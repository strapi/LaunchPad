import { unstable_noStore as noStore } from 'next/cache';

export function strapiImage(url: string): string {
  noStore();
  if (url.startsWith("/")) {

    if (!process.env.NEXT_PUBLIC_API_URL && document.location) {
      return `https://${document.location.host.replace("client-", "api-")}${url}`
    }

    return process.env.NEXT_PUBLIC_API_URL + url
  }
  return url
}