#!/bin/bash

# Script pour nettoyer et réparer un dump PostgreSQL avec des problèmes de contraintes FK
# Spécialement pour Strapi avec users-permissions

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  NETTOYAGE DU DUMP SQL STRAPI${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}\n"

INPUT_FILE="${1:-strapi_backup.sql}"
OUTPUT_FILE="${2:-strapi_backup_clean.sql}"

if [ ! -f "$INPUT_FILE" ]; then
    echo -e "${RED}✗ Fichier non trouvé: $INPUT_FILE${NC}"
    exit 1
fi

echo -e "${YELLOW}Fichier source:${NC} $INPUT_FILE"
echo -e "${YELLOW}Fichier de sortie:${NC} $OUTPUT_FILE"
echo -e ""

# Créer un fichier temporaire
TEMP_FILE=$(mktemp)

echo -e "${YELLOW}Étape 1: Copie et nettoyage de base...${NC}"

# Copier le fichier en supprimant les lignes problématiques
grep -v "SET idle_in_transaction_session_timeout" "$INPUT_FILE" | \
grep -v "SET default_table_access_method" > "$TEMP_FILE" || true

echo -e "${GREEN}✓ Nettoyage de base effectué${NC}\n"

echo -e "${YELLOW}Étape 2: Création du script de nettoyage des contraintes...${NC}"

# Créer le fichier final avec les commandes de nettoyage
cat > "$OUTPUT_FILE" << 'EOF'
-- ═══════════════════════════════════════════════════════════
-- STRAPI DATABASE IMPORT - Version nettoyée
-- ═══════════════════════════════════════════════════════════

-- Désactiver temporairement les contraintes
SET session_replication_role = replica;

EOF

# Ajouter le contenu nettoyé
cat "$TEMP_FILE" >> "$OUTPUT_FILE"

# Ajouter un script de nettoyage post-import
cat >> "$OUTPUT_FILE" << 'EOF'

-- ═══════════════════════════════════════════════════════════
-- POST-IMPORT CLEANUP
-- ═══════════════════════════════════════════════════════════

-- Nettoyer les références orphelines dans up_permissions_role_lnk
DELETE FROM up_permissions_role_lnk
WHERE permission_id NOT IN (SELECT id FROM up_permissions);

DELETE FROM up_permissions_role_lnk
WHERE role_id NOT IN (SELECT id FROM up_roles);

-- Nettoyer les références orphelines dans up_users_role_lnk
DELETE FROM up_users_role_lnk
WHERE user_id NOT IN (SELECT id FROM up_users);

DELETE FROM up_users_role_lnk
WHERE role_id NOT IN (SELECT id FROM up_roles);

-- Nettoyer admin_permissions_role_lnk
DELETE FROM admin_permissions_role_lnk
WHERE permission_id NOT IN (SELECT id FROM admin_permissions);

DELETE FROM admin_permissions_role_lnk
WHERE role_id NOT IN (SELECT id FROM admin_roles);

-- Réactiver les contraintes
SET session_replication_role = DEFAULT;

-- Afficher un résumé
DO $$
DECLARE
    up_perms_count INTEGER;
    up_roles_count INTEGER;
    up_users_count INTEGER;
    admin_users_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO up_perms_count FROM up_permissions;
    SELECT COUNT(*) INTO up_roles_count FROM up_roles;
    SELECT COUNT(*) INTO up_users_count FROM up_users;
    SELECT COUNT(*) INTO admin_users_count FROM admin_users;

    RAISE NOTICE '';
    RAISE NOTICE '═══════════════════════════════════════════════════════════';
    RAISE NOTICE 'IMPORT RÉUSSI - Résumé des données users-permissions:';
    RAISE NOTICE '═══════════════════════════════════════════════════════════';
    RAISE NOTICE 'Permissions: %', up_perms_count;
    RAISE NOTICE 'Roles: %', up_roles_count;
    RAISE NOTICE 'Users: %', up_users_count;
    RAISE NOTICE 'Admin Users: %', admin_users_count;
    RAISE NOTICE '═══════════════════════════════════════════════════════════';
END $$;
EOF

# Nettoyer
rm "$TEMP_FILE"

FILE_SIZE=$(du -h "$OUTPUT_FILE" | cut -f1)
echo -e "${GREEN}✓ Script de nettoyage ajouté${NC}\n"

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ NETTOYAGE TERMINÉ${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}\n"

echo -e "${YELLOW}Fichier nettoyé:${NC} $OUTPUT_FILE"
echo -e "${YELLOW}Taille:${NC} $FILE_SIZE"
echo -e ""
echo -e "${YELLOW}Utilisez ce fichier pour l'import:${NC}"
echo -e "  cp $OUTPUT_FILE strapi/data/strapi_backup.sql"
echo -e ""
