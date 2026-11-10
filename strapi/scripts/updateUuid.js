import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { v4 as uuidv4 } from 'uuid';

// This script will update the UUID of the demo project in order to get some random analytics on
// this demo usage.

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageJsonPath = path.join(__dirname, '../package.json');

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

if (packageJson.strapi && packageJson.strapi.uuid === 'LAUNCHPAD') {
  const environment = process.env.NODE_ENV || 'development';

  if (environment === 'development') {
    packageJson.strapi.uuid = `LAUNCHPAD-LOCAL-${uuidv4()}`;
  } else if (environment === 'production') {
    packageJson.strapi.uuid = `LAUNCHPAD-HOSTED-${uuidv4()}`;
  } else {
  }

  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2),
    'utf-8'
  );
} else {
}
