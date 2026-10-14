import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::promo-banner.promo-banner', {
  config: {
    find: { middlewares: ['api::promo-banner.promo-banner-populate'] },
    findOne: { middlewares: ['api::promo-banner.promo-banner-populate'] },
  },
});
