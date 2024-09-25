import type { Struct, Schema } from '@strapi/strapi';

export interface SharedUser extends Struct.ComponentSchema {
  collectionName: 'components_shared_users';
  info: {
    displayName: 'User';
    icon: 'user';
    description: '';
  };
  attributes: {
    firstname: Schema.Attribute.String;
    lastname: Schema.Attribute.String;
    job: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedSteps extends Struct.ComponentSchema {
  collectionName: 'components_shared_steps';
  info: {
    displayName: 'Steps';
    icon: 'bulletList';
    description: '';
  };
  attributes: {
    title: Schema.Attribute.String;
    description: Schema.Attribute.String;
  };
}

export interface SharedSocialMediaIconLinks extends Struct.ComponentSchema {
  collectionName: 'components_shared_social_media_icon_links';
  info: {
    displayName: 'Social_Media_Icon_Links';
    icon: 'expand';
    description: '';
  };
  attributes: {
    image: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    link: Schema.Attribute.Component<'shared.link', true>;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    displayName: 'seo';
    icon: 'search';
  };
  attributes: {
    metaTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    metaDescription: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 50;
      }>;
    metaImage: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
    keywords: Schema.Attribute.Text;
    metaRobots: Schema.Attribute.String;
    structuredData: Schema.Attribute.JSON;
    metaViewport: Schema.Attribute.String;
    canonicalURL: Schema.Attribute.String;
  };
}

export interface SharedSection extends Struct.ComponentSchema {
  collectionName: 'components_shared_sections';
  info: {
    displayName: 'Section';
    icon: 'cursor';
  };
  attributes: {
    heading: Schema.Attribute.String;
    sub_heading: Schema.Attribute.String;
    users: Schema.Attribute.Component<'shared.user', true>;
  };
}

export interface SharedPerks extends Struct.ComponentSchema {
  collectionName: 'components_shared_perks';
  info: {
    displayName: 'Perks';
    icon: 'check';
    description: '';
  };
  attributes: {
    text: Schema.Attribute.String;
  };
}

export interface SharedLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_links';
  info: {
    displayName: 'Link';
    icon: 'link';
  };
  attributes: {
    text: Schema.Attribute.String;
    URL: Schema.Attribute.String;
    target: Schema.Attribute.Enumeration<
      ['_blank', '_self', '_parent', '_top']
    >;
  };
}

export interface SharedLaunches extends Struct.ComponentSchema {
  collectionName: 'components_shared_launches';
  info: {
    displayName: 'Launches';
    icon: 'rocket';
    description: '';
  };
  attributes: {
    mission_number: Schema.Attribute.String;
    title: Schema.Attribute.String;
    description: Schema.Attribute.String;
  };
}

export interface SharedForm extends Struct.ComponentSchema {
  collectionName: 'components_shared_forms';
  info: {
    displayName: 'Form';
    icon: 'paperPlane';
    description: '';
  };
  attributes: {
    inputs: Schema.Attribute.Component<'items.input', true>;
  };
}

export interface SharedButton extends Struct.ComponentSchema {
  collectionName: 'components_shared_buttons';
  info: {
    displayName: 'Button';
    icon: 'cursor';
    description: '';
  };
  attributes: {
    text: Schema.Attribute.String;
    URL: Schema.Attribute.String;
    target: Schema.Attribute.Enumeration<
      ['_blank', '_self', '_parent', '_top']
    >;
    variant: Schema.Attribute.Enumeration<
      ['simple', 'outline', 'primary', 'muted']
    > &
      Schema.Attribute.DefaultTo<'primary'>;
  };
}

export interface ItemsRayItems extends Struct.ComponentSchema {
  collectionName: 'components_items_ray_items';
  info: {
    displayName: 'Ray_Card_Items';
    icon: 'bulletList';
    description: '';
  };
  attributes: {
    item_1: Schema.Attribute.String;
    item_2: Schema.Attribute.String;
    item_3: Schema.Attribute.String;
  };
}

export interface ItemsLeftNavbarItems extends Struct.ComponentSchema {
  collectionName: 'components_items_left_navbar_items';
  info: {
    displayName: 'Left_Navbar_Items';
    icon: 'bulletList';
  };
  attributes: {
    name: Schema.Attribute.String;
    URL: Schema.Attribute.String;
  };
}

export interface ItemsInput extends Struct.ComponentSchema {
  collectionName: 'components_items_inputs';
  info: {
    displayName: 'Input';
    icon: 'apps';
    description: '';
  };
  attributes: {
    type: Schema.Attribute.Enumeration<
      [
        'text',
        'email',
        'password',
        'submit',
        'textarea',
        'button',
        'checkbox',
        'color',
        'date',
        'datetime-local',
        'file',
        'hidden',
        'image',
        'month',
        'number',
        'radio',
        'range',
        'reset',
        'search',
        'tel',
        'time',
        'url',
        'week',
      ]
    > &
      Schema.Attribute.DefaultTo<'text'>;
    name: Schema.Attribute.String;
    placeholder: Schema.Attribute.String;
  };
}

export interface ItemsGraphCardTopItems extends Struct.ComponentSchema {
  collectionName: 'components_items_graph_card_top_items';
  info: {
    displayName: 'Graph_Card_Top_Items';
    icon: 'bulletList';
  };
  attributes: {
    number: Schema.Attribute.String;
    text: Schema.Attribute.String;
  };
}

export interface GlobalNavbar extends Struct.ComponentSchema {
  collectionName: 'components_global_navbars';
  info: {
    displayName: 'Navbar';
    icon: 'bold';
  };
  attributes: {
    logo: Schema.Attribute.Relation<'oneToOne', 'api::logo.logo'>;
    left_navbar_items: Schema.Attribute.Component<'shared.link', true>;
    right_navbar_items: Schema.Attribute.Component<'shared.link', true>;
  };
}

export interface GlobalFooter extends Struct.ComponentSchema {
  collectionName: 'components_global_footers';
  info: {
    displayName: 'Footer';
    icon: 'apps';
    description: '';
  };
  attributes: {
    logo: Schema.Attribute.Relation<'oneToOne', 'api::logo.logo'>;
    description: Schema.Attribute.String;
    copyright: Schema.Attribute.String;
    designed_developed_by: Schema.Attribute.String;
    built_with: Schema.Attribute.String;
    internal_links: Schema.Attribute.Component<'shared.link', true>;
    policy_links: Schema.Attribute.Component<'shared.link', true>;
    social_media_links: Schema.Attribute.Component<'shared.link', true>;
  };
}

export interface DynamicZoneTestimonials extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_testimonials';
  info: {
    displayName: 'Testimonials';
    icon: 'emotionHappy';
    description: '';
  };
  attributes: {
    heading: Schema.Attribute.String;
    sub_heading: Schema.Attribute.String;
    testimonials: Schema.Attribute.Relation<
      'oneToMany',
      'api::testimonial.testimonial'
    >;
  };
}

export interface DynamicZoneRelatedProducts extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_related_products';
  info: {
    displayName: 'Related_Products';
    icon: 'stack';
  };
  attributes: {
    heading: Schema.Attribute.String;
    sub_heading: Schema.Attribute.String;
    products: Schema.Attribute.Relation<'oneToMany', 'api::product.product'>;
  };
}

export interface DynamicZoneRelatedArticles extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_related_articles';
  info: {
    displayName: 'related_articles';
    icon: 'bulletList';
    description: '';
  };
  attributes: {
    heading: Schema.Attribute.String;
    sub_heading: Schema.Attribute.String;
    articles: Schema.Attribute.Relation<'oneToMany', 'api::article.article'>;
  };
}

export interface DynamicZonePricing extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_pricings';
  info: {
    displayName: 'Pricing';
    icon: 'shoppingCart';
    description: '';
  };
  attributes: {
    heading: Schema.Attribute.String;
    sub_heading: Schema.Attribute.String;
    plans: Schema.Attribute.Relation<'oneToMany', 'api::plan.plan'>;
  };
}

export interface DynamicZoneLaunches extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_launches';
  info: {
    displayName: 'Launches';
    icon: 'rocket';
    description: '';
  };
  attributes: {
    heading: Schema.Attribute.String;
    sub_heading: Schema.Attribute.String;
    launches: Schema.Attribute.Component<'shared.launches', true>;
  };
}

export interface DynamicZoneHowItWorks extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_how_it_works';
  info: {
    displayName: 'How_It_Works';
    icon: 'question';
    description: '';
  };
  attributes: {
    heading: Schema.Attribute.String;
    sub_heading: Schema.Attribute.String;
    steps: Schema.Attribute.Component<'shared.steps', true>;
  };
}

export interface DynamicZoneHero extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_heroes';
  info: {
    displayName: 'Hero';
    icon: 'layout';
    description: '';
  };
  attributes: {
    heading: Schema.Attribute.String;
    sub_heading: Schema.Attribute.String;
    CTAs: Schema.Attribute.Component<'shared.button', true>;
  };
}

export interface DynamicZoneFormNextToSection extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_form_next_to_sections';
  info: {
    displayName: 'Form_Next_To_Section';
    icon: 'book';
    description: '';
  };
  attributes: {
    heading: Schema.Attribute.String;
    sub_heading: Schema.Attribute.String;
    form: Schema.Attribute.Component<'shared.form', false>;
    section: Schema.Attribute.Component<'shared.section', false>;
    social_media_icon_links: Schema.Attribute.Component<
      'shared.social-media-icon-links',
      true
    >;
  };
}

export interface DynamicZoneFeatures extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_features';
  info: {
    displayName: 'Features';
    icon: 'bulletList';
    description: '';
  };
  attributes: {
    heading: Schema.Attribute.String;
    sub_heading: Schema.Attribute.String;
    globe_card: Schema.Attribute.Component<'cards.globe-card', false>;
    ray_card: Schema.Attribute.Component<'cards.ray-card', false>;
    graph_card: Schema.Attribute.Component<'cards.graph-card', false>;
    social_media_card: Schema.Attribute.Component<
      'cards.social-media-card',
      false
    >;
  };
}

export interface DynamicZoneFaq extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_faqs';
  info: {
    displayName: 'FAQ';
    icon: 'question';
  };
  attributes: {
    heading: Schema.Attribute.String;
    sub_heading: Schema.Attribute.String;
    faqs: Schema.Attribute.Relation<'oneToMany', 'api::faq.faq'>;
  };
}

export interface DynamicZoneCta extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_ctas';
  info: {
    displayName: 'CTA';
    icon: 'cursor';
    description: '';
  };
  attributes: {
    heading: Schema.Attribute.String;
    sub_heading: Schema.Attribute.String;
    CTAs: Schema.Attribute.Component<'shared.button', true>;
  };
}

export interface DynamicZoneBrands extends Struct.ComponentSchema {
  collectionName: 'components_dynamic_zone_brands';
  info: {
    displayName: 'Brands';
    icon: 'bulletList';
    description: '';
  };
  attributes: {
    heading: Schema.Attribute.String;
    sub_heading: Schema.Attribute.String;
    logos: Schema.Attribute.Relation<'oneToMany', 'api::logo.logo'>;
  };
}

export interface CardsSocialMediaCard extends Struct.ComponentSchema {
  collectionName: 'components_cards_social_media_cards';
  info: {
    displayName: 'Social_Media_Card';
    icon: 'dashboard';
    description: '';
  };
  attributes: {
    Title: Schema.Attribute.String;
    Description: Schema.Attribute.String;
    logos: Schema.Attribute.Relation<'oneToMany', 'api::logo.logo'>;
    span: Schema.Attribute.Enumeration<['one', 'two', 'three']>;
  };
}

export interface CardsRayCard extends Struct.ComponentSchema {
  collectionName: 'components_cards_ray_cards';
  info: {
    displayName: 'Ray_Card';
    icon: 'dashboard';
    description: '';
  };
  attributes: {
    title: Schema.Attribute.String;
    description: Schema.Attribute.String;
    before_ray_items: Schema.Attribute.Component<'items.ray-items', false>;
    after_ray_items: Schema.Attribute.Component<'items.ray-items', false>;
    span: Schema.Attribute.Enumeration<['one', 'two', 'three']>;
  };
}

export interface CardsGraphCard extends Struct.ComponentSchema {
  collectionName: 'components_cards_graph_cards';
  info: {
    displayName: 'Graph_Card';
    icon: 'dashboard';
    description: '';
  };
  attributes: {
    title: Schema.Attribute.String;
    description: Schema.Attribute.String;
    top_items: Schema.Attribute.Component<'items.graph-card-top-items', true>;
    highlighted_text: Schema.Attribute.String;
    span: Schema.Attribute.Enumeration<['one', 'two', 'three']>;
  };
}

export interface CardsGlobeCard extends Struct.ComponentSchema {
  collectionName: 'components_cards_globe_cards';
  info: {
    displayName: 'Globe_Card';
    icon: 'dashboard';
    description: '';
  };
  attributes: {
    title: Schema.Attribute.String;
    description: Schema.Attribute.String;
    span: Schema.Attribute.Enumeration<['one', 'two', 'three']>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.user': SharedUser;
      'shared.steps': SharedSteps;
      'shared.social-media-icon-links': SharedSocialMediaIconLinks;
      'shared.seo': SharedSeo;
      'shared.section': SharedSection;
      'shared.perks': SharedPerks;
      'shared.link': SharedLink;
      'shared.launches': SharedLaunches;
      'shared.form': SharedForm;
      'shared.button': SharedButton;
      'items.ray-items': ItemsRayItems;
      'items.left-navbar-items': ItemsLeftNavbarItems;
      'items.input': ItemsInput;
      'items.graph-card-top-items': ItemsGraphCardTopItems;
      'global.navbar': GlobalNavbar;
      'global.footer': GlobalFooter;
      'dynamic-zone.testimonials': DynamicZoneTestimonials;
      'dynamic-zone.related-products': DynamicZoneRelatedProducts;
      'dynamic-zone.related-articles': DynamicZoneRelatedArticles;
      'dynamic-zone.pricing': DynamicZonePricing;
      'dynamic-zone.launches': DynamicZoneLaunches;
      'dynamic-zone.how-it-works': DynamicZoneHowItWorks;
      'dynamic-zone.hero': DynamicZoneHero;
      'dynamic-zone.form-next-to-section': DynamicZoneFormNextToSection;
      'dynamic-zone.features': DynamicZoneFeatures;
      'dynamic-zone.faq': DynamicZoneFaq;
      'dynamic-zone.cta': DynamicZoneCta;
      'dynamic-zone.brands': DynamicZoneBrands;
      'cards.social-media-card': CardsSocialMediaCard;
      'cards.ray-card': CardsRayCard;
      'cards.graph-card': CardsGraphCard;
      'cards.globe-card': CardsGlobeCard;
    }
  }
}
