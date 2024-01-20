'use strict'


require('dotenv').config()

const { Client } = require('pg')
const fetch = require('node-fetch')
const _ = require('lodash');
const ogVods = require('../og-tags.json')


// const slugify = require('slugify')


// function slugifyString (str) {
//   return slugify(str, {
//     replacement: '-',  // replace spaces with replacement character, defaults to `-`
//     remove: undefined, // remove characters that match regex, defaults to `undefined`
//     lower: true,      // convert to lower case, defaults to `false`
//     strict: true,     // strip special characters except replacement, defaults to `false`
//     locale: 'en',      // language code of the locale to use
//     trim: true         // trim leading and trailing replacement chars, defaults to `true`
//   })
// }


async function associateTagWithVodsInStrapi (tagId, vodsIds) {
  const res = await fetch(`${process.env.STRAPI_URL}/api/tags/${tagId}`, {
    method: 'PUT',
    headers: {
      'authorization': `Bearer ${process.env.STRAPI_API_KEY}`
    },
    data: {
      vods: [vodsIds]
    }
  })
  const json = await res.json()


  if (!res.ok) throw new Error(JSON.stringify(json))
}



async function associateVodWithTagsInStrapi (knex, vodId, tagsIds) {
  console.log(`updating vodId:${vodId} with tagsIds:${tagsIds}`)
  for (const tagId of tagsIds) {
    // see if it exists already
    const rows = await knex.select('*').from('tags_vods_links').where({
      'vod_id': vodId,
      'tag_id': tagId
    })
    if (rows.length === 0) {
      await knex('tags_vods_links').insert({
        vod_id: vodId,
        tag_id: tagId
      });
    }
  }
}

async function getStrapiVodByAnnounceUrl (knex, announceUrl) {
  const rows = await knex.select('*').from('vods').where('announce_url', announceUrl)
  return (rows[0])
}




async function getStrapiTagByName (knex, tag) {
  const rows = await knex.select('*').from('tags').where({ 'name': tag })
  return rows[0]
}





module.exports = {
  async up(knex) {
    // You have full access to the Knex.js API with an already initialized connection to the database

    for (const vod of ogVods) {
      // get matching vod in strapi
      console.log(vod)
      if (vod.announceUrl) {
        const strapiVod = await getStrapiVodByAnnounceUrl(knex, vod.announceUrl)

        if (strapiVod) {
          // we've got a matching vod

          if (vod.tags) {
            console.log(`source vod has tags: ${vod.tags}`)

            let strapiTagsIds = []

            // for each tag, get the matching strapi tag ID
            for (const tag of vod.tags) {
              // lookup the strapi tag id
              const strapiTag = await getStrapiTagByName(knex, tag)
              if (!!strapiTag) { 
                strapiTagsIds.push(strapiTag.id)
              }
            }
            
            console.log(`we are adding the following strapiTagsIds to vod ID ${strapiVod.id}: ${strapiTagsIds}`)

            // create relations between matching vod and the tags
            await associateVodWithTagsInStrapi(knex, strapiVod.id, strapiTagsIds)

          }
        }
      }
    }

    // Get all VODs from the database
    const vods = await knex.select('*').from('vods');

    // Process each VOD
    for (const vod of vods) {

    }
  }
}
