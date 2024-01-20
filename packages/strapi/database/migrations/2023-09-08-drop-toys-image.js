module.exports = {
    async up(knex) {
        const hasColumn = await knex.schema.hasColumn('toys', 'image');

        if (hasColumn) {
            await knex.schema.table('toys', (table) => {
                table.dropColumn('image');
            });
        }
    }
};
