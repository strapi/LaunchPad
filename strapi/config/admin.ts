const getPreviewPathname = (uid, { locale, slug }): string => {
  switch (uid) {
    case "api::page.page":
      switch (slug) {
        case "homepage":
          return `/${locale}`;
        case "pricing":
          return "/pricing";
        case "contact":
          return "/contact";
        case "faq":
          return "/faq";
      }
    case "api::product.product": {
      if (!slug) {
        return "/products";
      }

      return `/products/${slug}`;
    }
    case "api::article.article": {
      if (!slug) {
        return "/blog";
      }

      return `/blog/${slug}`;
    }
  }

  return "/";
};

export default ({ env }) => {
  const clientUrl = env("CLIENT_URL");
  const previewSecret = env("CLIENT_PREVIEW_SECRET");

  return {
    auth: {
      secret: env("ADMIN_JWT_SECRET"),
    },
    apiToken: {
      salt: env("API_TOKEN_SALT"),
    },
    transfer: {
      token: {
        salt: env("TRANSFER_TOKEN_SALT"),
      },
    },
    flags: {
      nps: env.bool("FLAG_NPS", true),
      promoteEE: env.bool("FLAG_PROMOTE_EE", true),
    },
    preview: {
      enabled: true,
      config: {
        async handler(uid, { documentId, locale }) {
          const data = await strapi.documents(uid).findOne({ documentId });

          const urlSearchParams = new URLSearchParams({
            url: getPreviewPathname(uid, {
              locale,
              slug: data.slug,
            }),
            secret: previewSecret,
          });

          return `${clientUrl}/api/preview?${urlSearchParams}`;
        },
      },
    },
  };
};
