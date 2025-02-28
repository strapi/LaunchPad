/**
 * `deepPopulate` middleware
 */

import type { Core } from '@strapi/strapi';
import { UID } from '@strapi/types';
import { contentTypes } from '@strapi/utils';
import pluralize from 'pluralize';


interface Options {
  /**
   * Fields to select when populating relations
   */
  relationalFields?: string[];
}

const { CREATED_BY_ATTRIBUTE, UPDATED_BY_ATTRIBUTE } = contentTypes.constants;

const extractPathSegment = (url: string) => url.match(/\/([^/?]+)(?:\?|$)/)?.[1] || '';

const getDeepPopulate = (uid: UID.Schema, opts: Options = {}) => {
  const model = strapi.getModel(uid);
  const attributes = Object.entries(model.attributes);

  return attributes.reduce((acc: any, [attributeName, attribute]) => {
    switch (attribute.type) {
      case 'relation': {
        const isMorphRelation = attribute.relation.toLowerCase().startsWith('morph');
        if (isMorphRelation) {
          break;
        }

        // Ignore not visible fields other than createdBy and updatedBy
        const isVisible = contentTypes.isVisibleAttribute(model, attributeName);
        const isCreatorField = [CREATED_BY_ATTRIBUTE, UPDATED_BY_ATTRIBUTE].includes(attributeName);

        if (isVisible) {
          if (attributeName === 'testimonials') {
            acc[attributeName] = { populate: "user.image" };
          } else {
            acc[attributeName] = { populate: "*" };
          }
        }

        break;
      }

      case 'media': {
        acc[attributeName] = { populate: "*" };
        break;
      }

      case 'component': {
        const populate = getDeepPopulate(attribute.component, opts);
        acc[attributeName] = { populate };
        break;
      }

      case 'dynamiczone': {
        // Use fragments to populate the dynamic zone components
        const populatedComponents = (attribute.components || []).reduce(
          (acc: any, componentUID: UID.Component) => {
            acc[componentUID] = { populate: getDeepPopulate(componentUID, opts) };

            return acc;
          },
          {}
        );

        acc[attributeName] = { on: populatedComponents };
        break;
      }
      default:
        break;
    }

    return acc;
  }, {});
};

export default (config, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx, next) => {
    if (ctx.request.url.startsWith('/api/') && ctx.request.method === 'GET' && !ctx.query.populate && !ctx.request.url.includes('/api/users') && !ctx.request.url.includes('/api/seo')
    ) {
      strapi.log.info('Using custom Dynamic-Zone population Middleware...');

      const contentType = extractPathSegment(ctx.request.url);
      const singular = pluralize.singular(contentType)
      const uid = `api::${singular}.${singular}`;

      ctx.query.populate = {
        // @ts-ignores 
        ...getDeepPopulate(uid),
        ...(!ctx.request.url.includes("products") && { localizations: { populate: {} } })
      };
    }
    await next();
  };
};

