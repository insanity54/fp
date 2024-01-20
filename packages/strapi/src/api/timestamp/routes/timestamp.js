'use strict';

/**
 * timestamp router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;


const defaultRouter = createCoreRouter('api::timestamp.timestamp');

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
    method: 'POST',
    path: '/timestamps/assert',
    handler: 'api::timestamp.timestamp.assert'
  },
  {
    method: "PUT",
    path: "/timestamps/:id/vote",
    handler: "api::timestamp.timestamp.vote"
  }, 
  {
    method: 'DELETE',
    path: '/timestamps/:id',
    handler: 'api::timestamp.timestamp.delete'
  },
  {
    method: 'DELETE',
    path: '/timestamps/deleteMine/:id',
    handler: 'api::timestamp.timestamp.deleteMine'
  }
];

module.exports = customRouter(defaultRouter, myExtraRoutes);


