# Guide : Fork LaunchPad et rester synchronisé avec l'upstream

## 🎯 Stratégie : Fork + Sync = Meilleur des deux mondes

### ✅ Avantages de forker LaunchPad

**Vous gardez** :
- ✅ Lien avec le projet original (upstream)
- ✅ Possibilité de récupérer les mises à jour
- ✅ Bénéfice des corrections de bugs
- ✅ Nouvelles fonctionnalités automatiquement
- ✅ Votre propre code et personnalisations

**Vous pouvez** :
- ✅ Personnaliser à 100% votre version
- ✅ Synchroniser quand vous voulez
- ✅ Choisir quelles mises à jour prendre
- ✅ Contribuer au projet original (Pull Requests)

---

## 🚀 Étape 1 : Créer votre fork

### Sur GitHub.com

1. **Aller sur le repo LaunchPad** : https://github.com/strapi/launchpad

2. **Cliquer sur "Fork"** en haut à droite
   ```
   ┌────────────────────────────────┐
   │  strapi/launchpad              │
   │                    [⭐ Star]   │
   │                    [🍴 Fork]   │ ← Cliquer ici
   └────────────────────────────────┘
   ```

3. **Configurer le fork**
   ```
   Owner: votre-username
   Repository name: mon-site-vitrine
   Description: Mon site vitrine basé sur Strapi LaunchPad
   
   ☐ Copy the main branch only
   ☑ Copy all branches (recommandé pour suivre toutes les branches)
   
   [Create fork]
   ```

4. **Votre fork est créé** : `https://github.com/votre-username/mon-site-vitrine`

---

## 💻 Étape 2 : Cloner votre fork en local

```bash
# Cloner VOTRE fork (pas l'original)
git clone https://github.com/votre-username/mon-site-vitrine.git
cd mon-site-vitrine

# Vérifier les remotes
git remote -v
# Résultat :
# origin  https://github.com/votre-username/mon-site-vitrine.git (fetch)
# origin  https://github.com/votre-username/mon-site-vitrine.git (push)
```

---

## 🔗 Étape 3 : Ajouter l'upstream (repo original)

C'est **LA** étape importante pour pouvoir synchroniser !

```bash
# Ajouter le repo original comme "upstream"
git remote add upstream https://github.com/strapi/launchpad.git

# Vérifier
git remote -v
# Résultat :
# origin    https://github.com/votre-username/mon-site-vitrine.git (fetch)
# origin    https://github.com/votre-username/mon-site-vitrine.git (push)
# upstream  https://github.com/strapi/launchpad.git (fetch)
# upstream  https://github.com/strapi/launchpad.git (push)
```

**Explication** :
- `origin` = votre fork (où vous poussez vos changements)
- `upstream` = le projet original (d'où vous tirez les mises à jour)

---

## 🔄 Étape 4 : Synchroniser avec upstream

### Méthode 1 : Via l'interface GitHub (Plus simple)

1. **Aller sur votre fork sur GitHub**
2. **Cliquer sur "Sync fork"**
   ```
   ┌──────────────────────────────────────┐
   │ This branch is 5 commits behind      │
   │ strapi:main                          │
   │                                      │
   │ [Sync fork] ▼                        │ ← Cliquer ici
   └──────────────────────────────────────┘
   ```

3. **Choisir l'action**
   - "Update branch" : Merge les changements
   - "Discard commits" : Écraser vos changements (attention !)

4. **Puis en local**
   ```bash
   git pull origin main
   ```

### Méthode 2 : En ligne de commande (Plus de contrôle)

```bash
# 1. Récupérer les dernières modifications de l'upstream
git fetch upstream

# 2. Se placer sur votre branche principale
git checkout main

# 3. Merger les changements de l'upstream
git merge upstream/main

# 4. Pousser vers votre fork
git push origin main
```

### Méthode 3 : Avec rebase (Pour un historique propre)

```bash
# 1. Fetch upstream
git fetch upstream

# 2. Rebase sur upstream/main
git rebase upstream/main

# 3. Force push (car l'historique a changé)
git push --force-with-lease origin main
```

⚠️ **Attention** : N'utilisez `--force` que si vous êtes sûr !

---

## 🎨 Workflow recommandé pour personnaliser

### Structure de branches conseillée

```
main (synchronisé avec upstream)
├── develop (votre branche de développement)
│   ├── feature/custom-header
│   ├── feature/new-services-page
│   └── feature/custom-design
└── production (branche de production)
```

### Workflow étape par étape

#### 1. Garder `main` propre

```bash
# La branche main reste synchronisée avec upstream
# Ne faites JAMAIS de modifications directement sur main
git checkout main
git fetch upstream
git merge upstream/main
git push origin main
```

#### 2. Travailler sur des branches

```bash
# Créer une branche pour vos modifications
git checkout -b feature/custom-homepage main

# Faire vos modifications
# ... éditer les fichiers ...

# Commit
git add .
git commit -m "feat: Personnalisation de la page d'accueil"

# Push vers votre fork
git push origin feature/custom-homepage
```

#### 3. Merger dans develop

```bash
# Merge votre feature dans develop
git checkout develop
git merge feature/custom-homepage
git push origin develop
```

#### 4. Synchronisation régulière

```bash
# Une fois par semaine/mois
git checkout main
git fetch upstream
git merge upstream/main
git push origin main

# Mettre à jour develop avec les nouvelles fonctionnalités
git checkout develop
git merge main
# Résoudre les conflits si nécessaire
git push origin develop
```

---

## 🛡️ Gestion des conflits

### Qu'est-ce qu'un conflit ?

Un conflit survient quand vous et l'upstream modifiez la même ligne de code.

```
<<<<<<< HEAD (votre version)
const titre = "Mon Super Site";
=======
const titre = "LaunchPad Demo"; (version upstream)
>>>>>>> upstream/main
```

### Résoudre un conflit

```bash
# 1. Le conflit apparaît après un merge
git merge upstream/main
# CONFLICT (content): Merge conflict in src/app/page.tsx

# 2. Ouvrir le fichier en conflit
code src/app/page.tsx

# 3. Choisir quelle version garder
# Supprimer les marqueurs <<<<<<, =======, >>>>>>>
# Garder le code que vous voulez

# 4. Marquer comme résolu
git add src/app/page.tsx

# 5. Finaliser le merge
git commit -m "chore: Résolution des conflits avec upstream"

# 6. Push
git push origin main
```

### Stratégies pour éviter les conflits

**1. Ne jamais modifier les fichiers core de LaunchPad**

❌ **À éviter** :
```
Modifier directement :
├── next/src/lib/strapi.ts
├── next/src/components/blocks/BlockRenderer.tsx
└── strapi/config/server.ts
```

✅ **Préférer** :
```
Créer vos propres fichiers :
├── next/src/lib/custom-strapi.ts
├── next/src/components/blocks/CustomBlocks.tsx
└── next/src/components/custom/
```

**2. Isoler vos modifications**

```typescript
// ❌ Mauvais : Modifier directement BlockRenderer.tsx
export function BlockRenderer({ block }) {
  switch (block.__component) {
    case 'sections.hero':
      return <HeroBlock {...block} />;
    case 'sections.mon-bloc-custom': // ← Modification directe
      return <MonBlocCustom {...block} />;
  }
}

// ✅ Bon : Étendre BlockRenderer
// components/blocks/CustomBlockRenderer.tsx
import { BlockRenderer as OriginalBlockRenderer } from './BlockRenderer';

export function CustomBlockRenderer({ block }) {
  // Gérer vos blocs custom
  if (block.__component === 'sections.mon-bloc-custom') {
    return <MonBlocCustom {...block} />;
  }
  
  // Déléguer aux blocs originaux
  return <OriginalBlockRenderer block={block} />;
}
```

**3. Utiliser des fichiers de configuration séparés**

```bash
# Fichiers originaux
next/tailwind.config.ts
next/.env.example

# Vos fichiers custom (pas commités dans upstream)
next/tailwind.config.custom.ts
next/.env.local
next/src/config/custom.ts
```

---

## 🔔 Automatiser la synchronisation

### Option 1 : GitHub Actions (Automatique)

Créez `.github/workflows/sync-upstream.yml` dans votre fork :

```yaml
name: Sync with upstream

on:
  schedule:
    # Tous les jours à minuit
    - cron: '0 0 * * *'
  workflow_dispatch: # Permet de lancer manuellement

jobs:
  sync:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
      
      - name: Sync upstream changes
        run: |
          git config user.name github-actions
          git config user.email [email protected]
          
          # Ajouter upstream
          git remote add upstream https://github.com/strapi/launchpad.git
          
          # Fetch et merge
          git fetch upstream
          git checkout main
          git merge upstream/main --no-edit
          
          # Push
          git push origin main
```

**Avantages** :
- ✅ Synchronisation automatique quotidienne
- ✅ Notification si conflit
- ✅ Peut être lancé manuellement

### Option 2 : GitHub App "Pull"

Installer l'app [Pull](https://github.com/apps/pull) :

1. Aller sur https://github.com/apps/pull
2. Cliquer sur "Install"
3. Sélectionner votre repo forké
4. L'app créera automatiquement des PR quand upstream est mis à jour

**Configuration** (`.github/pull.yml`) :

```yaml
version: "1"
rules:
  - base: main
    upstream: strapi:main
    mergeMethod: merge
    mergeUnstable: false
```

### Option 3 : Script local

Créez `sync-upstream.sh` :

```bash
#!/bin/bash

echo "🔄 Synchronisation avec upstream..."

# Fetch upstream
git fetch upstream

# Sauvegarder la branche actuelle
CURRENT_BRANCH=$(git branch --show-current)

# Aller sur main
git checkout main

# Merger upstream
git merge upstream/main

# Pousser
git push origin main

# Retourner à la branche d'origine
git checkout $CURRENT_BRANCH

echo "✅ Synchronisation terminée !"
```

**Usage** :
```bash
chmod +x sync-upstream.sh
./sync-upstream.sh
```

---

## 📊 Visualiser les différences avec upstream

### Voir ce qui a changé dans upstream

```bash
# Voir les commits ajoutés dans upstream
git log main..upstream/main

# Voir les fichiers modifiés
git diff main..upstream/main --name-only

# Voir les changements détaillés
git diff main..upstream/main
```

### Interface GitHub

Sur votre fork, cliquer sur "Compare" :
```
base: votre-username/main
compare: strapi/main
```

Vous verrez tous les changements entre votre version et l'upstream.

---

## 🎯 Stratégie de versioning

### Tagging de vos releases

```bash
# Quand vous déployez en production
git tag -a v1.0.0 -m "Version 1.0.0 - Lancement initial"
git push origin v1.0.0

# Version avec nouvelle feature
git tag -a v1.1.0 -m "Version 1.1.0 - Ajout page Services"
git push origin v1.1.0

# Hotfix
git tag -a v1.1.1 -m "Version 1.1.1 - Correction bug formulaire"
git push origin v1.1.1
```

### Suivre les versions de LaunchPad

```bash
# Voir la version upstream actuelle
git fetch upstream --tags
git tag -l

# Merger une version spécifique
git merge upstream/v2.0.0
```

---

## 🚨 Cas particuliers et solutions

### Problème 1 : "Your branch has diverged"

**Symptôme** :
```
Your branch and 'upstream/main' have diverged,
and have 10 and 5 different commits each, respectively.
```

**Solution** :
```bash
# Option A : Garder vos commits (merge)
git merge upstream/main

# Option B : Écraser avec upstream (réinitialiser)
git reset --hard upstream/main
git push --force origin main
```

### Problème 2 : Trop de conflits

**Solution** : Rebase interactif
```bash
git rebase -i upstream/main

# Choisir pour chaque commit :
# pick = garder
# drop = supprimer
# squash = combiner
```

### Problème 3 : Fichiers .env en conflit

**Solution** : Les ignorer
```bash
# .gitignore
.env
.env.local
.env.*.local
```

---

## 📋 Checklist de synchronisation régulière

### Tous les lundis matin (5 min)

- [ ] `git fetch upstream`
- [ ] Vérifier les changements : `git log main..upstream/main`
- [ ] Lire les release notes sur GitHub
- [ ] Décider si synchroniser maintenant ou attendre
- [ ] Si OK : `git merge upstream/main`
- [ ] Tester en local : `yarn dev`
- [ ] Push : `git push origin main`

### Avant chaque déploiement (15 min)

- [ ] Synchroniser avec upstream
- [ ] Merger main dans develop
- [ ] Résoudre les conflits
- [ ] Tester toutes les pages
- [ ] Vérifier les breaking changes
- [ ] Déployer

---

## 🎓 Ressources

### Documentation Git
- [Syncing a fork - GitHub Docs](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork)
- [Configuring a remote for a fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/configuring-a-remote-repository-for-a-fork)

### Outils
- [Pull App](https://github.com/apps/pull) - Sync automatique
- [GitHub CLI](https://cli.github.com/) - `gh repo sync`

---

## ✅ Avantages finaux de cette approche

### Flexibilité totale
- ✅ Personnalisation sans limite
- ✅ Contrôle de quand et comment synchroniser
- ✅ Possibilité de revenir en arrière

### Bénéfices de l'upstream
- ✅ Corrections de bugs automatiques
- ✅ Nouvelles fonctionnalités
- ✅ Meilleures pratiques
- ✅ Optimisations de performance

### Contribution possible
- ✅ Vous pouvez créer des PR vers upstream
- ✅ Partager vos améliorations avec la communauté
- ✅ Votre nom dans les contributeurs !

---

## 🎯 Conclusion

**Fork + Sync = Stratégie gagnante** pour votre site vitrine !

Vous obtenez :
- 🏠 Votre propre version personnalisée
- 🔄 Les mises à jour du projet original
- 🛡️ Sécurité des corrections de bugs
- 🚀 Nouvelles fonctionnalités gratuites
- 💪 Contrôle total sur votre code

**Prochaines étapes** :
1. Forker LaunchPad maintenant
2. Configurer l'upstream
3. Créer votre branche develop
4. Commencer à personnaliser
5. Synchroniser régulièrement

**Bon développement ! 🚀**