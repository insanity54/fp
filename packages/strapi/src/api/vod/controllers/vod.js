'use strict';


const { sanitize } = require('@strapi/utils');

if (!process.env.CDN_BUCKET_USC_URL) throw new Error('CDN_BUCKET_USC_URL environment variable is required!');

/**
 * vod controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

// greets https://docs.strapi.io/dev-docs/backend-customization/controllers#adding-a-new-controller
module.exports = createCoreController('api::vod.vod', ({ strapi }) => ({

    async createFromUppy(ctx) {

      const uploaderId = ctx.state.user.id;

      if (!ctx.request.body.data) return ctx.badRequest("data was missing in request body");
      if (!ctx.request.body.data.date) return ctx.badRequest("date was missing");
      if (!ctx.request.body.data.b2Key) return ctx.badRequest("b2Key was missing");
      if (!ctx.request.body.data.b2UploadId) return ctx.badRequest("b2UploadId was missing");


      const videoSrcB2 = await strapi.entityService.create('api::b2-file.b2-file', {
        data: {
          url: `https://f000.backblazeb2.com/b2api/v1/b2_download_file_by_id?fileId=${ctx.request.body.data.b2UploadId}`,
          key: ctx.request.body.data.b2Key,
          uploadId: ctx.request.body.data.b2UploadId,
          cdnUrl: `${process.env.CDN_BUCKET_USC_URL}/${ctx.request.body.data.b2Key}`
        }
      });

      const vod = await strapi.entityService.create('api::vod.vod', {
        data: {
          notes: ctx.request.body.data.notes,
          date: ctx.request.body.data.date,
          videoSrcB2: videoSrcB2.id,
          publishedAt: null,
          uploader: uploaderId,
        }
      });

      return vod;
    },

    // greets https://stackoverflow.com/a/73929966/1004931
    async random(ctx) {
      const numberOfEntries = 1;
      const contentType = strapi.contentType('api::vod.vod')
    
      // Fetch only the 'id' field of all VODs
      const entries = await strapi.entityService.findMany(
        "api::vod.vod",
        {
          fields: ['id'],
          filters: {
            publishedAt: {
              $notNull: true,
            },
          }
        }
      );
    
      // Randomly select one entry
      const randomEntry = entries[Math.floor(Math.random() * entries.length)];
    
      // Fetch the full details of the randomly selected VOD
      const rawVod = await strapi.entityService.findOne(
        "api::vod.vod",
        randomEntry.id,
        {
          populate: '*',
        },
      );
    
      const sanitizedOutput = await sanitize.contentAPI.output(rawVod, contentType, { auth: ctx.state.auth });

      ctx.body = sanitizedOutput;
    }
    
  })
)