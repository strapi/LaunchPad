"use client";

import { useEffect } from "react";
import { useSlugContext } from "@/app/context/SlugContext";

export default function ClientSlugHandler({
  localizedSlugs,
}: {
  localizedSlugs: Record<string, string>;
}) {
  const { dispatch } = useSlugContext();

  useEffect(() => {
    if (localizedSlugs) {
      dispatch({ type: "SET_SLUGS", payload: localizedSlugs });
    }
  }, [localizedSlugs, dispatch]);

  return null; // This component only handles the state and doesn't render anything.
}
