/**
 * `global-populate` middleware
 */
import type { Core } from '@strapi/strapi';

const populate = {
  navbar: {
    populate: {
      left_navbar_items: true,
      right_navbar_items: true,
      logo: {
        fields: ['company'],
        populate: {
          image: true,
        },
      },
    },
  },
  footer: {
    fields: ['description', 'copyright', 'designed_developed_by', 'built_with'],
    populate: {
      internal_links: true,
      policy_links: true,
      social_media_links: true,
      logo: {
        fields: ['company'],
        populate: {
          image: true,
        },
      },
    },
  },
};

export default (config, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx, next) => {
    console.log('Hi! something is happening, also inside the return', populate);
    ctx.query.populate = populate;
    await next();
  };
};
