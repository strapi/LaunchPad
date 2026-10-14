import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::regulated-document.regulated-document', {
  config: {
    find: { middlewares: ['api::regulated-document.regulated-document-populate'] },
    findOne: { middlewares: ['api::regulated-document.regulated-document-populate'] },
  },
});
