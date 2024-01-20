module.exports = {
  async up(knex) {
    // Add the `image2` field (column) as a short text field
    await knex.schema.table('toys', (table) => {
      table.string('image_2', 512);
    });

    // Get all toys
    const toys = await knex.select('*').from('toys');

    // Update the image2 field with the previous image URLs
    for (const toy of toys) {
      // lookup the file morph which maps toy to (image) file
      const imageFileId = (await knex.select('file_id').from('files_related_morphs').where({ related_id: toy.id }))[0].file_id

      // get the image data from the file
      const imageUrl = (await knex.select('url').from('files').where({ id: imageFileId }))[0].url

      if (!imageUrl) continue;

      // Copy the values from image to image2
      await knex('toys').update({ image_2: imageUrl }).where({ id: toy.id });
    }

    const hasImageColumn = await knex.schema.hasColumn('toys', 'image');
    if (hasImageColumn) {
      // Drop the `image` column
      table.dropColumn('image');
    }


  },
};
