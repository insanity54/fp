'use strict';

/**
 * Module dependencies
 */

// Public node modules.
const _ = require('lodash');
const urlJoin = require('url-join');

const { getAbsoluteServerUrl } = require('@strapi/utils');
const { getService } = require('../utils');

module.exports = ({ strapi }) => {
  /**
   * Helper to get profiles
   *
   * @param {String}   provider
   */

  const getProfile = async (provider, query) => {
    const accessToken = query.access_token || query.code || query.oauth_token;

    const providers = await strapi
      .store({ type: 'plugin', name: 'users-permissions', key: 'grant' })
      .get();

    return getService('providers-registry').run({
      provider,
      query,
      accessToken,
      providers,
    });
  };

  /**
   * Connect thanks to a third-party provider.
   *
   *
   * @param {String}    provider
   * @param {String}    accessToken
   *
   * @return  {*}
   */

  const connect = async (provider, query) => {
    const accessToken = query.access_token || query.code || query.oauth_token;

    if (!accessToken) {
      throw new Error('No access_token.');
    }

    // Get the profile.
    const profile = await getProfile(provider, query);

    const email = _.toLower(profile.email);

    // We need at least the mail.
    if (!email) {
      throw new Error('Email was not available.');
    }

    const users = await strapi.query('plugin::users-permissions.user').findMany({
      where: { email },
    });

    const advancedSettings = await strapi
      .store({ type: 'plugin', name: 'users-permissions', key: 'advanced' })
      .get();

    const user = _.find(users, { provider });

    if (_.isEmpty(user) && !advancedSettings.allow_register) {
      throw new Error('Register action is actually not available.');
    }

    if (!_.isEmpty(user)) {
      console.log(`>>> welcome back, user!`)
      console.log(user)
    }


    // Retrieve default role.
    const defaultRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: advancedSettings.default_role } });

    const patronRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { name: 'Patron' }});

    if (_.isEmpty(patronRole)) throw new Error('Patron role is missing in Strapi. Please create it in users-permissions plugin.');

    const patreonModel = await strapi
    .query('api::patreon.patreon')
    .findOne({ select: ['id', 'accessToken', 'benefitId'], where: { id: 1 } });
    
    console.log(`  >> patreon model`)
    console.log(patreonModel)
    console.log(`  >> patreon:${patreonModel.id}`)
    
    // get the user's patron status
    console.log(`  >> HERE is the user's patreon profile`)
    const isPatron = profile.benefits.includes(patreonModel.benefitId)
    const patreonBenefits = profile.benefits.join(',')
    console.log(`isPatron:${isPatron}`)


    // Update the user's role to match their patron status
    const selectedRole = (isPatron) ? patronRole : defaultRole


    if (!_.isEmpty(user)) {
      const updatedUser = await strapi
        .query('plugin::users-permissions.user')
        .update({
          where: { email },
          data: {
            ...user,
            role: selectedRole.id,
            patreonBenefits
          }
        })
      return updatedUser;
    }

    if (users.length && advancedSettings.unique_email) {
      throw new Error('Email is already taken.');
    }
    
    // Create the new user.
    const newUser = {
      ...profile,
      email, // overwrite with lowercased email
      provider,
      role: selectedRole.id,
      confirmed: true,
    };

    const createdUser = await strapi
      .query('plugin::users-permissions.user')
      .create({ data: newUser });

    return createdUser;
  };

  const buildRedirectUri = (provider = '') => {
    const apiPrefix = strapi.config.get('api.rest.prefix');
    return urlJoin(getAbsoluteServerUrl(strapi.config), apiPrefix, 'connect', provider, 'callback');
  };

  return {
    connect,
    buildRedirectUri,
  };
};
