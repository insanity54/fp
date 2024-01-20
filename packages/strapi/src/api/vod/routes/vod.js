'use strict';

/**
 * vod router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

const defaultRouter = createCoreRouter('api::vod.vod');

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
    path: "/vods/createFromUppy",
    handler: "api::vod.vod.createFromUppy"
  },
  {
    method: "GET",
    path: "/vods/random",
    handler: "api::vod.vod.random"
  }
];

module.exports = customRouter(defaultRouter, myExtraRoutes);