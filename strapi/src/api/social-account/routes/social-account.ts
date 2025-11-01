/**
 * Social Account Routes
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/social-accounts',
      handler: 'social-account.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/social-accounts/:id',
      handler: 'social-account.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/social-accounts/:id',
      handler: 'social-account.delete',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/social-accounts/:id/refresh-token',
      handler: 'social-account.refreshToken',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/social-accounts/:id/test-connection',
      handler: 'social-account.testConnection',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
