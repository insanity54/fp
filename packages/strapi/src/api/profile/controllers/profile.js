'use strict';



module.exports = {
  update: async (ctx, next) => {
    const update = strapi.plugin('users-permissions').controllers.user.update
    await update(ctx);
  },
  me: async (ctx) => {
    const userId = ctx?.state?.user?.id;
    if (!userId) return ctx.badRequest("There was no user id in the request!");
    const user = await strapi.entityService.findOne('plugin::users-permissions.user', userId, { 
      populate: 'role'
    });
    return user
  },
  test: async (ctx) => {
    return 'blah'
  }
};
