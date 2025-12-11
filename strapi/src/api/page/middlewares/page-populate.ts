/**
 * `page` middleware
 */
import type { Core } from '@strapi/strapi';

const populate = {
  dynamic_zone: {
    on: {
      'dynamic-zone.hero': {
        populate: {
          background: true,
          CTAs: true,
        },
      },
      'sections.section-service': {
        populate: {
          service: {
            populate: '*'
          }
        },
      },
      'sections.section-projet-home': {
        populate: {
          projets: {
            populate: '*'
          }
        },
      },
      'sections.service-card': {
        populate: {
          offres: {
            populate: '*'
          }
        },
      },
      'sections.notre-equipe-home': {
        populate: {
          team_members: {
            populate: {
              image: true,
              poste: true,
            }
          }
        },
      },
      'sections.technologies-home': {
        populate: {
          cards: {
            populate: {
              image: true,
              technologies: true,
            }
          }
        },
      },
      'sections.section-title-content-image': {
        populate: {
              image: true, 
        }
      },
      'sections.section-image': {
        populate: {
              images: true, 
        }
      },
      'sections.client-satified': {
        populate: {
          client_satisfied_detaileds: {
            populate: '*'
          },
          logos: {
            populate: '*'
          }
        }
      },
      'sections.booste-activity': {
        populate: {
          expertise: {
            populate: "*"
          },
          background: true
        }
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
            populate: "*"
          },
        },
      },
      'sections.trusted-client': {
        populate: {
          logos: {
            populate: '*'
          }
        }
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
              additional_perks: true,
              CTA: true,
              product: true,
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
      'dynamic-zone.faq': {
        populate: {
          faqs: true,
        },
      },
      'dynamic-zone.form-next-to-section': {
        populate: {
          form: {
            populate: {
              inputs: true,
            },
          },
          section: {
            populate: {
              users: {
                populate: {
                  image: true,
                },
              },
            },
          },
          social_media_icon_links: {
            populate: {
              image: true,
              link: true,
            },
          },
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
