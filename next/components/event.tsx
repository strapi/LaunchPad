"use client";
import { useListener } from "@/lib/strapi/nextjs/client";

export function EventHandler() {
  useListener();

  return <div />;
}
