'use strict';

/**
 * tag service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::tag.tag', ({ strapi }) => ({
    async assertTag(tagName, userId) {

        if (!tagName) throw new Error('tagName was missing from request');
        if (!userId) throw new Error('userId was missing from request');

        let tagEntry;

        // does the named tag already exist?
        // tagEntry = await strapi.db.query('api::tag.tag')
        //     .findOne({ where: { name: tagName } });
        tagEntry = (await strapi.entityService.findMany('api::tag.tag', {
            limit: 1,
            filters: {
                $and: [
                    {
                        publishedAt: { $notNull: true },
                    },
                    {
                        name: tagName
                    }
                ]
            }
        }))[0]

        if (!tagEntry) {
            tagEntry = await strapi.entityService.create('api::tag.tag', {
                data: {
                    name: tagName,
                    creator: userId,
                    publishedAt: new Date(),
                }
            })
        }

        return tagEntry;
    },
}));
