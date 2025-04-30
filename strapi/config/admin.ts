export default ({ env }) => ({
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
      allowedOrigins: [env("CLIENT_URL")],
      async handler(uid, { documentId, locale, status }) {
        const document = await strapi.documents(uid).findOne({
          documentId,
          populate: null,
          fields: ["slug"],
        });
        const { slug } = document;

        const urlSearchParams = new URLSearchParams({
          secret: env("PREVIEW_SECRET"),
          ...(slug && { slug }),
          locale,
          uid,
          status,
        });

        const previewURL = `${env("CLIENT_URL")}/api/preview?${urlSearchParams}`;

        return previewURL;
      },
    },
  },
});
