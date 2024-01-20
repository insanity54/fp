module.exports = {
    async up(knex) {
  
      const toys = await knex.select('*').from('toys');
      for (const [index, toy] of toys.entries()) {
        if (toy.image_2) {
          const existingImageFilename = new URL(toy.image_2).pathname.split('/').at(-1)
          await knex('toys').update({ image_2: `https://futureporn-b2.b-cdn.net/${existingImageFilename}` }).where({ id: toy.id });
        }
      }
    },
  };
  