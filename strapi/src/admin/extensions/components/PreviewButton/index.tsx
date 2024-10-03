import React, { useEffect } from "react";
import { Button, Flex, IconButton } from "@strapi/design-system";
import { Eye, ArrowsCounterClockwise, Link } from "@strapi/icons";
import {
  unstable_useContentManagerContext as useContentManagerContext,
  useNotification,
} from "@strapi/strapi/admin";
import { useIntl } from "react-intl";

const clientUrl = process.env.STRAPI_ADMIN_CLIENT_URL;
const previewSecret = process.env.STRAPI_ADMIN_CLIENT_PREVIEW_SECRET;

type CMCtx = ReturnType<typeof useContentManagerContext>;

const getPreviewPathname = (cmCtx: CMCtx): string => {
  switch (cmCtx.model) {
    case "api::page.page":
      const slug = cmCtx.form.values.slug;

      switch (slug) {
        case "homepage":
          return "/en";
        case "pricing":
          return "/pricing";
        case "contact":
          return "/contact";
        case "faq":
          return "/faq";
      }
    case "api::product.product": {
      const slug = cmCtx.form.values.slug;

      if (!slug) {
        return "/products";
      }

      return `/products/${slug}`;
    }
    case "api::article.article": {
      const slug = cmCtx.form.values.slug;

      if (!slug) {
        return "/blog";
      }

      return `/blog/${slug}`;
    }
  }

  return "/";
};

const buildPreviewUrl = (cmCtx: CMCtx): string => {
  const urlSearchParams = new URLSearchParams({
    url: getPreviewPathname(cmCtx),
    secret: previewSecret!,
  });

  return `${clientUrl}/api/preview?${urlSearchParams}`;
};

const PreviewButton = () => {
  const { formatMessage } = useIntl();
  const cmCtx = useContentManagerContext();
  const { toggleNotification } = useNotification();

  const onKeyDown = (event: KeyboardEvent) => {
    if (
      (event.ctrlKey && event.key === "s") ||
      (event.metaKey && event.key === "s")
    ) {
      event.preventDefault();

      const saveButton = Array.from(document.querySelectorAll("button")).find(
        (button) => button.textContent === "Save"
      );

      if (saveButton) {
        saveButton.click();
      }
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  });

  if (!previewSecret || !clientUrl) {
    return null;
  }

  const handlePreview = () => {
    const previewUrl = buildPreviewUrl(cmCtx);

    window.open(previewUrl, "_blank")?.focus();
  };

  const handleRevalidate = async () => {
    const urlSearchParams = new URLSearchParams({
      url: getPreviewPathname(cmCtx),
    });

    try {
      await fetch(`${clientUrl}/api/revalidate?${urlSearchParams}`, {
        mode: "no-cors",
      });
    } catch (error) {
      console.log(error);
    }

    toggleNotification({
      message: formatMessage({
        id: "components.Revalidate.notification",
        defaultMessage: "Revalidation done",
      }),
    });
  };

  const content = {
    id: "components.PreviewButton.button",
    defaultMessage: "Open Preview",
  };

  return (
    <>
      {/* <Flex gap={2} width="100%">
        <Button variant="tertiary" fullWidth onClick={handlePreview}>
          {formatMessage(content)}
        </Button>
        <IconButton
          variant="tertiary"
          label="Open preview"
          onClick={() => {
            navigator.clipboard.writeText(buildPreviewUrl(cmCtx));
          }}
          aria-label={formatMessage(content)}
        >
          <Link />
        </IconButton>
      </Flex> */}
      <Button
        variant="tertiary"
        fullWidth
        startIcon={<ArrowsCounterClockwise />}
        onClick={handleRevalidate}
      >
        {formatMessage({
          id: "components.Revalidate.button",
          defaultMessage: "Revalidate",
        })}
      </Button>
    </>
  );
};

export default PreviewButton;
