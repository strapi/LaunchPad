"use client";

import { useEffect } from "react";
import { useSlugContext } from "@/app/context/SlugContext";
import { useRouter } from "next/navigation";

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

  const router = useRouter();

  useEffect(() => {
    const handleMessage = async (message: MessageEvent<any>) => {
      if (
        message.origin === process.env.NEXT_PUBLIC_API_URL &&
        message.data.type === "strapiUpdate"
      ) {
        router.refresh();
      }
    };

    // Add the event listener
    window.addEventListener("message", handleMessage);

    // Cleanup the event listener on unmount
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [router]);

  return null; // This component only handles the state and doesn't render anything.
}
