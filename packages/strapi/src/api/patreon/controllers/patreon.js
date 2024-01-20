'use strict';

/**
 * patreon controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::patreon.patreon', ({ strapi }) => ({
  async getPublicPatrons(ctx) {
    const patrons = await strapi.entityService.findMany('plugin::users-permissions.user', {
      fields: ['username', 'vanityLink', 'isNamePublic', 'isLinkPublic', 'patreonBenefits'],
    })

    let publicPatrons = []
    for (const patron of patrons) {
      let publicPatron = {}
      let benefits = (!!patron?.patreonBenefits) ? patron.patreonBenefits.split(',') : []
      if (patron.isNamePublic) publicPatron.username = patron.username;

      // if patron has "Your URL displayed on Futureporn.net" benefit,
      // publically share their link if they want it shared
      if (benefits.includes('10663202')) {
        if (patron.isLinkPublic) publicPatron.vanityLink = patron.vanityLink;
      }

      if (!!publicPatron.username || !!publicPatron.vanityLink) publicPatrons.push(publicPatron);
    }

    return publicPatrons
  },
  async muxAllocationCount(ctx) {
    const count = await strapi.service('api::patreon.patreon').getMuxAllocationCount()
    return count
  }
}));

