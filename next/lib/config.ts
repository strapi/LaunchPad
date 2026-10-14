export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';

export function mediaUrl(media?: { url?: string } | null): string | null {
  if (!media?.url) return null;
  return media.url.startsWith('http') ? media.url : `${API_URL}${media.url}`;
}
