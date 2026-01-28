-- ═══════════════════════════════════════════════════════════
-- SCRIPT DE RÉPARATION STRAPI - Foreign Key Constraints
-- ═══════════════════════════════════════════════════════════
--
-- Ce script nettoie les références orphelines dans la base
-- Utilisation: psql -U strapi -d strapi -f fix-foreign-keys.sql
--
-- ═══════════════════════════════════════════════════════════

\echo '═══════════════════════════════════════════════════════════'
\echo 'RÉPARATION DES CONTRAINTES DE CLÉS ÉTRANGÈRES'
\echo '═══════════════════════════════════════════════════════════'
\echo ''

-- Afficher l'état actuel
\echo 'État AVANT nettoyage:'
\echo '─────────────────────────────────────────────────────────'

SELECT
    'up_permissions' as table_name,
    COUNT(*) as count
FROM up_permissions
UNION ALL
SELECT
    'up_permissions_role_lnk' as table_name,
    COUNT(*) as count
FROM up_permissions_role_lnk
UNION ALL
SELECT
    'up_roles' as table_name,
    COUNT(*) as count
FROM up_roles
UNION ALL
SELECT
    'up_users' as table_name,
    COUNT(*) as count
FROM up_users;

\echo ''
\echo 'Références orphelines détectées:'
\echo '─────────────────────────────────────────────────────────'

-- Compter les références orphelines
SELECT
    'up_permissions_role_lnk (permission_id)' as orphan_type,
    COUNT(*) as orphan_count
FROM up_permissions_role_lnk
WHERE permission_id NOT IN (SELECT id FROM up_permissions)
UNION ALL
SELECT
    'up_permissions_role_lnk (role_id)' as orphan_type,
    COUNT(*) as orphan_count
FROM up_permissions_role_lnk
WHERE role_id NOT IN (SELECT id FROM up_roles)
UNION ALL
SELECT
    'up_users_role_lnk (user_id)' as orphan_type,
    COUNT(*) as orphan_count
FROM up_users_role_lnk
WHERE user_id NOT IN (SELECT id FROM up_users)
UNION ALL
SELECT
    'up_users_role_lnk (role_id)' as orphan_type,
    COUNT(*) as orphan_count
FROM up_users_role_lnk
WHERE role_id NOT IN (SELECT id FROM up_roles);

\echo ''
\echo 'NETTOYAGE EN COURS...'
\echo '─────────────────────────────────────────────────────────'

-- Supprimer les contraintes FK temporairement
ALTER TABLE up_permissions_role_lnk DROP CONSTRAINT IF EXISTS up_permissions_role_lnk_fk;
ALTER TABLE up_permissions_role_lnk DROP CONSTRAINT IF EXISTS up_permissions_role_lnk_inv_fk;
ALTER TABLE up_users_role_lnk DROP CONSTRAINT IF EXISTS up_users_role_lnk_fk;
ALTER TABLE up_users_role_lnk DROP CONSTRAINT IF EXISTS up_users_role_lnk_inv_fk;
ALTER TABLE admin_permissions_role_lnk DROP CONSTRAINT IF EXISTS admin_permissions_role_lnk_fk;
ALTER TABLE admin_permissions_role_lnk DROP CONSTRAINT IF EXISTS admin_permissions_role_lnk_inv_fk;

\echo '✓ Contraintes temporairement supprimées'

-- Nettoyer up_permissions_role_lnk
DELETE FROM up_permissions_role_lnk
WHERE permission_id NOT IN (SELECT id FROM up_permissions);

DELETE FROM up_permissions_role_lnk
WHERE role_id NOT IN (SELECT id FROM up_roles);

\echo '✓ up_permissions_role_lnk nettoyé'

-- Nettoyer up_users_role_lnk
DELETE FROM up_users_role_lnk
WHERE user_id NOT IN (SELECT id FROM up_users);

DELETE FROM up_users_role_lnk
WHERE role_id NOT IN (SELECT id FROM up_roles);

\echo '✓ up_users_role_lnk nettoyé'

-- Nettoyer admin_permissions_role_lnk
DELETE FROM admin_permissions_role_lnk
WHERE permission_id NOT IN (SELECT id FROM admin_permissions);

DELETE FROM admin_permissions_role_lnk
WHERE role_id NOT IN (SELECT id FROM admin_roles);

\echo '✓ admin_permissions_role_lnk nettoyé'

-- Recréer les contraintes FK
ALTER TABLE up_permissions_role_lnk
ADD CONSTRAINT up_permissions_role_lnk_fk
FOREIGN KEY (permission_id)
REFERENCES up_permissions(id)
ON DELETE CASCADE;

ALTER TABLE up_permissions_role_lnk
ADD CONSTRAINT up_permissions_role_lnk_inv_fk
FOREIGN KEY (role_id)
REFERENCES up_roles(id)
ON DELETE CASCADE;

ALTER TABLE up_users_role_lnk
ADD CONSTRAINT up_users_role_lnk_fk
FOREIGN KEY (user_id)
REFERENCES up_users(id)
ON DELETE CASCADE;

ALTER TABLE up_users_role_lnk
ADD CONSTRAINT up_users_role_lnk_inv_fk
FOREIGN KEY (role_id)
REFERENCES up_roles(id)
ON DELETE CASCADE;

ALTER TABLE admin_permissions_role_lnk
ADD CONSTRAINT admin_permissions_role_lnk_fk
FOREIGN KEY (permission_id)
REFERENCES admin_permissions(id)
ON DELETE CASCADE;

ALTER TABLE admin_permissions_role_lnk
ADD CONSTRAINT admin_permissions_role_lnk_inv_fk
FOREIGN KEY (role_id)
REFERENCES admin_roles(id)
ON DELETE CASCADE;

\echo '✓ Contraintes recréées'

\echo ''
\echo 'État APRÈS nettoyage:'
\echo '─────────────────────────────────────────────────────────'

SELECT
    'up_permissions' as table_name,
    COUNT(*) as count
FROM up_permissions
UNION ALL
SELECT
    'up_permissions_role_lnk' as table_name,
    COUNT(*) as count
FROM up_permissions_role_lnk
UNION ALL
SELECT
    'up_roles' as table_name,
    COUNT(*) as count 
FROM up_roles
UNION ALL
SELECT
    'up_users' as table_name,
    COUNT(*) as count
FROM up_users;

\echo ''
\echo '═══════════════════════════════════════════════════════════'
\echo '✅ RÉPARATION TERMINÉE'
\echo '═══════════════════════════════════════════════════════════'
\echo ''
\echo 'Vous pouvez maintenant redémarrer Strapi:'
\echo '  docker-compose restart strapi'
\echo ''
