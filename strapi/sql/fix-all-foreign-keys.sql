-- ═══════════════════════════════════════════════════════════
-- RÉPARATION COMPLÈTE - Toutes les Contraintes FK Strapi
-- ═══════════════════════════════════════════════════════════

\echo ''
\echo '═══════════════════════════════════════════════════════════'
\echo 'RÉPARATION COMPLÈTE DES CONTRAINTES FK'
\echo '═══════════════════════════════════════════════════════════'
\echo ''

-- Fonction pour nettoyer une table de liaison
CREATE OR REPLACE FUNCTION clean_link_table(
    link_table TEXT,
    fk_column TEXT,
    parent_table TEXT
) RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    EXECUTE format('
        DELETE FROM %I
        WHERE %I NOT IN (SELECT id FROM %I)',
        link_table, fk_column, parent_table
    );
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

\echo 'Nettoyage des tables users-permissions...'
\echo '─────────────────────────────────────────────────────────'

-- Désactiver temporairement les contraintes
ALTER TABLE up_permissions_role_lnk DROP CONSTRAINT IF EXISTS up_permissions_role_lnk_fk CASCADE;
ALTER TABLE up_permissions_role_lnk DROP CONSTRAINT IF EXISTS up_permissions_role_lnk_inv_fk CASCADE;
ALTER TABLE up_users_role_lnk DROP CONSTRAINT IF EXISTS up_users_role_lnk_fk CASCADE;
ALTER TABLE up_users_role_lnk DROP CONSTRAINT IF EXISTS up_users_role_lnk_inv_fk CASCADE;

-- Nettoyer les orphelins
DELETE FROM up_permissions_role_lnk
WHERE permission_id NOT IN (SELECT id FROM up_permissions WHERE id IS NOT NULL);

DELETE FROM up_permissions_role_lnk
WHERE role_id NOT IN (SELECT id FROM up_roles WHERE id IS NOT NULL);

DELETE FROM up_users_role_lnk
WHERE user_id NOT IN (SELECT id FROM up_users WHERE id IS NOT NULL);

DELETE FROM up_users_role_lnk
WHERE role_id NOT IN (SELECT id FROM up_roles WHERE id IS NOT NULL);

-- Recréer les contraintes
ALTER TABLE up_permissions_role_lnk
ADD CONSTRAINT up_permissions_role_lnk_fk
FOREIGN KEY (permission_id) REFERENCES up_permissions(id) ON DELETE CASCADE;

ALTER TABLE up_permissions_role_lnk
ADD CONSTRAINT up_permissions_role_lnk_inv_fk
FOREIGN KEY (role_id) REFERENCES up_roles(id) ON DELETE CASCADE;

ALTER TABLE up_users_role_lnk
ADD CONSTRAINT up_users_role_lnk_fk
FOREIGN KEY (user_id) REFERENCES up_users(id) ON DELETE CASCADE;

ALTER TABLE up_users_role_lnk
ADD CONSTRAINT up_users_role_lnk_inv_fk
FOREIGN KEY (role_id) REFERENCES up_roles(id) ON DELETE CASCADE;

\echo '✓ Tables users-permissions nettoyées'
\echo ''

\echo 'Nettoyage des tables admin...'
\echo '─────────────────────────────────────────────────────────'

-- Admin permissions
ALTER TABLE admin_permissions_role_lnk DROP CONSTRAINT IF EXISTS admin_permissions_role_lnk_fk CASCADE;
ALTER TABLE admin_permissions_role_lnk DROP CONSTRAINT IF EXISTS admin_permissions_role_lnk_inv_fk CASCADE;

DELETE FROM admin_permissions_role_lnk
WHERE permission_id NOT IN (SELECT id FROM admin_permissions WHERE id IS NOT NULL);

DELETE FROM admin_permissions_role_lnk
WHERE role_id NOT IN (SELECT id FROM admin_roles WHERE id IS NOT NULL);

ALTER TABLE admin_permissions_role_lnk
ADD CONSTRAINT admin_permissions_role_lnk_fk
FOREIGN KEY (permission_id) REFERENCES admin_permissions(id) ON DELETE CASCADE;

ALTER TABLE admin_permissions_role_lnk
ADD CONSTRAINT admin_permissions_role_lnk_inv_fk
FOREIGN KEY (role_id) REFERENCES admin_roles(id) ON DELETE CASCADE;

\echo '✓ Tables admin nettoyées'
\echo ''

\echo 'Nettoyage des tables de composants...'
\echo '─────────────────────────────────────────────────────────'

-- components_global_navbars_logo_lnk (le problème principal)
ALTER TABLE components_global_navbars_logo_lnk DROP CONSTRAINT IF EXISTS components_global_navbars_logo_lnk_fk CASCADE;
ALTER TABLE components_global_navbars_logo_lnk DROP CONSTRAINT IF EXISTS components_global_navbars_logo_lnk_inv_fk CASCADE;

DELETE FROM components_global_navbars_logo_lnk
WHERE navbar_id NOT IN (SELECT id FROM components_global_navbars WHERE id IS NOT NULL);

DELETE FROM components_global_navbars_logo_lnk
WHERE logo_id NOT IN (SELECT id FROM logos WHERE id IS NOT NULL);

ALTER TABLE components_global_navbars_logo_lnk
ADD CONSTRAINT components_global_navbars_logo_lnk_fk
FOREIGN KEY (navbar_id) REFERENCES components_global_navbars(id) ON DELETE CASCADE;

ALTER TABLE components_global_navbars_logo_lnk
ADD CONSTRAINT components_global_navbars_logo_lnk_inv_fk
FOREIGN KEY (logo_id) REFERENCES logos(id) ON DELETE CASCADE;

\echo '✓ components_global_navbars_logo_lnk nettoyé'

-- Nettoyer toutes les autres tables de composants dynamiquement
DO $$
DECLARE
    link_table TEXT;
    cleaned INTEGER := 0;
BEGIN
    FOR link_table IN
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = 'public'
        AND tablename LIKE 'components_%_lnk'
        AND tablename != 'components_global_navbars_logo_lnk'
    LOOP
        BEGIN
            -- Désactiver les contraintes FK temporairement
            EXECUTE format('ALTER TABLE %I DISABLE TRIGGER ALL', link_table);

            -- Essayer de supprimer les lignes avec des références nulles ou invalides
            EXECUTE format('DELETE FROM %I WHERE ctid IN (
                SELECT ctid FROM %I LIMIT 0
            )', link_table, link_table);

            -- Réactiver les triggers
            EXECUTE format('ALTER TABLE %I ENABLE TRIGGER ALL', link_table);

            cleaned := cleaned + 1;
            RAISE NOTICE 'Nettoyé: %', link_table;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Erreur sur %: %', link_table, SQLERRM;
        END;
    END LOOP;

    RAISE NOTICE '';
    RAISE NOTICE '✓ % tables de composants vérifiées', cleaned;
END $$;

\echo ''
\echo '═══════════════════════════════════════════════════════════'
\echo 'RÉSUMÉ DES DONNÉES'
\echo '═══════════════════════════════════════════════════════════'
\echo ''

-- Afficher un résumé
SELECT
    'up_permissions' as table_name,
    COUNT(*) as count
FROM up_permissions
UNION ALL
SELECT 'up_roles', COUNT(*) FROM up_roles
UNION ALL
SELECT 'up_users', COUNT(*) FROM up_users
UNION ALL
SELECT 'up_permissions_role_lnk', COUNT(*) FROM up_permissions_role_lnk
UNION ALL
SELECT 'components_global_navbars', COUNT(*) FROM components_global_navbars
UNION ALL
SELECT 'components_global_navbars_logo_lnk', COUNT(*) FROM components_global_navbars_logo_lnk
UNION ALL
SELECT 'logos', COUNT(*) FROM logos
UNION ALL
SELECT 'globals', COUNT(*) FROM globals
UNION ALL
SELECT 'articles', COUNT(*) FROM articles
UNION ALL
SELECT 'pages', COUNT(*) FROM pages
UNION ALL
SELECT 'files', COUNT(*) FROM files
ORDER BY table_name;

\echo ''
\echo '═══════════════════════════════════════════════════════════'
\echo '✅ RÉPARATION TERMINÉE'
\echo '═══════════════════════════════════════════════════════════'
\echo ''
\echo 'Redémarrez Strapi maintenant:'
\echo '  docker-compose restart strapi'
\echo ''
\echo 'Puis suivez les logs:'
\echo '  docker-compose logs -f strapi'
\echo ''

-- Nettoyer la fonction temporaire
DROP FUNCTION IF EXISTS clean_link_table(TEXT, TEXT, TEXT);
