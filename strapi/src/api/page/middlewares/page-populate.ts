/**
 * `page` middleware
 */
import type { Core } from '@strapi/strapi';

const populate = {
  dynamic_zone: {
    on: {
      'dynamic-zone.hero': {
        populate: {
          CTAs: true,
        },
      },
      'dynamic-zone.features': {
        populate: {
          globe_card: true,
          ray_card: {
            populate: {
              before_ray_items: true,
              after_ray_items: true,
            },
          },
          graph_card: {
            populate: {
              top_items: true,
            },
          },
          social_media_card: {
            populate: {
              logos: {
                populate: {
                  image: true,
                },
              },
            },
          },
        },
      },
      'dynamic-zone.testimonials': {
        populate: {
          testimonials: {
            populate: {
              user: {
                populate: {
                  image: true,
                },
              },
            },
          },
        },
      },
      'dynamic-zone.how-it-works': {
        populate: {
          steps: true,
        },
      },
      'dynamic-zone.brands': {
        populate: {
          logos: {
            populate: {
              image: true,
            },
          },
        },
      },
      'dynamic-zone.pricing': {
        populate: {
          plans: {
            populate: {
              perks: true,
              CTA: true,
              product: {
                populate: {
                  plans: true,
                  dynamic_zone: {
                    on: {
                      'dynamic-zone.related-products': {
                        populate: {
                          products: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      'dynamic-zone.launches': {
        populate: {
          launches: true,
        },
      },
      'dynamic-zone.cta': {
        populate: {
          CTAs: true,
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
