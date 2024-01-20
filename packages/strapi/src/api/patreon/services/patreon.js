'use strict';

/**
 * patreon service
 */

const EleventyFetch = require("@11ty/eleventy-fetch");
const { createCoreService } = require('@strapi/strapi').factories;



module.exports = createCoreService('api::patreon.patreon', ({strapi}) => ({


  async getPatreonCampaign() {
    return EleventyFetch('https://www.patreon.com/api/campaigns/8012692', {
      duration: "12h",
      type: "json",
    })
  },


  async getPatreonCampaignPledgeSum() {
    const campaign = await this.getPatreonCampaign()
    return campaign.data.attributes.pledge_sum
  },


  /**
   * Calculate how many mux allocations the site should have, based on the dollar amount of pledges from patreon
   * 
   * @param {Number} pledgeSum - USD cents
   */
  async getMuxAllocationCount() {
    const patreonData = await strapi.entityService.findMany('api::patreon.patreon', {
      fields: ['muxAllocationCostCents']
    })
    if (!patreonData) throw new Error('patreonData in Strapi was missing');
    const muxAllocationCostCents = patreonData.muxAllocationCostCents
    const pledgeSum = await this.getPatreonCampaignPledgeSum()
    const muxAllocationCount = Math.floor(pledgeSum / muxAllocationCostCents); // calculate the number of mux allocations required
    return muxAllocationCount;
  }
}));

