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

# Strapi
SEED_DB=true  # true pour charger les données initiales, false en production
STRAPI_PORT=1337
STRAPI_HOST=strapi

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

### Mode développement

```bash
# Construire et démarrer tous les services
docker-compose up --build

# Ou en arrière-plan
docker-compose up -d --build
```

### Mode production

Modifiez `.env` :
```env
SEED_DB=false
NODE_ENV=production
```

Puis :
```bash
docker-compose up -d --build
```

## 🌐 Accès aux services

Une fois démarré :

- **Next.js (site web)** : http://localhost:3000
- **Strapi Admin** : http://localhost:1337/admin
- **Base de données PostgreSQL** : Accessible uniquement depuis les conteneurs (port interne 5432)

## 📝 Commandes utiles

### Gestion des conteneurs

```bash
# Voir les logs de tous les services
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs -f strapi

# Arrêter tous les services
docker-compose down

# Redémarrer un service
docker-compose restart nextjs

# Accéder au shell d'un conteneur
docker-compose exec strapi sh
docker-compose exec postgres psql -U strapi -d strapi
```

### Gestion de Strapi

```bash
# Créer un utilisateur admin (dans le conteneur Strapi)
docker-compose exec strapi yarn strapi admin:create-user

# Exécuter le seed manuellement
docker-compose exec strapi yarn seed

# Construire Strapi (si modifications)
docker-compose exec strapi yarn build
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
docker-compose exec postgres pg_dump -U strapi strapi > backup.sql

# Restaurer la base de données
docker-compose exec -T postgres psql -U strapi strapi < backup.sql
```

## 💾 Persistance des données

Les données sont persistées dans des volumes Docker nommés :

- `postgres_data` : Données PostgreSQL
- `strapi_uploads` : Fichiers uploadés par Strapi

### Sauvegarde complète

```bash
# Créer une sauvegarde des volumes
docker run --rm -v postgres_data:/data -v $(pwd)/backup:/backup alpine tar czf /backup/postgres-backup.tar.gz -C /data .
docker run --rm -v strapi_uploads:/data -v $(pwd)/backup:/backup alpine tar czf /backup/uploads-backup.tar.gz -C /data .
```

### Restauration

```bash
# Restaurer les volumes
docker run --rm -v postgres_data:/data -v $(pwd)/backup:/backup alpine sh -c "cd /data && tar xzf /backup/postgres-backup.tar.gz"
docker run --rm -v strapi_uploads:/data -v $(pwd)/backup:/backup alpine sh -c "cd /data && tar xzf /backup/uploads-backup.tar.gz"
```

## 🔧 Dépannage

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
  ```

- Testez la connexion :
  ```bash
  docker-compose exec postgres pg_isready -U strapi -d strapi
  ```

### Problèmes avec Strapi

- Vérifiez les variables d'environnement dans `.env`
- Assurez-vous que PostgreSQL est accessible
- Pour les erreurs de seed, vérifiez les logs détaillés

### Problèmes avec Next.js

- Vérifiez que Strapi est accessible :
  ```bash
  curl http://localhost:1337/api/health  # ou similaire
  ```

- Rebuild Next.js :
  ```bash
  docker-compose build nextjs
  ```

### Nettoyer complètement

⚠️ **Attention : supprime toutes les données !**

```bash
# Arrêter et supprimer les conteneurs
docker-compose down

# Supprimer les volumes (données)
docker-compose down -v

# Supprimer les images
docker-compose down --rmi all

# Nettoyer le cache Docker
docker system prune -f
```

## 📊 Monitoring

### Ressources utilisées

```bash
# Voir l'utilisation des ressources
docker stats

# Espace disque utilisé par Docker
docker system df
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
SEED_DB=false
POSTGRES_PASSWORD=votre_mot_de_passe_prod
```

### Utilisation de Docker Swarm ou Kubernetes

Pour un déploiement scalable :

1. Utilisez `docker stack deploy` avec Docker Swarm
2. Ou déployez sur Kubernetes avec `kubectl`
3. Configurez des secrets pour les mots de passe

### Optimisations

- Utilisez des images multi-stage (déjà configuré)
- Configurez des limites de ressources dans docker-compose.yml
- Utilisez un reverse proxy (nginx) pour Next.js et Strapi

## 📚 Ressources

- [Documentation Docker](https://docs.docker.com)
- [Documentation Docker Compose](https://docs.docker.com/compose/)
- [Documentation Strapi](https://docs.strapi.io)
- [Documentation Next.js](https://nextjs.org/docs)

## 🤝 Support

Pour des problèmes spécifiques :
1. Consultez les logs détaillés
2. Vérifiez la configuration `.env`
3. Testez les connexions entre services
4. Ouvrez une issue sur le repository GitHub