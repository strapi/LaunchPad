import { ImageResponse } from "next/og";
import { getTheme } from "@/actions/themes";

// Image metadata
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Dynamic route params
export default async function Image({
  params,
}: {
  params: { themeId: string };
}) {
  const theme = await getTheme(params.themeId);

  // Set default colors if theme doesn't exist
  const primaryColor = theme?.styles?.light?.primary || "#000000";
  const secondaryColor = theme?.styles?.light?.secondary || "#ffffff";
  const accentColor = theme?.styles?.light?.accent || "#0070f3";
  const mutedColor = theme?.styles?.light?.muted || "#f5f5f5";
  const borderColor = theme?.styles?.light?.border || "#e5e5e5";
  const backgroundColor = theme?.styles?.light?.background || "#ffffff";
  const foregroundColor = theme?.styles?.light?.foreground || "#000000";
  const themeName = theme?.name || "Theme";

  return new ImageResponse(
    (
      <div
        style={{
          background: backgroundColor,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          color: foregroundColor,
        }}
      >
        {/* Top section for theme name */}
        <div
          style={{
            height: "40%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              fontSize: 32,
              opacity: 0.8,
              marginBottom: "10px",
            }}
          >
            tweakcn.com
          </div>
          <div
            style={{
              fontSize: 80,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {themeName}
          </div>
        </div>

        {/* Bottom section with horizontal color swatches */}
        <div
          style={{
            height: "60%",
            display: "flex",
            flexDirection: "row",
            width: "100%",
          }}
        >
          {/* Primary */}
          <div
            style={{
              flex: 1,
              background: primaryColor,
              borderTopLeftRadius: "16px",
              borderTopRightRadius: "16px",
            }}
          />

          {/* Secondary */}
          <div
            style={{
              flex: 1,
              background: secondaryColor,
              borderTopLeftRadius: "16px",
              borderTopRightRadius: "16px",
            }}
          />

          {/* Accent */}
          <div
            style={{
              flex: 1,
              background: accentColor,
              borderTopLeftRadius: "16px",
              borderTopRightRadius: "16px",
            }}
          />

          {/* Muted */}
          <div
            style={{
              flex: 1,
              background: mutedColor,
              borderTopLeftRadius: "16px",
              borderTopRightRadius: "16px",
            }}
          />

          {/* Border */}
          <div
            style={{
              flex: 1,
              background: borderColor,
              borderTopLeftRadius: "16px",
              borderTopRightRadius: "16px",
            }}
          />
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
