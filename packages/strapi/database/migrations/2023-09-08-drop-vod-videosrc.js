module.exports = {
    async up(knex) {
        const hasColumn = await knex.schema.hasColumn('vods', 'video_src');

        if (hasColumn) {
            await knex.schema.table('vods', (table) => {
                table.dropColumn('video_src');
            });
        }
    }
};
