# Guide Déploiement Docker & PostgreSQL - LaunchPad

## 🎯 Vue d'ensemble

Ce guide couvre le déploiement complet de LaunchPad avec :
- 🐳 Docker & Docker Compose
- 🐘 PostgreSQL (au lieu de SQLite)
- 🚀 Configuration développement et production
- 🔄 CI/CD avec GitHub Actions

---

## 📋 Prérequis

### Installation locale

```bash
# Docker Desktop (Windows/Mac)
# https://www.docker.com/products/docker-desktop

# Ou Docker Engine (Linux)
sudo apt update
sudo apt install docker.io docker-compose-plugin

# Vérifier l'installation
docker --version
docker compose version
```

### Connaissances requises

- ✅ Bases de Docker
- ✅ Variables d'environnement
- ✅ PostgreSQL basique
- ✅ CLI Linux/Unix

---

## 🏗️ Architecture Docker

### Vue d'ensemble

```
┌─────────────────────────────────────────────┐
│              Docker Network                  │
│                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │          │  │          │  │          │  │
│  │  Next.js │  │  Strapi  │  │PostgreSQL│  │
│  │  :3000   │  │  :1337   │  │  :5432   │  │
│  │          │  │          │  │          │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  │
│       │             │             │         │
│       └─────────────┴─────────────┘         │
│            Réseau interne                    │
└─────────────────────────────────────────────┘
         │
         │ Port mapping
         ▼
   Internet (80, 443)
```

---

## 📁 Structure des fichiers Docker

```
projet/
├── docker/
│   ├── next/
│   │   └── Dockerfile
│   ├── strapi/
│   │   └── Dockerfile
│   └── postgres/
│       └── init.sql
├── docker-compose.yml           # Développement
├── docker-compose.prod.yml      # Production
├── .env.example
├── .env.local                   # Dev (pas commité)
├── .env.production              # Prod (pas commité)
└── .dockerignore
```

---

## 🐳 Fichiers Docker

### 1. Dockerfile Next.js

```dockerfile
# docker/next/Dockerfile
FROM node:20-alpine AS base

# Installer les dépendances
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY next/package.json next/yarn.lock* ./
RUN yarn --frozen-lockfile

# Build de l'application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY next/ .

# Variables d'environnement pour le build
ARG NEXT_PUBLIC_STRAPI_URL
ENV NEXT_PUBLIC_STRAPI_URL=$NEXT_PUBLIC_STRAPI_URL

RUN yarn build

# Image de production
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

### 2. Dockerfile Strapi

```dockerfile
# docker/strapi/Dockerfile
FROM node:20-alpine AS base

# Installer les dépendances
FROM base AS deps
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app

COPY strapi/package.json strapi/yarn.lock* ./
RUN yarn --frozen-lockfile

# Build de l'application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY strapi/ .

# Variables d'environnement pour le build
ARG DATABASE_CLIENT
ARG DATABASE_HOST
ARG DATABASE_PORT
ARG DATABASE_NAME
ARG DATABASE_USERNAME
ARG DATABASE_PASSWORD

ENV DATABASE_CLIENT=$DATABASE_CLIENT \
    DATABASE_HOST=$DATABASE_HOST \
    DATABASE_PORT=$DATABASE_PORT \
    DATABASE_NAME=$DATABASE_NAME \
    DATABASE_USERNAME=$DATABASE_USERNAME \
    DATABASE_PASSWORD=$DATABASE_PASSWORD

RUN yarn build

# Image de production
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN apk add --no-cache vips-dev

COPY --from=builder /app ./

EXPOSE 1337

CMD ["yarn", "start"]
```

### 3. docker-compose.yml (Développement)

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: launchpad-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${DATABASE_NAME:-launchpad_dev}
      POSTGRES_USER: ${DATABASE_USERNAME:-strapi}
      POSTGRES_PASSWORD: ${DATABASE_PASSWORD:-strapi_dev_2024}
    ports:
      - "${DATABASE_PORT:-5432}:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./docker/postgres/init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - launchpad-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DATABASE_USERNAME:-strapi}"]
      interval: 10s
      timeout: 5s
      retries: 5

  strapi:
    build:
      context: .
      dockerfile: docker/strapi/Dockerfile
      args:
        DATABASE_CLIENT: postgres
        DATABASE_HOST: postgres
        DATABASE_PORT: 5432
        DATABASE_NAME: ${DATABASE_NAME:-launchpad_dev}
        DATABASE_USERNAME: ${DATABASE_USERNAME:-strapi}
        DATABASE_PASSWORD: ${DATABASE_PASSWORD:-strapi_dev_2024}
    container_name: launchpad-strapi
    restart: unless-stopped
    environment:
      NODE_ENV: development
      DATABASE_CLIENT: postgres
      DATABASE_HOST: postgres
      DATABASE_PORT: 5432
      DATABASE_NAME: ${DATABASE_NAME:-launchpad_dev}
      DATABASE_USERNAME: ${DATABASE_USERNAME:-strapi}
      DATABASE_PASSWORD: ${DATABASE_PASSWORD:-strapi_dev_2024}
      DATABASE_SSL: false
      JWT_SECRET: ${JWT_SECRET:-changeme}
      ADMIN_JWT_SECRET: ${ADMIN_JWT_SECRET:-changeme}
      APP_KEYS: ${APP_KEYS:-changeme}
      API_TOKEN_SALT: ${API_TOKEN_SALT:-changeme}
      TRANSFER_TOKEN_SALT: ${TRANSFER_TOKEN_SALT:-changeme}
    ports:
      - "1337:1337"
    volumes:
      - ./strapi:/app
      - /app/node_modules
      - strapi_uploads:/app/public/uploads
    networks:
      - launchpad-network
    depends_on:
      postgres:
        condition: service_healthy

  nextjs:
    build:
      context: .
      dockerfile: docker/next/Dockerfile
      args:
        NEXT_PUBLIC_STRAPI_URL: ${NEXT_PUBLIC_STRAPI_URL:-http://localhost:1337}
    container_name: launchpad-nextjs
    restart: unless-stopped
    environment:
      NODE_ENV: development
      NEXT_PUBLIC_STRAPI_URL: ${NEXT_PUBLIC_STRAPI_URL:-http://localhost:1337}
      STRAPI_API_TOKEN: ${STRAPI_API_TOKEN}
      VTIGER_API_URL: ${VTIGER_API_URL}
      VTIGER_API_KEY: ${VTIGER_API_KEY}
      VTIGER_API_SECRET: ${VTIGER_API_SECRET}
    ports:
      - "3000:3000"
    volumes:
      - ./next:/app
      - /app/node_modules
      - /app/.next
    networks:
      - launchpad-network
    depends_on:
      - strapi

networks:
  launchpad-network:
    driver: bridge

volumes:
  postgres_data:
  strapi_uploads:
```

### 4. docker-compose.prod.yml (Production)

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: launchpad-postgres-prod
    restart: always
    environment:
      POSTGRES_DB: ${DATABASE_NAME}
      POSTGRES_USER: ${DATABASE_USERNAME}
      POSTGRES_PASSWORD: ${DATABASE_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - launchpad-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DATABASE_USERNAME}"]
      interval: 30s
      timeout: 10s
      retries: 5

  strapi:
    build:
      context: .
      dockerfile: docker/strapi/Dockerfile
      args:
        DATABASE_CLIENT: postgres
        DATABASE_HOST: postgres
        DATABASE_PORT: 5432
        DATABASE_NAME: ${DATABASE_NAME}
        DATABASE_USERNAME: ${DATABASE_USERNAME}
        DATABASE_PASSWORD: ${DATABASE_PASSWORD}
    container_name: launchpad-strapi-prod
    restart: always
    environment:
      NODE_ENV: production
      DATABASE_CLIENT: postgres
      DATABASE_HOST: postgres
      DATABASE_PORT: 5432
      DATABASE_NAME: ${DATABASE_NAME}
      DATABASE_USERNAME: ${DATABASE_USERNAME}
      DATABASE_PASSWORD: ${DATABASE_PASSWORD}
      DATABASE_SSL: ${DATABASE_SSL:-false}
      JWT_SECRET: ${JWT_SECRET}
      ADMIN_JWT_SECRET: ${ADMIN_JWT_SECRET}
      APP_KEYS: ${APP_KEYS}
      API_TOKEN_SALT: ${API_TOKEN_SALT}
      TRANSFER_TOKEN_SALT: ${TRANSFER_TOKEN_SALT}
    volumes:
      - strapi_uploads:/app/public/uploads
    networks:
      - launchpad-network
    depends_on:
      postgres:
        condition: service_healthy

  nextjs:
    build:
      context: .
      dockerfile: docker/next/Dockerfile
      args:
        NEXT_PUBLIC_STRAPI_URL: ${NEXT_PUBLIC_STRAPI_URL}
    container_name: launchpad-nextjs-prod
    restart: always
    environment:
      NODE_ENV: production
      NEXT_PUBLIC_STRAPI_URL: ${NEXT_PUBLIC_STRAPI_URL}
      STRAPI_API_TOKEN: ${STRAPI_API_TOKEN}
      VTIGER_API_URL: ${VTIGER_API_URL}
      VTIGER_API_KEY: ${VTIGER_API_KEY}
      VTIGER_API_SECRET: ${VTIGER_API_SECRET}
    networks:
      - launchpad-network
    depends_on:
      - strapi

  nginx:
    image: nginx:alpine
    container_name: launchpad-nginx
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./docker/nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./docker/nginx/ssl:/etc/nginx/ssl:ro
      - nginx_cache:/var/cache/nginx
    networks:
      - launchpad-network
    depends_on:
      - nextjs
      - strapi

networks:
  launchpad-network:
    driver: bridge

volumes:
  postgres_data:
  strapi_uploads:
  nginx_cache:
```

### 5. .dockerignore

```
# .dockerignore
node_modules
.next
.git
.gitignore
.env*
!.env.example
README.md
.DS_Store
*.log
.cache
dist
build
.vscode
.idea
coverage
.nyc_output
*.md
docker-compose*.yml
Dockerfile*
```

---

## 🔐 Variables d'environnement

### .env.example (Template)

```bash
# Database (PostgreSQL)
DATABASE_CLIENT=postgres
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_NAME=launchpad_dev
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=change_me_in_production
DATABASE_SSL=false

# Strapi
JWT_SECRET=generate_random_string_here
ADMIN_JWT_SECRET=generate_random_string_here
APP_KEYS=generate_random_string_here
API_TOKEN_SALT=generate_random_string_here
TRANSFER_TOKEN_SALT=generate_random_string_here
STRAPI_API_TOKEN=your_api_token_here

# Next.js
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Vtiger (optionnel)
VTIGER_API_URL=https://your-vtiger.com/api
VTIGER_API_KEY=your_vtiger_api_key
VTIGER_API_SECRET=your_vtiger_api_secret
```

### Générer les secrets

```bash
# Générer des secrets aléatoires sécurisés
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Ou avec openssl
openssl rand -base64 32
```

### .env.local (Développement)

```bash
# Copier depuis .env.example
cp .env.example .env.local

# Éditer avec vos valeurs
nano .env.local
```

---

## 🚀 Démarrage

### Développement

```bash
# 1. Première installation
git clone https://github.com/votre-username/mon-site-vitrine.git
cd mon-site-vitrine

# 2. Copier les variables d'environnement
cp .env.example .env.local

# 3. Générer les secrets Strapi
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
# Copier dans .env.local pour JWT_SECRET, etc.

# 4. Démarrer tous les services
docker compose up -d

# 5. Vérifier les logs
docker compose logs -f

# 6. Attendre que tout soit prêt
# - PostgreSQL: healthcheck OK
# - Strapi: "Server started on port 1337"
# - Next.js: "Ready on http://0.0.0.0:3000"

# 7. Accéder aux services
# Next.js: http://localhost:3000
# Strapi Admin: http://localhost:1337/admin
```

### Commandes utiles

```bash
# Démarrer
docker compose up -d

# Arrêter
docker compose down

# Arrêter et supprimer les volumes
docker compose down -v

# Voir les logs
docker compose logs -f

# Logs d'un service spécifique
docker compose logs -f strapi

# Rebuild après modification
docker compose up -d --build

# Entrer dans un container
docker compose exec strapi sh
docker compose exec postgres psql -U strapi -d launchpad_dev

# Voir l'état des services
docker compose ps

# Redémarrer un service
docker compose restart strapi
```

---

## 🐘 Migration vers PostgreSQL

### 1. Configuration Strapi pour PostgreSQL

```javascript
// strapi/config/database.js
module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST', 'localhost'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'strapi'),
      user: env('DATABASE_USERNAME', 'strapi'),
      password: env('DATABASE_PASSWORD', 'strapi'),
      ssl: env.bool('DATABASE_SSL', false) && {
        rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', true),
      },
    },
    debug: false,
    pool: {
      min: 2,
      max: 10,
      acquireTimeoutMillis: 30000,
      createTimeoutMillis: 30000,
      destroyTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
      reapIntervalMillis: 1000,
      createRetryIntervalMillis: 100,
    },
  },
});
```

### 2. Installer le driver PostgreSQL

```bash
# Dans le dossier strapi/
cd strapi
yarn add pg

# Supprimer better-sqlite3 (optionnel)
yarn remove better-sqlite3
```

### 3. Initialisation de la base

```sql
-- docker/postgres/init.sql
CREATE DATABASE launchpad_dev;

-- Créer un utilisateur si nécessaire
-- CREATE USER strapi WITH PASSWORD 'strapi_dev_2024';
-- GRANT ALL PRIVILEGES ON DATABASE launchpad_dev TO strapi;
```

### 4. Premier démarrage avec PostgreSQL

```bash
# 1. Supprimer l'ancien volume SQLite
docker compose down -v

# 2. Démarrer avec PostgreSQL
docker compose up -d

# 3. Strapi va créer automatiquement les tables
# Attendre la fin de la migration dans les logs
docker compose logs -f strapi

# 4. Créer le premier admin
# Aller sur http://localhost:1337/admin
```

### 5. Migration de données existantes (optionnel)

Si vous avez déjà des données dans SQLite :

```bash
# 1. Exporter depuis SQLite
cd strapi
yarn strapi export --file backup.tar.gz

# 2. Changer la config vers PostgreSQL

# 3. Importer dans PostgreSQL
yarn strapi import --file backup.tar.gz
```

---

## 🌐 Configuration Nginx (Production)

### nginx.conf

```nginx
# docker/nginx/nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream nextjs {
        server nextjs:3000;
    }

    upstream strapi {
        server strapi:1337;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=admin:10m rate=5r/s;

    # Cache
    proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=1g inactive=60m;

    server {
        listen 80;
        server_name votre-domaine.com www.votre-domaine.com;
        
        # Redirect to HTTPS
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name votre-domaine.com www.votre-domaine.com;

        # SSL
        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

        # Next.js frontend
        location / {
            proxy_pass http://nextjs;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Strapi API
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            
            proxy_pass http://strapi;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Strapi Admin (protégé)
        location /admin {
            limit_req zone=admin burst=10 nodelay;
            
            proxy_pass http://strapi;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Strapi uploads
        location /uploads/ {
            proxy_cache my_cache;
            proxy_cache_valid 200 1d;
            proxy_pass http://strapi;
        }

        # Gzip
        gzip on;
        gzip_vary on;
        gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    }
}
```

---

## 📦 Déploiement Production

### Étapes de déploiement

```bash
# 1. Sur votre serveur de production
ssh user@votre-serveur.com

# 2. Cloner le repo
git clone https://github.com/votre-username/mon-site-vitrine.git
cd mon-site-vitrine

# 3. Configurer les variables d'environnement
cp .env.example .env.production
nano .env.production

# IMPORTANT: Générer des secrets forts !
# JWT_SECRET, ADMIN_JWT_SECRET, etc.

# 4. Configurer les certificats SSL
mkdir -p docker/nginx/ssl
# Copier vos certificats SSL
# - fullchain.pem
# - privkey.pem

# 5. Build et démarrage
docker compose -f docker-compose.prod.yml up -d --build

# 6. Vérifier les logs
docker compose -f docker-compose.prod.yml logs -f

# 7. Créer le premier admin Strapi
# Aller sur https://votre-domaine.com/admin
```

### Script de déploiement automatique

```bash
#!/bin/bash
# deploy.sh

set -e

echo "🚀 Déploiement en production..."

# Pull latest code
git pull origin main

# Build images
docker compose -f docker-compose.prod.yml build

# Stop old containers
docker compose -f docker-compose.prod.yml down

# Start new containers
docker compose -f docker-compose.prod.yml up -d

# Wait for health checks
echo "⏳ Attente du démarrage des services..."
sleep 10

# Check health
docker compose -f docker-compose.prod.yml ps

echo "✅ Déploiement terminé!"
echo "Site: https://votre-domaine.com"
echo "Admin: https://votre-domaine.com/admin"
```

---

## 🔄 CI/CD avec GitHub Actions

### .github/workflows/deploy.yml

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Deploy to server
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /path/to/mon-site-vitrine
            git pull origin main
            docker compose -f docker-compose.prod.yml up -d --build
            docker compose -f docker-compose.prod.yml ps

      - name: Notify success
        if: success()
        run: echo "✅ Déploiement réussi!"

      - name: Notify failure
        if: failure()
        run: echo "❌ Échec du déploiement"
```

---

## 🔍 Monitoring et Logs

### Voir les logs en temps réel

```bash
# Tous les services
docker compose logs -f

# Service spécifique
docker compose logs -f strapi
docker compose logs -f nextjs
docker compose logs -f postgres

# Dernières 100 lignes
docker compose logs --tail=100 strapi
```

### Exporter les logs

```bash
# Exporter dans un fichier
docker compose logs > logs_$(date +%Y%m%d).txt

# Logs d'un service spécifique
docker compose logs strapi > strapi_logs.txt
```

### Monitoring avec Docker stats

```bash
# Voir l'utilisation CPU/RAM en temps réel
docker stats

# Ou pour vos containers seulement
docker stats launchpad-nextjs launchpad-strapi launchpad-postgres
```

---

## 🛡️ Sécurité

### Checklist de sécurité

- [ ] Variables d'environnement sécurisées (secrets forts)
- [ ] SSL/TLS configuré (HTTPS)
- [ ] Nginx avec rate limiting
- [ ] PostgreSQL pas exposé sur internet (port interne uniquement)
- [ ] Strapi admin protégé par mot de passe fort
- [ ] Firewall configuré (UFW sur Linux)
- [ ] Backups automatiques configurés
- [ ] Updates régulières des images Docker

### Configurer le firewall

```bash
# UFW (Ubuntu/Debian)
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable

# Vérifier
sudo ufw status
```

---

## 💾 Backups

### Backup automatique PostgreSQL

```bash
# backup.sh
#!/bin/bash

BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/launchpad_$DATE.sql.gz"

# Créer le backup
docker compose exec -T postgres pg_dump -U strapi launchpad_prod | gzip > $BACKUP_FILE

# Garder seulement les 7 derniers jours
find $BACKUP_DIR -name "launchpad_*.sql.gz" -mtime +7 -delete

echo "✅ Backup créé: $BACKUP_FILE"
```

### Cron pour backups quotidiens

```bash
# Éditer crontab
crontab -e

# Ajouter (tous les jours à 2h du matin)
0 2 * * * /path/to/backup.sh >> /var/log/backup.log 2>&1
```

### Restaurer un backup

```bash
# 1. Décompresser
gunzip launchpad_20241123.sql.gz

# 2. Restaurer
docker compose exec -T postgres psql -U strapi launchpad_prod < launchpad_20241123.sql
```

---

## 🔧 Troubleshooting

### Problème: Container ne démarre pas

```bash
# Voir les logs détaillés
docker compose logs strapi

# Vérifier la configuration
docker compose config

# Recréer le container
docker compose up -d --force-recreate strapi
```

### Problème: PostgreSQL connection refused

```bash
# Vérifier que PostgreSQL est prêt
docker compose exec postgres pg_isready -U strapi

# Vérifier les logs
docker compose logs postgres

# Redémarrer PostgreSQL
docker compose restart postgres
```

### Problème: Port déjà utilisé

```bash
# Trouver quel process utilise le port
sudo lsof -i :3000
sudo lsof -i :1337

# Tuer le process
kill -9 <PID>

# Ou changer le port dans docker-compose.yml
```

### Problème: Espace disque plein

```bash
# Voir l'utilisation Docker
docker system df

# Nettoyer les images inutilisées
docker system prune -a

# Nettoyer les volumes non utilisés
docker volume prune
```

---

## 📚 Ressources

### Documentation

- [Docker Compose](https://docs.docker.com/compose/)
- [PostgreSQL Docker](https://hub.docker.com/_/postgres)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [Next.js Docker](https://nextjs.org/docs/deployment#docker-image)
- [Strapi Docker](https://docs.strapi.io/dev-docs/installation/docker)

### Outils utiles

- [Portainer](https://www.portainer.io/) - Interface UI pour Docker
- [Watchtower](https://containrrr.dev/watchtower/) - Auto-update containers
- [Traefik](https://traefik.io/) - Alternative à Nginx avec Let's Encrypt auto

---

## ✅ Checklist finale

### Avant de déployer en production

- [ ] Tests locaux passent
- [ ] Variables d'environnement configurées
- [ ] Secrets générés (forts et uniques)
- [ ] SSL/TLS configuré
- [ ] Backups configurés
- [ ] Monitoring en place
- [ ] Firewall configuré
- [ ] DNS pointant vers le serveur
- [ ] Nginx configuré correctement
- [ ] Tests de charge effectués

### Après déploiement

- [ ] Vérifier tous les services démarrent
- [ ] Tester le site frontend
- [ ] Tester l'admin Strapi
- [ ] Vérifier les logs (pas d'erreurs)
- [ ] Tester le formulaire contact
- [ ] Vérifier l'intégration Vtiger
- [ ] Test de restauration de backup
- [ ] Configurer les alertes

---

**Votre site est maintenant en production ! 🎉**

**Support et maintenance :**
- Vérifier les logs quotidiennement
- Backups automatiques testés
- Updates régulières des images
- Monitoring de l'espace disque

**Bon déploiement ! 🚀**