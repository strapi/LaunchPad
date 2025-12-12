# Guide Docker pour Strapi

## 📋 Prérequis

- Docker installé (version 20.10+)
- Docker Compose installé (version 2.0+)

## 🚀 Démarrage rapide

### 1. Configuration des variables d'environnement

Copiez le fichier `.env.example` vers `.env`:

```bash
cp .env.example .env
```

Générez des secrets sécurisés pour votre fichier `.env`:

```bash
# Générer APP_KEYS (4 clés séparées par des virgules)
node -e "console.log(Array(4).fill(0).map(() => require('crypto').randomBytes(16).toString('base64')).join(','))"

# Générer les autres secrets
node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"
```

Remplacez les valeurs `toBeModified` dans votre fichier `.env`.

### 2. Construire et démarrer le conteneur

**Sans seed (base de données vide):**

```bash
docker-compose up -d --build
```

**Avec seed (charger les données initiales):**

```bash
# Modifier .env: SEED_DB=true
docker-compose up -d --build
```

### 3. Accéder à Strapi

Ouvrez votre navigateur à l'adresse: `http://localhost:1337`

## 📝 Commandes utiles

### Voir les logs

```bash
docker-compose logs -f strapi
```

### Arrêter le conteneur

```bash
docker-compose down
```

### Redémarrer le conteneur

```bash
docker-compose restart
```

### Exécuter des commandes dans le conteneur

```bash
# Accéder au shell
docker-compose exec strapi sh

# Exécuter yarn seed manuellement
docker-compose exec strapi yarn seed

# Créer un admin
docker-compose exec strapi yarn strapi admin:create-user
```

### Nettoyer complètement (⚠️ supprime les données)

```bash
docker-compose down -v
```

## 💾 Persistance des données

Les données sont persistées dans des volumes Docker:

- `strapi-data`: Base de données SQLite
- `strapi-uploads`: Fichiers uploadés

Pour sauvegarder vos données:

```bash
# Créer une sauvegarde
docker run --rm -v strapi-data:/data -v $(pwd):/backup alpine tar czf /backup/strapi-backup.tar.gz -C /data .

# Restaurer une sauvegarde
docker run --rm -v strapi-data:/data -v $(pwd):/backup alpine sh -c "cd /data && tar xzf /backup/strapi-backup.tar.gz"
```

## 🔧 Configuration de production

Pour la production, modifiez votre `.env`:

```env
NODE_ENV=production
SEED_DB=false
```

Et utilisez:

```bash
docker-compose -f docker-compose.yml up -d --build
```

## 🐛 Dépannage

### Le conteneur ne démarre pas

Vérifiez les logs:
```bash
docker-compose logs strapi
```

### Erreur de permissions

```bash
docker-compose down
docker volume rm strapi-data strapi-uploads
docker-compose up -d --build
```

### Réinitialiser complètement

```bash
docker-compose down -v
rm -rf .tmp node_modules
docker-compose up -d --build
```

## 📚 Ressources

- [Documentation Strapi](https://docs.strapi.io)
- [Documentation Docker](https://docs.docker.com)
