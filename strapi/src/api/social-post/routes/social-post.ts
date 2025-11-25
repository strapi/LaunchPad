/**
 * Social Post Routes
 * Defines all API endpoints for social post management
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/social-posts',
      handler: 'social-post.find',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/social-posts/:id',
      handler: 'social-post.findOne',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/social-posts',
      handler: 'social-post.create',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/social-posts/:id',
      handler: 'social-post.update',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'DELETE',
      path: '/social-posts/:id',
      handler: 'social-post.delete',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/social-posts/:id/publish',
      handler: 'social-post.publish',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/social-posts/:id/schedule',
      handler: 'social-post.schedule',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/social-posts/:id/analytics',
      handler: 'social-post.getAnalytics',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
