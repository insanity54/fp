'use strict';

/**
 * tag-vod-relation controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::tag-vod-relation.tag-vod-relation', ({ strapi }) => ({
  async relate(ctx) {

    const userId = ctx?.state?.user?.id;
    if (!userId) return ctx.badRequest("There was no user id in the request!");
    if (!ctx.request.body.data) return ctx.badRequest('data was missing from body');
    if (!ctx.request.body.data.tag) return ctx.badRequest('tag was missing from data');
    if (!ctx.request.body.data.vod) return ctx.badRequest('vod was missing from data');

    const { tag: tagId, vod: vodId } = ctx.request.body.data;

    const tagVodRelation = await strapi.entityService.create('api::tag-vod-relation.tag-vod-relation', {
      data: {
        vod: vodId,
        tag: tagId,
        creator: userId,
        creatorId: userId,
        publishedAt: new Date(),
        votes: 2
      }
    })

    return tagVodRelation
  },
  async vote(ctx) {
    // @todo
  },

  // // greets https://docs.strapi.io/dev-docs/backend-customization/controllers#extending-core-controllers
  // // greets https://docs.strapi.io/dev-docs/backend-customization/controllers#adding-a-new-controller
  // // Method 2: Wrapping a core action (leaves core logic in place)
  // async find(ctx) {
  //   // // some custom logic here
  //   // ctx.query = { ...ctx.query, local: 'en' }

  //   const userId = ctx?.state?.user?.id;
  //   if (!userId) return ctx.badRequest("There was no user id in the request!");



  //   // Calling the default core action
  //   const { data, meta } = await super.find(ctx);

  //   // add isCreator if the tvr was created by this user
  //   let dataWithCreator = data.map((d) => {
  //     if (d.data.attributes.)
  //   })

  //   // // some more custom logic
  //   // meta.date = Date.now()

  //   return { data, meta };
  // },

  // greets https://docs.strapi.io/dev-docs/backend-customization/controllers#extending-core-controllers
  // greets https://docs.strapi.io/dev-docs/backend-customization/controllers#adding-a-new-controller
  // Method 2: Wrapping a core action (leaves core logic in place)
  async create(ctx) {
    console.log('>> create a tag vod relation')
    // only allow unique tag, vod combos

    const { query } = ctx.request;

    const userId = ctx?.state?.user?.id;
    if (!userId) return ctx.badRequest("There was no user id in the request!");
    if (!ctx.request.body.data) return ctx.badRequest('data was missing from body');
    if (!ctx.request.body.data.tag) return ctx.badRequest('tag was missing from data');
    if (!ctx.request.body.data.vod) return ctx.badRequest('vod was missing from data');

    const { tag: tagId, vod: vodId } = ctx.request.body.data;

    console.log(`lets make a combo entityService.findMany`)
    const combo = await strapi.entityService.findMany('api::tag-vod-relation.tag-vod-relation', {
      populate: ['tag', 'vod'],
      filters: {
        $and: [{
          tag: {
            id: {
              $eq: ctx.request.body.data.tag
            }
          }
        }, {
          vod: {
            id: {
              $eq: ctx.request.body.data.vod
            }
          }
        }]
      }
    })

    if (combo.length > 0) {
      return ctx.badRequest('this vod already has that tag');
    }

    // @todo add votes and creator
    ctx.request.body.data.creator = userId
    ctx.request.body.data.votes = 2

    const parseBody = (ctx) => {
      if (ctx.is('multipart')) {
        return parseMultipartData(ctx);
      }

      const { data } = ctx.request.body || {};

      return { data };
    };


    const sanitizedInputData = {
      vod: vodId,
      tag: tagId,
      publishedAt: new Date(),
      creator: userId,
      creatorId: userId,
      votes: 2
    }





    const entity = await strapi
      .service('api::tag-vod-relation.tag-vod-relation')
      .create({ 
        ...query, 
        data: sanitizedInputData, 
        populate: { vod: true, tag: true }
      });

    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

    return this.transformResponse({ ...sanitizedEntity });
  },


  async tagVod (ctx) {

    // create tag if needed
    const userId = ctx?.state?.user?.id;
    if (!userId) return ctx.badRequest("There was no user id in the request!");
    if (!ctx.request.body.data) return ctx.badRequest('data was missing from body');
    if (!ctx.request.body.data.tagName) return ctx.badRequest('tagName was missing from data');
    if (!ctx.request.body.data.vodId) return ctx.badRequest('vodId was missing from data');
    
    const { tagName, vodId } = ctx.request.body.data;


    const tag = await strapi.service('api::tag.tag').assertTag(tagName, userId);


    try {
      const tvr = await strapi.service('api::tag-vod-relation.tag-vod-relation').assertTvr(tag.id, vodId, userId);


      const sanitizedEntity = await this.sanitizeOutput(tvr, ctx);
      return this.transformResponse({ ...sanitizedEntity });
    } catch (e) {
      console.error(e)
      ctx.badRequest('Vod Tag could not be created.')
    }

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
    const tvrToDelete = await strapi.entityService.findOne('api::tag-vod-relation.tag-vod-relation', id, {
      populate: {
        tag: true,
        vod: true,
        creator: true,
      }
    })

    if (!tvrToDelete) return ctx.badRequest('Tag to be deleted does not exist.');

    if (tvrToDelete.creator.id !== userId)
      ctx.forbidden('only the creator of the tag can delete it');

    if ((new Date(tvrToDelete.createdAt).valueOf()+86400000) < new Date().valueOf())
      ctx.forbidden('cannot delete tags older than 24 hours')

    // Calling the default core action
    const { data, meta } = await super.delete(ctx);

    // delete the related tag if it has no other vod
    // @todo?? or maybe this is handled by lifecycle hook?

    // // some more custom logic
    // meta.date = Date.now()

    return { data, meta };
  }


}));

