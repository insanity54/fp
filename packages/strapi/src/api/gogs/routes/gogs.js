'use strict';

/**
 * gogs router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

const defaultRouter = createCoreRouter('api::gogs.gogs');

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
        path: "/gogs/issues",
        handler: "api::gogs.gogs.issues"
    }
];

module.exports = customRouter(defaultRouter, myExtraRoutes);

