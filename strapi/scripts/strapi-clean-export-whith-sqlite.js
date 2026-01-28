/**
 * Nettoyage générique des FK SQLite avant export Strapi
 * Compatible Windows
 */

const Database = require('better-sqlite3');
const { execSync } = require('child_process');
const fs = require('fs');

const DB_PATH = '.tmp/data.db';
const EXPORT_DIR = './exports';
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-');
const EXPORT_FILE = `${EXPORT_DIR}/strapi_export_${TIMESTAMP}.tar.gz`;

if (!fs.existsSync(DB_PATH)) {
  console.error(`❌ DB SQLite introuvable : ${DB_PATH}`);
  process.exit(1);
}

fs.mkdirSync(EXPORT_DIR, { recursive: true });

console.log('🚀 Strapi generic clean export (SQLite / Windows)');

const db = new Database(DB_PATH);
db.pragma('foreign_keys = OFF');

const tables = db
  .prepare(`
    SELECT name FROM sqlite_master
    WHERE type='table'
    AND name NOT LIKE 'sqlite_%'
  `)
  .all()
  .map(t => t.name);

for (const table of tables) {
  const fks = db.prepare(`PRAGMA foreign_key_list(${table})`).all();

  if (!fks.length) continue;

  console.log(`🧩 Table: ${table}`);

  for (const fk of fks) {
    const { table: refTable, from, to } = fk;

    console.log(`   🔗 ${table}.${from} → ${refTable}.${to}`);

    const sql = `
      DELETE FROM "${table}"
      WHERE "${from}" IS NOT NULL
      AND "${from}" NOT IN (
        SELECT "${to}" FROM "${refTable}"
      )
    `;

    db.prepare(sql).run();
  }
}

db.pragma('foreign_keys = ON');
db.close();

console.log('✅ Nettoyage générique terminé');
console.log('📦 Export Strapi en cours...');

// execSync(`npx strapi export -f "${EXPORT_FILE}"`, {
execSync(`npx strapi export --no-encrypt --file "${EXPORT_FILE}"`, {
  stdio: 'inherit',
});

console.log('🎉 Export terminé !');
console.log(`📁 Fichier : ${EXPORT_FILE}`);
