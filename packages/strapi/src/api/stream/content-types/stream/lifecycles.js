const { init } = require('@paralleldrive/cuid2');



module.exports = {
    async beforeUpdate(event) {
        const { data } = event.params;
        if (!data.cuid) {
            const length = 10; // 50% odds of collision after ~51,386,368 ids
            const cuid = init({ length });
            event.params.data.cuid = cuid();
        }
    },
    async afterUpdate(event) {
        console.log(`>>>>>>>>>>>>>> STREAM is afterUpdate !!!!!!!!!!!!`);

        const { data, where, select, populate } = event.params;

        console.log(data);

        const id = where.id;
        
        // greets https://forum.strapi.io/t/how-to-get-previous-component-data-in-lifecycle-hook/25892/4?u=ggr247
        const existingData = await strapi.entityService.findOne("api::stream.stream", id, {
            populate: ['vods', 'tweet']
        })

        // Initialize archiveStatus to a default value
        let archiveStatus = 'missing';

        // Iterate through all vods to determine archiveStatus
        for (const vod of existingData.vods) {
            if (!!vod.videoSrcHash) {
                if (!!vod.note) {
                    // If a vod has both videoSrcHash and note, set archiveStatus to 'issue'
                    archiveStatus = 'issue';
                    break; // No need to check further
                } else {
                    // If a vod has videoSrcHash but no note, set archiveStatus to 'good'
                    archiveStatus = 'good';
                }
            }
        }

        // we can't use query engine here, because that would trigger an infinite loop
        // where this 
        // instead we access knex instance
        await strapi.db.connection("streams").where({ id: id }).update({
            archive_status: archiveStatus,
        });

        if (!!existingData.tweet) {
            await strapi.db.connection("streams").where({ id: id }).update({ 
                is_chaturbate_stream: existingData.tweet.isChaturbateInvite,
                is_fansly_stream: existingData.tweet.isFanslyInvite
            });
        }


    }
};