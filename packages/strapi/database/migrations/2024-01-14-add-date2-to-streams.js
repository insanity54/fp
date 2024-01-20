
module.exports = {
    async up(knex) {

        console.log(`MIGRATION-- 2024-01-14-add-date2-to-streams.js`);

        // Check if the 'date_2' column already exists in the 'streams' table
        const hasColumn = await knex.schema.hasColumn('streams', 'date_2');

        if (!hasColumn) {
            console.log(`Adding the 'date_2' column to the 'streams' table`);
            await knex.schema.table('streams', (table) => {
                table.string('date_2');
            });
        }

        // Get all streams from the database
        const streams = await knex.select('*').from('streams');

        // For each stream, populate date_2 if it's null or undefined
        for (const [index, stream] of streams.entries()) {
            if (stream.date_2 === null && stream.date_str !== null) {
                const result = await knex('streams').update({ date_2: stream.date_str }).where({ id: stream.id });
            }
        }
        
    },
};

