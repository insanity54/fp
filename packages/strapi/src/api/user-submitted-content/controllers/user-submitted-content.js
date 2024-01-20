
'use strict';


if (!process.env.CDN_BUCKET_USC_URL) throw new Error('CDN_BUCKET_USC_URL environment variable is required!');

/**
 * user-submitted-content controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

// greets https://docs.strapi.io/dev-docs/backend-customization/controllers#adding-a-new-controller
module.exports = createCoreController('api::user-submitted-content.user-submitted-content', ({ strapi }) => ({

    async createFromUppy(ctx) {
      try {
        // Destructure data from the request body
        const { data } = ctx.request.body;

        console.log(data);
  
        // Check for required fields in the data
        const requiredFields = ['files', 'vtuber', 'date', 'notes', 'attribution'];
        if (!data) {
          return ctx.badRequest('ctx.request.body.data was missing.');
        }
        for (const field of requiredFields) {
          console.log(`checking field=${field} data[field]=${data[field]}`);
          if (data[field] === undefined || data[field] === null) {
            return ctx.badRequest(`${field} was missing from request data.`);
          }
        }
  
        // Extract relevant data
        const { files, vtuber, date, notes, attribution } = data;
        const uploader = ctx.state.user.id;
  
        console.log('Creating user-submitted content');
        const usc = await strapi.entityService.create('api::user-submitted-content.user-submitted-content', {
          data: {
            uploader,
            files: files.map((f) => ({ ...f, cdnUrl: `${process.env.CDN_BUCKET_USC_URL}/${f.key}` })),
            vtuber,
            date,
            notes,
            attribution,
          }
        });
  
        return usc;
      } catch (error) {
        // Handle unexpected errors
        console.error(error);
        return ctx.badRequest('An error occurred while processing the request');
      }
    }
  
  }));
  