# Guide du Back-office Strapi - LaunchPad

## 📋 Table des matières
1. [Introduction au Back-office Strapi](#introduction-au-back-office-strapi)
2. [Accès et connexion](#accès-et-connexion)
3. [Vue d'ensemble de l'interface](#vue-densemble-de-linterface)
4. [Content-Type Builder - Créer la structure](#content-type-builder---créer-la-structure)
5. [Content Manager - Gérer le contenu](#content-manager---gérer-le-contenu)
6. [Media Library - Gérer les médias](#media-library---gérer-les-médias)
7. [Cas pratiques](#cas-pratiques)
8. [Internationalisation (i18n)](#internationalisation-i18n)
9. [Workflow de publication](#workflow-de-publication)
10. [Bonnes pratiques](#bonnes-pratiques)

---

## 🎯 Introduction au Back-office Strapi

Le back-office Strapi (Admin Panel) est l'interface d'administration qui vous permet de :
- **Définir la structure** de votre contenu (Content-Type Builder)
- **Créer et gérer** le contenu (Content Manager)
- **Gérer les médias** (Media Library)
- **Configurer les utilisateurs** et permissions (Roles & Permissions)
- **Visualiser le contenu** avant publication (Preview)

**Philosophie de Strapi** : Vous ne touchez jamais au code pour gérer le contenu. Tout se fait via l'interface graphique intuitive.

---

## 🔑 Accès et connexion

### Première utilisation

1. **Démarrer Strapi** :
```bash
cd launchpad/strapi
yarn develop
```

2. **Accéder à l'admin** : `http://localhost:1337/admin`

3. **Créer le premier compte Super Admin** :
   - Prénom
   - Nom
   - Email
   - Mot de passe (min. 8 caractères)

### Connexion ultérieure

Utilisez simplement vos identifiants sur `http://localhost:1337/admin`

---

## 🏠 Vue d'ensemble de l'interface

### Menu principal (barre latérale gauche)

```
┌─────────────────────────────┐
│ 🏠 Dashboard                │  ← Vue d'ensemble
│ 📝 Content Manager          │  ← Gérer le contenu
│ 🔨 Content-Type Builder     │  ← Créer la structure
│ 🖼️  Media Library            │  ← Gérer les médias
│ 🔌 Plugins                  │  ← Extensions
│ ⚙️  Settings                 │  ← Configuration
└─────────────────────────────┘
```

### Zone de travail (centre)

C'est ici que vous créez et modifiez :
- Les types de contenu
- Les entrées de contenu
- Les médias

### Barre supérieure

- **Nom du projet** : LaunchPad
- **Notifications** : Alertes système
- **Profil utilisateur** : Paramètres du compte

---

## 🔨 Content-Type Builder - Créer la structure

Le Content-Type Builder est l'outil le plus important de Strapi. Il vous permet de définir **la structure de vos données** sans écrire une ligne de code.

### Les 3 types de structures

#### 1. Collection Types (Types de collection)

**Ce que c'est** : Plusieurs entrées d'un même type de contenu.

**Exemples** : Articles de blog, Produits, Événements, Témoignages

**Quand l'utiliser** : Quand vous avez plusieurs éléments similaires.

```
Articles
├── Article 1: "Comment utiliser Strapi"
├── Article 2: "Next.js et Strapi"
├── Article 3: "Déployer son site"
└── ...
```

#### 2. Single Types (Types uniques)

**Ce que c'est** : Une seule entrée, unique dans tout le système.

**Exemples** : Page d'accueil, Paramètres globaux, À propos, Contact

**Quand l'utiliser** : Pour du contenu unique qui n'a qu'une seule instance.

```
Homepage (une seule)
├── Titre principal
├── Description
├── Image hero
└── Sections...
```

#### 3. Components (Composants)

**Ce que c'est** : Blocs de contenu réutilisables dans plusieurs types.

**Exemples** : Bouton CTA, Carte produit, Section témoignage, Bloc vidéo

**Quand l'utiliser** : Pour éviter la répétition et créer des blocs modulaires.

```
Component: Button
├── Label (texte)
├── URL (lien)
└── Style (choix)

Utilisable dans → Articles, Pages, Produits...
```

---

### Créer un Collection Type (Étape par étape)

#### Exemple : Créer un type "Événements"

**Étape 1 : Accéder au Content-Type Builder**

1. Cliquez sur **"Content-Type Builder"** dans le menu latéral
2. Cliquez sur **"Create new collection type"**

**Étape 2 : Nommer le type**

```
Display name: Événement
└─ Strapi génère automatiquement :
   - API ID (singular): evenement
   - API ID (plural): evenements
```

💡 **Conseil** : Utilisez un nom au singulier, Strapi gère le pluriel automatiquement.

**Étape 3 : Ajouter des champs**

Cliquez sur **"Add another field"** et choisissez parmi :

##### Types de champs disponibles

**Champs texte** :
- **Text (court)** : Titre, nom, slug
  - Options : Requis, Unique, Min/Max longueur
- **Rich Text (long)** : Description, contenu formaté
  - Support Markdown ou HTML
- **Email** : Adresse email avec validation
- **Password** : Mot de passe chiffré

**Champs numériques** :
- **Number** : Prix, quantité, âge
  - Options : Integer, Float, Decimal
- **Date** : Date d'événement
  - Options : Date, DateTime, Time

**Champs de choix** :
- **Boolean** : Oui/Non (Publié, En vedette)
- **Enumeration** : Liste de choix (Catégorie, Statut)
  ```
  Statuts possibles:
  - brouillon
  - en_cours
  - publie
  - archive
  ```

**Champs média** :
- **Media (Simple)** : Une image, vidéo ou fichier
- **Media (Multiple)** : Galerie d'images

**Champs relationnels** :
- **Relation** : Lier à d'autres types
  - One-to-One (1→1)
  - One-to-Many (1→∞)
  - Many-to-Many (∞→∞)
- **UID** : Identifiant unique basé sur un autre champ
  ```
  Slug basé sur "titre"
  "Mon article" → "mon-article"
  ```

**Champs spéciaux** :
- **JSON** : Données structurées personnalisées
- **Component** : Bloc réutilisable
- **Dynamic Zone** : Zone flexible avec plusieurs types de composants

#### Configuration d'un événement complet

```
Collection Type: Événement
├── titre (Text, Requis, Unique)
│   └─ "Conférence Strapi 2025"
│
├── slug (UID basé sur "titre", Requis)
│   └─ "conference-strapi-2025"
│
├── description (Rich Text, Requis)
│   └─ Contenu formaté avec Markdown
│
├── date_debut (DateTime, Requis)
│   └─ 2025-06-15 09:00:00
│
├── date_fin (DateTime)
│   └─ 2025-06-15 18:00:00
│
├── lieu (Text)
│   └─ "Paris, France"
│
├── prix (Number - Decimal)
│   └─ 99.99
│
├── places_disponibles (Number - Integer)
│   └─ 150
│
├── en_vedette (Boolean)
│   └─ true/false
│
├── categorie (Enumeration)
│   └─ Options: conference, atelier, webinaire, meetup
│
├── image_principale (Media - Single)
│   └─ banner-event.jpg
│
├── galerie (Media - Multiple)
│   └─ [photo1.jpg, photo2.jpg, photo3.jpg]
│
├── organisateur (Relation - Many-to-One → Organisateurs)
│   └─ Lien vers un autre type de contenu
│
└── informations_supplementaires (Dynamic Zone)
    ├─ Section Programme (Component)
    ├─ Section Intervenants (Component)
    └─ Section FAQ (Component)
```

**Étape 4 : Sauvegarder**

Cliquez sur **"Save"** en haut à droite. Strapi redémarre automatiquement pour prendre en compte la nouvelle structure.

---

### Créer un Single Type

#### Exemple : Page d'accueil

**Étape 1** : Content-Type Builder → **"Create new single type"**

**Étape 2** : Nommer le type
```
Display name: Homepage
API ID: homepage
```

**Étape 3** : Ajouter les champs

```
Single Type: Homepage
├── seo (Component - Unique: SEO)
│   ├── meta_title
│   ├── meta_description
│   └── meta_image
│
├── hero_titre (Text)
│   └─ "Bienvenue sur LaunchPad"
│
├── hero_description (Rich Text)
│   └─ "Découvrez la puissance de Strapi..."
│
├── hero_image (Media - Single)
│   └─ hero-banner.jpg
│
├── bouton_cta (Component - Unique: Button)
│   ├── label: "Commencer"
│   ├── url: "/get-started"
│   └── style: "primary"
│
└── sections (Dynamic Zone)
    ├─ Features Section
    ├─ Testimonials Section
    ├─ Pricing Section
    └─ CTA Section
```

💡 **Important** : Un Single Type n'a qu'**une seule entrée**. Vous ne créez pas plusieurs "Homepage", juste une.

---

### Créer un Component (Composant)

Les composants sont des blocs réutilisables. C'est LA fonctionnalité qui rend Strapi flexible.

#### Exemple 1 : Composant "Bouton"

**Étape 1** : Content-Type Builder → **"Create new component"**

**Étape 2** : Choisir une catégorie
```
Catégorie: elements (ou créer "ui")
Nom: Button
└─ API ID: elements.button
```

**Étape 3** : Ajouter les champs
```
Component: elements.button
├── label (Text, Requis)
│   └─ "En savoir plus"
│
├── url (Text, Requis)
│   └─ "/about"
│
├── style (Enumeration)
│   └─ Options: primary, secondary, outline, ghost
│
└── ouverture_nouvel_onglet (Boolean)
    └─ true/false
```

**Utilisation** : Ce composant peut maintenant être ajouté à n'importe quel type de contenu.

#### Exemple 2 : Composant "Card Produit"

```
Component: sections.product-card
├── titre (Text)
├── description (Text)
├── image (Media - Single)
├── prix (Number - Decimal)
├── badge (Text) [Ex: "Nouveau", "Promo"]
└── bouton (Component - elements.button)
```

#### Exemple 3 : Composant "Section Hero"

```
Component: sections.hero
├── titre (Text)
├── sous_titre (Text)
├── description (Rich Text)
├── image_fond (Media - Single)
├── alignement (Enumeration: left, center, right)
└── boutons (Component - Repeatable: elements.button)
    ├─ Bouton 1: "Démarrer"
    └─ Bouton 2: "En savoir plus"
```

💡 **Repeatable** : Permet d'avoir plusieurs instances du même composant (plusieurs boutons, plusieurs cartes, etc.)

---

### Dynamic Zones - Le système de blocs

Les **Dynamic Zones** sont la fonctionnalité la plus puissante de Strapi. Elles permettent de créer des pages flexibles et modulaires.

#### Qu'est-ce qu'une Dynamic Zone ?

C'est un champ spécial qui peut contenir **plusieurs types de composants différents** que vous pouvez :
- Ajouter dans n'importe quel ordre
- Réorganiser par glisser-déposer
- Dupliquer
- Supprimer

#### Exemple : Page flexible

**Étape 1** : Créer les composants
```
sections.hero
sections.features
sections.testimonials
sections.pricing
sections.faq
sections.newsletter
sections.cta
```

**Étape 2** : Ajouter une Dynamic Zone
```
Collection Type: Page
├── titre (Text)
├── slug (UID)
└── contenu (Dynamic Zone)
    └─ Composants autorisés:
       ├─ sections.hero
       ├─ sections.features
       ├─ sections.testimonials
       ├─ sections.pricing
       ├─ sections.faq
       ├─ sections.newsletter
       └─ sections.cta
```

**Étape 3** : Dans le Content Manager, vous pouvez maintenant :
```
Page: "À propos"
└── contenu:
    [+ Ajouter un composant]
    ├─ Hero Section
    ├─ Features Section
    ├─ Testimonials Section
    └─ CTA Section

Page: "Tarifs"
└── contenu:
    [+ Ajouter un composant]
    ├─ Hero Section
    ├─ Pricing Section
    ├─ FAQ Section
    └─ Newsletter Section
```

💡 **Flexibilité totale** : Chaque page peut avoir une structure différente !

---

### Relations entre types

Les relations permettent de lier des types de contenu entre eux.

#### Types de relations

**1. One-to-One (1 → 1)**
```
Article → Auteur (un article = un auteur unique)
```

**2. One-to-Many (1 → ∞)**
```
Catégorie → Articles (une catégorie = plusieurs articles)
```

**3. Many-to-One (∞ → 1)**
```
Articles → Catégorie (plusieurs articles = une catégorie)
```

**4. Many-to-Many (∞ → ∞)**
```
Articles ↔ Tags (un article peut avoir plusieurs tags, un tag peut être sur plusieurs articles)
```

#### Créer une relation

**Exemple : Articles avec Catégories**

**Étape 1** : Créer le type "Catégorie"
```
Collection Type: Categorie
├── nom (Text, Unique)
├── slug (UID)
├── description (Rich Text)
└── couleur (Text) [Code couleur hex]
```

**Étape 2** : Ajouter la relation dans "Article"

1. Ouvrir le type "Article"
2. Ajouter un champ **"Relation"**
3. Configurer :
```
Type de relation: Many-to-One
Article (many) → Categorie (one)

Nom du champ: categorie
```

**Résultat** : Chaque article peut être lié à une catégorie.

#### Exemple avancé : Articles avec Tags

**Many-to-Many** : Un article peut avoir plusieurs tags, un tag peut être sur plusieurs articles.

```
Collection Type: Tag
├── nom (Text, Unique)
├── slug (UID)
└── couleur (Text)

Collection Type: Article
├── titre (Text)
├── contenu (Rich Text)
├── categorie (Relation - Many-to-One → Categorie)
└── tags (Relation - Many-to-Many → Tag)
```

---

## 📝 Content Manager - Gérer le contenu

Une fois la structure créée avec le Content-Type Builder, vous utilisez le **Content Manager** pour créer et gérer les entrées.

### Créer une nouvelle entrée

#### Exemple : Créer un article

**Étape 1** : Accéder au Content Manager
- Menu latéral → **"Content Manager"**
- Choisir **"Article"** dans la liste

**Étape 2** : Créer une entrée
- Cliquer sur **"Create new entry"**

**Étape 3** : Remplir les champs

```
┌─────────────────────────────────────┐
│ Create an entry                     │
├─────────────────────────────────────┤
│                                     │
│ Titre *                             │
│ [Guide complet de Strapi          ]│
│                                     │
│ Slug *                              │
│ [guide-complet-strapi            ]│
│ (généré automatiquement)            │
│                                     │
│ Description courte *                │
│ [Découvrez comment utiliser...   ]│
│                                     │
│ Contenu *                           │
│ [Éditeur Rich Text]                 │
│ # Introduction                      │
│ Strapi est un CMS headless...      │
│                                     │
│ Image de couverture *               │
│ [📷 Sélectionner média]             │
│                                     │
│ Date de publication                 │
│ [2025-11-23 10:00]                 │
│                                     │
│ Catégorie *                         │
│ [▼ Tutoriels]                      │
│                                     │
│ Tags                                │
│ [✓ Strapi] [✓ Next.js] [✓ CMS]   │
│                                     │
│ En vedette                          │
│ [☑] Oui                            │
│                                     │
│ Auteur                              │
│ [▼ John Doe]                       │
│                                     │
│ Sections (Dynamic Zone)             │
│ [+ Ajouter un composant]            │
│                                     │
│ ┌───────────────────────────────┐   │
│ │ 🎯 Hero Section              │   │
│ │ [Modifier] [↑] [↓] [🗑️]     │   │
│ └───────────────────────────────┘   │
│                                     │
│ ┌───────────────────────────────┐   │
│ │ ⭐ Features Section          │   │
│ │ [Modifier] [↑] [↓] [🗑️]     │   │
│ └───────────────────────────────┘   │
│                                     │
│ [+ Ajouter un composant]            │
│                                     │
└─────────────────────────────────────┘

[Enregistrer]  [Publier]
```

**Étape 4** : Sauvegarder ou publier

- **Save** : Enregistre en brouillon (Draft)
- **Publish** : Publie immédiatement
- **Schedule** : Programmer la publication (avec plugin)

### Éditer une entrée existante

1. Content Manager → Choisir le type
2. Cliquer sur l'entrée dans la liste
3. Modifier les champs
4. Sauvegarder

### Actions en masse

Sélectionnez plusieurs entrées pour :
- **Publier** plusieurs entrées en même temps
- **Dépublier** plusieurs entrées
- **Supprimer** plusieurs entrées

```
☑ Article 1
☑ Article 2
☑ Article 3

[Publier sélection] [Dépublier] [Supprimer]
```

### Filtrer et rechercher

```
┌─────────────────────────────────────┐
│ [🔍 Rechercher...]                  │
│                                     │
│ Filtres:                            │
│ [▼ Catégorie] [▼ Statut] [▼ Auteur]│
│                                     │
│ Trier par: [Date ↓]                │
└─────────────────────────────────────┘
```

**Filtres disponibles** :
- Par catégorie
- Par statut (publié, brouillon)
- Par date
- Par auteur
- Par tags

---

## 🖼️ Media Library - Gérer les médias

La Media Library est l'endroit où vous gérez tous vos fichiers : images, vidéos, PDF, etc.

### Télécharger des médias

**Méthode 1 : Glisser-Déposer**
1. Menu → **"Media Library"**
2. Glissez vos fichiers dans la zone

**Méthode 2 : Depuis un champ média**
1. Dans le Content Manager
2. Champ "Image" → **"Add new assets"**
3. Choisir les fichiers

### Organiser les médias

#### Dossiers

Créez des dossiers pour organiser :
```
Media Library
├── 📁 Blog
│   ├── 📁 Articles
│   └── 📁 Auteurs
├── 📁 Produits
│   ├── 📁 Électronique
│   └── 📁 Vêtements
└── 📁 Pages
    ├── 📁 Accueil
    └── 📁 À propos
```

**Créer un dossier** :
1. Bouton **"Create new folder"**
2. Nommer le dossier
3. Glisser les médias dedans

### Éditer les métadonnées

Cliquez sur une image pour :
```
┌─────────────────────────────────────┐
│ 🖼️  banner-article.jpg              │
├─────────────────────────────────────┤
│ Nom du fichier                      │
│ [banner-article.jpg              ] │
│                                     │
│ Texte alternatif (SEO) *            │
│ [Bannière de l'article sur Str...] │
│                                     │
│ Légende                             │
│ [Image d'illustration           ] │
│                                     │
│ Dimensions: 1920x1080               │
│ Taille: 450 KB                      │
│ Type: image/jpeg                    │
│                                     │
│ [Remplacer] [Télécharger] [Suppr.] │
└─────────────────────────────────────┘
```

💡 **SEO** : Le texte alternatif est crucial pour le référencement et l'accessibilité !

### Types de fichiers supportés

- **Images** : JPG, PNG, GIF, WebP, SVG
- **Vidéos** : MP4, MOV, AVI
- **Documents** : PDF, DOC, DOCX, XLS
- **Audio** : MP3, WAV
- **Autres** : ZIP, etc.

### Optimisation des images

Strapi peut optimiser automatiquement les images :
- Génération de miniatures
- Formats responsifs
- Compression automatique (avec plugins)

---

## 💼 Cas pratiques

### Cas 1 : Créer un blog complet

#### Étape 1 : Créer les types de contenu

**Collection Type : Article**
```
Article
├── titre (Text, Requis, Unique)
├── slug (UID basé sur titre)
├── description_courte (Text, 200 caractères max)
├── contenu (Rich Text, Requis)
├── image_couverture (Media - Single, Requis)
├── date_publication (DateTime)
├── temps_lecture (Number - Integer) [minutes]
├── en_vedette (Boolean)
├── categorie (Relation - Many-to-One → Categorie)
├── tags (Relation - Many-to-Many → Tag)
├── auteur (Relation - Many-to-One → Auteur)
└── seo (Component - seo.metadata)
```

**Collection Type : Catégorie**
```
Categorie
├── nom (Text, Requis, Unique)
├── slug (UID basé sur nom)
├── description (Rich Text)
├── couleur (Text) [hex color]
├── icone (Media - Single)
└── articles (Relation - One-to-Many ← Article)
```

**Collection Type : Tag**
```
Tag
├── nom (Text, Requis, Unique)
├── slug (UID)
└── articles (Relation - Many-to-Many ↔ Article)
```

**Collection Type : Auteur**
```
Auteur
├── nom (Text, Requis)
├── prenom (Text, Requis)
├── slug (UID basé sur nom + prenom)
├── bio (Rich Text)
├── photo (Media - Single)
├── poste (Text) [Ex: "Développeur Full-Stack"]
├── twitter (Text)
├── linkedin (Text)
├── site_web (Text)
└── articles (Relation - One-to-Many ← Article)
```

**Component : seo.metadata**
```
seo.metadata
├── meta_title (Text, 60 caractères max)
├── meta_description (Text, 160 caractères max)
├── meta_image (Media - Single)
└── keywords (Text)
```

#### Étape 2 : Créer le contenu

1. Créer les catégories :
   - Tutoriels
   - Actualités
   - Guides
   
2. Créer les tags :
   - Strapi, Next.js, React, JavaScript, etc.

3. Créer les auteurs

4. Créer les articles en les liant aux catégories, tags et auteurs

---

### Cas 2 : Site e-commerce simple

#### Types de contenu

**Collection Type : Produit**
```
Produit
├── nom (Text, Requis, Unique)
├── slug (UID)
├── description_courte (Text, 250 caractères)
├── description_complete (Rich Text)
├── prix (Number - Decimal, Requis)
├── prix_promo (Number - Decimal)
├── en_promotion (Boolean)
├── pourcentage_reduction (Number)
├── stock (Number - Integer)
├── disponible (Boolean)
├── image_principale (Media - Single, Requis)
├── galerie_images (Media - Multiple)
├── categorie (Relation - Many-to-One → Categorieproduit)
├── tags (Relation - Many-to-Many → Tagproduit)
├── caracteristiques (Component - Repeatable: produit.caracteristique)
│   ├─ nom (Text)
│   └─ valeur (Text)
├── variants (Component - Repeatable: produit.variant)
│   ├─ nom (Text) [Ex: "Taille"]
│   ├─ options (JSON) [Ex: ["S", "M", "L"]]
│   └─ prix_supplementaire (Number)
└── seo (Component - seo.metadata)
```

**Collection Type : CategorieProduct**
```
CategorieProduct
├── nom (Text, Requis, Unique)
├── slug (UID)
├── description (Rich Text)
├── image (Media - Single)
├── icone (Media - Single)
├── parent (Relation - Self) [Pour sous-catégories]
└── produits (Relation - One-to-Many ← Produit)
```

---

### Cas 3 : Site vitrine avec pages flexibles

**Single Type : Homepage**
```
Homepage
├── seo (Component - seo.metadata)
└── sections (Dynamic Zone)
    ├─ sections.hero
    ├─ sections.features
    ├─ sections.services
    ├─ sections.portfolio
    ├─ sections.testimonials
    ├─ sections.team
    ├─ sections.pricing
    ├─ sections.faq
    ├─ sections.blog-preview
    ├─ sections.newsletter
    └─ sections.cta
```

**Collection Type : Page**
```
Page
├── titre (Text, Requis)
├── slug (UID)
├── template (Enumeration: default, full-width, sidebar)
├── seo (Component - seo.metadata)
└── contenu (Dynamic Zone)
    [Mêmes composants que Homepage]
```

**Composants sections** (exemples) :

```
sections.hero
├── badge (Text)
├── titre (Text)
├── sous_titre (Text)
├── description (Rich Text)
├── image (Media - Single)
├── position_image (Enumeration: left, right)
└── boutons (Component - Repeatable: ui.button)

sections.features
├── badge (Text)
├── titre (Text)
├── description (Text)
├── layout (Enumeration: grid-2, grid-3, grid-4)
└── features (Component - Repeatable: sections.feature-item)
    ├─ icone (Media - Single)
    ├─ titre (Text)
    ├─ description (Text)
    └─ lien (Component - ui.link)

sections.testimonials
├── titre (Text)
├── description (Text)
└── testimonials (Component - Repeatable: sections.testimonial)
    ├─ contenu (Rich Text)
    ├─ auteur_nom (Text)
    ├─ auteur_poste (Text)
    ├─ auteur_photo (Media - Single)
    ├─ note (Number - 1 à 5)
    └─ entreprise_logo (Media - Single)

sections.cta
├── style (Enumeration: primary, gradient, dark)
├── titre (Text)
├── description (Text)
├── image_fond (Media - Single)
└── bouton (Component - ui.button)
```

---

## 🌍 Internationalisation (i18n)

L'internationalisation permet de créer du contenu dans plusieurs langues.

### Activer l'i18n

1. **Settings** → **Internationalization**
2. Ajouter les langues :
   - Français (fr) - Défaut
   - Anglais (en)
   - Espagnol (es)
   - Etc.

### Configurer un Content-Type pour l'i18n

**Étape 1** : Ouvrir le Content-Type Builder
**Étape 2** : Sélectionner votre type (ex: Article)
**Étape 3** : Cliquer sur "Edit"
**Étape 4** : Dans "Advanced Settings"
```
✅ Enable localization for this Content-Type
```

### Gérer les traductions

#### Créer une traduction

```
┌─────────────────────────────────────┐
│ Article: "Guide Strapi"             │
├─────────────────────────────────────┤
│ Locale: 🇫🇷 Français (fr)             │
│                                     │
│ [Create new locale] ▼               │
│   🇬🇧 English (en)                   │
│   🇪🇸 Español (es)                   │
└─────────────────────────────────────┘
```

**Workflow** :
1. Créer le contenu dans la langue par défaut (fr)
2. Publier la version française
3. Cliquer sur "Create new locale"
4. Choisir la langue cible (en)
5. Traduire les champs
6. Publier la version anglaise

#### Switcher entre les locales

```
┌─────────────────────────────────────┐
│ [🇫🇷 fr] [🇬🇧 en] [🇪🇸 es]            │
│                                     │
│ fr: ✅ Publié                        │
│ en: ✅ Publié                        │
│ es: 📝 Brouillon                    │
└─────────────────────────────────────┘
```

### Champs internationalisés vs partagés

Certains champs peuvent être **partagés** entre toutes les langues :

**Exemple : Produit**
```
Produit
├── nom (Text) → Internationalisé
│   ├─ fr: "Ordinateur portable"
│   └─ en: "Laptop"
│
├── description (Rich Text) → Internationalisé
│   ├─ fr: "Un ordinateur puissant..."
│   └─ en: "A powerful computer..."
│
├── prix (Number) → Partagé (même pour toutes les langues)
│   └─ 999.99
│
├── stock (Number) → Partagé
│   └─ 50
│
└── images (Media) → Partagé
    └─ [laptop.jpg, laptop-2.jpg]
```

**Configuration** :
- Dans le Content-Type Builder
- Modifier un champ
- Cocher/décocher "Enable localization for this field"

### API avec i18n

L'API Strapi gère automatiquement les locales :

```javascript
// Récupérer les articles en français
GET /api/articles?locale=fr

// Récupérer les articles en anglais
GET /api/articles?locale=en

// Récupérer toutes les locales d'un article
GET /api/articles/1?locale=all
```

---

## 📋 Workflow de publication

### Draft & Publish

Le système Draft & Publish permet de travailler sur du contenu sans le publier immédiatement.

### États du contenu

```
┌─────────────────────────────────────┐
│ 📝 Draft (Brouillon)                │
│ ↓ [Publier]                         │
│ ✅ Published (Publié)                │
│ ↓ [Dépublier]                       │
│ 📝 Draft (Modifications)            │
└─────────────────────────────────────┘
```

### Workflow type

**Scénario 1 : Nouvel article**
1. Créer l'article → État : Draft
2. Remplir le contenu
3. Cliquer sur "Save" → Reste en Draft
4. Prévisualiser (mode Preview)
5. Cliquer sur "Publish" → État : Published

**Scénario 2 : Modifier un article publié**
1. Ouvrir l'article publié
2. Modifier le contenu
3. "Save" → Crée une version Draft
4. L'ancienne version reste publiée
5. "Publish" → Remplace la version publiée

**Scénario 3 : Dépublier**
1. Ouvrir l'article publié
2. Cliquer sur "Unpublish"
3. L'article n'est plus accessible via l'API
4. Reste en Draft pour modification

### Preview Mode

Le Preview Mode permet de voir le contenu en brouillon sur votre site Next.js.

**Configuration dans Strapi** :
```
Settings → Preview
├─ URL de prévisualisation: http://localhost:3000/api/preview
├─ Secret: votre-secret-preview
└─ Template: /articles/{slug}
```

**Utilisation** :
1. Dans un article en Draft
2. Cliquer sur "Preview"
3. S'ouvre dans Next.js avec le contenu non publié
4. Voir le rendu final avant publication

---

## ⚙️ Settings - Configuration

### Administration Panel

#### Users & Permissions

**Rôles d'administration** :
```
Super Admin
├─ Accès total
├─ Gestion des utilisateurs
├─ Configuration système
└─ Tous les Content-Types

Editor (Éditeur)
├─ Créer/Modifier/Supprimer contenu
├─ Gérer la Media Library
└─ Pas d'accès aux Settings

Author (Auteur)
├─ Créer/Modifier son propre contenu
└─ Accès limité à la Media Library

Reviewer (Relecteur)
├─ Voir tout le contenu
└─ Commenter (pas de modification)
```

**Créer un utilisateur admin** :
1. Settings → Administration Panel → Users
2. "Add new user"
3. Remplir les informations
4. Choisir le rôle
5. Envoyer l'invitation

#### API Tokens

Créer des tokens pour accéder à l'API :

```
Settings → API Tokens → Create new API Token

Nom: Next.js Production
Type: 
  ○ Read-only (Lecture seule)
  ○ Full access (Accès complet)
  ● Custom (Personnalisé)

Permissions:
  Article
    ✅ find
    ✅ findOne
    ❌ create
    ❌ update
    ❌ delete
  
  Category
    ✅ find
    ✅ findOne

Duration: Unlimited
```

**Utilisation** :
```bash
# .env dans Next.js
NEXT_PUBLIC_API_TOKEN=votre-token-ici
```

### Roles & Permissions (Public)

Gérer les permissions pour l'API publique (sans authentification) :

```
Settings → Roles → Public

Article
├─ find: ✅ (Lister les articles)
├─ findOne: ✅ (Voir un article)
├─ create: ❌
├─ update: ❌
└─ delete: ❌

Category
├─ find: ✅
├─ findOne: ✅
└─ ...

Media
├─ find: ✅ (Nécessaire pour afficher les images)
└─ ...
```

### Email Configuration

Configurer l'envoi d'emails (notifications, reset password, etc.) :

```
Settings → Email Plugin

Provider: Sendgrid / Mailgun / SMTP
├─ SMTP Host: smtp.gmail.com
├─ SMTP Port: 587
├─ Username: votre-email@gmail.com
├─ Password: ••••••••
└─ From email: noreply@votresite.com
```

---

## 🔌 Plugins essentiels

### Plugins préinstallés dans LaunchPad

#### 1. Internationalization (i18n)
- Gestion multilingue
- Déjà configuré

#### 2. Upload
- Gestion des médias
- Media Library

#### 3. Users & Permissions
- Authentification
- Gestion des rôles

### Plugins recommandés à installer

#### SEO Plugin
```bash
yarn add @strapi/plugin-seo
```

**Utilisation** :
- Ajoute automatiquement des champs SEO
- Prévisualisation Google
- Analyse des mots-clés

#### Slugify Plugin
```bash
yarn add strapi-plugin-slugify
```

**Utilisation** :
- Génère automatiquement les slugs
- Évite les doublons
- Personnalisable

#### Sitemap Plugin
```bash
yarn add strapi-plugin-sitemap
```

**Utilisation** :
- Génère automatiquement sitemap.xml
- Configuration par Content-Type
- Mise à jour automatique

---

## 💡 Bonnes pratiques

### 1. Nommage des Content-Types

**✅ Bon** :
```
Article
Categorie
Produit
Auteur
Page
```

**❌ Éviter** :
```
article_de_blog (underscores)
ARTICLE (majuscules)
articles (déjà au pluriel)
```

### 2. Organisation des composants

**Structure recommandée** :
```
components/
├── ui/                    # Éléments UI de base
│   ├── button
│   ├── link
│   ├── card
│   └── badge
│
├── sections/              # Sections de page
│   ├── hero
│   ├── features
│   ├── testimonials
│   ├── pricing
│   └── cta
│
├── shared/                # Éléments partagés
│   ├── seo
│   ├── social-media
│   └── address
│
└── specific/              # Spécifiques métier
    ├── product-card
    ├── article-preview
    └── team-member
```

### 3. Gestion des médias

**Organisation** :
```
Media Library
├── 📁 Blog
│   ├── 📁 2024
│   └── 📁 2025
│       ├── 📁 Janvier
│       └── 📁 Février
│
├── 📁 Produits
│   ├── 📁 Électronique
│   └── 📁 Vêtements
│
├── 📁 Pages
│   ├── 📁 Accueil
│   └── 📁 About
│
└── 📁 Commun
    ├── 📁 Logos
    ├── 📁 Icônes
    └── 📁 Backgrounds
```

**Nommage des fichiers** :
```
✅ Bon:
hero-section-accueil.jpg
produit-laptop-dell-xps.jpg
logo-entreprise-2024.svg

❌ Éviter:
IMG_1234.jpg
Screenshot 2024-11-23.png
téléchargement (1).jpg
```

### 4. Optimisation des images

**Tailles recommandées** :
```
Hero banner: 1920x1080px (16:9)
Article cover: 1200x630px (OG image)
Product image: 1000x1000px (carré)
Thumbnail: 400x300px
Logo: 200x60px (ou SVG)
```

**Formats** :
- **JPG** : Photos, images complexes
- **PNG** : Logos avec transparence
- **SVG** : Icônes, illustrations vectorielles
- **WebP** : Format moderne (meilleure compression)

### 5. Structure des slugs

**Convention** :
```
Articles: /blog/mon-article-super-interessant
Produits: /produits/categorie/nom-produit
Pages: /nom-de-page

✅ Bon:
/blog/guide-complet-strapi-nextjs
/produits/electronique/laptop-dell-xps-15

❌ Éviter:
/blog/Guide_Complet_Strapi!!!
/produits/électronique/Laptop%20Dell
```

### 6. Relations et performance

**Éviter les relations circulaires** :
```
❌ Mauvais:
Article → Catégorie → Article (cercle infini)

✅ Bon:
Article → Catégorie (one-way)
```

**Limiter la profondeur des relations** :
```
❌ Trop profond:
Article → Catégorie → Parent → GrandParent → ...

✅ Optimal:
Article → Catégorie (1 niveau)
Article → Tags (1 niveau)
Article → Auteur (1 niveau)
```

### 7. SEO dans Strapi

**Composant SEO réutilisable** :
```
Component: shared.seo
├── meta_title (Text, 60 caractères max)
│   └─ Recommandation: 50-60 caractères
│
├── meta_description (Text, 160 caractères max)
│   └─ Recommandation: 150-160 caractères
│
├── meta_image (Media - Single)
│   └─ Format: 1200x630px (Open Graph)
│
├── keywords (Text)
│   └─ Séparés par des virgules
│
├── canonical_url (Text)
│   └─ URL canonique si besoin
│
└── no_index (Boolean)
    └─ Empêcher l'indexation Google
```

**Utilisation** :
```
Article
├── titre: "Guide complet Strapi"
├── contenu: ...
└── seo:
    ├─ meta_title: "Guide Complet Strapi 2025 - Tutoriel Débutant"
    ├─ meta_description: "Apprenez à utiliser Strapi avec ce guide complet..."
    └─ meta_image: guide-strapi-og.jpg
```

### 8. Validation des champs

**Utiliser les validations intégrées** :
```
Text
├─ Required: ✅
├─ Unique: ✅ (pour titre, email, etc.)
├─ Min length: 10
├─ Max length: 100
└─ Regex: /^[a-zA-Z0-9-]+$/ (pour slugs)

Email
├─ Required: ✅
└─ Format email validé automatiquement

Number
├─ Required: ✅
├─ Min: 0
├─ Max: 9999
└─ Format: Integer / Float / Decimal

URL
└─ Format URL validé automatiquement
```

### 9. Workflow d'équipe

**Process recommandé** :
```
1. 📝 Rédacteur crée l'article (Draft)
2. 👀 Relecteur vérifie le contenu
3. 📸 Designer ajoute les visuels
4. ✅ Éditeur valide et publie
5. 📊 Analyse des performances
```

**Utiliser les commentaires** :
- Ajouter des notes pour l'équipe
- Mentionner des collaborateurs
- Garder un historique des modifications

### 10. Backup et sécurité

**Sauvegardes régulières** :
```bash
# Backup de la base de données
# SQLite (dev)
cp .tmp/data.db backups/data-2024-11-23.db

# PostgreSQL (production)
pg_dump database_name > backup.sql
```

**Variables d'environnement sensibles** :
```bash
# Ne JAMAIS committer ces informations
DATABASE_PASSWORD=••••••
API_TOKEN_SALT=••••••
ADMIN_JWT_SECRET=••••••
JWT_SECRET=••••••
```

---

## 🚀 Workflow complet : De Strapi à Next.js

### Exemple : Créer une page "Services"

#### Étape 1 : Dans Strapi - Créer la structure

**1.1 Créer les composants**
```
sections.service-item
├── icone (Media - Single)
├── titre (Text)
├── description (Rich Text)
├── points_forts (Component - Repeatable)
│   └── texte (Text)
└── lien (Component - ui.link)
```

**1.2 Créer le Single Type**
```
Single Type: Services Page
├── seo (Component - shared.seo)
├── hero_titre (Text)
├── hero_description (Text)
└── services (Component - Repeatable: sections.service-item)
```

#### Étape 2 : Dans Strapi - Ajouter le contenu

```
Services Page (Content Manager)
├── SEO
│   ├─ Title: "Nos Services - LaunchPad"
│   └─ Description: "Découvrez nos services..."
│
├── hero_titre: "Nos Services"
├── hero_description: "Des solutions adaptées à vos besoins"
│
└── services
    ├─ Service 1
    │  ├─ icone: [icon-dev.svg]
    │  ├─ titre: "Développement Web"
    │  ├─ description: "Création de sites..."
    │  └─ points_forts:
    │     ├─ "Next.js & React"
    │     ├─ "Performance optimale"
    │     └─ "SEO-friendly"
    │
    ├─ Service 2
    │  ├─ icone: [icon-design.svg]
    │  ├─ titre: "Design UI/UX"
    │  └─ ...
    │
    └─ Service 3
       └─ ...
```

**Publier** la page.

#### Étape 3 : Dans Next.js - Créer la fonction API

```typescript
// lib/strapi.ts
export async function fetchServicesPage(locale = 'fr') {
  const response = await fetchAPI(
    `/services-page?locale=${locale}&populate=deep`,
    {
      next: { revalidate: 60 }
    }
  );
  
  return response.data;
}
```

#### Étape 4 : Dans Next.js - Créer la page

```typescript
// app/[locale]/services/page.tsx
import { fetchServicesPage } from '@/lib/strapi';
import { ServiceItem } from '@/components/ServiceItem';

export default async function ServicesPage({
  params,
}: {
  params: { locale: string };
}) {
  const pageData = await fetchServicesPage(params.locale);
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            {pageData.attributes.hero_titre}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {pageData.attributes.hero_description}
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pageData.attributes.services.map((service, index) => (
              <ServiceItem key={index} service={service} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// SEO
export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const pageData = await fetchServicesPage(params.locale);
  const seo = pageData.attributes.seo;
  
  return {
    title: seo.meta_title,
    description: seo.meta_description,
    openGraph: {
      images: [seo.meta_image?.data?.attributes?.url],
    },
  };
}
```

#### Étape 5 : Créer le composant ServiceItem

```typescript
// components/ServiceItem.tsx
import Image from 'next/image';
import { getStrapiMedia } from '@/lib/utils';

export function ServiceItem({ service }) {
  const iconUrl = getStrapiMedia(service.icone?.data?.attributes?.url);
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition">
      {/* Icône */}
      {iconUrl && (
        <div className="w-16 h-16 mb-6">
          <Image
            src={iconUrl}
            alt={service.titre}
            width={64}
            height={64}
            className="w-full h-full object-contain"
          />
        </div>
      )}
      
      {/* Titre */}
      <h3 className="text-2xl font-bold mb-4">
        {service.titre}
      </h3>
      
      {/* Description */}
      <div 
        className="text-gray-600 mb-6 prose prose-sm"
        dangerouslySetInnerHTML={{ __html: service.description }}
      />
      
      {/* Points forts */}
      {service.points_forts && (
        <ul className="space-y-2 mb-6">
          {service.points_forts.map((point, index) => (
            <li key={index} className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span className="text-gray-700">{point.texte}</span>
            </li>
          ))}
        </ul>
      )}
      
      {/* Lien */}
      {service.lien && (
        <a
          href={service.lien.url}
          className="text-blue-600 font-semibold hover:text-blue-700"
        >
          {service.lien.label} →
        </a>
      )}
    </div>
  );
}
```

#### Résultat

✅ Page créée entièrement depuis Strapi
✅ Aucun code à modifier pour ajouter/modifier des services
✅ SEO optimisé
✅ Performance optimale (SSR + cache)
✅ Multilingue (si i18n activé)

---

## 📊 Exemple complet : Blog avec système de filtres

### Dans Strapi

**Structure complète** :
```
Collection: Article
├── titre (Text, Requis, Unique)
├── slug (UID)
├── description_courte (Text, 200 max)
├── contenu (Rich Text, Requis)
├── image_couverture (Media - Single)
├── date_publication (DateTime)
├── temps_lecture (Number) [minutes]
├── en_vedette (Boolean)
├── categorie (Relation → Categorie)
├── tags (Relation → Tag)
├── auteur (Relation → Auteur)
└── seo (Component - shared.seo)

Collection: Categorie
├── nom (Text, Unique)
├── slug (UID)
├── description (Rich Text)
├── couleur (Text)
└── articles (Relation ← Article)

Collection: Tag
├── nom (Text, Unique)
├── slug (UID)
└── articles (Relation ← Article)

Collection: Auteur
├── nom_complet (Text)
├── slug (UID)
├── bio (Rich Text)
├── photo (Media)
├── poste (Text)
└── articles (Relation ← Article)
```

### Dans Next.js

**Page liste avec filtres** :
```typescript
// app/[locale]/blog/page.tsx
import { fetchArticles, fetchCategories } from '@/lib/strapi';

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { categorie?: string; tag?: string };
}) {
  const articles = await fetchArticles({
    categorie: searchParams.categorie,
    tag: searchParams.tag,
  });
  
  const categories = await fetchCategories();
  
  return (
    <div className="container mx-auto py-16">
      {/* Filtres */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Catégories</h2>
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/blog?categorie=${cat.attributes.slug}`}
              className="px-4 py-2 rounded-full bg-gray-100 hover:bg-blue-100"
            >
              {cat.attributes.nom}
            </Link>
          ))}
        </div>
      </div>

      {/* Articles */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
```

---

## 🎓 Exercices pratiques

### Exercice 1 : Portfolio de projets

**Objectif** : Créer un portfolio avec filtres par technologie

**À créer dans Strapi** :
1. Collection Type "Projet"
2. Collection Type "Technologie"
3. Relation Many-to-Many entre les deux
4. Composant "capture-ecran" (repeatable)

**Challenge** : Ajouter un filtre par type de projet (Web, Mobile, Desktop)

### Exercice 2 : FAQ dynamique

**Objectif** : Section FAQ avec catégories

**À créer** :
1. Collection Type "Question"
2. Collection Type "CategorieQuestion"
3. Champs : question, reponse, categorie, ordre

**Challenge** : Système de recherche dans les questions

### Exercice 3 : Témoignages avec notes

**Objectif** : Système de témoignages clients

**À créer** :
1. Collection Type "Temoignage"
2. Champs : contenu, auteur, photo, poste, entreprise, note (1-5)
3. Boolean "afficher_sur_homepage"

**Challenge** : Filtrer par note minimum, afficher moyenne des notes

---

## 🆘 Dépannage courant

### Problème : "Forbidden" lors de l'accès à l'API

**Solution** :
1. Vérifier Settings → Roles → Public
2. Activer `find` et `findOne` pour le Content-Type
3. Redémarrer Strapi

### Problème : Les images ne s'affichent pas

**Solution** :
```javascript
// Vérifier l'URL complète
const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}${image.url}`;

// Configurer next.config.js
images: {
  domains: ['localhost', 'votre-strapi.com'],
}
```

### Problème : Le slug ne se génère pas automatiquement

**Solution** :
1. Content-Type Builder → Ouvrir le type
2. Modifier le champ "slug"
3. Vérifier "Attached field" → Sélectionner "titre"
4. Sauvegarder

### Problème : Relations non peuplées dans l'API

**Solution** :
```javascript
// Ajouter populate
/api/articles?populate=*
/api/articles?populate=deep // Tout peupler
/api/articles?populate[categorie]=* // Spécifique
```

---

## 📚 Ressources supplémentaires

### Documentation officielle
- [Strapi Docs](https://docs.strapi.io)
- [Content-Type Builder](https://docs.strapi.io/user-docs/content-type-builder)
- [Content Manager](https://docs.strapi.io/user-docs/content-manager)

### Tutoriels
- [Strapi YouTube Channel](https://www.youtube.com/@Strapi)
- [Strapi Blog](https://strapi.io/blog)

### Communauté
- [Discord Strapi](https://discord.strapi.io)
- [Forum Strapi](https://forum.strapi.io)
- [GitHub](https://github.com/strapi/strapi)

---

## ✅ Checklist avant de démarrer un projet

### Configuration Strapi
- [ ] Strapi installé et démarré
- [ ] Premier compte admin créé
- [ ] Variables d'environnement configurées
- [ ] Base de données configurée

### Structure de contenu
- [ ] Content-Types créés
- [ ] Relations définies
- [ ] Composants créés
- [ ] Dynamic Zones configurées
- [ ] i18n activé (si besoin)

### Permissions
- [ ] Permissions Public configurées
- [ ] API Token créé pour Next.js
- [ ] Rôles d'équipe définis

### Contenu
- [ ] Contenu de test créé
- [ ] Médias organisés
- [ ] SEO configuré
- [ ] Traductions ajoutées (si i18n)

### Next.js
- [ ] Variables d'environnement configurées
- [ ] Fonctions API créées
- [ ] Pages créées
- [ ] Composants créés
- [ ] Images configurées

---

**Vous avez maintenant toutes les clés pour maîtriser Strapi ! 🚀**

N'hésitez pas à expérimenter, la meilleure façon d'apprendre est de pratiquer. Strapi est très flexible et pardonne les erreurs en développement.