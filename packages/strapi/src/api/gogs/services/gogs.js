'use strict';

/**
 * gogs service
 */

const { createCoreService } = require('@strapi/strapi').factories;



module.exports = createCoreService('api::gogs.gogs', ({ strapi }) => ({

    async fetchAllPagesFromGogsAPI(url, apiKey) {

        // Fetch the first page
        const response = await fetch(url, {
            headers: {
                'Authorization': `token ${apiKey}`
            }
        });

        if (!response.ok) {
            throw new Error(`Request failed with status: ${response.status}`);
        }

        const data = await response.json();

        // Check if there are more pages available
        if (response.headers.has('link')) {
            const linkHeader = response.headers.get('link');
            const nextPageMatch = /<([^>]+)>;\s*rel="next"/.exec(linkHeader);

            if (nextPageMatch) {
                const nextPageUrl = nextPageMatch[1];
                const nextPageData = await this.fetchAllPagesFromGogsAPI(nextPageUrl, apiKey);
                return [...data, ...nextPageData];
            }
        }

        return data;
    }
}))