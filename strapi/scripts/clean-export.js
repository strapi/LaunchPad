const { Pool } = require('pg');

async function cleanExport() {
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

  const pool = new Pool(poolConfig);

  try {
    console.log('Cleaning orphaned links before export...\n');

    // Trouver tous les liens orphelins
    const linkTables = await pool.query(`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
      AND tablename LIKE '%_lnk'
    `);

    for (const row of linkTables.rows) {
      const tableName = row.tablename;

      const columns = await pool.query(`
        SELECT
          kcu.column_name,
          ccu.table_name AS foreign_table_name
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
        WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_name = $1
      `, [tableName]);

      for (const col of columns.rows) {
        const columnName = col.column_name;
        const foreignTable = col.foreign_table_name;

        const deleted = await pool.query(`
          DELETE FROM ${tableName}
          WHERE ${columnName} NOT IN (SELECT id FROM ${foreignTable})
        `);

        if (deleted.rowCount > 0) {
          console.log(`✓ Removed ${deleted.rowCount} orphaned links from ${tableName}.${columnName}`);
        }
      }
    }

    console.log('\n✓ Database cleaned! You can now export with:');
    console.log('  strapi export -f ./data/export_clean.tar.gz\n');

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

cleanExport();
