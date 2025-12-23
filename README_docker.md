# 🚀 Déploiement Docker - Webtinix Refonte

Guide complet pour déployer l'application Webtinix (Next.js + Strapi + PostgreSQL) en utilisant Docker et Docker Compose.

## 📋 Prérequis

- **Docker** (version 20.10+)
- **Docker Compose** (version 2.0+)
- **Git** (pour cloner le projet)

## 🛠️ Configuration

### 1. Cloner le projet

```bash
git clone https://github.com/webtinix1/wx-refonte-with-launchpad.git
cd wx-refonte-with-launchpad
```

### 2. Variables d'environnement

Copiez le fichier d'exemple :

```bash
cp .env.example .env
```

Modifiez `.env` avec vos valeurs sécurisées :

```env
# Base de données PostgreSQL
POSTGRES_DB=strapi
POSTGRES_USER=strapi
POSTGRES_PASSWORD=votre_mot_de_passe_fort
DATABASE_SSL=false

# Strapi
SEED_DB=true  # IMPORTANT: voir section "Premier démarrage" ci-dessous
STRAPI_PORT=1337
STRAPI_HOST=strapi
STRAPI_DISABLE_TELEMETRY=true

# Next.js
NEXTJS_PORT=3000
```

**⚠️ Sécurité :**
- Utilisez des mots de passe forts (au moins 16 caractères)
- Ne commitez jamais `.env` (ajoutez-le à `.gitignore`)

### 3. Générer des clés sécurisées (optionnel)

Pour Strapi, générez des clés sécurisées :

```bash
# Générer une clé aléatoire
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🚀 Démarrage

### ⚠️ IMPORTANT : Distinction Premier Démarrage vs Démarrages Suivants

L'application nécessite une configuration différente pour le **premier démarrage** (avec import des données) et les **démarrages suivants**.

---

## 🆕 Premier Démarrage (avec SEED_DB=true)

Pour le tout premier démarrage, vous devez importer les données initiales dans Strapi.

### Étape 1 : Configuration du docker-compose.yml

**Commentez** le volume `strapi_uploads` dans `docker-compose.yml` :

```yaml
strapi:
  # ... autres configurations
  depends_on:
    postgres:
      condition: service_healthy
  # COMMENTEZ CETTE LIGNE POUR LE PREMIER DÉMARRAGE :
  # volumes:
  #   - strapi_uploads:/opt/app/public/uploads
  networks:
    - wx-refonte-sitenetwork
```

**Pourquoi ?** Le volume Docker écrase les permissions nécessaires pour créer le dossier de backup lors de l'import.

### Étape 2 : Configurer .env

```env
SEED_DB=true
```

### Étape 3 : Démarrer

```bash
# Nettoyer complètement (si ce n'est pas la première fois)
docker-compose down -v

# Construire et démarrer
docker-compose up --build

# Ou en arrière-plan
docker-compose up -d --build
```

### Étape 4 : Vérifier l'import

Surveillez les logs pour confirmer que l'import s'est bien passé :

```bash
docker-compose logs -f strapi
```

Vous devriez voir :
```
Starting database seeding...
Starting import...
Import process has been completed successfully!
Starting Strapi...
```

---

## 🔄 Démarrages Suivants (avec SEED_DB=false)

Une fois les données importées avec succès, vous devez modifier la configuration pour les démarrages normaux.

### Étape 1 : Modifier .env

```env
SEED_DB=false
```

### Étape 2 : Réactiver le volume dans docker-compose.yml

**Décommentez** le volume `strapi_uploads` :

```yaml
strapi:
  # ... autres configurations
  depends_on:
    postgres:
      condition: service_healthy
  volumes:
    - strapi_uploads:/opt/app/public/uploads  # DÉCOMMENTEZ CETTE LIGNE
  networks:
    - wx-refonte-sitenetwork
```

**Pourquoi ?** Le volume permet maintenant de persister vos fichiers uploadés entre les redémarrages.

### Étape 3 : Redémarrer

```bash
# Arrêter les conteneurs (SANS supprimer les volumes)
docker-compose down

# Relancer
docker-compose up -d
```

---

## 📊 Récapitulatif des Configurations

| Scénario | SEED_DB | Volume strapi_uploads | Commande |
|----------|---------|----------------------|----------|
| **Premier démarrage** | `true` | ❌ Commenté | `docker-compose down -v && docker-compose up --build` |
| **Démarrages normaux** | `false` | ✅ Activé | `docker-compose up -d` |
| **Réimport complet** | `true` | ❌ Commenté | `docker-compose down -v && docker-compose up --build` |

---

## 🌐 Accès aux services

Une fois démarré :

- **Next.js (site web)** : http://localhost:3000
- **Strapi Admin** : http://localhost:1337/admin
- **Base de données PostgreSQL** : Accessible uniquement depuis les conteneurs (port interne 5432)

### Premier accès à Strapi Admin

Si les données ont été importées avec succès, utilisez les identifiants configurés dans votre export. Sinon, créez un admin :

```bash
docker-compose exec strapi yarn strapi admin:create-user
```

## 📝 Commandes utiles

### Gestion des conteneurs

```bash
# Voir les logs de tous les services
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs -f strapi
docker-compose logs -f postgres
docker-compose logs -f nextjs

# Arrêter tous les services
docker-compose down

# Redémarrer un service
docker-compose restart strapi

# Accéder au shell d'un conteneur
docker-compose exec strapi sh
docker-compose exec postgres psql -U strapi -d strapi
```

### Lancer uniquement certains services

```bash
# Lancer uniquement Strapi et PostgreSQL (sans Next.js)
docker-compose up postgres strapi

# Lancer en arrière-plan
docker-compose up -d postgres strapi
```

### Gestion de Strapi

```bash
# Exécuter le seed manuellement
docker-compose exec strapi yarn seed

# Construire Strapi (si modifications)
docker-compose exec strapi yarn build

# Voir la structure de la base de données
docker-compose exec postgres psql -U strapi -d strapi -c "\dt"
```

### Gestion de Next.js

```bash
# Voir les logs Next.js
docker-compose logs -f nextjs

# Rebuild Next.js après modifications
docker-compose build nextjs && docker-compose up -d nextjs
```

### Base de données

```bash
# Sauvegarder la base de données
docker-compose exec postgres pg_dump -U strapi strapi > backup_$(date +%Y%m%d_%H%M%S).sql

# Restaurer la base de données
docker-compose exec -T postgres psql -U strapi strapi < backup.sql

# Voir les tables
docker-compose exec postgres psql -U strapi -d strapi -c "\dt"

# Se connecter à la base
docker-compose exec postgres psql -U strapi -d strapi
```

## 💾 Persistance des données

Les données sont persistées dans des volumes Docker nommés :

- `postgres_data` : Données PostgreSQL (tables, utilisateurs, etc.)
- `strapi_uploads` : Fichiers uploadés par Strapi (images, documents, etc.)

### Lister les volumes

```bash
docker volume ls | grep wx-refonte
```

### Sauvegarde complète

```bash
# Créer un dossier de backup
mkdir -p ./backups

# Sauvegarder PostgreSQL
docker-compose exec postgres pg_dump -U strapi strapi > ./backups/postgres_$(date +%Y%m%d_%H%M%S).sql

# Sauvegarder les uploads
docker run --rm \
  -v wx-refonte-site_strapi_uploads:/data \
  -v $(pwd)/backups:/backup \
  alpine tar czf /backup/uploads_$(date +%Y%m%d_%H%M%S).tar.gz -C /data .
```

### Restauration

```bash
# Restaurer PostgreSQL
docker-compose exec -T postgres psql -U strapi strapi < ./backups/postgres_YYYYMMDD_HHMMSS.sql

# Restaurer les uploads
docker run --rm \
  -v wx-refonte-site_strapi_uploads:/data \
  -v $(pwd)/backups:/backup \
  alpine sh -c "cd /data && tar xzf /backup/uploads_YYYYMMDD_HHMMSS.tar.gz"
```

## 🔧 Dépannage

### Le seed échoue avec "backup folder could not be created"

**Solution :** Vous avez oublié de commenter le volume `strapi_uploads` dans `docker-compose.yml` pour le premier démarrage.

1. Arrêtez les conteneurs : `docker-compose down -v`
2. Commentez le volume dans `docker-compose.yml`
3. Relancez : `docker-compose up --build`

### Les conteneurs ne démarrent pas

1. Vérifiez les logs :
   ```bash
   docker-compose logs
   ```

2. Vérifiez l'état des conteneurs :
   ```bash
   docker-compose ps
   ```

3. Redémarrez avec reconstruction :
   ```bash
   docker-compose down
   docker-compose up --build
   ```

### Erreur de connexion à PostgreSQL

- Vérifiez que PostgreSQL est healthy :
  ```bash
  docker-compose logs postgres
  docker-compose ps
  ```

- Testez la connexion :
  ```bash
  docker-compose exec postgres pg_isready -U strapi -d strapi
  ```

- Attendez que PostgreSQL soit complètement démarré (health check)

### Problèmes avec Strapi

- Vérifiez les variables d'environnement dans `.env`
- Assurez-vous que PostgreSQL est accessible
- Pour les erreurs de seed, vérifiez les logs détaillés :
  ```bash
  docker-compose logs strapi | grep -i error
  ```

### Problèmes avec Next.js

- Vérifiez que Strapi est accessible :
  ```bash
  curl http://localhost:1337/api
  ```

- Rebuild Next.js :
  ```bash
  docker-compose build nextjs && docker-compose up -d nextjs
  ```

### Nettoyer complètement

⚠️ **Attention : supprime toutes les données !**

```bash
# Arrêter et supprimer les conteneurs + volumes
docker-compose down -v

# Supprimer les images
docker-compose down --rmi all

# Nettoyer le cache Docker
docker system prune -f
```

### Réimporter les données depuis le début

Si vous devez recommencer l'import :

```bash
# 1. Tout nettoyer
docker-compose down -v

# 2. Modifier .env
echo "SEED_DB=true" >> .env

# 3. Commenter le volume dans docker-compose.yml
# (voir section "Premier Démarrage")

# 4. Reconstruire et démarrer
docker-compose up --build
```

## 📊 Monitoring

### Ressources utilisées

```bash
# Voir l'utilisation des ressources en temps réel
docker stats

# Espace disque utilisé par Docker
docker system df

# Voir les volumes et leur taille
docker system df -v
```

### Health checks

PostgreSQL a un health check intégré. Pour vérifier :

```bash
docker-compose ps
# Cherchez "healthy" dans la colonne STATUS
```

## 🚀 Déploiement en production

### Variables d'environnement de production

```env
NODE_ENV=production
SEED_DB=false  # TOUJOURS false en production
POSTGRES_PASSWORD=votre_mot_de_passe_prod_tres_fort
DATABASE_SSL=true  # Si votre provider PostgreSQL le supporte
STRAPI_DISABLE_TELEMETRY=true
```

### Checklist avant production

- [ ] `SEED_DB=false` configuré
- [ ] Volume `strapi_uploads` activé dans docker-compose.yml
- [ ] Mots de passe forts dans `.env`
- [ ] `.env` dans `.gitignore`
- [ ] Backups automatisés configurés
- [ ] Health checks activés
- [ ] Monitoring en place

### Optimisations

- Utilisez des images multi-stage (déjà configuré)
- Configurez des limites de ressources dans docker-compose.yml :
  ```yaml
  deploy:
    resources:
      limits:
        cpus: '1'
        memory: 1G
  ```
- Utilisez un reverse proxy (nginx/Traefik) pour Next.js et Strapi
- Activez HTTPS avec Let's Encrypt

## 📚 Ressources

- [Documentation Docker](https://docs.docker.com)
- [Documentation Docker Compose](https://docs.docker.com/compose/)
- [Documentation Strapi](https://docs.strapi.io)
- [Documentation Next.js](https://nextjs.org/docs)

## 🤝 Support

Pour des problèmes spécifiques :
1. Consultez les logs détaillés : `docker-compose logs -f`
2. Vérifiez la configuration `.env`
3. Testez les connexions entre services
4. Consultez ce README pour les cas spécifiques (premier démarrage vs normal)
5. Ouvrez une issue sur le repository GitHub

## 📋 Changelog

### Version actuelle
- ✅ Support du seed automatique au premier démarrage
- ✅ Gestion des permissions pour l'import Strapi
- ✅ Documentation complète pour premier démarrage vs démarrages suivants
- ✅ Volumes persistants pour PostgreSQL et uploads Strapi