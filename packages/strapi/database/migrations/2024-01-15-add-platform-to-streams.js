
module.exports = {
    async up(knex) {

        console.log(`MIGRATION-- 2024-01-15-add-platform-streams.js`);

        // Check if the 'platform' column already exists in the 'streams' table
        const hasColumn = await knex.schema.hasColumn('streams', 'platform');

        if (!hasColumn) {
            console.log(`Adding the 'platform' column to the 'streams' table`);
            await knex.schema.table('streams', (table) => {
                table.string('platform');
            });
        }

        // Get all streams from the database
        const streams = await knex.select('*').from('streams');

        // For each stream, populate platform based on the related tweet data
        for (const [index, stream] of streams.entries()) {

            const tweetLink = await knex('streams_tweet_links')
                .where({ stream_id: stream.id })
                .first();

            if (tweetLink) {
                console.log(tweetLink);

                const tweet = await knex('tweets')
                    .where({ id: tweetLink.tweet_id })
                    .first();

                console.log(tweet);

                if (!!tweet) {
                    console.log(`stream ${stream.id} tweet tweet.is_chaturbate_invite=${tweet.is_chaturbate_invite}, tweet.is_fansly_invite=${tweet.is_fansly_invite}`);
                    await knex('streams').update({
                        is_chaturbate_stream: !!tweet.is_chaturbate_invite,
                        is_fansly_stream: !!tweet.is_fansly_invite
                    }).where({ id: stream.id });
                }
            }

        }
        
    },
};

