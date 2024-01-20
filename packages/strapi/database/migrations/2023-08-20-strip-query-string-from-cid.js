const stripQueryString = function (text) {
  if (!text) return '';
  return text.split(/[?#]/)[0];
}

module.exports = {
    async up(knex) {
  
      // Get all vods
      const vods = await knex.select('*').from('vods');
  
      // For each vod, update videoSrcHash and video240Hash
      // we remove any existing ?filename(...) qs from the cid
      for (const [index, vod] of vods.entries()) {
        const strippedVideoSrcHash = stripQueryString(vod.video_src_hash)
        const strippedVideo240Hash = stripQueryString(vod.video_240_hash)
        await knex('vods').update({ video_src_hash: strippedVideoSrcHash }).where({ id: vod.id });
        await knex('vods').update({ video_240_hash: strippedVideo240Hash }).where({ id: vod.id });
      }

    },
  };
  