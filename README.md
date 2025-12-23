# Site Webtinix - Moderne et Optimisé

![LaunchPad](./LaunchPad.jpg)

Bienvenue sur le nouveau site de **Webtinix**, propulsé par Strapi et Next.js. Ce projet est un fork du dépôt officiel [Strapi LaunchPad](https://github.com/strapi/LaunchPad), adapté et optimisé pour les besoins de Webtinix.

Ce dépôt contient :

* Un projet Strapi avec des types de contenu et des données préchargées
* Un client Next.js prêt à récupérer et afficher le contenu depuis Strapi
* Une configuration optimisée pour PostgreSQL en production

## 🚀 Démarrage rapide

Vous pouvez démarrer ce projet sur votre machine locale en suivant les instructions ci-dessous.

### 1. Cloner le projet

Clonez le dépôt avec cette commande :

```bash
git clone https://github.com/webtinix1/wx-refonte-with-launchpad.git
cd wx-refonte-with-launchpad
```

### 2. Configurer PostgreSQL

Ce projet utilise PostgreSQL comme base de données. Voici comment la configurer :

#### Installation de PostgreSQL

Si PostgreSQL n'est pas installé sur votre machine :

**Windows :**
- Téléchargez PostgreSQL depuis [postgresql.org](https://www.postgresql.org/download/windows/)
- Installez-le avec l'assistant d'installation
- Notez le mot de passe que vous définissez pour l'utilisateur `postgres`

**Linux (Ubuntu/Debian) :**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

**macOS :**
```bash
brew install postgresql
brew services start postgresql
```

#### Créer la base de données

Connectez-vous à PostgreSQL et créez la base de données pour Strapi :

```bash
# Connectez-vous en tant que superutilisateur postgres
psql -U postgres

# Dans le shell PostgreSQL, exécutez :
CREATE USER strapi WITH PASSWORD 'strapi';
CREATE DATABASE strapi OWNER strapi;

# Accordez tous les droits nécessaires
GRANT ALL PRIVILEGES ON DATABASE strapi TO strapi;

# Connectez-vous à la base strapi
\c strapi

# Accordez les droits sur le schéma public
GRANT ALL ON SCHEMA public TO strapi;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO strapi;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO strapi;

# Quittez le shell PostgreSQL
\q
```

**Note :** Pour les environnements de production, utilisez un mot de passe fort et sécurisé !

### 3. Configurer les variables d'environnement

#### Configuration de Strapi

Créez le fichier `.env` pour Strapi :

```bash
cp ./strapi/.env.example ./strapi/.env
```

Modifiez `./strapi/.env` avec vos paramètres :

```env
HOST=0.0.0.0
PORT=1337
APP_KEYS="votre-clé-1,votre-clé-2"
API_TOKEN_SALT=votre-token-salt
ADMIN_JWT_SECRET=votre-admin-secret
TRANSFER_TOKEN_SALT=votre-transfer-salt
JWT_SECRET=votre-jwt-secret

# Base de données PostgreSQL
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=strapi
DATABASE_SSL=false
DATABASE_SCHEMA=public

# Optimisations
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=20
DATABASE_CONNECTION_TIMEOUT=600000

# Configuration Next.js (optionnel)
CLIENT_URL=http://localhost:3000
PREVIEW_SECRET=votre-preview-secret

# Environnement
NODE_ENV=development
STRAPI_DISABLE_TELEMETRY=true

# Mémoire Node.js (pour les imports volumineux)
NODE_OPTIONS=--max-old-space-size=4096
```

**Important :** Générez des clés sécurisées pour `APP_KEYS`, `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, etc. Ne réutilisez jamais les valeurs par défaut en production !

#### Configuration de Next.js

Créez le fichier `.env` pour Next.js :

```bash
cp ./next/.env.example ./next/.env
```

Modifiez `./next/.env` selon vos besoins :

```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_URL=http://localhost:1337
PREVIEW_SECRET=votre-preview-secret
```

### 4. Démarrer Strapi

Installez les dépendances, importez les données initiales et démarrez le serveur :

```bash
cd strapi
yarn install
yarn seed
yarn develop
```

Le panneau d'administration Strapi sera accessible sur [http://localhost:1337/admin](http://localhost:1337/admin)

**Note :** La commande `yarn seed` importe les données de démonstration. Si vous rencontrez des erreurs liées aux droits PostgreSQL, vérifiez que vous avez bien exécuté toutes les commandes SQL de la section "Créer la base de données".

### 5. Démarrer Next.js

Ouvrez un nouveau terminal et démarrez le client Next.js :

```bash
cd next
yarn install
yarn build
yarn start
```

Ou pour le mode développement :

```bash
yarn dev
```

Le site sera accessible sur [http://localhost:3000](http://localhost:3000)

## 📚 Fonctionnalités

### Côté Utilisateur

* **Éditeur intuitif et minimaliste** : Créez du contenu avec des blocs dynamiques
* **Bibliothèque média** : Téléchargez et optimisez vos images et vidéos
* **Gestion de contenu flexible** : Adaptez la structure selon vos besoins
* **Tri et filtrage** : Gérez facilement des milliers d'entrées
* **Interface conviviale** : L'une des interfaces open-source les plus faciles à utiliser
* **Optimisé SEO** : Gérez vos métadonnées SEO simplement

### Fonctionnalités Globales

* **API personnalisable** : REST ou GraphQL générées automatiquement
* **Bibliothèque média avancée** : Stockage et gestion optimisés
* **Contrôle d'accès basé sur les rôles (RBAC)** : Droits d'accès granulaires
* **Internationalisation (i18n)** : Gestion multilingue du contenu
* **Journaux d'audit** : Traçabilité de toutes les actions
* **Transfert de données** : Import/export entre instances Strapi
* **Workflow de révision** : Collaboration sur le cycle de vie du contenu

## 🛠️ Scripts disponibles

### Strapi

```bash
yarn develop       # Démarrer en mode développement
yarn start        # Démarrer en mode production
yarn build        # Construire le projet
yarn seed         # Importer les données de démonstration
```

### Next.js

```bash
yarn dev          # Démarrer en mode développement
yarn build        # Construire pour la production
yarn start        # Démarrer en mode production
yarn lint         # Vérifier le code
```

## 🔧 Dépannage

### Erreur "droit refusé pour le schéma public"

Si vous rencontrez cette erreur lors de l'exécution de `yarn seed`, c'est que l'utilisateur PostgreSQL n'a pas les droits nécessaires. Exécutez les commandes suivantes :

```bash
psql -U postgres -d strapi

GRANT ALL ON SCHEMA public TO strapi;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO strapi;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO strapi;

\q
```

### Erreur de connexion à PostgreSQL

Vérifiez que :
1. PostgreSQL est bien démarré sur votre machine
2. Les identifiants dans `.env` correspondent à ceux configurés
3. La base de données `strapi` existe bien
4. L'utilisateur `strapi` a les droits nécessaires

## 📖 Documentation

* [Documentation Strapi](https://docs.strapi.io)
* [Documentation Next.js](https://nextjs.org/docs)
* [Forum Strapi](https://forum.strapi.io/)
* [Discord Strapi](https://discord.strapi.io)

## 🌐 Déploiement

Consultez les guides de déploiement dans le dépôt :
* `wx-deployment-docker-guide.md` - Déploiement avec Docker
* `wx-fork-launchpad-guide.md` - Guide du fork LaunchPad
* `wx-dev-best-practices.md` - Bonnes pratiques de développement

## 📝 Personnalisations

Ce projet contient plusieurs personnalisations par rapport au LaunchPad original :

* Configuration PostgreSQL optimisée pour la production
* Middlewares de population personnalisés dans les routes API
* Script postinstall pour la gestion des UUID
* Support natif de PostgreSQL au lieu de SQLite

## 📄 Licence

MIT

## 👥 À propos

Développé par **Webtinix** - [Site web](https://webtinix.com)

Basé sur [Strapi LaunchPad](https://github.com/strapi/LaunchPad)