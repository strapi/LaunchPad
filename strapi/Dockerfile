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

# Rendre le script d'extraction exécutable
RUN chmod +x /opt/app/scripts/extract-uploads.sh

# Installer les dépendances (sans --frozen-lockfile pour permettre la mise à jour)
RUN yarn install

# Copier le reste du code
COPY . .

# Créer le dossier public avec les bonnes permissions AVANT le build
RUN mkdir -p /opt/app/public/uploads && \
    chmod -R 777 /opt/app/public

# Construire l'application Strapi
RUN yarn build

# S'assurer que les permissions sont toujours là après le build
RUN chmod -R 777 /opt/app/public

# Créer un script de démarrage qui gère les permissions, le seeding et l'extraction des uploads
RUN printf '#!/bin/sh\n\
set -e\n\
\n\
# Créer et définir les permissions pour le dossier public\n\
mkdir -p /opt/app/public/uploads\n\
chmod -R 777 /opt/app/public\n\
\n\
# Exécuter le seed et extraire les uploads si demandé\n\
if [ "$SEED_DB" = "true" ]; then\n\
  echo "Starting database seeding..."\n\
  yarn seed:fixed || echo "Seed failed or already completed, continuing..."\n\
  \n\
  # Appeler le script d extraction des uploads\n\
  echo ""\n\
  /opt/app/scripts/extract-uploads.sh\n\
  echo ""\n\
fi\n\
\n\
# Démarrer Strapi\n\
echo "Starting Strapi..."\n\
exec yarn start\n' > /opt/app/start.sh && chmod +x /opt/app/start.sh

# Exposer le port par défaut de Strapi
EXPOSE 1337

# Utiliser le script de démarrage
CMD ["/opt/app/start.sh"]
