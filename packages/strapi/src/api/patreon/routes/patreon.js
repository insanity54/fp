'use strict';

/**
 * patreon router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

const defaultRouter = createCoreRouter('api::patreon.patreon');

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
    method: "GET",
    path: "/patreon/patrons",
    handler: "api::patreon.patreon.getPublicPatrons"
  }, {
    method: 'GET',
    path: '/patreon/muxAllocationCount',
    handler: 'api::patreon.patreon.muxAllocationCount'
  }
];

module.exports = customRouter(defaultRouter, myExtraRoutes);