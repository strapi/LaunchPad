const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const tar = require('tar');

async function fixExportAndImport() {
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
  const tempDir = './data/temp_export';
  const fixedExportPath = './data/export_fixed.tar.gz';

  try {
    console.log('Step 1: Extracting export archive...');

    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    fs.mkdirSync(tempDir, { recursive: true });

    await tar.x({
      file: exportPath,
      cwd: tempDir
    });

    console.log('✓ Archive extracted\n');

    console.log('Step 2: Analyzing links file...');

    const linksPath = path.join(tempDir, 'links', 'links_00001.jsonl');

    if (!fs.existsSync(linksPath)) {
      throw new Error('links_00001.jsonl not found');
    }

    const linksContent = fs.readFileSync(linksPath, 'utf8');
    const lines = linksContent.split('\n').filter(Boolean);

    console.log(`  Total links: ${lines.length}`);

    // Lire les entités pour savoir quels logos existent
    const entitiesPath = path.join(tempDir, 'entities', 'entities_00001.jsonl');
    const entitiesContent = fs.readFileSync(entitiesPath, 'utf8');
    const entityLines = entitiesContent.split('\n').filter(Boolean);

    const existingLogoIds = new Set();

    for (const line of entityLines) {
      try {
        const entity = JSON.parse(line);
        if (entity.type === 'api::logo.logo') {
          existingLogoIds.add(entity.id);
        }
      } catch (e) {
        // Ignorer les erreurs de parsing
      }
    }

    console.log(`  Existing logo IDs: ${Array.from(existingLogoIds).sort((a, b) => a - b).join(', ')}`);
    console.log(`  Logo ID 8 exists: ${existingLogoIds.has(8) ? '✅' : '❌'}\n`);

    // Filtrer les liens
    const fixedLines = [];
    let removedCount = 0;
    let removedLinks = [];

    for (const line of lines) {
      try {
        const link = JSON.parse(line);

        // Vérifier si c'est un lien vers logo:8
        const linkStr = JSON.stringify(link);

        // Vérifier différents formats possibles
        const isProblematicLink = (
          (link.right && link.right.ref === 'api::logo.logo' && link.right.id === 8) ||
          (link.left && link.left.ref === 'api::logo.logo' && link.left.id === 8) ||
          linkStr.includes('"id":8') && linkStr.includes('logo.logo')
        );

        if (isProblematicLink && !existingLogoIds.has(8)) {
          console.log(`  ⚠ Removing problematic link:`, {
            kind: link.kind,
            relation: link.relation,
            left: link.left,
            right: link.right
          });
          removedLinks.push(link);
          removedCount++;
          continue;
        }

        fixedLines.push(line);
      } catch (e) {
        // Si on ne peut pas parser, on garde la ligne
        fixedLines.push(line);
      }
    }

    console.log(`\n✓ Removed ${removedCount} problematic link(s)`);

    if (removedCount === 0) {
      console.log('  ℹ No problematic links found. The issue might be elsewhere.\n');
    } else {
      // Sauvegarder les liens corrigés
      fs.writeFileSync(linksPath, fixedLines.join('\n') + '\n', 'utf8');
      console.log(`✓ Fixed links file saved (${fixedLines.length} links remaining)\n`);
    }

    console.log('Step 3: Creating fixed archive...');

    if (fs.existsSync(fixedExportPath)) {
      fs.unlinkSync(fixedExportPath);
    }

    await tar.c({
      gzip: true,
      file: fixedExportPath,
      cwd: tempDir
    }, fs.readdirSync(tempDir));

    console.log(`✓ Fixed archive: ${fixedExportPath}\n`);

    fs.rmSync(tempDir, { recursive: true, force: true });

    console.log('Step 4: Importing fixed data...');
    const pool = new Pool(poolConfig);

    try {
      await pool.query('SELECT NOW()');
      console.log('✓ Database connected\n');

      await pool.query('SET session_replication_role = replica;');
      console.log('✓ Constraints disabled\n');

      console.log('Starting import...\n');
      execSync(`strapi import -f "${fixedExportPath}" --force`, { stdio: 'inherit' });

      await pool.query('SET session_replication_role = DEFAULT;');
      console.log('\n✓ Constraints re-enabled\n');
    } finally {
      await pool.end();
    }

    console.log('✅ Import completed successfully!\n');
    console.log('Run "yarn verify" to check the imported data.');

  } catch (error) {
    console.error('\n✗ Failed:', error.message);
    console.error('Stack:', error.stack);

    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }

    process.exit(1);
  }
}

fixExportAndImport();
