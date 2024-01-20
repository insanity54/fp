module.exports = {
  routes: [
    {
      method: 'PUT',
      path: '/profile/:id',
      handler: 'profile.update',
      config: {
        prefix: '',
        policies: ['global::updateOwnerOnly']
      },
    },
    {
      method: 'GET',
      path: '/profile/me',
      handler: 'profile.me'
    },
    {
      method: 'GET',
      path: '/profile/test',
      handler: 'profile.test'
    }
  ],
};
