'use strict';

/**
 * tag controller
 */

const { createCoreController } = require('@strapi/strapi').factories;
const { sanitize } = require('@strapi/utils');


module.exports = createCoreController('api::tag.tag', ({ strapi }) => ({

  async random(ctx) {
    const numberOfTags = 10; // Change this number to the desired number of random tags
    const contentType = strapi.contentType('api::vod.vod');

    // Fetch only the 'id' field of all tags
    const tagIds = (await strapi.entityService.findMany(
      "api::tag.tag",
      {
        fields: ['id'],
      }
    )).map(tag => tag.id);


    const selectedTags = [];

    // Randomly select the specified number of tag IDs
    for (let i = 0; i < numberOfTags; i++) {
      const randomIndex = Math.floor(Math.random() * tagIds.length);
      const randomTagId = tagIds[randomIndex];


      // Fetch the full details of the randomly selected tag using its ID
      const rawTag = await strapi.entityService.findOne(
        "api::tag.tag",
        randomTagId, // Use the tag's ID
        {
          filter: {
            publishedAt: {
              $notNull: true,
            },
          },
          fields: ['id', 'name']
        }
      );

      selectedTags.push(await sanitize.contentAPI.output(rawTag, contentType, { auth: ctx.state.auth }));

      // Remove the selected tag ID from the array to avoid duplicates
      tagIds.splice(randomIndex, 1);
    }

    ctx.body = selectedTags;
  },



  async createTagRelation(ctx) {

    // we have this controller which associates a tag with a vod
    // this exists so users can indirectly update vod records which they dont have permissions to update
    // first we need to get the user's request.
    // they are telling us a vod ID and a tag ID
    // our job is to get a reference to the vod, and add the tag relation.

    if (!ctx.request.body.data) return ctx.badRequest('data was missing from body');
    if (!ctx.request.body.data.tag) return ctx.badRequest('tag was missing from data');
    if (!ctx.request.body.data.vod) return ctx.badRequest('vod was missing from data');

    const { tag, vod: vodId } = ctx.request.body.data;



    await strapi.entityService.update('api::vod.vod', vodId, {
      data: {
        tags: {
          connect: [tag]
        }
      }
    })

    return 'OK'

  },
}));

