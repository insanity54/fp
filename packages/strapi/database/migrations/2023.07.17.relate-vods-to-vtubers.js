module.exports = {
  async up(knex) {

    console.log('Create vtubers table')
    await knex.schema.createTable('vtubers', (table) => {
      table.increments('id').primary();
      table.string('displayName').notNullable();
      table.string('chaturbate');
      table.string('twitter');
      table.string('patreon');
      table.string('twitch');
      table.string('tiktok');
      table.string('onlyfans');
      table.string('youtube');
      table.string('linktree');
      table.string('carrd');
      table.string('fansly');
      table.string('pornhub');
      table.string('discord');
      table.string('reddit');
      table.string('throne');
      table.string('instagram');
      table.string('facebook');
      table.string('merch');
      table.string('slug').notNullable();
      table.text('description1').notNullable();
      table.text('description2');
      table.string('image').notNullable();
    });

    console.log('Create vods_vtuber_links table')
    await knex.schema.createTable('vods_vtuber_links', (table) => {
      table.increments('id').primary();
      table.integer('vod_id').unsigned().references('vods.id');
      table.integer('vtuber_id').unsigned().references('vtubers.id');
      table.integer('vod_order').notNullable();
    });


    console.log('Create a vtuber entry for ProjektMelody')
    const projektMelody = {
      displayName: 'ProjektMelody',
      slug: 'projektmelody', // You can customize the slug based on your preference
      description1: 'Description for ProjektMelody', // Add your vtuber's description here
      image: 'http://futureporn-b2.b-cdn.net/futureporn/projekt-melody.jpg', // Replace with the image filename for ProjektMelody
    };

    console.log('Get all VODs from the database')
    const vods = await knex.select('*').from('vods');

    console.log('get projektmelody id')
    // const [projektMelodyId] = await knex('vtubers').insert(projektMelody);
    const projektMelodyId = 1

    console.log(`projektmelodyId is : ${projektMelodyId}`)

    console.log(`For each VOD, associate ProjektMelody vtuber.`)
    for (const [index, vod] of vods.entries()) {
      console.log(`Check if vtuber_id exists in the vtubers table`)
      const vtuber = await knex('vtubers').where('id', projektMelodyId).first();
      if (vtuber) {
        await knex('vods_vtuber_links').insert({
          vtuber_id: projektMelodyId,
          vod_id: vod.id,
          vod_order: index + 1, // Auto-increment the vod_order number
        });
      }
    }
  },
};
