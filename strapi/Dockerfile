# Utiliser Node.js LTS
FROM node:20-alpine

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

# Copier les fichiers de dépendances
COPY package.json yarn.lock* ./

# Installer les dépendances
RUN yarn install --frozen-lockfile

# Copier le reste du code
COPY . .

# Construire l'application Strapi
RUN yarn build

# Exposer le port par défaut de Strapi
EXPOSE 1337

# Script de démarrage
CMD ["sh", "-c", "if [ \"$SEED_DB\" = \"true\" ]; then yarn seed; fi && yarn start"]
