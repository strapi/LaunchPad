# Utiliser Node.js 22
FROM node:22-alpine

# Installer les dépendances système nécessaires
RUN apk update && apk add --no-cache \
    build-base \
    gcc \
    autoconf \
    automake \
    zlib-dev \
    libpng-dev \
    vips-dev \
    git \
    python3 \
    postgresql-client \
    bash

# Définir le répertoire de travail
WORKDIR /opt/app

# Activer Corepack pour Yarn
RUN corepack enable

# Copier TOUS les fichiers de configuration Yarn d'abord
COPY package.json yarn.lock .yarnrc.yml* ./

# Copier aussi .yarn/ si présent (pour Yarn 4 PnP)
# COPY .yarn .yarn 2>/dev/null || true

# Copier les scripts nécessaires pour le postinstall
COPY scripts ./scripts

# Installer les dépendances
# Yarn 4 utilise --immutable au lieu de --frozen-lockfile
RUN yarn install --immutable || yarn install

# Copier le reste du code
COPY . .

# Créer les dossiers nécessaires
RUN mkdir -p /opt/app/data \
    /opt/app/public/uploads \
    /opt/app/scripts

# S'assurer que les scripts sont bien présents et exécutables
RUN chmod +x /opt/app/scripts/*.sh 2>/dev/null || true

# Construire l'application Strapi
ENV NODE_ENV=production
RUN yarn build

# S'assurer que les permissions sont correctes
RUN chmod -R 777 /opt/app/public

# Exposer le port par défaut de Strapi
EXPOSE 1337

# Utiliser le script de démarrage personnalisé
ENTRYPOINT ["/opt/app/scripts/entrypoint.sh"]
CMD ["yarn", "start"]
