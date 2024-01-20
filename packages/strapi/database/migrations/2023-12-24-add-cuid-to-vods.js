
const generateCuid = require('../../misc/generateCuid');

module.exports = {
    async up(knex) {

        console.log(`MIGRATION-- 2023-12-24-add-cuid-to-vods.js`);

        // Check if the 'cuid' column already exists in the 'vods' table
        const hasCuidColumn = await knex.schema.hasColumn('vods', 'cuid');

        if (!hasCuidColumn) {
            // Add the 'cuid' column to the 'vods' table
            await knex.schema.table('vods', (table) => {
                table.string('cuid');
            });
        }

        // Get all vods from the database
        const vods = await knex.select('*').from('vods');

        // For each vod, populate cuid if it's null or undefined
        for (const [index, vod] of vods.entries()) {
            if (!vod.cuid) {
                await knex('vods').update({ cuid: generateCuid() }).where({ id: vod.id });
            }
        }
        
    },
};

