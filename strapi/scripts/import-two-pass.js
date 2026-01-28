const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

async function importTwoPass() {
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
    console.log('  TWO-PASS IMPORT STRATEGY');
    console.log('═══════════════════════════════════════════════════════════\n');

    const pool = new Pool(poolConfig);
    
    try {
      await pool.query('SELECT NOW()');
      console.log('✓ Database connected\n');

      // PASS 1 : Import avec contraintes désactivées (ignore les erreurs)
      console.log('───────────────────────────────────────────────────────────');
      console.log('PASS 1: Initial import with constraints disabled');
      console.log('───────────────────────────────────────────────────────────\n');

      await pool.query('SET session_replication_role = replica;');
      console.log('✓ Foreign key constraints disabled\n');

      console.log('Starting import (errors expected and ignored)...\n');
      
      try {
        execSync(`strapi import -f "${exportPath}" --force`, { 
          stdio: 'inherit'
        });
      } catch (error) {
        console.log('\n⚠ Import completed with errors (this is expected)\n');
      }

      await pool.query('SET session_replication_role = DEFAULT;');
      console.log('✓ Constraints re-enabled\n');

      // Vérifier ce qui a été importé
      console.log('───────────────────────────────────────────────────────────');
      console.log('Checking what was imported...');
      console.log('───────────────────────────────────────────────────────────\n');

      const checks = [
        { table: 'logos', label: 'Logos' },
        { table: 'globals', label: 'Globals (navbar)' },
        { table: 'articles', label: 'Articles' },
        { table: 'pages', label: 'Pages' },
      ];

      let hasData = false;

      for (const check of checks) {
        try {
          const result = await pool.query(`SELECT COUNT(*) as count FROM ${check.table}`);
          const count = parseInt(result.rows[0].count);
          console.log(`  ${check.label.padEnd(20)} ${count.toString().padStart(4)} rows`);
          if (count > 0) hasData = true;
        } catch (error) {
          console.log(`  ${check.label.padEnd(20)}  ❌ (table not found)`);
        }
      }

      console.log('');

      if (!hasData) {
        console.log('❌ No data was imported. Transaction was rolled back.\n');
        console.log('This means the error occurred too early in the import process.');
        console.log('Let\'s try a different approach...\n');

        // ALTERNATIVE: Désactiver les triggers complètement
        console.log('───────────────────────────────────────────────────────────');
        console.log('ALTERNATIVE: Disabling ALL triggers');
        console.log('───────────────────────────────────────────────────────────\n');

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

        console.log('✓ All triggers disabled\n');
        console.log('Retrying import...\n');

        try {
          execSync(`strapi import -f "${exportPath}" --force`, { 
            stdio: 'inherit'
          });
        } catch (error) {
          console.log('\n⚠ Import completed with some errors\n');
        }

        // Réactiver les triggers
        for (const row of tables.rows) {
          try {
            await pool.query(`ALTER TABLE "${row.tablename}" ENABLE TRIGGER ALL`);
          } catch (e) {
            // Ignorer les erreurs
          }
        }

        console.log('✓ All triggers re-enabled\n');
      }

      // Vérification finale
      console.log('───────────────────────────────────────────────────────────');
      console.log('Final verification');
      console.log('───────────────────────────────────────────────────────────\n');

      for (const check of checks) {
        try {
          const result = await pool.query(`SELECT COUNT(*) as count FROM ${check.table}`);
          const count = parseInt(result.rows[0].count);
          const status = count > 0 ? '✅' : '❌';
          console.log(`  ${status} ${check.label.padEnd(20)} ${count.toString().padStart(4)} rows`);
        } catch (error) {
          console.log(`  ❌ ${check.label.padEnd(20)}  table not found`);
        }
      }

      console.log('\n═══════════════════════════════════════════════════════════');
      console.log('  IMPORT COMPLETED');
      console.log('═══════════════════════════════════════════════════════════\n');

      console.log('Run "yarn verify" for detailed verification.\n');

    } finally {
      await pool.end();
    }

  } catch (error) {
    console.error('\n✗ Failed:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

importTwoPass();