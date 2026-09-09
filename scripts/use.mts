import * as net from 'net';

import { currentPreviewTarget, setPreviewTarget } from './env.mjs';
import { FRONTENDS, frontendUrl, presentFrontends } from './frontends.mjs';

/** True if something is listening on the port, i.e. Strapi is up. */
function portInUse(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = net
      .connect({ port, host: '127.0.0.1' })
      .on('connect', () => {
        socket.destroy();
        resolve(true);
      })
      .on('error', () => resolve(false));
    socket.setTimeout(300, () => {
      socket.destroy();
      resolve(false);
    });
  });
}

const name = process.argv[2]?.trim();

if (!name) {
  const current = currentPreviewTarget();
  const match = FRONTENDS.find((f) => frontendUrl(f) === current);
  console.log(
    `Preview target: ${match ? `${match.name} (${current})` : (current ?? 'not set')}`
  );
  console.log(
    `Available: ${presentFrontends()
      .map((f) => f.name)
      .join(', ')}`
  );
  process.exit(0);
}

const url = setPreviewTarget(name);
console.log(`Switched preview target to ${name} (${url})`);

if (await portInUse(1337)) {
  console.log('!  Strapi is running — restart it for this to take effect.');
}
