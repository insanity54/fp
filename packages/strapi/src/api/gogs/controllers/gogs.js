'use strict';

/**
 * gogs controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::gogs.gogs', ({ strapi }) => ({
    issues: async (ctx) => {
        try {
            // Fetch the 'gogs' single type from Strapi
            const gogsConfig = await strapi.query('api::gogs.gogs').findOne();

            if (!gogsConfig) {
                return ctx.badRequest('Gogs configuration not found');
            }

            const { url, apiKey } = gogsConfig;
            const openIssues   = await strapi.service('api::gogs.gogs').fetchAllPagesFromGogsAPI(`${url}/api/v1/repos/futureporn/pm/issues?state=open`, apiKey)
            const closedIssues = await strapi.service('api::gogs.gogs').fetchAllPagesFromGogsAPI(`${url}/api/v1/repos/futureporn/pm/issues?state=closed`, apiKey)

            return { openIssues, closedIssues }
        } catch (error) {
            console.error('Error fetching Gogs issues:', error);
            return ctx.badRequest('Failed to fetch issues from Gogs');
        }
    }
}));