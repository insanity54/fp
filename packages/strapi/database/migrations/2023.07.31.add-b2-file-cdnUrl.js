module.exports = {
  async up(knex) {
    // Add the 'cdn_url' column to the 'b2_files' table
    await knex.schema.table('b2_files', (table) => {
      table.string('cdn_url'); // Change the data type if needed (e.g., text, varchar, etc.)
    });

    // Get all B2 Files from the database
    const files = await knex.select('*').from('b2_files');

    // For each B2 File, create cdnUrl
    for (const [index, file] of files.entries()) {
      const key = file.key;
      const cdnUrl = `https://futureporn-b2.b-cdn.net/futureporn/${key}`;
      await knex('b2_files').update({ cdn_url: cdnUrl }).where({ id: file.id });
    }
  },
};
