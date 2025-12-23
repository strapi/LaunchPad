/**
 * `page` middleware
 */
import type { Core } from '@strapi/strapi';
import { link } from 'fs';

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
            populate: '*',
          },
        },
      },
      'sections.a-propos-de-nous': {
        populate: {
          cta: true,
          image: true,
          cards: {
            populate: {
              icon: true,
            },
          }
        },
      },
      'sections.our-values': {
        populate: {
          values_items: {
            populate: {
              logo: true
            }
          }
        }
      },
      'sections.avis-clients': {
        populate: {
          avis_clients: {
            populate: {
              client_photo: true,
              option_projet: {
                populate: '*'
              },
            }
          }
        }
      },
      'sections.our-services-have': {
        populate: {
          services_have_items: {
            populate: {
              items_services: true
            }
          }
        }
      },
      'sections.our-vision-of-developpement': {
        populate: {
          image: true
        }
      },
      'sections.carousel-avis-client': {
        populate: {
          avis_clients: {
            populate: {
              client_photo: true,
              option_projet: {
                populate: '*'
              },
            }
          }
        }
      },
      'sections.most-asked-question': {
        populate: {
          faqs: {
            populate: '*'
          }
        }
      },
      'shared.etude-de-cas': {
        populate: {
          solition_appporter_resultat: {
            populate: '*'
          }
        }
      },
      'sections.team-first-section': {
        populate: {
          image: true
        }
      },
      'sections.our-trust': {
        populate: {
          our_trust_items: {
            populate: {
              image: true,
              client_photo: true,
              button: '*',
              entreprise_logo: true
            }
          }
        }
      },
      'sections.section-projet-home': {
        populate: {
          projets: {
            populate: '*',
          },
        },
      },
      'sections.nos-valeurs-a-propos': {
        populate: {
          a_propos_nos_valeurs: {
            populate: {
              icon: true,
            },
          },
        },
      },
      'sections.who-are-we': {
        populate: {
          images: true,
          three_words: true
        }
      },
      'sections.our-vision': {
        populate: {
          vision_detailled: {
            populate: {
              image: true,
              projet_client_satified: {
                populate: '*'
              }
            }
          }
        }
      },
      'items.images-grid': {
        populate: '*',
      },
      'sections.service-card': {
        populate: {
          offres: {
            populate: '*',
          },
        },
      },
      'sections.team-members': {
        populate: {
          team_members: {
            populate: {
              image: true,
              poste: true,
              links: {
                populate: {
                  icon: {
                    populate: {
                      image: true,
                    },
                  }
                }
              }
            },
          },
        }
      },
      'sections.notre-equipe-home': {
        populate: {
          team_members: {
            populate: {
              image: true,
              poste: true,
            },
          },
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
      'sections.team-members-apropos': {
        populate: {
          link: true,
          team_members: {
            populate: {
              image: true,
              poste: true,
              links: {
                populate: {
                  icon: {
                    populate: {
                      image: true,
                    },
                  }
                }
              }
            },
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
            populate: '*',
          },
          logos: {
            populate: '*',
          },
        },
      },
      'sections.booste-activity': {
        populate: {
          expertise: {
            populate: '*',
          },
          background: true,
        },
      },
      'items.cas-etude-header': {
        populate: {
          items_cas_utilisation: true,
          button: true,
          image: true,
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
            populate: '*',
          },
        },
      },
      'dynamic-zone.see-realization': {
        populate: '*',
      },
      'sections.trusted-client': {
        populate: {
          logos: {
            populate: '*',
          },
        },
      },
      'sections.cas-etude': {
        populate: {
          problematique: {
            populate: {
              image: true,
              title_description_items: true,
            },
          },
          challenge: {
            populate: {
              image: true,
              title_description_items: true,
            },
          },
          solution: {
            populate: {
              image: true,
              title_description_items: {
                populate: {
                  image: true,
                }
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
      'form.contact-form': {
        populate: {
          image: true,
          form_config: true
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
