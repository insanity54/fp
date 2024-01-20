'use strict';

/**
 * tag-vod-relation service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::tag-vod-relation.tag-vod-relation', ({ strapi }) => ({


    async assertTvr(tagId, vodId, userId) {
        
        if (!tagId) throw new Error('tagId was missing in request');
        if (!vodId) throw new Error('vodId was missing in request');
        if (!userId) throw new Error('userId was missing in request');



        let existingTvr;
        existingTvr = await strapi.entityService
            .findMany('api::tag-vod-relation.tag-vod-relation', {
                limit: 1,
                filters: {
                    $and: [
                        {
                            tag: {
                                id: tagId,
                            },
                        },
                        {
                            vod: {
                                id: vodId
                            }
                        }
                    ]
                },
                populate: ['tag', 'vod']
            })
        

        if (existingTvr.length === 0) {
            const newTvr = await strapi.entityService.create('api::tag-vod-relation.tag-vod-relation', {
                data: {
                    tag: tagId,
                    vod: vodId,
                    creator: userId,
                    creatorId: userId,
                },
                populate: {
                    tag: true,
                    vod: true
                }
            })

            // trigger data revalidation in next.js server
            // fetch(`${nextJsServerUrl}/`)
            return newTvr;
        } else {

            return existingTvr[0];
        }


    },

}));


