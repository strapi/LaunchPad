import posthog from "posthog-js";

export function initPostHog() {
  if (process.env.NODE_ENV === "development") return;
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (posthogKey) {
    posthog.init(posthogKey, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    });
  } else {
    console.warn("PostHog key is missing, skipping initialization.");
  }
}
