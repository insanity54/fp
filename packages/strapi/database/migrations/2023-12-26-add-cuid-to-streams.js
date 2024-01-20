
const { init } = require('@paralleldrive/cuid2');

module.exports = {
    async up(knex) {

        console.log(`MIGRATION-- 2023-12-26-add-cuid-to-streams.js`);

        // Check if the 'cuid' column already exists in the 'streams' table
        const hasCuidColumn = await knex.schema.hasColumn('streams', 'cuid');

        if (!hasCuidColumn) {
            // Add the 'cuid' column to the 'streams' table
            await knex.schema.table('streams', (table) => {
                table.string('cuid');
            });
        }

        // Get all streams from the database
        const streams = await knex.select('*').from('streams');

        // For each stream, populate cuid if it's null or undefined
        for (const [index, stream] of streams.entries()) {
            if (!stream.cuid) {
                const length = 10;
                const genCuid = init({ length });
                await knex('streams').update({ cuid: genCuid() }).where({ id: stream.id });
            }
        }
        
    },
};

