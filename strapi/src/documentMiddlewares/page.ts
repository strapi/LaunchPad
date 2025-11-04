import type { FindOne } from '@strapi/types/dist/modules/documents/params/document-engine';

const pageTypes = ['api::page.page'];
const pageActions = ['findMany'];

/**
 * Registers a middleware to customize the population of related fields for page documents during Strapi queries.
 *
 * This middleware intercepts document queries for the "api::page.page" content type when the action is "findMany".
 * If the request parameters include pagination with { start: 0, limit: 1 } and a 'middlewarePopulate' array,
 * it selectively applies deep population rules for specified attributes, as defined in 'pagePopulateObject'.
 *
 * The request must contain 'middlewarePopulate' (array of string keys) in the 'params' object, which is going to be mapped to 'pagePopulateObject' attributes.
 *
 */
export const registerPopulatePageMiddleware = ({ strapi }) => {
  strapi.documents.use((context, next) => {
    if (
      pageTypes.includes(context.uid) &&
      pageActions.includes(context.action)
    ) {
      const requestParams: {
        start?: number;
        limit?: number;
        middlewarePopulate?: Array<string>;
      } = context.params;
      if (
        // This is added by Strapi regardless of whether you use pagination or start & limit attributes
        // This condition will be met if the request contains {pagination: {page: 1, pageSize: 1}}
        requestParams?.start === 0 &&
        requestParams?.limit === 1 &&
        Array.isArray(requestParams?.middlewarePopulate)
      ) {
        requestParams.middlewarePopulate
          .filter((populateAttr) =>
            Object.keys(pagePopulateObject).includes(populateAttr)
          )
          .forEach((populateAttr) => {
            context.params.populate[populateAttr] =
              pagePopulateObject[populateAttr];
          });
      }
    }

    return next();
  });
};

const pagePopulateObject: FindOne<'api::page.page'>['populate'] = {
  // Example:
  // content: {
  //   on: {
  //     "sections.image-with-cta-button": {
  //       populate: { image: { populate: { media: true } }, link: true },
  //     }
  //   },
  // },
  // seo: {
  //   populate: {
  //     metaImage: true,
  //     twitter: { populate: { images: true } },
  //     og: { populate: { image: true } },
  //   },
  // },
};
