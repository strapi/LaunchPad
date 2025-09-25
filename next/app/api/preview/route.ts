import { redirect } from 'next/navigation';

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const url = searchParams.get('url') ?? '/';
  const status = searchParams.get('status');

  // Check the secret and next parameters
  // This secret should only be known to this route handler and the CMS
  if (secret !== process.env.PREVIEW_SECRET) {
    return new Response('Invalid token', { status: 401 });
  }

  // Instead of using cookies, pass the status as a query parameter
  const redirectUrl = new URL(url, request.url);

  if (status === 'draft') {
    redirectUrl.searchParams.set('draft', 'true');
  } else {
    // For published content, don't add any parameter (clean URL)
    redirectUrl.searchParams.delete('draft');
  }

  redirect(redirectUrl.toString());
};

