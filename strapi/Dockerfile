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

# Copier les fichiers de dépendances
COPY package.json yarn.lock* ./

# Installer les dépendances
RUN yarn install --frozen-lockfile

# Copier le reste du code
COPY . .

# Créer les dossiers nécessaires
RUN mkdir -p /opt/app/data \
    /opt/app/public/uploads \
    /opt/app/scripts

# Copier les scripts d'import
COPY scripts/import-sql.sh /opt/app/scripts/import-sql.sh
COPY scripts/entrypoint.sh /opt/app/scripts/entrypoint.sh

# Si vous avez extract-uploads.sh, le copier aussi
# COPY scripts/extract-uploads.sh /opt/app/scripts/extract-uploads.sh

# Rendre les scripts exécutables
RUN chmod +x /opt/app/scripts/*.sh

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
