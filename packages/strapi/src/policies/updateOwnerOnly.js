'use strict';

/**
 * `updateOwnerOnly` policy.
 */
module.exports = (policyContext, config, { strapi }) => {
    const { PolicyError } = require("@strapi/utils").errors;

    if (policyContext.state.auth.strategy.name === "api-token") {
      if (policyContext.state.auth.credentials.type === "full-access")
        return true;
    } else if (
      policyContext.state.auth.strategy.name === "users-permissions"
    ) {

      // Skip for admins
      if (policyContext.state.auth.credentials.role.type === "admin") {
        return true;
      }

      const currentUserId = policyContext.state.auth.credentials.id;
      const userToUpdate = policyContext.params.id;

      // Unable that an user can update another user
      if (currentUserId != userToUpdate) {
        strapi.log.info(`WARNING: User ${currentUserId} tried to edit user ${userToUpdate}`);
        throw new PolicyError('Unable to edit this user ID');
      }

      return true
    }

    return false;
};