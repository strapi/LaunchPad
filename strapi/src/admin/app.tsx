import type { StrapiApp } from "@strapi/strapi/admin";

import PreviewButton from "./extensions/components/PreviewButton";
import { unstable_useContentManagerContext as useContentManagerContext } from "@strapi/strapi/admin";

export default {
  config: {
    locales: [
      // 'ar',
      // 'fr',
      // 'cs',
      // 'de',
      // 'dk',
      // 'es',
      // 'he',
      // 'id',
      // 'it',
      // 'ja',
      // 'ko',
      // 'ms',
      // 'nl',
      // 'no',
      // 'pl',
      // 'pt-BR',
      // 'pt',
      // 'ru',
      // 'sk',
      // 'sv',
      // 'th',
      // 'tr',
      // 'uk',
      // 'vi',
      // 'zh-Hans',
      // 'zh',
    ],
  },

  bootstrap(app: StrapiApp) {
    // @ts-ignore
    app.getPlugin("content-manager").apis.addEditViewSidePanel([
      () => {
        const cmCtx = useContentManagerContext();

        const modelsWithoutPreview = [
          "api::category.category",
          "api::logo.logo",
          "api::faq.faq",
          "api::plan.plan",
          "api::redirection.redirection",
          "api::testimonial.testimonial",
        ];

        if (modelsWithoutPreview.includes(cmCtx.model)) {
          return null;
        }

        return {
          title: "Cache",
          content: <PreviewButton />,
        };
      },
    ]);
  },
};
