'use strict';



// const purest = require('purest');

// const patreon = async function patreon({ accessToken }) {
//   console.log(`  >> patreon callback ascivated with accessToken:${accessToken}`)
//   const patreon = purest({
//     provider: 'patreon',
//     config: {
//       patreon: {
//         default: {
//           origin: 'https://www.patreon.com',
//           path: 'api/oauth2/{path}',
//           headers: {
//             authorization: 'Bearer {auth}',
//           },
//         },
//       },
//     },
//   });

//   return patreon
//     .get('v2/identity')
//     .auth(accessToken)
//     .qs(new URLSearchParams({ 
//       "include": "memberships,memberships.currently_entitled_tiers,memberships.currently_entitled_tiers.benefits,memberships.campaign",
//       "fields[member]": "full_name,is_follower,patron_status,currently_entitled_amount_cents,campaign_lifetime_support_cents",
//       'fields[user]': 'full_name',
//     }).toString())
//     .request()
//     .then(({ body }) => {
//       const patreonData = body.data.attributes;
//       console.log(`  >> patreonData`)
//       console.log(patreonData)
//       return {
//         username: patreonData.full_name,
//         memberships: patreonData
//       };
//     });
// }


module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }) {

    // console.log(strapi.plugin('users-permissions').service('providers-registry'))
    // strapi.plugin('users-permissions').service('providers-registry').register('taco', patreon)
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/*{ strapi }*/) {

  },
};




// module.exports = async () => {
//   await strapi.admin.services.permission.conditionProvider.register({
//     displayName: 'Billing amount under 10K',
//     name: 'billing-amount-under-10k',
//     plugin: 'admin',
//     handler: { amount: { $lt: 10000 } },
//   });
// };