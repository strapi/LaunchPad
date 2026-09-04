import type { SessionUser } from '#shared/types/strapi';

/**
 * Who is signed in.
 *
 * This is the piece that makes auth work on a prerendered site. Identity
 * cannot be baked into HTML that is built once and served to everyone, so the
 * pages ship anonymous and this asks `/api/auth/me` after hydration.
 *
 * `pending` starts true and the navbar hides both states while it holds. The
 * alternative — rendering the signed-out links immediately — flashes "Sign up"
 * at someone who is already signed in, which reads as having been logged out.
 * A brief gap in the navbar is the lesser of the two.
 *
 * State goes through `useState` so the desktop and mobile navbars share one
 * answer, and `inflight` makes sure they share one request too.
 */

let inflight: Promise<void> | null = null;

export function useAuth() {
  const user = useState<SessionUser | null>('auth:user', () => null);
  const pending = useState<boolean>('auth:pending', () => true);

  async function refresh(): Promise<void> {
    // Both navbars mount at once; without this they would each fire a request.
    if (inflight) return inflight;

    inflight = (async () => {
      try {
        const data = await $fetch<{ user: SessionUser | null }>(
          '/api/auth/me',
          { credentials: 'same-origin' }
        );
        user.value = data.user;
      } catch {
        // Offline, or the endpoint is unreachable. Showing the signed-out
        // state is the safe default — worst case someone signed in sees a
        // sign-in link, rather than the page implying a session that is not
        // there.
        user.value = null;
      } finally {
        pending.value = false;
        inflight = null;
      }
    })();

    return inflight;
  }

  async function logout(): Promise<void> {
    try {
      await $fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'same-origin',
      });
    } finally {
      user.value = null;
    }
  }

  return { user, pending, refresh, logout };
}
