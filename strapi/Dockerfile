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

# Construire l'application Strapi
RUN yarn build

# Créer un script de démarrage qui gère les permissions et le seeding
RUN printf '#!/bin/sh\n\
set -e\n\
\n\
# Créer et définir les permissions pour le dossier public\n\
mkdir -p /opt/app/public/uploads\n\
chmod -R 777 /opt/app/public\n\
\n\
# Exécuter le seed si demandé\n\
if [ "$SEED_DB" = "true" ]; then\n\
  echo "Starting database seeding..."\n\
  yes y | yarn seed || echo "Seed failed or already completed, continuing..."\n\
fi\n\
\n\
# Démarrer Strapi\n\
echo "Starting Strapi..."\n\
exec yarn start\n' > /opt/app/start.sh && chmod +x /opt/app/start.sh

# Exposer le port par défaut de Strapi
EXPOSE 1337

# Utiliser le script de démarrage
CMD ["/opt/app/start.sh"]
