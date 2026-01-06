const { Pool } = require('pg');

async function verifyImport() {
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
    console.log('🔍 Verifying import results...\n');

    // Vérifier les principales tables
    const tables = [
      'articles',
      'avis_clients',
      'categories',
      'logos',
      'pages',
      'products',
      'services',
      'team_members',
      'technologies',
      'files', // Images
      'globals',
    ];

    console.log('📊 Content Statistics:');
    console.log('─'.repeat(60));

    for (const table of tables) {
      try {
        const result = await pool.query(`SELECT COUNT(*) as count FROM ${table}`);
        const count = result.rows[0].count;
        console.log(`  ${table.padEnd(30)} ${count.toString().padStart(5)} rows`);
      } catch (error) {
        console.log(`  ${table.padEnd(30)}    ❌ (table not found)`);
      }
    }

    console.log('─'.repeat(60));

    // Vérifier le problème spécifique du logo
    console.log('\n🔎 Checking logo issue:');
    console.log('─'.repeat(60));

    const logos = await pool.query('SELECT id, title FROM logos ORDER BY id');
    console.log(`  Total logos in database: ${logos.rowCount}`);

    if (logos.rowCount > 0) {
      console.log('  Logo IDs:', logos.rows.map(r => r.id).join(', '));
      const hasLogo8 = logos.rows.some(r => r.id === 8);
      console.log(`  Logo ID 8 exists: ${hasLogo8 ? '✅' : '❌'}`);
    }

    // Vérifier les navbars
    const navbars = await pool.query('SELECT id FROM globals WHERE 1=1 LIMIT 5');
    console.log(`  Total globals (navbar): ${navbars.rowCount}`);

    // Vérifier la table de liaison problématique
    const navbarLogoLinks = await pool.query(
      'SELECT * FROM components_global_navbars_logo_lnk'
    );
    console.log(`  Navbar-Logo links: ${navbarLogoLinks.rowCount}`);

    if (navbarLogoLinks.rowCount > 0) {
      console.log('  Links:', navbarLogoLinks.rows);
    }

    console.log('─'.repeat(60));

    // Vérifier les core-store (configuration)
    console.log('\n⚙️  Checking core-store configuration:');
    console.log('─'.repeat(60));

    try {
      const coreStore = await pool.query('SELECT key FROM strapi_core_store_settings');
      console.log(`  Configuration entries: ${coreStore.rowCount}`);

      if (coreStore.rowCount > 0) {
        console.log('  Keys:', coreStore.rows.slice(0, 5).map(r => r.key).join(', '));
        if (coreStore.rowCount > 5) {
          console.log(`  ... and ${coreStore.rowCount - 5} more`);
        }
      }
    } catch (error) {
      console.log('  ❌ Core store table not found or empty');
    }

    console.log('─'.repeat(60));
    console.log('\n✅ Verification complete!\n');

  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

verifyImport();
