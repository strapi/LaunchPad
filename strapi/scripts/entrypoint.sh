#!/bin/bash

set -e

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  STRAPI CONTAINER STARTUP${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}\n"

# Attendre que PostgreSQL soit prêt
echo -e "${YELLOW}Waiting for PostgreSQL...${NC}"
while ! PGPASSWORD="$DATABASE_PASSWORD" pg_isready -h "$DATABASE_HOST" -p "$DATABASE_PORT" -U "$DATABASE_USERNAME" -d "$DATABASE_NAME" > /dev/null 2>&1; do
    echo -e "${YELLOW}PostgreSQL is unavailable - sleeping${NC}"
    sleep 2
done
echo -e "${GREEN}✓ PostgreSQL is ready${NC}\n"

# Vérifier si on doit faire l'import SQL
if [ "$SEED_DB" = "true" ] || [ "$IMPORT_SQL" = "true" ]; then
    SQL_FILE="/opt/app/data/strapi_backup.sql"

    if [ -f "$SQL_FILE" ]; then
        echo -e "${YELLOW}SQL backup file found, starting import...${NC}\n"

        # Vérifier si la base est vide ou si on force l'import
        TABLE_COUNT=$(PGPASSWORD="$DATABASE_PASSWORD" psql -h "$DATABASE_HOST" -p "$DATABASE_PORT" -U "$DATABASE_USERNAME" -d "$DATABASE_NAME" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" 2>/dev/null | xargs || echo "0")

        if [ "$TABLE_COUNT" = "0" ] || [ "$FORCE_IMPORT" = "true" ]; then
            echo -e "${YELLOW}Running SQL import...${NC}\n"
            AUTO_CONFIRM=yes /opt/app/scripts/import-sql.sh

            if [ $? -eq 0 ]; then
                echo -e "${GREEN}✓ SQL import completed successfully${NC}\n"
            else
                echo -e "\033[0;31m✗ SQL import failed${NC}\n"
                exit 1
            fi
        else
            echo -e "${GREEN}✓ Database already contains data, skipping import${NC}"
            echo -e "${YELLOW}  (Use FORCE_IMPORT=true to force reimport)${NC}\n"
        fi
    else
        echo -e "${YELLOW}⚠️  SQL backup file not found at $SQL_FILE${NC}"
        echo -e "${YELLOW}  Skipping import, Strapi will start with empty database${NC}\n"
    fi
fi

# Extraire les uploads si nécessaire
echo -e "${YELLOW}Checking for uploads...${NC}"

# Option 1: Archive uploads.tar.gz préparée
if [ -f "/opt/app/data/uploads.tar.gz" ]; then
    echo -e "${YELLOW}Found uploads.tar.gz, extracting...${NC}"

    if [ ! -d "/opt/app/public/uploads" ] || [ -z "$(ls -A /opt/app/public/uploads 2>/dev/null)" ]; then
        mkdir -p /opt/app/public/uploads
        tar -xzf /opt/app/data/uploads.tar.gz -C /opt/app/public/
        chmod -R 777 /opt/app/public/uploads

        UPLOAD_COUNT=$(find /opt/app/public/uploads -type f 2>/dev/null | wc -l)
        echo -e "${GREEN}✓ Uploads extracted: $UPLOAD_COUNT files${NC}\n"
    else
        UPLOAD_COUNT=$(find /opt/app/public/uploads -type f 2>/dev/null | wc -l)
        echo -e "${GREEN}✓ Uploads already present: $UPLOAD_COUNT files${NC}\n"
    fi

# Option 2: Archive Strapi export complète (fallback)
elif [ -f "/opt/app/data/export_20250116105447.tar.gz" ]; then
    echo -e "${YELLOW}Found Strapi export archive, extracting uploads from it...${NC}"

    EXPORT_ARCHIVE="/opt/app/data/export_20250116105447.tar.gz"
    TEMP_DIR="/tmp/strapi-extract"
    TARGET_DIR="/opt/app/public/uploads"

    # Créer le dossier temporaire
    mkdir -p "$TEMP_DIR"

    # Extraire l'archive
    echo -e "${YELLOW}Extracting archive...${NC}"
    tar -xzf "$EXPORT_ARCHIVE" -C "$TEMP_DIR" 2>/dev/null || {
        echo -e "${RED}✗ Failed to extract archive${NC}"
        rm -rf "$TEMP_DIR"
    }

    # Trouver le dossier assets/uploads
    UPLOADS_DIR=$(find "$TEMP_DIR" -type d -path "*/assets/uploads" 2>/dev/null | head -1)

    if [ -n "$UPLOADS_DIR" ] && [ -d "$UPLOADS_DIR" ]; then
        mkdir -p "$TARGET_DIR"
        SOURCE_COUNT=$(find "$UPLOADS_DIR" -type f 2>/dev/null | wc -l)

        echo -e "${YELLOW}Copying $SOURCE_COUNT files...${NC}"
        cp -r "$UPLOADS_DIR"/* "$TARGET_DIR/" 2>/dev/null || true
        chmod -R 777 "$TARGET_DIR"

        TARGET_COUNT=$(find "$TARGET_DIR" -type f 2>/dev/null | wc -l)
        echo -e "${GREEN}✓ Uploads extracted: $TARGET_COUNT files${NC}\n"
    else
        echo -e "${YELLOW}⚠️  No uploads directory found in archive${NC}\n"
    fi

    # Nettoyer
    rm -rf "$TEMP_DIR"
else
    echo -e "${YELLOW}⚠️  No upload archives found${NC}"
    echo -e "${YELLOW}  Looking for:${NC}"
    echo -e "${YELLOW}    - /opt/app/data/uploads.tar.gz${NC}"
    echo -e "${YELLOW}    - /opt/app/data/export_20250116105447.tar.gz${NC}\n"
fi

echo -e "${BLUE}Starting Strapi...${NC}\n"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}\n"

# Détecter si on utilise Yarn ou npm
if [ -f "yarn.lock" ]; then
    echo -e "${YELLOW}Detected Yarn project${NC}\n"
    PACKAGE_MANAGER="yarn"
elif [ -f "package-lock.json" ]; then
    echo -e "${YELLOW}Detected npm project${NC}\n"
    PACKAGE_MANAGER="npm"
else
    echo -e "${YELLOW}No lock file found, defaulting to yarn${NC}\n"
    PACKAGE_MANAGER="yarn"
fi

# Si la commande est "npm start" ou "yarn start", utiliser le bon gestionnaire
if [ "$1" = "npm" ] && [ "$2" = "start" ]; then
    exec yarn start
elif [ "$1" = "yarn" ] || [ "$1" = "npm" ]; then
    # Exécuter la commande telle quelle
    exec "$@"
else
    # Commande personnalisée
    exec "$@"
fi
