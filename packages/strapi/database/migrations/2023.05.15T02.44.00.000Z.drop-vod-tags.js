
// previously, we tagged vods directly on the vod content-type
// now, we use tag-vod-relation to relate tags to vods.
// thus, we want to get rid of vod.tags
// and also tag.vods

module.exports = {
  async up(knex) {
    console.log('2023.05.15 - drop tags_vods_links')
    await knex.schema.dropTable('tags_vods_links')
  }
}