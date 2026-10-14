import type { Core } from '@strapi/strapi';

const populate = { faqs: true, seo: { populate: { ogImage: true } }, blocks: { on: { 'blocks.hero': { populate: { image: true, cta: true } }, 'blocks.coverage-table': { populate: { rows: true } }, 'blocks.document-list': true, 'blocks.faq-list': true, 'blocks.rich-text': true, 'blocks.stats': { populate: { items: true } }, 'blocks.cta-band': { populate: { cta: true } } } } };

export default (config, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx, next) => {
    ctx.query = { populate, ...ctx.query };
    await next();
  };
};
