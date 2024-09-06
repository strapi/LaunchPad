/**
 * `dynamic-zone-population` middleware
 */

import type { Core } from '@strapi/strapi';
import getDynamicZoneComponents from '../scripts/populate';

import fs from 'fs';
import path from 'path';


interface Attribute {
  type: string;
}

const extractPathSegment = url => url.match(/\/([^/?]+)(?:\?|$)/)?.[1] || '';

async function checkDynamicZone(contentTypePlural) {
  try {
    let hasDynamicZone = false;
    const apiDir = path.join(__dirname, '../api');

    // Récupération de tous les dossiers dans le répertoire api
    const contentTypeFolders = fs.readdirSync(apiDir);

    let found = false;

    // Parcours de tous les dossiers pour trouver le schema.json correspondant
    for (const folder of contentTypeFolders) {
      const schemaPath = path.join(apiDir, folder, 'content-types', folder, 'schema.json');

      // Vérifie si le fichier schema.json existe dans le dossier
      if (fs.existsSync(schemaPath)) {
        const schemaData = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));

        // Vérification si le pluralName correspond à contentTypePlural
        if (schemaData.info && schemaData.info.pluralName === contentTypePlural) {
          found = true;

          // Vérifie si un attribut de type dynamiczone existe
          const attributes: Record<string, Attribute> = schemaData.attributes;
          hasDynamicZone = Object.values(attributes).some(attr => attr.type === 'dynamiczone');
          break;
        }
      }
    }

    return hasDynamicZone

  } catch (error) {
    console.error(`Erreur: ${error.message}`);
  }
}

export default (config, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx, next) => {
    if (ctx.request.url.startsWith('/api/') && ctx.request.method === 'GET') {

      const contentType = extractPathSegment(ctx.request.url);
      const hasDynamicZone = await checkDynamicZone(contentType);

      if (hasDynamicZone) {
        strapi.log.info('Using custom Dynamic-Zone population Middleware...');
        ctx.query.populate = {
          dynamic_zone: {
            on: getDynamicZoneComponents(),
          },
        };
      }

    }
    await next();
  };
};
