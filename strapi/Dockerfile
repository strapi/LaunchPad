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
    python3

# Définir le répertoire de travail
WORKDIR /opt/app

# Activer Corepack pour Yarn
RUN corepack enable

# Copier les fichiers de dépendances et les scripts nécessaires aux hooks
COPY package.json yarn.lock* ./
COPY scripts ./scripts

# Installer les dépendances (sans --frozen-lockfile pour permettre la mise à jour)
RUN yarn install

# Copier le reste du code
COPY . .

# Créer le dossier public et définir les permissions
RUN mkdir -p /opt/app/public/uploads && \
    chmod -R 777 /opt/app/public

# Construire l'application Strapi
RUN yarn build

# Exposer le port par défaut de Strapi
EXPOSE 1337

# Script de démarrage
CMD ["sh", "-c", "if [ \"$SEED_DB\" = \"true\" ]; then yes y | yarn seed; fi && yarn start"]