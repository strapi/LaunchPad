import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::press-release.press-release', {
  config: {
    find: { middlewares: ['api::press-release.press-release-populate'] },
    findOne: { middlewares: ['api::press-release.press-release-populate'] },
  },
});
