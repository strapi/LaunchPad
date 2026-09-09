/**
 * Preview / draft-mode entry point.
 *
 * GET /api/preview?secret=<PREVIEW_SECRET>&url=<target>&status=<draft|published>
 *
 * Matches the contract Strapi's admin builds in `config/admin.ts`, so the same
 * preview URL template works across every LaunchPad frontend.
 *
 * `status=published` disables draft mode instead of enabling it — that is how
 * the admin's "view the published version" toggle comes back.
 */
export default defineEventHandler((event) => {
  const query = getQuery(event);
  const secret = typeof query.secret === 'string' ? query.secret : null;
  const target = typeof query.url === 'string' ? query.url : '/';
  const status = typeof query.status === 'string' ? query.status : null;

  const expected = useRuntimeConfig().previewSecret;

  if (!expected) {
    throw createError({
      statusCode: 500,
      statusMessage: 'PREVIEW_SECRET is not configured on the server.',
    });
  }

  if (secret !== expected) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' });
  }

  if (status === 'published') {
    disableDraftMode(event);
  } else {
    enableDraftMode(event);
  }

  // Only same-origin paths — an open redirect here would be handed out by
  // Strapi's admin to anyone who can read the preview URL. `//evil.com` is a
  // protocol-relative URL, so a leading slash alone is not enough.
  const safeTarget =
    target.startsWith('/') && !target.startsWith('//') ? target : '/';

  // Leaving draft mode goes back to the real, prerendered page.
  if (status === 'published') {
    return sendRedirect(event, safeTarget, 307);
  }

  // Entering draft mode goes to the on-demand renderer instead. The public
  // routes are prerendered from published content, so a draft-only entry has
  // no page there — which is exactly what an editor is trying to preview.
  return sendRedirect(
    event,
    `/preview${safeTarget === '/' ? '' : safeTarget}`,
    307
  );
});
