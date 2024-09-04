/**
 * `dynamic-zone-population` middleware
 */

import type { Core } from '@strapi/strapi';
import getDynamicZoneComponents from '../scripts/populate';

export default (config, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx, next) => {
    if (ctx.request.url.startsWith('/api/') && ctx.request.method === 'GET') {
      strapi.log.info('Using custom Dynamic-Zone population Middleware...');
      ctx.query.populate = {
        dynamic_zone: {
          on: getDynamicZoneComponents(),
        },
      };
    }
    await next();
  };
};
