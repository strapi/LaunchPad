import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/*
 * Why this patch exists
 * ---------------------
 *
 * This Strapi app runs as ESM (`"type": "module"` in `strapi/package.json`)
 * and compiles its server TypeScript with `module: "NodeNext"`. That makes
 * Strapi load its own `.mjs` server build paths at runtime.
 *
 * Strapi 5.47.1 publishes ESM files, but some of those files still import
 * CommonJS-only dependencies as if Node could provide native ESM named exports
 * from them. Two examples seen during the migration:
 *
 * - `@strapi/core/dist/Strapi.mjs` imports named utilities from `lodash/fp`.
 * - `@strapi/core/dist/loaders/apis.mjs` imports `existsSync` from `fs-extra`.
 *
 * Both packages are fundamentally CommonJS in the paths Strapi uses:
 *
 * - `lodash/fp` is a directory/subpath backed by `fp.js`, and Node's ESM
 *   resolver does not support extensionless directory imports unless the
 *   package provides a matching `exports` map.
 * - `lodash` and `fs-extra` expose their runtime API as a CommonJS object.
 *   Node can provide that object as a default import, but it does not synthesize
 *   reliable named exports for these packages in the way Strapi's `.mjs` files
 *   currently expect.
 *
 * Without this patch, Strapi starts failing with errors such as:
 *
 * - `ERR_UNSUPPORTED_DIR_IMPORT: Directory import '.../lodash/fp' is not supported`
 * - `SyntaxError: The requested module 'lodash/fp' does not provide an export named 'get'`
 * - `SyntaxError: The requested module 'fs-extra' does not provide an export named 'existsSync'`
 *
 * What this script does
 * ---------------------
 *
 * During `postinstall`, we generate tiny ESM wrapper files inside the installed
 * dependency folders. Each wrapper default-imports the original CommonJS file,
 * re-exports that default, and then re-exports every valid property name as a
 * named ESM export. We also patch the dependency `package.json` `exports` map so
 * Node resolves Strapi's imports to those wrappers.
 *
 * This is intentionally a local install-time compatibility shim, not a source
 * code abstraction. It should be removed once Strapi publishes ESM-compatible
 * imports for these dependencies or once the project upgrades to a Strapi
 * version where `yarn start` works with this app's `"type": "module"` and
 * `module: "NodeNext"` settings without patching `node_modules`.
 */

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const strapiRoot = path.join(__dirname, '..');
const require = createRequire(import.meta.url);

const isValidIdentifier = (key) => /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key);

const patchPackage = (packageName, entries) => {
  const packageDir = path.join(strapiRoot, 'node_modules', packageName);
  const packageJsonPath = path.join(packageDir, 'package.json');

  if (fs.existsSync(packageJsonPath) === false) {
    return;
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  const exportsMap = {};

  for (const entry of entries) {
    const cjsPath = path.join(packageDir, entry.cjsFile);
    const mjsPath = path.join(packageDir, entry.mjsFile);

    if (fs.existsSync(cjsPath) === false) {
      continue;
    }

    const cjsModule = require(cjsPath);
    const keys = Object.keys(cjsModule);
    const namedExports = keys
      .filter(isValidIdentifier)
      .map((key) => `export const ${key} = cjsModule.${key};`)
      .join('\n');

    const importPath = `./${path
      .relative(path.dirname(mjsPath), cjsPath)
      .replace(/\\/g, '/')}`;

    const wrapper = `import cjsModule from '${importPath}';

export default cjsModule;

${namedExports}
`;

    fs.writeFileSync(mjsPath, wrapper);
    exportsMap[entry.exportSubpath] = `./${entry.mjsFile.replace(/\\/g, '/')}`;
  }

  if (packageName === 'lodash') {
    exportsMap['./*'] = './*.js';
  }

  if (packageName === 'fs-extra') {
    exportsMap['./esm'] = './lib/esm.mjs';
  }

  packageJson.exports = exportsMap;
  fs.writeFileSync(
    packageJsonPath,
    `${JSON.stringify(packageJson, null, 2)}\n`
  );
};

patchPackage('lodash', [
  { cjsFile: 'lodash.js', mjsFile: 'lodash.mjs', exportSubpath: '.' },
  { cjsFile: 'fp.js', mjsFile: 'fp.mjs', exportSubpath: './fp' },
]);

patchPackage('fs-extra', [
  { cjsFile: 'lib/index.js', mjsFile: 'lib/index.mjs', exportSubpath: '.' },
]);
