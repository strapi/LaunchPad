export default ({ env }) => ({
  'better-auth': {
    enabled: true,
    resolve: '@strapi-community/plugin-better-auth/package.json',
    config: {
      betterAuthOptions: {
        secret: env('BETTER_AUTH_SECRET'),
        baseURL: env('STRAPI_URL', 'http://localhost:1337'),
        trustedOrigins: [env('CLIENT_URL', 'http://localhost:3000')],
        emailAndPassword: {
          enabled: true,
          requireEmailVerification: false,
        },
        session: {
          expiresIn: 60 * 60 * 24 * 7, // 7 days
        },
      },
    },
  },
});
