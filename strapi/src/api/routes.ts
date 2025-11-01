/**
 * Custom Routes
 * Additional API endpoints for OAuth and webhooks
 */

export default {
  routes: [
    // OAuth routes
    {
      method: 'GET',
      path: '/auth/facebook',
      handler: 'plugin::users-permissions.auth.facebookAuth',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/auth/facebook/callback',
      handler: 'plugin::users-permissions.auth.facebookCallback',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/auth/instagram',
      handler: 'plugin::users-permissions.auth.instagramAuth',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/auth/instagram/callback',
      handler: 'plugin::users-permissions.auth.instagramCallback',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/auth/twitter',
      handler: 'plugin::users-permissions.auth.twitterAuth',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/auth/twitter/callback',
      handler: 'plugin::users-permissions.auth.twitterCallback',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/auth/linkedin',
      handler: 'plugin::users-permissions.auth.linkedinAuth',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/auth/linkedin/callback',
      handler: 'plugin::users-permissions.auth.linkedinCallback',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    // Stripe webhook
    {
      method: 'POST',
      path: '/webhooks/stripe',
      handler: 'plugin::users-permissions.stripe.handleWebhook',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
