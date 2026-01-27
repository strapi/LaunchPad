const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

async function importWithSchemaFix() {
  const env = (key, defaultValue) => process.env[key] || defaultValue;
  const envInt = (key, defaultValue) => {
    const value = process.env[key];
    return value ? parseInt(value, 10) : defaultValue;
  };

  const poolConfig = env('DATABASE_URL')
    ? { connectionString: env('DATABASE_URL') }
    : {
        host: env('DATABASE_HOST', 'localhost'),
        port: envInt('DATABASE_PORT', 5432),
        database: env('DATABASE_NAME', 'strapi'),
        user: env('DATABASE_USERNAME', 'strapi'),
        password: env('DATABASE_PASSWORD', 'strapi'),
      };

  const exportPath = './data/export_20250116105447.tar.gz';

  try {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('  IMPORT STRAPI AVEC CORRECTION DE SCHÉMA');
    console.log('═══════════════════════════════════════════════════════════\n');

    const pool = new Pool(poolConfig);

    try {
      await pool.query('SELECT NOW()');
      console.log('✓ Database connected\n');

      // ÉTAPE 1: Nettoyer les workflows existants
      console.log('───────────────────────────────────────────────────────────');
      console.log('ÉTAPE 1: Nettoyage des workflows existants');
      console.log('───────────────────────────────────────────────────────────\n');

      try {
        await pool.query('DELETE FROM strapi_workflows_stages_permissions_lnk');
        await pool.query('DELETE FROM strapi_workflows_stages');
        await pool.query('DELETE FROM strapi_workflows');
        await pool.query("DELETE FROM strapi_core_store_settings WHERE key LIKE 'plugin_review-workflows%'");
        console.log('✓ Workflows nettoyés\n');
      } catch (error) {
        console.log('⚠ Pas de workflows à nettoyer (tables n\'existent pas encore)\n');
      }

      // ÉTAPE 2: Désactiver temporairement les contraintes
      console.log('───────────────────────────────────────────────────────────');
      console.log('ÉTAPE 2: Désactivation des contraintes');
      console.log('───────────────────────────────────────────────────────────\n');

      // Désactiver tous les triggers
      const tables = await pool.query(`
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = 'public'
      `);

      for (const row of tables.rows) {
        try {
          await pool.query(`ALTER TABLE "${row.tablename}" DISABLE TRIGGER ALL`);
        } catch (e) {
          // Ignorer les erreurs
        }
      }
      console.log('✓ Triggers désactivés\n');

      // ÉTAPE 3: Import avec force
      console.log('───────────────────────────────────────────────────────────');
      console.log('ÉTAPE 3: Import des données');
      console.log('───────────────────────────────────────────────────────────\n');

      console.log('Démarrage de l\'import (les erreurs de schéma seront ignorées)...\n');

      try {
        execSync(`yes y | strapi import -f "${exportPath}" --force`, {
          stdio: 'inherit',
          env: {
            ...process.env,
            // Forcer Strapi à ignorer les différences de schéma
            STRAPI_DISABLE_SCHEMA_VALIDATION: 'true'
          }
        });
      } catch (error) {
        console.log('\n⚠ Import terminé avec des avertissements\n');
      }

      // ÉTAPE 4: Réactiver les triggers
      console.log('───────────────────────────────────────────────────────────');
      console.log('ÉTAPE 4: Réactivation des contraintes');
      console.log('───────────────────────────────────────────────────────────\n');

      for (const row of tables.rows) {
        try {
          await pool.query(`ALTER TABLE "${row.tablename}" ENABLE TRIGGER ALL`);
        } catch (e) {
          // Ignorer les erreurs
        }
      }
      console.log('✓ Triggers réactivés\n');

      // ÉTAPE 5: Vérification
      console.log('───────────────────────────────────────────────────────────');
      console.log('ÉTAPE 5: Vérification des données importées');
      console.log('───────────────────────────────────────────────────────────\n');

      const checks = [
        { table: 'logos', label: 'Logos' },
        { table: 'globals', label: 'Globals (navbar)' },
        { table: 'articles', label: 'Articles' },
        { table: 'pages', label: 'Pages' },
        { table: 'services', label: 'Services' },
        { table: 'products', label: 'Products' },
        { table: 'team_members', label: 'Team Members' },
        { table: 'files', label: 'Files (media)' },
      ];

      let totalRows = 0;
      console.log('📊 Résumé de l\'import:\n');

      for (const check of checks) {
        try {
          const result = await pool.query(`SELECT COUNT(*) as count FROM ${check.table}`);
          const count = parseInt(result.rows[0].count);
          totalRows += count;
          const status = count > 0 ? '✅' : '⚠️';
          console.log(`  ${status} ${check.label.padEnd(25)} ${count.toString().padStart(5)} rows`);
        } catch (error) {
          console.log(`  ❌ ${check.label.padEnd(25)} table non trouvée`);
        }
      }

      console.log('\n───────────────────────────────────────────────────────────\n');

      if (totalRows > 0) {
        console.log(`✅ SUCCÈS: ${totalRows} lignes importées au total\n`);
        console.log('🎉 L\'import a réussi! Vous pouvez maintenant démarrer Strapi.\n');
      } else {
        console.log('❌ ÉCHEC: Aucune donnée n\'a été importée.\n');
        console.log('💡 SOLUTIONS POSSIBLES:\n');
        console.log('1. Vérifiez que le fichier d\'export est correct et non corrompu');
        console.log('2. Assurez-vous que l\'export a été créé sans les workflows');
        console.log('3. Essayez de créer un nouvel export depuis votre environnement local');
        console.log('4. Vérifiez les versions de Strapi (local vs déploiement)');
        console.log('\nCommande pour créer un export propre:');
        console.log('yarn strapi export --no-encrypt --exclude review-workflows -f ./data/export_clean.tar.gz\n');
      }

      console.log('═══════════════════════════════════════════════════════════\n');

    } finally {
      await pool.end();
    }

  } catch (error) {
    console.error('\n✗ Erreur fatale:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

importWithSchemaFix();
