
const { sub, add } = require('date-fns');


module.exports = {
    async up(knex) {
        console.log(`MIGRATION-- 2023-12-27-relate-vods-to-streams.js`);

        // Get all VODs from the database
        const vods = await knex.select('*').from('vods');

        // For each VOD, associate it with the stream with the nearest date (if not already associated)
        for (const [index, vod] of vods.entries()) {
            const existingAssociation = await knex('vods_stream_links')
                .where({ vod_id: vod.id })
                .first();

            if (!existingAssociation) {
                // get nearest stream within +/- 3 hours
                const date2 = new Date(vod.date_2);
                const startDate = sub(date2, { hours: 3 })
                const endDate = add(date2, { hours: 3 });
                console.log(`vod.id=${vod.id}, vod.date_2=${vod.date_2}, date2=${date2}, startDate=${startDate}, endDate=${endDate}`)
                const stream = await knex('streams')
                    .whereBetween('date', [startDate, endDate])

                await knex('vods_stream_links').insert({
                    stream_id: stream.id,
                    vod_id: vod.id,
                    vod_order: 1,
                });
            }
        }
    },
};
