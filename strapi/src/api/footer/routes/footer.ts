import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::footer.footer', {
  config: {
    find: { middlewares: ['api::footer.footer-populate'] },
  },
});
