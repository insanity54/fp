'use strict';

/**
 * Jwt.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

const _ = require('lodash');
const jwt = require('jsonwebtoken');

module.exports = ({ strapi }) => ({
  getToken(ctx) {
    let token;

    if (ctx.request && ctx.request.header && ctx.request.header.authorization) {
      const parts = ctx.request.header.authorization.split(/\s+/);

      if (parts[0].toLowerCase() !== 'bearer' || parts.length !== 2) {
        return null;
      }

      token = parts[1];
    } else {
      return null;
    }

    return this.verify(token);
  },

  issue(payload, jwtOptions = {}) {
    _.defaults(jwtOptions, strapi.config.get('plugin.users-permissions.jwt'));

    // jwt.issue and jwt.verify are modified from stock strapi code because I believe there is an issue with how stock strapi handles JWT.
    // see https://github.com/auth0/node-jsonwebtoken/issues/208#issuecomment-231861138
    // console.log(`>>> JWT ISSUE invoked!!! jwtSecret:${strapi.config.get('plugin.users-permissions.jwtSecret')}`)

    // const jwtOne = jwt.sign(
    //   _.clone(payload),
    //   strapi.config.get('plugin.users-permissions.jwtSecret'),
    //   jwtOptions
    // )

    // const jwtTwo = jwt.sign(
    //   _.clone(payload),
    //   new Buffer.from(strapi.config.get('plugin.users-permissions.jwtSecret'), 'base64'),
    //   jwtOptions
    // )

    // console.log(`ok so lets do the thing. here is jwtOne:${jwtOne}`)
    // console.log(`ok so lets do the thing. here is jwtTwo:${jwtTwo}`)
    

    return jwt.sign(
      _.clone(payload.toJSON ? payload.toJSON() : payload),
      new Buffer.from(strapi.config.get('plugin.users-permissions.jwtSecret'), 'base64'),
      jwtOptions
    );
  },

  verify(token) {
    return new Promise((resolve, reject) => {
      // jwt.issue and jwt.verify are modified from stock strapi code because I believe there is an issue with how stock strapi handles JWT.
      // see https://github.com/auth0/node-jsonwebtoken/issues/208#issuecomment-231861138

      jwt.verify(
        token,
        new Buffer.from(strapi.config.get('plugin.users-permissions.jwtSecret'), 'base64'),
        {},
        (err, tokenPayload = {}) => {
          if (err) {
            return reject(new Error('Invalid token.'));
          }
          resolve(tokenPayload);
        }
      );
    });
  },
});
