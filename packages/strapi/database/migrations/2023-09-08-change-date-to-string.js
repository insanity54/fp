module.exports = {
    async up(knex) {
        // Check if the 'date_2' column exists in the 'vods' table
        const hasDate2Column = await knex.schema.hasColumn('vods', 'date_2');

        if (!hasDate2Column) {
            // Add the new 'date_2' column as a string if it doesn't exist
            await knex.schema.table('vods', (table) => {
                table.string('date_2');
            });

            // Fetch all existing rows from the 'vods' table
            const existingVods = await knex.select('id', 'date').from('vods');

            // Loop through each row and update 'date_2' with the date value
            for (const vod of existingVods) {
                await knex('vods')
                    .where({ id: vod.id })
                    .update({ date_2: vod.date.toISOString() });
            }
        }
    },
};
