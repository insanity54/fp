module.exports = {
  async up(knex) {
    // ... (Create vods_vtuber_links table if not already created)

    // Get vtuber ID for ProjektMelody (assuming it's 1)
    const vtuberId = 1;

    // Get all VODs from the database
    const vods = await knex.select('*').from('vods');

    // For each VOD, associate it with the vtuber (vtuber with ID 1) if not already associated
    for (const [index, vod] of vods.entries()) {
      const existingAssociation = await knex('vods_vtuber_links')
        .where({ vtuber_id: vtuberId, vod_id: vod.id })
        .first();
      if (!existingAssociation) {
        await knex('vods_vtuber_links').insert({
          vtuber_id: vtuberId,
          vod_id: vod.id,
          vod_order: index + 1, // Auto-increment the vod_order number
        });
      }
    }
  },
};
