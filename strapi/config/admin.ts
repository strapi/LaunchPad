const getPreviewPathname = (uid, { locale, document }): string | null => {
  const { slug } = document;

  switch (uid) {
    case 'api::page.page':
      return slug === 'home' ? '/' : `/${slug}`;
    case 'api::product.product':
      return `/products/${slug}`;
    case 'api::news-item.news-item':
      return `/news/${slug}`;
    case 'api::press-release.press-release':
      return `/press/${slug}`;
    case 'api::global.global':
    case 'api::header.header':
    case 'api::footer.footer':
    case 'api::promo-banner.promo-banner':
      return '/';
    default:
      return null;
  }
};

export default ({ env }) => {
  const clientUrl = env('CLIENT_URL', 'http://localhost:3000');

  // Every LaunchPad frontend on its dev port, so preview works whichever one
  // is running. CLIENT_URL still selects which one the admin's Preview button
  // opens, because Strapi's preview handler must return a single URL.
  const allowedOrigins = Array.from(new Set([clientUrl, 'http://localhost:3000']));
  const previewSecret = env('PREVIEW_SECRET');

  return {
    auth: {
      secret: env('ADMIN_JWT_SECRET'),
    },
    apiToken: {
      salt: env('API_TOKEN_SALT'),
    },
    transfer: {
      token: {
        salt: env('TRANSFER_TOKEN_SALT'),
      },
    },
    flags: {
      nps: env.bool('FLAG_NPS', true),
      promoteEE: env.bool('FLAG_PROMOTE_EE', true),
    },
    preview: {
      enabled: true,
      config: {
        allowedOrigins,
        async handler(uid, { documentId, locale, status }) {
          const document = await strapi
            .documents(uid)
            .findOne({ documentId, locale, status });
          const pathname = getPreviewPathname(uid, { locale, document });

          // Disable preview if the pathname is not found
          if (!pathname) {
            return null;
          }

          // Use Next.js draft mode
          const urlSearchParams = new URLSearchParams({
            url: `/${locale ?? 'en'}${pathname}`,
            secret: previewSecret,
            status,
          });

          return `${clientUrl}/api/preview?${urlSearchParams}`;
        },
      },
    },
  };
};
