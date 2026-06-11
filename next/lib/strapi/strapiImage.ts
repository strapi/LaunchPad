import { unstable_noStore as noStore } from 'next/cache';
import { API_URL, stripStegaMarkers } from '../utils';

export function strapiImage(url: string): string {
  noStore();

  const cleanUrl = stripStegaMarkers(url);

  if (cleanUrl.startsWith('/')) {
    return API_URL + cleanUrl;
  }

  return cleanUrl;
}
