import type { APIRoute } from 'astro';

import { disableDraftMode } from '@/lib/draft';

/** Clears draft mode and returns to the page the request came from. */
export const prerender = false;

export const GET: APIRoute = ({ cookies, url, redirect }) => {
  disableDraftMode(cookies);
  const target = url.searchParams.get('url');
  return redirect(target?.startsWith('/') ? target : '/', 307);
};
