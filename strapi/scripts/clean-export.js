#!/usr/bin/env node
/**
 * ═══════════════════════════════════════════════════════════
 * Script de préparation et export Strapi v5 pour Windows
 * VERSION TYPESCRIPT
 * ═══════════════════════════════════════════════════════════
 * 
 * Ce script automatise la création d'un export Strapi propre
 * sans les workflows qui causent des problèmes d'import
 *
 * Usage: node prepare-and-export.js
 * ═══════════════════════════════════════════════════════════
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

// Interface pour les questions
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Fonction pour poser une question
function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

// Couleurs pour Windows (codes ANSI)
const colors = {
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[36m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function section(title) {
  console.log('\n═══════════════════════════════════════════════════════════');
  log(`  ${title}`, 'blue');
  console.log('═══════════════════════════════════════════════════════════\n');
}

function step(message) {
  console.log('───────────────────────────────────────────────────────────');
  console.log(message);
  console.log('───────────────────────────────────────────────────────────\n');
}

async function main() {
  try {
    section('PRÉPARATION ET EXPORT STRAPI - WINDOWS (TypeScript)');

    // ═══════════════════════════════════════════════════════════
    // ÉTAPE 1: Vérifier l'environnement
    // ═══════════════════════════════════════════════════════════
    
    log('📋 Étape 1: Vérification de l\'environnement', 'blue');
    step('');

    // Vérifier package.json
    if (!fs.existsSync('package.json')) {
      log('❌ Erreur: package.json non trouvé', 'red');
      log('   Ce script doit être exécuté à la racine de votre projet Strapi', 'red');
      process.exit(1);
    }

    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    if (!packageJson.dependencies || !packageJson.dependencies['@strapi/strapi']) {
      log('❌ Erreur: Ce n\'est pas un projet Strapi', 'red');
      process.exit(1);
    }

    log('✓ Projet Strapi détecté', 'green');
    log(`✓ Version Strapi: ${packageJson.dependencies['@strapi/strapi']}`, 'green');
    
    // Détecter TypeScript
    const isTypescript = packageJson.dependencies['typescript'] || 
                        packageJson.devDependencies?.['typescript'] ||
                        fs.existsSync('tsconfig.json');
    
    if (isTypescript) {
      log('✓ Projet TypeScript détecté', 'green');
    }

    // ═══════════════════════════════════════════════════════════
    // ÉTAPE 2: Créer la configuration plugins
    // ═══════════════════════════════════════════════════════════
    
    console.log('');
    log('📝 Étape 2: Configuration des plugins', 'blue');
    step('');

    // Créer le dossier config s'il n'existe pas
    if (!fs.existsSync('config')) {
      fs.mkdirSync('config');
      log('✓ Dossier config créé', 'green');
    }

    // Déterminer l'extension (.js ou .ts)
    const pluginsExt = isTypescript ? 'ts' : 'js';
    const pluginsPath = path.join('config', `plugins.${pluginsExt}`);
    const otherExt = pluginsExt === 'ts' ? 'js' : 'ts';
    const otherPluginsPath = path.join('config', `plugins.${otherExt}`);

    // Backup de l'ancien fichier plugins
    if (fs.existsSync(pluginsPath)) {
      log(`⚠  Le fichier config/plugins.${pluginsExt} existe déjà`, 'yellow');
      const backupPath = path.join('config', `plugins.${pluginsExt}.backup`);
      fs.copyFileSync(pluginsPath, backupPath);
      log(`   Sauvegarde créée: config/plugins.${pluginsExt}.backup`, 'yellow');
    }

    // Supprimer l'ancien fichier avec l'autre extension si existe
    if (fs.existsSync(otherPluginsPath)) {
      log(`⚠  Suppression de l'ancien config/plugins.${otherExt}`, 'yellow');
      fs.unlinkSync(otherPluginsPath);
    }

    // Créer le nouveau fichier plugins
    let pluginsContent;
    
    if (isTypescript) {
      // Version TypeScript
      pluginsContent = `/**
 * Configuration des plugins Strapi (TypeScript)
 * Généré automatiquement pour désactiver les review-workflows
 */

export default {
  'review-workflows': {
    enabled: false,
  },
};
`;
    } else {
      // Version JavaScript
      pluginsContent = `/**
 * Configuration des plugins Strapi
 * Généré automatiquement pour désactiver les review-workflows
 */

module.exports = {
  'review-workflows': {
    enabled: false,
  },
};
`;
    }

    fs.writeFileSync(pluginsPath, pluginsContent, 'utf8');
    log(`✓ Fichier config/plugins.${pluginsExt} créé`, 'green');

    // ═══════════════════════════════════════════════════════════
    // ÉTAPE 3: Nettoyer la base de données
    // ═══════════════════════════════════════════════════════════
    
    console.log('');
    log('🧹 Étape 3: Nettoyage des workflows dans la base', 'blue');
    step('');

    // Détecter le type de base de données
    let dbClient = 'unknown';
    try {
      // Essayer de lire le fichier de config TypeScript ou JavaScript
      const dbConfigFiles = ['config/database.ts', 'config/database.js'];
      let dbConfigPath = null;
      
      for (const configFile of dbConfigFiles) {
        if (fs.existsSync(configFile)) {
          dbConfigPath = configFile;
          break;
        }
      }

      if (dbConfigPath) {
        const content = fs.readFileSync(dbConfigPath, 'utf8');
        
        // Rechercher le client dans le contenu
        if (content.includes('postgres') || content.includes('postgresql')) {
          dbClient = 'postgresql';
        } else if (content.includes('better-sqlite3') || content.includes('sqlite')) {
          dbClient = 'sqlite';
        } else if (content.includes('mysql')) {
          dbClient = 'mysql';
        }
      }
    } catch (error) {
      // Ignorer l'erreur
    }

    log(`Base de données détectée: ${dbClient}`, 'blue');
    console.log('');

    if (dbClient === 'postgres' || dbClient === 'postgresql') {
      log('Pour PostgreSQL, vous devez exécuter ces commandes SQL:', 'yellow');
      console.log('');
      console.log('DELETE FROM strapi_workflows_stages_permissions_lnk;');
      console.log('DELETE FROM strapi_workflows_stages;');
      console.log('DELETE FROM strapi_workflows;');
      console.log('DELETE FROM strapi_core_store_settings WHERE key LIKE \'plugin_review-workflows%\';');
      console.log('');
      
      // Créer un fichier SQL pour faciliter l'exécution
      const sqlPath = 'clean-workflows.sql';
      const sqlContent = `-- Nettoyage des workflows Strapi
DELETE FROM strapi_workflows_stages_permissions_lnk;
DELETE FROM strapi_workflows_stages;
DELETE FROM strapi_workflows;
DELETE FROM strapi_core_store_settings WHERE key LIKE 'plugin_review-workflows%';

-- Vérification
SELECT 'Nettoyage terminé' as status;
SELECT COUNT(*) as workflows_restants FROM strapi_workflows;
`;
      fs.writeFileSync(sqlPath, sqlContent, 'utf8');
      log(`✓ Fichier SQL créé: ${sqlPath}`, 'green');
      log('  Vous pouvez l\'exécuter avec pgAdmin ou psql', 'green');
      console.log('');

    } else if (dbClient === 'sqlite' || dbClient === 'better-sqlite3') {
      log('Pour SQLite, tentative de nettoyage automatique...', 'yellow');
      
      // Chercher le fichier .db dans le dossier .tmp
      const possiblePaths = [
        '.tmp/data.db',
        'data.db',
        '.tmp/database.db',
        'database.db'
      ];
      
      let dbFile = null;
      for (const p of possiblePaths) {
        if (fs.existsSync(p)) {
          dbFile = p;
          break;
        }
      }

      if (!dbFile) {
        // Chercher tous les fichiers .db
        const findDbFiles = (dir) => {
          if (!fs.existsSync(dir)) return [];
          const files = [];
          fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
            if (entry.isFile() && (entry.name.endsWith('.db') || entry.name.endsWith('.sqlite'))) {
              files.push(path.join(dir, entry.name));
            }
          });
          return files;
        };
        
        const dbFiles = findDbFiles('.tmp');
        if (dbFiles.length > 0) {
          dbFile = dbFiles[0];
        }
      }

      if (dbFile) {
        log(`✓ Base de données trouvée: ${dbFile}`, 'green');
        
        try {
          const sqlite3 = require('better-sqlite3');
          const db = sqlite3(dbFile);
          
          db.exec('DELETE FROM strapi_workflows_stages_permissions_lnk;');
          db.exec('DELETE FROM strapi_workflows_stages;');
          db.exec('DELETE FROM strapi_workflows;');
          db.exec("DELETE FROM strapi_core_store_settings WHERE key LIKE 'plugin_review-workflows%';");
          
          db.close();
          log('✓ Base de données nettoyée automatiquement', 'green');
        } catch (error) {
          log('⚠  Nettoyage automatique échoué, nettoyage manuel requis', 'yellow');
          log(`   Erreur: ${error.message}`, 'yellow');
        }
      } else {
        log('⚠  Fichier SQLite non trouvé dans .tmp/, nettoyage manuel requis', 'yellow');
      }
    } else {
      log('⚠  Type de base non reconnu, nettoyage manuel requis', 'yellow');
    }

    console.log('');
    const dbCleaned = await question('Avez-vous nettoyé la base de données? (y/n) ');
    if (dbCleaned.toLowerCase() !== 'y') {
      log('❌ Veuillez nettoyer la base avant de continuer', 'red');
      rl.close();
      process.exit(1);
    }

    // ═══════════════════════════════════════════════════════════
    // ÉTAPE 4: Redémarrage de Strapi
    // ═══════════════════════════════════════════════════════════
    
    console.log('');
    log('🔄 Étape 4: Redémarrage recommandé', 'blue');
    step('');

    log('Il est recommandé de redémarrer Strapi avant l\'export', 'yellow');
    console.log('');
    console.log('Actions à faire:');
    console.log('  1. Arrêter Strapi (Ctrl+C si en cours)');
    console.log('  2. Exécuter: yarn develop');
    console.log('  3. Vérifier qu\'il démarre sans erreur');
    console.log('  4. Arrêter Strapi (Ctrl+C)');
    console.log('  5. Revenir à ce script');
    console.log('');

    const continueExport = await question('Voulez-vous continuer avec l\'export? (y/n) ');
    if (continueExport.toLowerCase() !== 'y') {
      log('⏸  Script mis en pause', 'yellow');
      log('   Redémarrez Strapi, puis relancez ce script', 'yellow');
      rl.close();
      process.exit(0);
    }

    // ═══════════════════════════════════════════════════════════
    // ÉTAPE 5: Créer l'export
    // ═══════════════════════════════════════════════════════════
    
    console.log('');
    log('📦 Étape 5: Création de l\'export', 'blue');
    step('');

    // Créer le dossier data s'il n'existe pas
    if (!fs.existsSync('data')) {
      fs.mkdirSync('data');
    }

    // Nom du fichier d'export
    const timestamp = new Date().toISOString()
      .replace(/T/, '_')
      .replace(/\..+/, '')
      .replace(/:/g, '-');
    const exportFile = `./data/export_clean_${timestamp}.tar.gz`;

    log(`Fichier de sortie: ${exportFile}`, 'blue');
    console.log('');
    log('Démarrage de l\'export...', 'blue');
    console.log('');

    try {
      // Exécuter la commande d'export
      execSync(`yarn strapi export --no-encrypt -f "${exportFile}"`, {
        stdio: 'inherit',
        shell: true
      });

      console.log('');
      log('✅ Export créé avec succès!', 'green');
      console.log('');

      // Afficher les informations sur le fichier
      const stats = fs.statSync(exportFile);
      const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
      
      console.log('📊 Informations sur l\'export:');
      console.log(`   Fichier: ${exportFile}`);
      console.log(`   Taille: ${fileSizeMB} MB`);
      console.log('');

      // Créer un lien vers le dernier export (copie sur Windows)
      const latestPath = './data/export_latest.tar.gz';
      if (fs.existsSync(latestPath)) {
        fs.unlinkSync(latestPath);
      }
      fs.copyFileSync(exportFile, latestPath);
      log('✓ Copie créée: ./data/export_latest.tar.gz', 'green');

    } catch (error) {
      console.log('');
      log('❌ Erreur lors de l\'export', 'red');
      log(`   ${error.message}`, 'red');
      rl.close();
      process.exit(1);
    }

    // ═══════════════════════════════════════════════════════════
    // ÉTAPE 6: Instructions finales
    // ═══════════════════════════════════════════════════════════
    
    console.log('');
    section('✅ EXPORT TERMINÉ');

    console.log('📋 Prochaines étapes:\n');
    console.log('1. L\'export est prêt à être envoyé vers votre serveur\n');
    console.log('2. Options d\'envoi:\n');
    console.log(`   Option A - SCP (si SSH configuré):`);
    console.log(`   scp "${exportFile}" user@server:/path/to/strapi/data/\n`);
    console.log(`   Option B - FTP/SFTP avec WinSCP ou FileZilla:`);
    console.log(`   Uploadez ${exportFile} vers le serveur\n`);
    console.log(`   Option C - Copie manuelle:`);
    console.log(`   Copiez ${exportFile}`);
    console.log(`   vers ./strapi/data/export_20250116105447.tar.gz sur votre serveur\n`);
    console.log('3. Sur le serveur, relancez le déploiement:');
    console.log('   docker-compose down && docker-compose up -d --build\n');
    console.log('4. Vérifiez l\'import:');
    console.log('   docker-compose logs -f strapi\n');

    console.log('═══════════════════════════════════════════════════════════\n');

    // Proposer de restaurer l'ancien plugins
    if (fs.existsSync(`config/plugins.${pluginsExt}.backup`)) {
      console.log('');
      const restore = await question(`Voulez-vous restaurer l'ancien config/plugins.${pluginsExt}? (y/n) `);
      if (restore.toLowerCase() === 'y') {
        fs.copyFileSync(`config/plugins.${pluginsExt}.backup`, pluginsPath);
        log('✓ Fichier restauré', 'green');
      } else {
        log(`La sauvegarde est conservée: config/plugins.${pluginsExt}.backup`, 'yellow');
      }
    }

    console.log('');
    log('🎉 Terminé!', 'green');
    console.log('');

    rl.close();

  } catch (error) {
    console.error('');
    log('❌ Erreur fatale:', 'red');
    console.error(error);
    rl.close();
    process.exit(1);
  }
}

// Lancer le script
main();