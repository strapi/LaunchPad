import { revalidatePath } from "next/cache";

/**
 * Make sure to do this securely, as this route can be used to revalidate any path.
 */
export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url") ?? "/";

  revalidatePath(url);

  return new Response(null, { status: 200 });
};
