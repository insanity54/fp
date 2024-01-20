
// up until now, tags have been attached directly to each vod object.
// now, tags are not attached to vods.
// instead, tag-vod-relations are used to associate a tag with a vod

// what we need to do in this migration is 
//   * create a new tag-vod-relation for each tag in each vod
//   * delete tags field in vods

module.exports = {
  async up(knex) {

    console.log('2023.05.14 - migrate tags to tag_vod_relations')

    // get all tags_vods_links
    // for each, create a tag-vod-relation
    const tagsVodsLinks = await knex.select('*').from('tags_vods_links')

    for (const tvl of tagsVodsLinks) {
      // Create a tag-vod-relation entry for each tag
      const tvr = await knex('tag_vod_relations')
        .insert({
          created_at: new Date(),
          updated_at: new Date(),
          creator_id: 1
        })
        .returning(
          ['id']
        )

      await knex('tag_vod_relations_tag_links').insert({
        tag_vod_relation_id: tvr[0].id,
        tag_id: tvl.tag_id
      })

      await knex('tag_vod_relations_vod_links').insert({
        tag_vod_relation_id: tvr[0].id,
        vod_id: tvl.vod_id
      })
    }

  },
};