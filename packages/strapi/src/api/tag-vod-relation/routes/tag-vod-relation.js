'use strict';

/**
 * tag-vod-relation router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

const defaultRouter = createCoreRouter('api::tag-vod-relation.tag-vod-relation');

// greets https://forum.strapi.io/t/how-to-add-custom-routes-to-core-routes-in-strapi-4/14070/7
const customRouter = (innerRouter, extraRoutes = []) => {
  let routes;
  return {
    get prefix() {
      return innerRouter.prefix;
    },
    get routes() {
      if (!routes) routes = extraRoutes.concat(innerRouter.routes)
      return routes;
    },
  };
};

const myExtraRoutes = [
  {
    method: "POST",
    path: "/tag-vod-relations/relate",
    handler: "api::tag-vod-relation.tag-vod-relation.relate"
  }, 
  // {
  //   method: 'GET',
  //   path: '/tag-vod-relations',
  //   handler: 'api::tag-vod-relation.tag-vod-relation.find'
  // }, 
  {
    method: "PUT",
    path: "/tag-vod-relations/vote",
    handler: "api::tag-vod-relation.tag-vod-relation.vote"
  }, {
    method: 'POST',
    path: '/tag-vod-relations/tag',
    handler: 'api::tag-vod-relation.tag-vod-relation.tagVod'
  }, {
    method: 'DELETE',
    path: '/tag-vod-relations/deleteMine/:id',
    handler: 'api::tag-vod-relation.tag-vod-relation.deleteMine'
  }
];

module.exports = customRouter(defaultRouter, myExtraRoutes);