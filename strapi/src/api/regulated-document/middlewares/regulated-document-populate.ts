import type { Core } from '@strapi/strapi';

const populate = { file: true, product: true };

export default (config, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx, next) => {
    ctx.query = { populate, ...ctx.query };
    await next();
  };
};
