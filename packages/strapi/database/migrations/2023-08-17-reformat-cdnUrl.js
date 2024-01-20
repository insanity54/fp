module.exports = {
    async up(knex) {
  
      // Get all B2 Files from the database
      const files = await knex.select('*').from('b2_files');
  
      // For each B2 File, update cdnUrl
      // we do this to change 
      // erroneous https://futureporn-b2.b-cdn.net/futureporn/:key
      // to        https://futureporn-b2.b-cdn.net/:key
      for (const [index, file] of files.entries()) {
        const key = file.key;
        const cdnUrl = `https://futureporn-b2.b-cdn.net/${key}`;
        await knex('b2_files').update({ cdn_url: cdnUrl }).where({ id: file.id });
      }
    },
  };
  