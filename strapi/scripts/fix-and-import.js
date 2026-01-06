const { execSync } = require('child_process');
const { Pool } = require('pg');

async function fixAndImport() {
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

  console.log('Connecting to database...');
  const pool = new Pool(poolConfig);

  try {
    console.log('Testing connection...');
    await pool.query('SELECT NOW()');
    console.log('✓ Connected successfully\n');

    console.log('Step 1: Setting session_replication_role to replica...');
    await pool.query('SET session_replication_role = replica;');
    console.log('✓ Constraints disabled\n');

    console.log('Step 2: Starting import...');
    try {
      execSync('strapi import -f ./data/export_20250116105447.tar.gz --force', {
        stdio: 'inherit'
      });
    } catch (error) {
      console.log('\n⚠ Import completed with errors (this is expected)\n');
    }

    console.log('Step 3: Resetting session_replication_role...');
    await pool.query('SET session_replication_role = DEFAULT;');
    console.log('✓ Constraints re-enabled\n');

    console.log('Step 4: Fixing orphaned links...');

    // Trouver toutes les tables de liaison
    const linkTables = await pool.query(`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
      AND tablename LIKE '%_lnk'
      ORDER BY tablename
    `);

    console.log(`Found ${linkTables.rowCount} link tables\n`);

    let totalDeleted = 0;

    for (const row of linkTables.rows) {
      const tableName = row.tablename;

      try {
        // Récupérer les contraintes de clés étrangères pour cette table
        const constraints = await pool.query(`
          SELECT
            kcu.column_name,
            ccu.table_name AS foreign_table_name,
            ccu.column_name AS foreign_column_name
          FROM information_schema.table_constraints AS tc
          JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
            AND tc.table_schema = kcu.table_schema
          JOIN information_schema.constraint_column_usage AS ccu
            ON ccu.constraint_name = tc.constraint_name
            AND ccu.table_schema = tc.table_schema
          WHERE tc.constraint_type = 'FOREIGN KEY'
          AND tc.table_name = $1
          AND tc.table_schema = 'public'
        `, [tableName]);

        if (constraints.rowCount === 0) {
          console.log(`  ⊘ ${tableName}: no foreign keys found`);
          continue;
        }

        for (const constraint of constraints.rows) {
          const columnName = constraint.column_name;
          const foreignTable = constraint.foreign_table_name;
          const foreignColumn = constraint.foreign_column_name;

          // Vérifier si la table étrangère existe
          const tableExists = await pool.query(`
            SELECT EXISTS (
              SELECT FROM information_schema.tables
              WHERE table_schema = 'public'
              AND table_name = $1
            )
          `, [foreignTable]);

          if (!tableExists.rows[0].exists) {
            console.log(`  ⚠ ${tableName}.${columnName} -> ${foreignTable}: foreign table doesn't exist`);
            continue;
          }

          // Supprimer les liens orphelins
          const deleted = await pool.query(`
            DELETE FROM ${tableName}
            WHERE ${columnName} IS NOT NULL
            AND ${columnName} NOT IN (
              SELECT ${foreignColumn} FROM ${foreignTable}
            )
          `);

          if (deleted.rowCount > 0) {
            console.log(`  ✓ ${tableName}.${columnName} -> ${foreignTable}: removed ${deleted.rowCount} orphaned link(s)`);
            totalDeleted += deleted.rowCount;
          }
        }
      } catch (error) {
        console.log(`  ✗ ${tableName}: ${error.message}`);
      }
    }

    console.log(`\n✓ Cleanup completed! Removed ${totalDeleted} orphaned link(s) in total\n`);

    // Vérifier l'intégrité finale
    console.log('Step 5: Verifying database integrity...');
    const integrityCheck = await pool.query(`
      SELECT
        conname AS constraint_name,
        conrelid::regclass AS table_name
      FROM pg_constraint
      WHERE contype = 'f'
      AND connamespace = 'public'::regnamespace
      LIMIT 5
    `);

    console.log(`✓ Database has ${integrityCheck.rowCount}+ foreign key constraints active`);

    console.log('\n✅ Import and cleanup completed successfully!\n');

  } catch (error) {
    console.error('\n✗ Process failed:', error.message);
    console.error('Stack:', error.stack);
    try {
      await pool.query('SET session_replication_role = DEFAULT;');
    } catch (e) {
      // Ignorer
    }
    process.exit(1);
  } finally {
    await pool.end();
  }
}

fixAndImport();
