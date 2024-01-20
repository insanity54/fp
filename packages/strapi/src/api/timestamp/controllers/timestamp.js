'use strict';

/**
 * timestamp controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::timestamp.timestamp', ({ strapi }) =>  ({


  async find(ctx) {
    const { data, meta } = await super.find(ctx);
    
    // Iterate over each timestamp in the data array
    const timestampsWithVotes = await Promise.all(data.map(async (timestamp) => {
      // Retrieve the upvoters count for the current timestamp      
      // Retrieve the downvoters count for the current timestamp
      const entry = await strapi.db
        .query('api::timestamp.timestamp')
        .findOne({
          populate: ['upvoters', 'downvoters'],
          where: {
            id: timestamp.id
          }
        });

      const upvotesCount = entry.upvoters.length
      const downvotesCount = entry.downvoters.length
        
      // Create new properties "upvotes" and "downvotes" on the timestamp object
      timestamp.attributes.upvotes = upvotesCount;
      timestamp.attributes.downvotes = downvotesCount;
      
      return timestamp;
    }));


    return { data: timestampsWithVotes, meta };
  },


  async assert(ctx) {
    const userId = ctx?.state?.user?.id;
    if (!userId) return ctx.badRequest("There was no user id in the request!");
    if (!ctx.request.body.data) return ctx.badRequest('data was missing from body');
    if (!ctx.request.body.data.tagId) return ctx.badRequest('tagId was missing from data');
    if (ctx.request.body.data.time === undefined || ctx.request.body.data.time === null || ctx.request.body.data.time < 0) return ctx.badRequest('time was missing from data');
    if (!ctx.request.body.data.vodId) return ctx.badRequest('vodId was missing from data');
    const { time, tagId, vodId } = ctx.request.body.data;
    const timestamp = await strapi.service('api::timestamp.timestamp').assertTimestamp(userId, tagId, vodId, time);
    return timestamp;
  },


  // greets https://docs.strapi.io/dev-docs/backend-customization/controllers#extending-core-controllers
  // greets https://docs.strapi.io/dev-docs/backend-customization/controllers#adding-a-new-controller
  // Method 2: Wrapping a core action (leaves core logic in place)
  async create(ctx) {
    // add creatorId to the record
    const userId = ctx?.state?.user?.id;
    if (!userId) return ctx.badRequest("There was no user id in the request!");
    if (!ctx.request.body.data) return ctx.badRequest('data was missing from body');
    if (!ctx.request.body.data.tag) return ctx.badRequest('tag was missing from data');
    const { time, tag } = ctx.request.body.data;

    ctx.request.body.data.creatorId = userId

    // does the timestamp already exist with same combination of time+tag?
    const duplicate = await strapi.db.query('api::timestamp.timestamp')
      .findOne({ where: { time, tag }})

    if (!!duplicate) return ctx.badRequest('A duplicate timestamp already exists!');

    // Calling the default core action
    const res = await super.create(ctx);

    return res
  },


  async vote(ctx) {
    const userId = ctx?.state?.user?.id;
    const { direction } = ctx.request.body.data;
    if (!ctx.request.params.id) return ctx.badRequest('id was missing from params');
    const { id } = ctx.request.params;
    // get the ts to be voted on
    const ts = await strapi.entityService.findOne('api::timestamp.timestamp', id)
    if (!ts) return ctx.badRequest('timestamp does not exist');
    const res = await strapi.entityService.update('api::timestamp.timestamp', id, {
      data: {
        upvoters: direction === 1 ? { connect: [userId] } : { disconnect: [userId] },
        downvoters: direction === 1 ? { disconnect: [userId] } : { connect: [userId] }
      }
    });
    return res;
  },



  async delete(ctx) {
    const userId = ctx?.state?.user?.id;
    const { id } = ctx.request.params;

    // get the ts to be deleted
    const ts = await strapi.entityService.findOne('api::timestamp.timestamp', id)
    if (!ts) return ctx.badRequest('Timestamp does not exist')


    // Refuse to delete if not the tag creator
    if (ts.creatorId !== userId) return ctx.forbidden('Only the timestamp creator can delete the timestamp.')


    const res = await super.delete(ctx)
    return res

  },


  async deleteMine (ctx) {
    // // some custom logic here
    // ctx.query = { ...ctx.query, local: 'en' }

    const userId = ctx?.state?.user?.id;
    if (!userId) return ctx.badRequest("There was no user id in the request!");
    if (!ctx.request.params.id) return ctx.badRequest('id was missing from params');
    const { id } = ctx.request.params;

    // constraints
    //   only able to delete tagVodRelation if
    //     * creator
    //     * publishedAt isBefore(now-24h)


    // get the tvr the user wants to delete
    const timestampToDelete = await strapi.entityService.findOne('api::timestamp.timestamp', id, {
      populate: {
        tag: true,
        vod: true
      }
    })

    if (!timestampToDelete) return ctx.badRequest('Timestamp to be deleted does not exist.');


    if (timestampToDelete.creatorId !== userId)
      ctx.forbidden('only the creator of the timestamp can delete it');

    if ((new Date(timestampToDelete.createdAt).valueOf()+86400000) < new Date().valueOf())
      ctx.forbidden('cannot delete tags older than 24 hours')

    // Calling the default core action
    const { data, meta } = await super.delete(ctx);

    // delete the related tag if it has no other vod
    // @todo?? or maybe this is handled by lifecycle hook?

    // // some more custom logic
    // meta.date = Date.now()

    return { data, meta };
  }


}))

