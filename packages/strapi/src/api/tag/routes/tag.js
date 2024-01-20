'use strict';

/**
 * tag router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;
const defaultRouter = createCoreRouter('api::tag.tag');

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
    path: "/tag/tagRelation",
    handler: "api::tag.tag.createTagRelation"
  },
  {
    method: 'GET',
    path: '/tag/random',
    handler: 'api::tag.tag.random'
  }
];

module.exports = customRouter(defaultRouter, myExtraRoutes)
