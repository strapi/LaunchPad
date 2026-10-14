import type { Core } from '@strapi/strapi';

const populate = { logo: true, defaultPromoBanner: true };

export default (config, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx, next) => {
    ctx.query = { populate, ...ctx.query };
    await next();
  };
};
