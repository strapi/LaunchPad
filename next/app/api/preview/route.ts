import { draftMode } from 'next/headers';
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

  const draft = await draftMode();

  if (status === 'published') {
    // Make sure draft mode is disabled so we only query published content
    draft.disable();
  } else {
    // Enable draft mode so we can query draft content
    draft.enable();
  }

  redirect(url);
};
