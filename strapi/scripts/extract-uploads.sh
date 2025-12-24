#!/bin/sh
set -e

echo "================================================"
echo "Extracting uploads from Strapi export archive"
echo "================================================"

EXPORT_ARCHIVE="/opt/app/data/export_20250116105447.tar.gz"
TEMP_DIR="/tmp/strapi-extract"
TARGET_DIR="/opt/app/public/uploads"

# Vérifier que l'archive existe
if [ ! -f "$EXPORT_ARCHIVE" ]; then
    echo "❌ ERROR: Export archive not found at $EXPORT_ARCHIVE"
    exit 1
fi

echo "✓ Archive found: $EXPORT_ARCHIVE"

# Créer le dossier temporaire
mkdir -p "$TEMP_DIR"
echo "✓ Created temporary directory: $TEMP_DIR"

# Extraire l'archive
echo "📦 Extracting archive..."
tar -xzf "$EXPORT_ARCHIVE" -C "$TEMP_DIR"

# Trouver le dossier assets/uploads
UPLOADS_DIR=$(find "$TEMP_DIR" -type d -path "*/assets/uploads" | head -1)

if [ -z "$UPLOADS_DIR" ] || [ ! -d "$UPLOADS_DIR" ]; then
    echo "❌ ERROR: assets/uploads directory not found in archive"
    rm -rf "$TEMP_DIR"
    exit 1
fi

echo "✓ Uploads directory found: $UPLOADS_DIR"

# S'assurer que le dossier cible existe
mkdir -p "$TARGET_DIR"

# Compter les fichiers à copier
SOURCE_COUNT=$(find "$UPLOADS_DIR" -type f | wc -l)
echo "📂 Found $SOURCE_COUNT files to copy"

# Copier les fichiers
echo "📋 Copying files to $TARGET_DIR..."
cp -r "$UPLOADS_DIR"/* "$TARGET_DIR/" 2>/dev/null || true

# Corriger les permissions
chmod -R 777 "$TARGET_DIR"
echo "✓ Permissions set to 777"

# Compter les fichiers copiés
TARGET_COUNT=$(find "$TARGET_DIR" -type f | wc -l)
echo "✓ Successfully copied files to uploads directory"
echo "  - Source: $SOURCE_COUNT files"
echo "  - Target: $TARGET_COUNT files"

# Nettoyer le dossier temporaire
rm -rf "$TEMP_DIR"
echo "✓ Cleaned up temporary directory"

echo "================================================"
echo "✅ Uploads extraction completed successfully!"
echo "================================================"
