export function strapiImage(url: string): string {
  if (url.startsWith("/")) {
    return process.env.NEXT_PUBLIC_API_URL + url
  }
  return url
}