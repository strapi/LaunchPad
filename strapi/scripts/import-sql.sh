#!/bin/bash

# Script d'import SQL pour restaurer la base de données Strapi depuis un dump PostgreSQL
# Ce script remplace l'import natif de Strapi qui échoue avec des erreurs de schéma

set -e

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  IMPORT SQL DIRECT DANS POSTGRESQL${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}\n"

# Variables d'environnement
DB_HOST="${DATABASE_HOST:-postgres}"
DB_PORT="${DATABASE_PORT:-5432}"
DB_NAME="${DATABASE_NAME:-strapi}"
DB_USER="${DATABASE_USERNAME:-strapi}"
DB_PASSWORD="${DATABASE_PASSWORD:-strapi}"
SQL_FILE="${SQL_FILE:-/opt/app/data/strapi_backup.sql}"

# Fonction pour exécuter des requêtes SQL
execute_sql() {
    PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "$1" 2>&1
}

# Fonction pour vérifier la connexion
check_connection() {
    echo -e "${YELLOW}Vérification de la connexion à PostgreSQL...${NC}"

    MAX_RETRIES=30
    RETRY_COUNT=0

    while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
        if PGPASSWORD="$DB_PASSWORD" pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" > /dev/null 2>&1; then
            echo -e "${GREEN}✓ Connexion établie${NC}\n"
            return 0
        fi

        RETRY_COUNT=$((RETRY_COUNT + 1))
        echo -e "${YELLOW}Tentative $RETRY_COUNT/$MAX_RETRIES...${NC}"
        sleep 2
    done

    echo -e "${RED}✗ Impossible de se connecter à PostgreSQL après $MAX_RETRIES tentatives${NC}"
    exit 1
}

# Fonction pour nettoyer la base de données
clean_database() {
    echo -e "${YELLOW}───────────────────────────────────────────────────────────${NC}"
    echo -e "${YELLOW}ÉTAPE 1: Nettoyage de la base de données${NC}"
    echo -e "${YELLOW}───────────────────────────────────────────────────────────${NC}\n"

    echo "Suppression de toutes les tables existantes..."

    # Supprimer toutes les tables (attention: destructif!)
    PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" << 'EOF'
DO $$
DECLARE
    r RECORD;
BEGIN
    -- Désactiver les contraintes de clés étrangères
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;

    -- Supprimer les séquences
    FOR r IN (SELECT sequence_name FROM information_schema.sequences WHERE sequence_schema = 'public') LOOP
        EXECUTE 'DROP SEQUENCE IF EXISTS ' || quote_ident(r.sequence_name) || ' CASCADE';
    END LOOP;
END $$;
EOF

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Base de données nettoyée${NC}\n"
    else
        echo -e "${RED}✗ Erreur lors du nettoyage${NC}\n"
        exit 1
    fi
}

# Fonction pour importer le SQL
import_sql() {
    echo -e "${YELLOW}───────────────────────────────────────────────────────────${NC}"
    echo -e "${YELLOW}ÉTAPE 2: Import du fichier SQL${NC}"
    echo -e "${YELLOW}───────────────────────────────────────────────────────────${NC}\n"

    if [ ! -f "$SQL_FILE" ]; then
        echo -e "${RED}✗ Fichier SQL non trouvé: $SQL_FILE${NC}"
        exit 1
    fi

    echo "Fichier SQL: $SQL_FILE"
    FILE_SIZE=$(du -h "$SQL_FILE" | cut -f1)
    echo "Taille: $FILE_SIZE"
    echo ""
    echo "Import en cours (cela peut prendre quelques minutes)..."

    PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$SQL_FILE" 2>&1 | \
        grep -v "NOTICE" | \
        grep -v "already exists" | \
        grep -v "does not exist, skipping" || true

    if [ ${PIPESTATUS[0]} -eq 0 ]; then
        echo -e "\n${GREEN}✓ Import SQL réussi${NC}\n"
    else
        echo -e "\n${RED}✗ Erreur lors de l'import SQL${NC}\n"
        exit 1
    fi
}

# Fonction pour vérifier les données importées
verify_import() {
    echo -e "${YELLOW}───────────────────────────────────────────────────────────${NC}"
    echo -e "${YELLOW}ÉTAPE 3: Vérification des données importées${NC}"
    echo -e "${YELLOW}───────────────────────────────────────────────────────────${NC}\n"

    echo -e "📊 Résumé de l'import:\n"

    # Liste des tables à vérifier
    TABLES=(
        "logos:Logos"
        "globals:Globals (navbar)"
        "articles:Articles"
        "pages:Pages"
        "services:Services"
        "products:Products"
        "team_members:Team Members"
        "files:Files (media)"
        "strapi_core_store_settings:Strapi Config"
        "up_users:Users"
    )

    TOTAL_ROWS=0

    for TABLE_INFO in "${TABLES[@]}"; do
        IFS=':' read -r TABLE LABEL <<< "$TABLE_INFO"

        COUNT=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM $TABLE;" 2>/dev/null | xargs || echo "0")

        if [ "$COUNT" != "0" ] && [ -n "$COUNT" ]; then
            TOTAL_ROWS=$((TOTAL_ROWS + COUNT))
            printf "  ${GREEN}✅${NC} %-30s %5s rows\n" "$LABEL" "$COUNT"
        else
            printf "  ${YELLOW}⚠️${NC}  %-30s %5s rows\n" "$LABEL" "0"
        fi
    done

    echo ""
    echo -e "${YELLOW}───────────────────────────────────────────────────────────${NC}\n"

    if [ $TOTAL_ROWS -gt 0 ]; then
        echo -e "${GREEN}✅ SUCCÈS: $TOTAL_ROWS lignes importées au total${NC}\n"
        echo -e "${GREEN}🎉 L'import a réussi! La base de données est prête.${NC}\n"
        return 0
    else
        echo -e "${RED}❌ ÉCHEC: Aucune donnée n'a été importée.${NC}\n"
        return 1
    fi
}

# Exécution principale
main() {
    check_connection

    # Demander confirmation si pas en mode automatique
    if [ "$AUTO_CONFIRM" != "yes" ]; then
        echo -e "${RED}⚠️  ATTENTION: Cette opération va supprimer toutes les données existantes!${NC}"
        echo -n "Voulez-vous continuer? (yes/no): "
        read -r CONFIRM

        if [ "$CONFIRM" != "yes" ]; then
            echo "Opération annulée."
            exit 0
        fi
        echo ""
    fi

    clean_database
    import_sql
    verify_import

    EXIT_CODE=$?

    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}\n"

    exit $EXIT_CODE
}

main
