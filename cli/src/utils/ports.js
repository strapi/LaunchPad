import { execa } from 'execa';
import net from 'node:net';

/**
 * Whether a port is free.
 *
 * This connects rather than binds. Binding looks obvious but is unreliable
 * here: servers pick different addresses (Strapi takes IPv4 `0.0.0.0`, Astro
 * takes IPv6 `[::1]`), and on BSD a wildcard bind happily coexists with a
 * loopback one — so a bind probe reported a busy port as free. If something
 * accepts a connection, the port is taken, whatever it bound to.
 */
function canConnect(port, host, timeout = 400) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    const done = (result) => {
      socket.destroy();
      resolve(result);
    };
    socket.setTimeout(timeout);
    socket.once('connect', () => done(true));
    socket.once('timeout', () => done(false));
    socket.once('error', () => done(false));
    socket.connect(port, host);
  });
}

export async function isPortAvailable(port) {
  const reachable = await Promise.all([
    canConnect(port, '127.0.0.1'),
    canConnect(port, '::1'),
  ]);
  return !reachable.some(Boolean);
}

/**
 * The working directory of whatever is listening on a port, if it can be
 * determined.
 *
 * Knowing a port is busy is much less useful than knowing which project owns
 * it. Two LaunchPad checkouts each have their own PREVIEW_SECRET, so a
 * frontend left running from a different one answers the admin's preview
 * request and fails it with "Invalid token" — a confusing way to discover a
 * port conflict.
 *
 * Best effort: lsof is not available everywhere, and the answer is only a
 * hint, so any failure returns null rather than interrupting the run.
 */
export async function portOwner(port) {
  try {
    // -sTCP:LISTEN matters: without it lsof also returns clients *connected*
    // to the port, and a browser tab's connection would be reported as the
    // owner.
    const { stdout: pids } = await execa('lsof', [
      '-nP',
      '-tiTCP:' + port,
      '-sTCP:LISTEN',
    ]);
    const pid = pids.split('\n')[0]?.trim();
    if (!pid) return null;

    const { stdout } = await execa('lsof', [
      '-a',
      '-p',
      pid,
      '-d',
      'cwd',
      '-Fn',
    ]);
    const cwd = stdout
      .split('\n')
      .find((line) => line.startsWith('n'))
      ?.slice(1);
    return cwd ?? null;
  } catch {
    return null;
  }
}
