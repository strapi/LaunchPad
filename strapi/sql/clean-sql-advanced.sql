#!/usr/bin/env python3
"""
Script pour nettoyer un dump PostgreSQL Strapi en supprimant les références orphelines
"""

import re
import sys

def clean_sql_dump(input_file, output_file):
    print("═══════════════════════════════════════════════════════════")
    print("  NETTOYAGE AVANCÉ DU DUMP SQL STRAPI")
    print("═══════════════════════════════════════════════════════════\n")

    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()

    print(f"✓ Fichier chargé: {len(content)} caractères\n")

    # 1. Supprimer toutes les tables users-permissions (elles seront recréées par Strapi)
    print("Étape 1: Suppression des tables users-permissions...")

    # Supprimer les DROP/CREATE TABLE pour up_*
    content = re.sub(r'DROP TABLE.*?up_permissions.*?;', '', content, flags=re.DOTALL | re.IGNORECASE)
    content = re.sub(r'DROP TABLE.*?up_roles.*?;', '', content, flags=re.DOTALL | re.IGNORECASE)
    content = re.sub(r'DROP TABLE.*?up_users.*?;', '', content, flags=re.DOTALL | re.IGNORECASE)
    content = re.sub(r'CREATE TABLE.*?up_permissions.*?\);', '', content, flags=re.DOTALL | re.IGNORECASE)
    content = re.sub(r'CREATE TABLE.*?up_roles.*?\);', '', content, flags=re.DOTALL | re.IGNORECASE)
    content = re.sub(r'CREATE TABLE.*?up_users.*?\);', '', content, flags=re.DOTALL | re.IGNORECASE)

    # Supprimer les INSERT pour up_*
    content = re.sub(r'COPY.*?up_permissions.*?FROM stdin;.*?\\\.', '', content, flags=re.DOTALL | re.IGNORECASE)
    content = re.sub(r'COPY.*?up_roles.*?FROM stdin;.*?\\\.', '', content, flags=re.DOTALL | re.IGNORECASE)
    content = re.sub(r'COPY.*?up_users.*?FROM stdin;.*?\\\.', '', content, flags=re.DOTALL | re.IGNORECASE)
    content = re.sub(r'COPY.*?up_permissions_role_lnk.*?FROM stdin;.*?\\\.', '', content, flags=re.DOTALL | re.IGNORECASE)
    content = re.sub(r'COPY.*?up_users_role_lnk.*?FROM stdin;.*?\\\.', '', content, flags=re.DOTALL | re.IGNORECASE)

    print("✓ Tables users-permissions supprimées\n")

    # 2. Supprimer les tables admin_permissions (seront recréées)
    print("Étape 2: Suppression des tables admin_permissions...")

    content = re.sub(r'COPY.*?admin_permissions.*?FROM stdin;.*?\\\.', '', content, flags=re.DOTALL | re.IGNORECASE)
    content = re.sub(r'COPY.*?admin_permissions_role_lnk.*?FROM stdin;.*?\\\.', '', content, flags=re.DOTALL | re.IGNORECASE)

    print("✓ Tables admin_permissions supprimées\n")

    # 3. Ajouter un script de nettoyage en fin de fichier
    print("Étape 3: Ajout du script de nettoyage post-import...")

    cleanup_script = """

-- ═══════════════════════════════════════════════════════════
-- POST-IMPORT CLEANUP AUTOMATIQUE
-- ═══════════════════════════════════════════════════════════

-- Nettoyer toutes les tables de liaison de composants
DO $$
DECLARE
    link_table TEXT;
    parent_table TEXT;
    child_table TEXT;
    parent_col TEXT;
    child_col TEXT;
    cleaned INTEGER := 0;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '═══════════════════════════════════════════════════════════';
    RAISE NOTICE 'NETTOYAGE AUTOMATIQUE DES CONTRAINTES FK';
    RAISE NOTICE '═══════════════════════════════════════════════════════════';
    RAISE NOTICE '';

    -- Désactiver tous les triggers temporairement
    FOR link_table IN
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = 'public'
        AND (tablename LIKE '%_lnk' OR tablename LIKE 'components_%')
    LOOP
        BEGIN
            EXECUTE format('ALTER TABLE %I DISABLE TRIGGER ALL', link_table);
        EXCEPTION WHEN OTHERS THEN
            -- Ignorer les erreurs
        END;
    END LOOP;

    RAISE NOTICE 'Triggers désactivés';
    RAISE NOTICE '';

    -- Nettoyer les tables de liaison les plus communes
    BEGIN
        DELETE FROM components_global_navbars_logo_lnk
        WHERE navbar_id NOT IN (SELECT id FROM components_global_navbars WHERE id IS NOT NULL)
        OR logo_id NOT IN (SELECT id FROM logos WHERE id IS NOT NULL);
        GET DIAGNOSTICS cleaned = ROW_COUNT;
        RAISE NOTICE 'Nettoyé components_global_navbars_logo_lnk: % lignes', cleaned;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Erreur components_global_navbars_logo_lnk: %', SQLERRM;
    END;

    BEGIN
        DELETE FROM components_global_footers_logo_lnk
        WHERE footer_id NOT IN (SELECT id FROM components_global_footers WHERE id IS NOT NULL)
        OR logo_id NOT IN (SELECT id FROM logos WHERE id IS NOT NULL);
        GET DIAGNOSTICS cleaned = ROW_COUNT;
        RAISE NOTICE 'Nettoyé components_global_footers_logo_lnk: % lignes', cleaned;
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Erreur components_global_footers_logo_lnk: %', SQLERRM;
    END;

    -- Réactiver tous les triggers
    FOR link_table IN
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = 'public'
        AND (tablename LIKE '%_lnk' OR tablename LIKE 'components_%')
    LOOP
        BEGIN
            EXECUTE format('ALTER TABLE %I ENABLE TRIGGER ALL', link_table);
        EXCEPTION WHEN OTHERS THEN
            -- Ignorer les erreurs
        END;
    END LOOP;

    RAISE NOTICE '';
    RAISE NOTICE 'Triggers réactivés';
    RAISE NOTICE '';
    RAISE NOTICE '═══════════════════════════════════════════════════════════';
    RAISE NOTICE 'NETTOYAGE TERMINÉ';
    RAISE NOTICE '═══════════════════════════════════════════════════════════';
    RAISE NOTICE '';
END $$;

-- Réactiver les contraintes
SET session_replication_role = DEFAULT;
"""

    # Insérer le script de nettoyage avant le dernier SET
    content = content.replace('SET session_replication_role = DEFAULT;', cleanup_script)

    print("✓ Script de nettoyage ajouté\n")

    # 4. Écrire le fichier nettoyé
    print(f"Étape 4: Écriture du fichier nettoyé...")

    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"✓ Fichier écrit: {output_file}\n")

    print("═══════════════════════════════════════════════════════════")
    print("✅ NETTOYAGE TERMINÉ")
    print("═══════════════════════════════════════════════════════════\n")

    print(f"Fichier source:  {input_file}")
    print(f"Fichier nettoyé: {output_file}")
    print(f"Réduction:       {len(content)} caractères\n")

    return True

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python3 clean-sql-advanced.py input.sql [output.sql]")
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else 'strapi_backup_ultra_clean.sql'

    try:
        clean_sql_dump(input_file, output_file)
        print("✅ Succès! Vous pouvez maintenant utiliser le fichier nettoyé.")
        print(f"\nCommande pour l'utiliser:")
        print(f"  cp {output_file} strapi/data/strapi_backup.sql")
        print(f"  docker-compose down -v")
        print(f"  docker-compose up -d --build")
    except Exception as e:
        print(f"\n❌ Erreur: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
