import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const strapiRoot = path.join(__dirname, '..');

const dirnamePolyfill = `import { fileURLToPath as __strapiFileURLToPath } from 'node:url';
import { dirname as __strapiDirname } from 'node:path';
const __dirname = __strapiDirname(__strapiFileURLToPath(import.meta.url));
`;

const filesToPatch = [
  'node_modules/@strapi/core/dist/ee/license.mjs',
  'node_modules/@strapi/generators/dist/index.mjs',
  'node_modules/@strapi/admin/dist/server/server/src/routes/serve-admin-panel.mjs',
  'node_modules/@strapi/plugin-users-permissions/dist/server/register.mjs',
];

for (const relativePath of filesToPatch) {
  const filePath = path.join(strapiRoot, relativePath);

  if (fs.existsSync(filePath) === false) {
    continue;
  }

  const source = fs.readFileSync(filePath, 'utf-8');

  if (source.includes('__strapiFileURLToPath') === true) {
    continue;
  }

  if (source.includes('__dirname') === false) {
    continue;
  }

  const lastImportIndex = source.lastIndexOf('import ');
  const nextLineIndex = source.indexOf('\n', lastImportIndex);

  if (lastImportIndex === -1 || nextLineIndex === -1) {
    continue;
  }

  const patched = `${source.slice(0, nextLineIndex + 1)}${dirnamePolyfill}${source.slice(nextLineIndex + 1)}`;
  fs.writeFileSync(filePath, patched);
}
