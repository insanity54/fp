require('dotenv').config()

const { Client } = require('pg')
const fetch = require('node-fetch')
const _ = require('lodash');



// module.exports = {
//   async up(knex) {

//     // Get all VODs from the database
//     const vods = await knex.select('*').from('vods');

//     // sanity check every B2 URL
//     for (const vod of vods) {
//       await checkUrl(vod.video_src)
//     }

//     console.log(`there are ${problemUrls.length} the problem urls`)
//     console.log(problemUrls)

//     process.exit(5923423)
//   },
// };

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



async function associateVodWithTagsInStrapi (vodId, tagsIds) {
  const res = await fetch(`${process.env.STRAPI_URL}/api/vods/${vodId}?populate=*`, {
    method: 'PUT',
    headers: {
      'authorization': `Bearer ${process.env.STRAPI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      data: {
        tags: tagsIds
      }
    })
  })
  const json = await res.json()


  if (!res.ok) throw new Error(JSON.stringify(json))
}

async function getStrapiVodByAnnounceUrl (announceUrl) {
  const res = await fetch(`${process.env.STRAPI_URL}/api/vods?filters[announceUrl][$eqi]=${announceUrl}`, {
    method: 'GET',
    headers: {
      'authorization': `Bearer ${process.env.STRAPI_API_KEY}`
    }
  })
  const json = await res.json()
  return json.data[0]
}


// async function getStrapiVodByDate (date) {

//   // const r = await fetch(`${process.env.STRAPI_URL}/api/vods/200`, {
//   //   method: 'GET',
//   //   headers: {
//   //     'authorization': `Bearer ${process.env.STRAPI_API_KEY}`
//   //   }
//   // })
//   // const j = await r.json()

//   const res = await fetch(`${process.env.STRAPI_URL}/api/vods?filters[date][$eqi]=${date}`, {
//     method: 'GET',
//     headers: {
//       'authorization': `Bearer ${process.env.STRAPI_API_KEY}`
//     }
//   })
//   const json = await res.json()
//   process.exit(3)
//   if (!res.ok) throw new Error(JSON.stringify(json));
//   return json.id
// }


async function getStrapiTagByName (tag) {
  const res = await fetch(`${process.env.STRAPI_URL}/api/tags?filters[name][$eqi]=${tag}`, {
    method: 'GET',
    headers: {
      'authorization': `Bearer ${process.env.STRAPI_API_KEY}`
    }
  })
  const json = await res.json()
  return json.data[0]
}

async function main () {
  const client = new Client()
  await client.connect()


  // get list of vods from our source db
  const vodsResponse = await client.query('SELECT tags, date, "announceUrl" FROM vod')

  console.log(JSON.stringify(vodsResponse.rows))
  process.exit(5)

  for (const vod of vodsResponse.rows) {



    // get matching vod in strapi
    const strapiVod = await getStrapiVodByAnnounceUrl(vod.announceUrl)

    if (strapiVod) {
      // we've got a matching vod

      if (vod.tags) {
        console.log(`source vod has tags: ${vod.tags}`)

        let strapiTagsIds = []

        // for each tag, get the matching strapi tag ID
        for (const tag of vod.tags) {
          // lookup the strapi tag id
          const strapiTag = await getStrapiTagByName(tag)
          strapiTagsIds.push(strapiTag.id)
        }
        
        console.log(`we are adding the following strapiTagsIds to vod ID ${strapiVod.id}: ${strapiTagsIds}`)

        // create relations between matching vod and the tags
        await associateVodWithTagsInStrapi(strapiVod.id, strapiTagsIds)

      }
    }
  }

  // const groupedCollection = _.groupBy(related.rows, 'vod_id');
  // for (const vodId in groupedCollection) {
  //   const tagsIds = groupedCollection[vodId].map((t)=>t.tag_id)
  //   const tagsIdsAltered = tagsIds.map((t)=>(t === 114) ? 520 : t)
  //   await associateVodWithTagsInStrapi(vodId, tagsIdsAltered)
  // }

  // const res = await client.query('SELECT id, name FROM tags')
  // for (const tag of res.rows) {
  //   // for (const link of related.rows) {
  //   //   await new Promise((resolve) => setTimeout(resolve, 1000))
  //   //   await associateTagWithVodsInStrapi(link.tag_id, link.vod_id)
  //   // }
  // }

  await client.end()
}





// const res = await client.query('SELECT * FROM public.tags_vod_links')


main()
// restore tags from db backup 
// make associations between vods <--> tags in strapi


// we iterate through the local, non-strapi backup db first.
// get list of all tags 
// for each tag
//   * get list of related vods
//   * create relation in Strapi. 

