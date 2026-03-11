import { unstable_noStore as noStore } from 'next/cache';
import { API_URL } from '../utils';

export function strapiImage(url: string): string {
  noStore();

  if (url.startsWith('/')) {
    return API_URL + url;
  }

  return url;
}
