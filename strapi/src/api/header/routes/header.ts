import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::header.header', {
  config: {
    find: { middlewares: ['api::header.header-populate'] },
  },
});
