import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::news-item.news-item', {
  config: {
    find: { middlewares: ['api::news-item.news-item-populate'] },
    findOne: { middlewares: ['api::news-item.news-item-populate'] },
  },
});
