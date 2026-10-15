import type { Schema, Struct } from '@strapi/strapi';

export interface BlocksCoverageTable extends Struct.ComponentSchema {
  collectionName: 'components_blocks_coverage_tables';
  info: {
    displayName: 'Coverage table';
    icon: 'grid';
  };
  attributes: {
    rows: Schema.Attribute.Component<'shared.coverage-row', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksCtaBand extends Struct.ComponentSchema {
  collectionName: 'components_blocks_cta_bands';
  info: {
    displayName: 'CTA band';
    icon: 'bell';
  };
  attributes: {
    cta: Schema.Attribute.Component<'shared.cta', false>;
    text: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksDocumentList extends Struct.ComponentSchema {
  collectionName: 'components_blocks_document_lists';
  info: {
    displayName: 'Document list';
    icon: 'file';
  };
  attributes: {
    intro: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksFaqList extends Struct.ComponentSchema {
  collectionName: 'components_blocks_faq_lists';
  info: {
    displayName: 'FAQ list';
    icon: 'question';
  };
  attributes: {
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksHero extends Struct.ComponentSchema {
  collectionName: 'components_blocks_heroes';
  info: {
    displayName: 'Hero';
    icon: 'layout';
  };
  attributes: {
    cta: Schema.Attribute.Component<'shared.cta', false>;
    image: Schema.Attribute.Media<'images'>;
    subtitle: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface BlocksRichText extends Struct.ComponentSchema {
  collectionName: 'components_blocks_rich_texts';
  info: {
    displayName: 'Rich text';
    icon: 'paragraph';
  };
  attributes: {
    body: Schema.Attribute.Blocks & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String;
  };
}

export interface BlocksStats extends Struct.ComponentSchema {
  collectionName: 'components_blocks_stats';
  info: {
    displayName: 'Stats';
    icon: 'chartCircle';
  };
  attributes: {
    items: Schema.Attribute.Component<'shared.stat', true>;
    title: Schema.Attribute.String;
  };
}

export interface BlocksSteps extends Struct.ComponentSchema {
  collectionName: 'components_blocks_steps';
  info: {
    displayName: 'Steps';
    icon: 'bulletList';
  };
  attributes: {
    intro: Schema.Attribute.Text;
    items: Schema.Attribute.Component<'shared.step', true>;
    title: Schema.Attribute.String;
  };
}

export interface SharedCoverageRow extends Struct.ComponentSchema {
  collectionName: 'components_shared_coverage_rows';
  info: {
    displayName: 'Coverage row';
    icon: 'check';
  };
  attributes: {
    included: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    note: Schema.Attribute.String;
  };
}

export interface SharedCta extends Struct.ComponentSchema {
  collectionName: 'components_shared_ctas';
  info: {
    displayName: 'CTA';
    icon: 'cursor';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
    variant: Schema.Attribute.Enumeration<['primary', 'secondary', 'outline']> &
      Schema.Attribute.DefaultTo<'primary'>;
  };
}

export interface SharedLinkGroup extends Struct.ComponentSchema {
  collectionName: 'components_shared_link_groups';
  info: {
    displayName: 'Link group';
    icon: 'bulletList';
  };
  attributes: {
    links: Schema.Attribute.Component<'shared.nav-link', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedNavLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_nav_links';
  info: {
    displayName: 'Nav link';
    icon: 'link';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    displayName: 'SEO';
    icon: 'search';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 70;
      }>;
    ogImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedStat extends Struct.ComponentSchema {
  collectionName: 'components_shared_stats';
  info: {
    displayName: 'Stat';
    icon: 'chartBubble';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedStep extends Struct.ComponentSchema {
  collectionName: 'components_shared_steps';
  info: {
    displayName: 'Step';
    icon: 'check';
  };
  attributes: {
    text: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'blocks.coverage-table': BlocksCoverageTable;
      'blocks.cta-band': BlocksCtaBand;
      'blocks.document-list': BlocksDocumentList;
      'blocks.faq-list': BlocksFaqList;
      'blocks.hero': BlocksHero;
      'blocks.rich-text': BlocksRichText;
      'blocks.stats': BlocksStats;
      'blocks.steps': BlocksSteps;
      'shared.coverage-row': SharedCoverageRow;
      'shared.cta': SharedCta;
      'shared.link-group': SharedLinkGroup;
      'shared.nav-link': SharedNavLink;
      'shared.seo': SharedSeo;
      'shared.stat': SharedStat;
      'shared.step': SharedStep;
    }
  }
}
