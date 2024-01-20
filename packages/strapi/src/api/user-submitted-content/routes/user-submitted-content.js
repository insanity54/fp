'use strict';

/**
 * user-submitted-content router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

const defaultRouter = createCoreRouter('api::user-submitted-content.user-submitted-content');

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
    path: "/user-submitted-contents/createFromUppy",
    handler: "api::user-submitted-content.user-submitted-content.createFromUppy"
  }
];

module.exports = customRouter(defaultRouter, myExtraRoutes);