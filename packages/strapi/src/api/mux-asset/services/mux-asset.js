'use strict';

const { JWT } = require('@mux/mux-node');
const { createCoreService } = require('@strapi/strapi').factories;

/**
 * mux-asset service
 */


module.exports = createCoreService('api::mux-asset.mux-asset', ({strapi}) => ({


  /**
   * reference: https://docs.mux.com/guides/video/secure-video-playback#4-generate-a-json-web-token-jwt
   * reference: https://docs.mux.com/guides/video/secure-video-playback#5-sign-the-json-web-token-jwt
   * 
   * @param {String} playbackId            - signed playback ID
   * @param {String} keyId                 - signing key ID
   * @param {String} keySecret             - base64 encoded private key
   * @param {String} playbackRestructionId - https://docs.mux.com/guides/video/secure-video-playback#create-a-playback-restriction
   * @returns {Object} jwt                 - 
   * @returns {String} jwt.token           -
   * @returns {String} jwt.gifToken        -
   * @returns {String} jwt.thumbnailToken  - 
   */
  async signJwt (playbackId, keyId, keySecret, playbackRestrictionId) {
    // Set some base options we can use for a few different signing types
    // Type can be either video, thumbnail, gif, or storyboard
    let baseOptions = {
      keyId: keyId,         // Enter your signing key id here
      keySecret: keySecret, // Enter your base64 encoded private key here
      expiration: '7d'      // E.g 60, "2 days", "10h", "7d", numeric value interpreted as seconds
    };

    const playbackToken = JWT.signPlaybackId(playbackId, { 
      ...baseOptions , 
      type: 'video',
      params: { playback_restriction_id: playbackRestrictionId }
    });

    // Now the signed playback url should look like this:
    // https://stream.mux.com/${playbackId}.m3u8?token=${token}

    // If you wanted to pass in params for something like a gif, use the
    // params key in the options object
    // const gifToken = JWT.signPlaybackId(playbackId, {
    //   ...baseOptions,
    //   type: 'gif',
    //   params: { time: 10 },
    // })

    const thumbnailToken = JWT.signPlaybackId(playbackId, {
      type: 'thumbnail',
      params: { playback_restriction_id: playbackRestrictionId },
    })

    // Then, use this token in a URL like this:
    // https://image.mux.com/${playbackId}/animated.gif?token=${gifToken}

    // A final example, if you wanted to sign a thumbnail url with a playback restriction
    const storyboardToken = JWT.sign(playbackId, {
      ...baseOptions,
      type: 'storyboard',
      params: { playback_restriction_id: playbackRestrictionId },
    })

    // When used in a URL, it should look like this:
    // https://image.mux.com/${playbackId}/thumbnail.png?token=${thumbnailToken}

    return {
      playbackToken,
      storyboardToken,
      thumbnailToken
    }
  },
  
}));