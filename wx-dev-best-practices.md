# Guide des Bonnes Pratiques Développeurs - LaunchPad

## 🎯 Objectif

Ce guide définit les **règles d'or** pour travailler sur le projet LaunchPad forké, garantir la maintenabilité et faciliter les synchronisations avec l'upstream.

---

## 🌳 Stratégie de Branches

### Architecture des branches

```
main (synchronisé avec strapi/launchpad)
├── develop (branche de développement principale)
│   ├── feature/nom-feature
│   ├── fix/nom-bug
│   └── refactor/nom-refactor
└── hotfix/nom-hotfix-urgent
```

### Règles des branches

#### 🔒 `main` - INTOUCHABLE

**Règle d'or : Ne JAMAIS commit directement sur `main`**

```bash
# ❌ INTERDIT
git checkout main
git add .
git commit -m "modif"

# ✅ CORRECT
# main sert UNIQUEMENT à synchroniser avec upstream
git checkout main
git fetch upstream
git merge upstream/main
git push origin main
```

**Objectifs de `main` :**
- 🔄 Reste synchronisé avec `strapi/launchpad`
- 🧹 Historique propre, sans modifications custom
- 🚀 Point de départ pour toutes les features

#### 🚧 `develop` - Branche de développement

**C'est votre branche de travail principale**

```bash
# Créer develop depuis main (une seule fois)
git checkout main
git checkout -b develop
git push origin develop

# Mettre à jour develop avec les nouveautés de main
git checkout develop
git merge main
```

**Ce qui va dans `develop` :**
- ✅ Toutes vos features mergées
- ✅ Tous vos fixes
- ✅ Configuration custom
- ✅ Code prêt pour la production

#### 🎨 `feature/*` - Nouvelles fonctionnalités

**Convention de nommage :**

```bash
feature/nom-court-descriptif

# Exemples :
feature/custom-homepage      # Page d'accueil personnalisée
feature/contact-form         # Formulaire de contact
feature/vtiger-integration   # Intégration Vtiger
feature/services-page        # Page services
```

**Workflow :**

```bash
# 1. Créer la feature depuis develop
git checkout develop
git pull origin develop
git checkout -b feature/contact-form

# 2. Développer
# ... faire vos modifications ...

# 3. Commit réguliers
git add .
git commit -m "feat: ajout formulaire contact"

# 4. Push vers votre fork
git push origin feature/contact-form

# 5. Créer une Pull Request sur GitHub
# feature/contact-form → develop

# 6. Après review et merge, supprimer la branche
git checkout develop
git pull origin develop
git branch -d feature/contact-form
git push origin --delete feature/contact-form
```

#### 🐛 `fix/*` - Corrections de bugs

**Convention de nommage :**

```bash
fix/nom-bug

# Exemples :
fix/form-validation          # Validation formulaire
fix/mobile-menu              # Menu mobile
fix/strapi-connection        # Connexion Strapi
```

**Workflow identique aux features**

#### 🔥 `hotfix/*` - Corrections urgentes en production

**Utilisé UNIQUEMENT pour les bugs critiques en production**

```bash
# Créer depuis main (pas develop)
git checkout main
git checkout -b hotfix/critical-security-fix

# Fix rapide
git add .
git commit -m "hotfix: correction faille sécurité"

# Merger dans main ET develop
git checkout main
git merge hotfix/critical-security-fix
git push origin main

git checkout develop
git merge hotfix/critical-security-fix
git push origin develop

# Supprimer
git branch -d hotfix/critical-security-fix
```

---

## 📝 Convention de Commits

### Format des commits

Utiliser la convention **Conventional Commits** :

```
<type>(<scope>): <description>

[corps optionnel]

[footer optionnel]
```

### Types de commits

| Type | Utilisation | Exemple |
|------|-------------|---------|
| `feat` | Nouvelle fonctionnalité | `feat(contact): ajout formulaire contact` |
| `fix` | Correction de bug | `fix(form): validation email` |
| `docs` | Documentation | `docs(readme): mise à jour installation` |
| `style` | Style (CSS, formatting) | `style(header): ajustement responsive` |
| `refactor` | Refactoring | `refactor(api): simplification appels Vtiger` |
| `perf` | Performance | `perf(images): optimisation lazy loading` |
| `test` | Tests | `test(contact): ajout tests formulaire` |
| `chore` | Maintenance | `chore(deps): update dependencies` |
| `ci` | CI/CD | `ci(docker): configuration production` |

### Exemples de bons commits

```bash
# ✅ BON
git commit -m "feat(homepage): ajout section témoignages clients"
git commit -m "fix(contact): correction validation téléphone"
git commit -m "docs(deployment): ajout guide Docker"
git commit -m "style(footer): responsive mobile"

# ❌ MAUVAIS
git commit -m "update"
git commit -m "fix bug"
git commit -m "modifications"
git commit -m "WIP"
```

### Commits descriptifs

```bash
# ✅ Bon commit avec description
git commit -m "feat(vtiger): intégration API leads

- Ajout endpoint /api/contact
- Validation des champs requis
- Transformation des données au format Vtiger
- Gestion des erreurs et retry logic
- Tests unitaires

Refs: #42"

# Corps du commit : Pourquoi ? Comment ?
# Footer : Références (issues, tickets)
```

---

## 🚫 Ce qu'il ne faut JAMAIS modifier

### ❌ Fichiers Core LaunchPad - INTERDITS

**Ces fichiers sont mis à jour par l'upstream et créeront des conflits :**

```bash
# ❌ NE JAMAIS MODIFIER DIRECTEMENT

# Next.js Core
next/src/lib/strapi.ts                    # Client Strapi
next/src/components/blocks/BlockRenderer.tsx  # Moteur de rendu
next/src/app/layout.tsx                   # Layout principal (sauf meta)

# Strapi Core
strapi/config/server.ts                   # Config serveur
strapi/config/admin.ts                    # Config admin
strapi/src/index.ts                       # Point d'entrée

# Configuration base
next/next.config.mjs                      # Config Next (sauf extend)
strapi/package.json                       # Dépendances Strapi
```

### ✅ Alternative : Étendre, ne pas modifier

#### Exemple 1 : Étendre BlockRenderer

```typescript
// ❌ MAUVAIS : Modifier BlockRenderer.tsx
// next/src/components/blocks/BlockRenderer.tsx
export function BlockRenderer({ block }) {
  switch (block.__component) {
    case 'sections.hero':
      return <HeroBlock {...block} />;
    case 'sections.custom-cta':  // ← Modification directe = CONFLIT
      return <CustomCTA {...block} />;
  }
}

// ✅ BON : Créer un wrapper custom
// next/src/components/blocks/CustomBlockRenderer.tsx
import { BlockRenderer } from './BlockRenderer';
import { CustomCTA } from '../custom/CustomCTA';

export function CustomBlockRenderer({ block }) {
  // Gérer vos blocs custom en premier
  switch (block.__component) {
    case 'sections.custom-cta':
      return <CustomCTA {...block} />;
    case 'sections.testimonials':
      return <TestimonialsBlock {...block} />;
    default:
      // Déléguer aux blocs originaux
      return <BlockRenderer block={block} />;
  }
}

// Dans votre page
import { CustomBlockRenderer } from '@/components/blocks/CustomBlockRenderer';
```

#### Exemple 2 : Configuration Next.js

```javascript
// ❌ MAUVAIS : Écraser next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['mon-domaine.com'],  // ← Écrase la config upstream
  },
};

// ✅ BON : Étendre la config
// next/next.config.mjs
import originalConfig from './next.config.original.mjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...originalConfig,
  images: {
    ...originalConfig.images,
    domains: [
      ...(originalConfig.images?.domains || []),
      'mon-domaine.com',  // ← Ajoute sans écraser
    ],
  },
};

export default nextConfig;
```

#### Exemple 3 : Client Strapi custom

```typescript
// ❌ MAUVAIS : Modifier strapi.ts
// next/src/lib/strapi.ts
export async function fetchAPI(path: string) {
  // Modification directe
}

// ✅ BON : Créer un wrapper
// next/src/lib/custom-strapi.ts
import { fetchAPI } from './strapi';

export async function fetchAPIWithCache(path: string, ttl = 60) {
  const cached = cache.get(path);
  if (cached) return cached;
  
  const data = await fetchAPI(path);
  cache.set(path, data, ttl);
  return data;
}
```

---

## 📁 Structure de fichiers recommandée

### Organisation des fichiers custom

```
next/
├── src/
│   ├── components/
│   │   ├── blocks/              # ← NE PAS MODIFIER (sauf extend)
│   │   │   ├── BlockRenderer.tsx
│   │   │   └── CustomBlockRenderer.tsx  # ← Votre wrapper
│   │   ├── custom/              # ← VOS COMPOSANTS
│   │   │   ├── ContactForm.tsx
│   │   │   ├── CustomCTA.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   └── ServicesGrid.tsx
│   │   └── ui/                  # ← Composants réutilisables
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       └── Card.tsx
│   ├── lib/
│   │   ├── strapi.ts            # ← NE PAS MODIFIER
│   │   ├── custom-strapi.ts     # ← Vos extensions
│   │   ├── vtiger.ts            # ← Votre intégration
│   │   └── utils.ts             # ← Utilitaires custom
│   ├── app/
│   │   ├── api/
│   │   │   ├── contact/         # ← Vos routes API
│   │   │   │   └── route.ts
│   │   │   └── vtiger/
│   │   │       └── route.ts
│   │   ├── (custom-pages)/      # ← Vos pages custom
│   │   │   ├── services/
│   │   │   ├── contact/
│   │   │   └── about/
│   │   └── layout.tsx           # ← Modifier UNIQUEMENT metadata
│   ├── styles/
│   │   ├── globals.css          # ← OK pour ajouter styles custom
│   │   └── custom.css           # ← Vos styles dédiés
│   └── config/
│       ├── site.ts              # ← Configuration site (custom)
│       └── vtiger.ts            # ← Config Vtiger
├── public/
│   └── custom/                  # ← Vos assets
│       ├── images/
│       ├── icons/
│       └── fonts/
└── .env.local                   # ← Variables d'environnement

strapi/
├── src/
│   ├── api/                     # ← Content Types Strapi
│   │   └── custom-content/      # ← Vos content types
│   ├── extensions/              # ← Extensions Strapi
│   │   └── custom-plugin/
│   └── middlewares/             # ← Middlewares custom
│       └── vtiger-sync.ts
└── config/
    └── custom.ts                # ← Config custom (pas server.ts)
```

---

## 🎨 Conventions de nommage

### Fichiers et dossiers

```bash
# Composants React : PascalCase
ContactForm.tsx
CustomBlockRenderer.tsx
TestimonialsSection.tsx

# Utilitaires : camelCase
customStrapi.ts
vtigerApi.ts
formValidation.ts

# Routes API : kebab-case
api/contact/route.ts
api/vtiger-webhook/route.ts

# Dossiers : kebab-case
custom-pages/
ui-components/
```

### Variables et fonctions

```typescript
// ✅ BON
const userEmail = '[email protected]';
const API_KEY = process.env.VTIGER_API_KEY;
function validateEmail(email: string) { }
const CustomButton = () => { };

// ❌ MAUVAIS
const UserEmail = '[email protected]';  // Variable en PascalCase
const apikey = process.env.VTIGER_API_KEY;  // Constante pas en CAPS
function ValidateEmail(email: string) { }  // Fonction en PascalCase
const custom_button = () => { };  // Composant en snake_case
```

---

## 🔄 Workflow de développement

### Workflow quotidien

```bash
# 1. Début de journée : Mettre à jour develop
git checkout develop
git pull origin develop

# 2. Créer une branche feature
git checkout -b feature/ma-nouvelle-feature

# 3. Développer (cycle de travail)
# ... coder ...
git add .
git commit -m "feat(scope): description"

# ... coder encore ...
git add .
git commit -m "feat(scope): autre modif"

# 4. Push régulièrement
git push origin feature/ma-nouvelle-feature

# 5. Fin de feature : Pull Request
# Sur GitHub : feature/ma-nouvelle-feature → develop

# 6. Après merge : cleanup
git checkout develop
git pull origin develop
git branch -d feature/ma-nouvelle-feature
```

### Synchronisation avec upstream (hebdomadaire)

```bash
# 1. Mettre à jour main avec upstream
git checkout main
git fetch upstream
git merge upstream/main
git push origin main

# 2. Intégrer dans develop
git checkout develop
git merge main

# 3. Résoudre les conflits si nécessaire
# ... éditer les fichiers en conflit ...
git add .
git commit -m "chore: merge upstream changes"

# 4. Push
git push origin develop
```

---

## ✅ Code Review - Checklist

### Avant de créer une Pull Request

- [ ] Le code compile sans erreur : `yarn build`
- [ ] Les tests passent : `yarn test`
- [ ] Pas de console.log oubliés
- [ ] Variables d'environnement documentées
- [ ] Types TypeScript corrects
- [ ] Pas de `any` TypeScript
- [ ] Responsive testé (mobile, tablet, desktop)
- [ ] Accessibilité vérifiée (a11y)
- [ ] Performance vérifiée (Lighthouse)

### Template de Pull Request

```markdown
## Description
[Description claire de la feature/fix]

## Type de changement
- [ ] Nouvelle feature
- [ ] Bug fix
- [ ] Refactoring
- [ ] Documentation

## Checklist
- [ ] Code testé localement
- [ ] Pas de conflit avec develop
- [ ] Documentation mise à jour
- [ ] Variables d'env ajoutées à .env.example

## Screenshots (si applicable)
[Ajouter des captures d'écran]

## Tests
Comment tester cette PR :
1. Lancer `yarn dev`
2. Aller sur /contact
3. Remplir le formulaire
4. Vérifier l'envoi à Vtiger
```

---

## 🛡️ Sécurité

### Variables d'environnement

```bash
# ✅ BON : .env.local (jamais commité)
VTIGER_API_KEY=secret_key_12345
DATABASE_URL=postgresql://user:pass@localhost:5432/db
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337

# ❌ MAUVAIS : Variables en dur dans le code
const apiKey = "secret_key_12345";  // ← INTERDIT
```

### .env.example à jour

```bash
# .env.example (commité dans le repo)
# Strapi
STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your_token_here

# Vtiger
VTIGER_API_URL=https://your-vtiger.com/api
VTIGER_API_KEY=your_api_key
VTIGER_API_SECRET=your_api_secret

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Next.js
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 🧪 Tests

### Tester avant de commit

```bash
# Build
yarn build

# Linter
yarn lint

# Tests
yarn test

# Type check
yarn type-check
```

### Tests minimums requis

```typescript
// Pour les composants custom
describe('ContactForm', () => {
  it('should validate email', () => {
    // ...
  });
  
  it('should submit to API', () => {
    // ...
  });
});

// Pour les routes API
describe('POST /api/contact', () => {
  it('should return 400 if email invalid', () => {
    // ...
  });
  
  it('should call Vtiger API', () => {
    // ...
  });
});
```

---

## 📚 Ressources

### Documentation

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Flow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)
- [Next.js Best Practices](https://nextjs.org/docs/basic-features/layouts)
- [Strapi Best Practices](https://docs.strapi.io/dev-docs/backend-customization)

### Outils recommandés

```bash
# Linter pour commits
npm install -g @commitlint/cli

# Hooks pre-commit
npm install -g husky

# Formatter
npm install -g prettier
```

---

## 🎯 Récapitulatif

### ✅ À FAIRE

- ✅ Toujours travailler sur une branche feature
- ✅ Commits descriptifs avec Conventional Commits
- ✅ Pull Requests avec review avant merge
- ✅ Synchroniser main avec upstream régulièrement
- ✅ Créer des composants custom dans `/custom`
- ✅ Utiliser .env.local pour les secrets
- ✅ Tester avant de commit

### ❌ À NE JAMAIS FAIRE

- ❌ Commit direct sur `main`
- ❌ Modifier les fichiers core LaunchPad
- ❌ Push sans tester
- ❌ Variables sensibles en dur dans le code
- ❌ `git push --force` sur develop/main
- ❌ Merge sans résoudre les conflits
- ❌ Commits "WIP" ou "fix"

---

**Ces règles garantissent :**
- 🔄 Synchronisation facile avec upstream
- 🧹 Code propre et maintenable
- 👥 Collaboration efficace en équipe
- 🚀 Déploiements sans stress

**Bon développement ! 🚀**