#!/bin/bash
set -e

DB=".tmp/data.db"
EXPORT_DIR="./exports"
DATE=$(date +"%Y%m%d_%H%M%S")
EXPORT_FILE="$EXPORT_DIR/strapi_export_$DATE.tar.gz"

echo "🚀 Strapi generic clean export (SQLite)"

if [ ! -f "$DB" ]; then
  echo "❌ DB SQLite introuvable : $DB"
  exit 1
fi

mkdir -p "$EXPORT_DIR"

echo "🔍 Détection des relations (FK) dans SQLite..."

TABLES=$(sqlite3 "$DB" "
SELECT name FROM sqlite_master
WHERE type='table'
AND name NOT LIKE 'sqlite_%';
")

for TABLE in $TABLES; do
  FKS=$(sqlite3 "$DB" "PRAGMA foreign_key_list($TABLE);")

  if [ -n "$FKS" ]; then
    echo "🧩 Table: $TABLE"

    echo "$FKS" | while read -r row; do
      REF_TABLE=$(echo "$row" | awk -F'|' '{print $3}')
      FROM_COL=$(echo "$row" | awk -F'|' '{print $4}')
      TO_COL=$(echo "$row" | awk -F'|' '{print $5}')

      echo "   🔗 $TABLE.$FROM_COL → $REF_TABLE.$TO_COL"

      sqlite3 "$DB" <<SQL
PRAGMA foreign_keys = OFF;
DELETE FROM "$TABLE"
WHERE "$FROM_COL" IS NOT NULL
AND "$FROM_COL" NOT IN (
  SELECT "$TO_COL" FROM "$REF_TABLE"
);
PRAGMA foreign_keys = ON;
SQL

    done
  fi
done

echo "✅ Nettoyage générique terminé"

echo "📦 Export Strapi..."
npx strapi export -f "$EXPORT_FILE"

echo "🎉 Export prêt : $EXPORT_FILE"
