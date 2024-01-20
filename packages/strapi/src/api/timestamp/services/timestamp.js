'use strict';

/**
 * timestamp service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::timestamp.timestamp', ({ strapi }) => ({
    async assertTimestamp(userId, tagId, vodId, time) {
        const existingTimestamp = await strapi.entityService.findMany('api::timestamp.timestamp', {
            populate: ['vod', 'tag'],
            filters: {
                $and: [
                    {
                        tag: {
                            id: tagId
                        }
                    },
                    {
                        vod: {
                            id: vodId
                        }
                    },
                    {
                        time: parseInt(time)
                    }
                ]
            },
            limit: 1
        })
        if (existingTimestamp.length > 0) return existingTimestamp[0];
        const newTimestamp = await strapi.entityService.create('api::timestamp.timestamp', {
            data: {
                tag: tagId,
                vod: vodId,
                creatorId: userId,
                time: time,
            }
        });

        return newTimestamp;
    }
}));
