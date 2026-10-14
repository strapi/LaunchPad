import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::faq.faq', {
  config: {
    find: { middlewares: ['api::faq.faq-populate'] },
    findOne: { middlewares: ['api::faq.faq-populate'] },
  },
});
