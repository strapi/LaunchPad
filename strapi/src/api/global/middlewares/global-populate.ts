/**
 * `global-populate` middleware
 */
import type { Core } from '@strapi/strapi';

const populate = {
  navbar: {
    populate: {
      up_navbar_items: {
        populate: {
          icon: {
            populate: ['image'],
          },
          links: {
            populate: {
              icon: {
                populate: {
                  image: true,
                },
              },
            },
          },
        },
      },
      left_navbar_items: true,
      right_navbar_items: true,
      logo: {
        populate: {
          image: true,
        },
      },
    },
  },
  footer: {
    populate: {
      internal_links: true,
      policy_links: true,
      social_media_links: {
        populate: {
          icon: {
            populate: ['image'],
          },
        },
      },
      background: true,
      logo: {
        populate: {
          image: true,
        },
      },
    },
  },
  seo: {
    populate: {
      metaImage: true,
    },
  },
};

export default (config, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx, next) => {
    ctx.query.populate = populate;
    await next();
  };
};
