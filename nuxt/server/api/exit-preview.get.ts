/** Clears draft mode and returns to the page the request came from. */
export default defineEventHandler((event) => {
  disableDraftMode(event);
  const target = getQuery(event).url;
  return sendRedirect(
    event,
    typeof target === 'string' && target.startsWith('/') ? target : '/',
    307
  );
});
