#!/bin/bash

# Script pour extraire les uploads depuis une archive tar.gz d'export Strapi
# et les préparer pour l'import SQL

set -e

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  EXTRACTION DES UPLOADS DEPUIS L'ARCHIVE STRAPI${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}\n"

# Paramètres
EXPORT_ARCHIVE="${1:-./data/export_20250116105447.tar.gz}"
OUTPUT_DIR="${2:-./uploads-extracted}"
UPLOADS_ARCHIVE="${3:-./uploads.tar.gz}"

if [ ! -f "$EXPORT_ARCHIVE" ]; then
    echo -e "${RED}✗ Archive non trouvée: $EXPORT_ARCHIVE${NC}"
    exit 1
fi

echo -e "${YELLOW}Archive source:${NC} $EXPORT_ARCHIVE"
echo -e "${YELLOW}Dossier de sortie:${NC} $OUTPUT_DIR"
echo -e "${YELLOW}Archive uploads finale:${NC} $UPLOADS_ARCHIVE"
echo ""

# Créer un dossier temporaire
TEMP_DIR=$(mktemp -d)
echo -e "${YELLOW}Extraction dans le dossier temporaire: $TEMP_DIR${NC}"

# Extraire l'archive Strapi
echo -e "${YELLOW}Extraction de l'archive Strapi...${NC}"
tar -xzf "$EXPORT_ARCHIVE" -C "$TEMP_DIR"

# Chercher le dossier uploads
UPLOADS_PATH=""

if [ -d "$TEMP_DIR/uploads" ]; then
    UPLOADS_PATH="$TEMP_DIR/uploads"
elif [ -d "$TEMP_DIR/public/uploads" ]; then
    UPLOADS_PATH="$TEMP_DIR/public/uploads"
else
    # Chercher récursivement
    UPLOADS_PATH=$(find "$TEMP_DIR" -type d -name "uploads" | head -n 1)
fi

if [ -z "$UPLOADS_PATH" ] || [ ! -d "$UPLOADS_PATH" ]; then
    echo -e "${RED}✗ Dossier uploads non trouvé dans l'archive${NC}"
    rm -rf "$TEMP_DIR"
    exit 1
fi

echo -e "${GREEN}✓ Dossier uploads trouvé: $UPLOADS_PATH${NC}"

# Compter les fichiers
FILE_COUNT=$(find "$UPLOADS_PATH" -type f | wc -l)
echo -e "${GREEN}✓ Nombre de fichiers: $FILE_COUNT${NC}"

if [ $FILE_COUNT -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Aucun fichier trouvé dans le dossier uploads${NC}"
    rm -rf "$TEMP_DIR"
    exit 0
fi

# Copier vers le dossier de sortie
echo -e "${YELLOW}Copie des fichiers...${NC}"
mkdir -p "$OUTPUT_DIR"
cp -r "$UPLOADS_PATH"/* "$OUTPUT_DIR/"

echo -e "${GREEN}✓ Fichiers copiés vers $OUTPUT_DIR${NC}"

# Créer une archive tar.gz des uploads
echo -e "${YELLOW}Création de l'archive uploads.tar.gz...${NC}"
cd "$(dirname "$OUTPUT_DIR")"
tar -czf "$UPLOADS_ARCHIVE" -C "$(basename "$OUTPUT_DIR")" .

ARCHIVE_SIZE=$(du -h "$UPLOADS_ARCHIVE" | cut -f1)
echo -e "${GREEN}✓ Archive créée: $UPLOADS_ARCHIVE ($ARCHIVE_SIZE)${NC}"

# Nettoyage
echo -e "${YELLOW}Nettoyage...${NC}"
rm -rf "$TEMP_DIR"

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ EXTRACTION TERMINÉE${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}Fichiers extraits dans:${NC} $OUTPUT_DIR"
echo -e "${YELLOW}Archive créée:${NC} $UPLOADS_ARCHIVE"
echo ""
echo -e "${YELLOW}Pour utiliser avec Docker:${NC}"
echo "1. Placer $UPLOADS_ARCHIVE dans le dossier ./strapi/data/"
echo "2. Rebuild et redémarrer les conteneurs"
echo ""
