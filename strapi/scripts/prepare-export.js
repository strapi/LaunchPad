#!/usr/bin/env node
/**
 * Script pour préparer un export Strapi compatible
 *
 * Ce script doit être exécuté sur votre machine LOCALE avant de créer l'export
 *
 * Usage: node prepare-export.js
 */

const fs = require('fs');
const path = require('path');

console.log('═══════════════════════════════════════════════════════════');
console.log('  PRÉPARATION DE L\'EXPORT STRAPI');
console.log('═══════════════════════════════════════════════════════════\n');

// Vérifier si le fichier de configuration existe
const configPath = path.join(process.cwd(), 'config', 'plugins.js');
const adminPath = path.join(process.cwd(), 'config', 'admin.js');

console.log('📋 Vérification de la configuration...\n');

// 1. Désactiver les workflows de révision
console.log('✓ Étape 1: Désactiver les workflows de révision');
console.log('  Ajoutez cette configuration dans config/plugins.js:\n');
console.log(`  module.exports = {
    // ... autres configs
    'review-workflows': {
      enabled: false,
    },
  };\n`);

// 2. Nettoyer la base de données des workflows
console.log('✓ Étape 2: Nettoyer les workflows de la base de données');
console.log('  Exécutez ces requêtes SQL dans votre base locale:\n');
console.log(`  -- Supprimer les données des workflows
  DELETE FROM strapi_workflows;
  DELETE FROM strapi_workflows_stages;
  DELETE FROM strapi_workflows_stages_permissions_lnk;
  DELETE FROM strapi_core_store_settings
  WHERE key LIKE 'plugin_review-workflows%';\n`);

// 3. Instructions pour l'export
console.log('✓ Étape 3: Créer l\'export sans chiffrement');
console.log('  Commande à exécuter:\n');
console.log('  yarn strapi export --no-encrypt --exclude admin-users --exclude admin-roles --exclude admin-permissions -f ./data/export_clean.tar.gz\n');

// 4. Vérifier les permissions
console.log('✓ Étape 4: Vérifier que le fichier est créé avec succès\n');

console.log('═══════════════════════════════════════════════════════════');
console.log('  ÉTAPES À SUIVRE');
console.log('═══════════════════════════════════════════════════════════\n');
console.log('1. Désactivez les review-workflows dans config/plugins.js');
console.log('2. Redémarrez Strapi localement (yarn develop)');
console.log('3. Nettoyez les workflows avec les requêtes SQL ci-dessus');
console.log('4. Créez l\'export avec la commande fournie');
console.log('5. Copiez le fichier export_clean.tar.gz vers votre serveur\n');

console.log('═══════════════════════════════════════════════════════════\n');
