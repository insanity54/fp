'use strict';

const { JWT } = require('@mux/mux-node');

const MUX_SIGNING_KEY_ID = process.env.MUX_SIGNING_KEY_ID;
const MUX_SIGNING_KEY_PRIVATE_KEY = process.env.MUX_SIGNING_KEY_PRIVATE_KEY;
const MUX_PLAYBACK_RESTRICTION_ID = process.env.MUX_PLAYBACK_RESTRICTION_ID

if (!MUX_SIGNING_KEY_PRIVATE_KEY) throw new Error('MUX_SIGNING_KEY_PRIVATE_KEY must be defined in env');
if (!MUX_SIGNING_KEY_ID) throw new Error('MUX_SIGNING_KEY_ID must be defined in env');
if (!MUX_PLAYBACK_RESTRICTION_ID) throw new Error('MUX_PLAYBACK_RESTRICTION_ID must be defined in env');


/**
 * mux-asset controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::mux-asset.mux-asset', ({ strapi }) => ({

  async secure (ctx, next) {

    if (ctx?.query?.id === undefined) {
      ctx.throw(400, 'id query param was missing!')
      return
    }

    const tokens = {}

    tokens.playbackToken = JWT.signPlaybackId(ctx.query.id, {
      keyId: MUX_SIGNING_KEY_ID,
      keySecret: MUX_SIGNING_KEY_PRIVATE_KEY,
      params: { 
        playback_restriction_id: MUX_PLAYBACK_RESTRICTION_ID 
      },
    })


    tokens.storyboardToken = JWT.signPlaybackId(ctx.query.id, {
      keyId: MUX_SIGNING_KEY_ID,
      keySecret: MUX_SIGNING_KEY_PRIVATE_KEY,
      type: 'storyboard'
    })

    tokens.thumbnailToken = JWT.signPlaybackId(ctx.query.id, {
      keyId: MUX_SIGNING_KEY_ID,
      keySecret: MUX_SIGNING_KEY_PRIVATE_KEY,
      type: 'thumbnail'
    })


    ctx.body = tokens
  }
}))

