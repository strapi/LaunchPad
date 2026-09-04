import * as path from 'path';
import { fileURLToPath } from 'url';

/** Repo root, resolved from this file's location rather than cwd. */
export const rootDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);

export const backendDir = path.join(rootDir, 'strapi');
