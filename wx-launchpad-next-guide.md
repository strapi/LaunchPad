# Guide du projet Next.js - Strapi LaunchPad

## 📋 Table des matières
1. [Vue d'ensemble](#vue-densemble)
2. [Structure du projet](#structure-du-projet)
3. [Configuration initiale](#configuration-initiale)
4. [Architecture et fonctionnement](#architecture-et-fonctionnement)
5. [Composants principaux](#composants-principaux)
6. [Gestion des données](#gestion-des-données)
7. [Routing et pages](#routing-et-pages)
8. [Modification et personnalisation](#modification-et-personnalisation)
9. [Bonnes pratiques](#bonnes-pratiques)

---

## 🎯 Vue d'ensemble

Le projet Next.js de LaunchPad est une application moderne construite avec :
- **Next.js 14+** avec App Router
- **TypeScript** pour le typage statique
- **Tailwind CSS** pour le style
- **Aceternity UI** pour les composants visuels modernes
- **React Server Components** pour les performances

L'application récupère du contenu dynamique depuis Strapi et le rend côté serveur pour des performances optimales.

---

## 📁 Structure du projet

```
launchpad/
└── next/
    ├── src/
    │   ├── app/                    # App Router de Next.js
    │   │   ├── [locale]/          # Routes internationalisées
    │   │   │   ├── layout.tsx     # Layout principal
    │   │   │   ├── page.tsx       # Page d'accueil
    │   │   │   ├── articles/      # Pages d'articles
    │   │   │   ├── pricing/       # Page de tarification
    │   │   │   └── ...
    │   │   ├── api/               # API routes (preview, etc.)
    │   │   └── globals.css        # Styles globaux
    │   │
    │   ├── components/            # Composants React
    │   │   ├── blocks/           # Blocs de contenu dynamiques
    │   │   ├── ui/               # Composants UI réutilisables
    │   │   ├── Header.tsx        # En-tête
    │   │   ├── Footer.tsx        # Pied de page
    │   │   └── ...
    │   │
    │   ├── lib/                   # Utilitaires et helpers
    │   │   ├── strapi.ts         # Client API Strapi
    │   │   ├── utils.ts          # Fonctions utilitaires
    │   │   └── types.ts          # Types TypeScript
    │   │
    │   └── middleware.ts          # Middleware Next.js
    │
    ├── public/                    # Assets statiques
    ├── .env.example              # Variables d'environnement
    ├── next.config.js            # Configuration Next.js
    ├── tailwind.config.ts        # Configuration Tailwind
    └── package.json              # Dépendances
```

---

## ⚙️ Configuration initiale

### 1. Variables d'environnement

Créer un fichier `.env` à la racine du dossier `next/` :

```bash
# URL de votre instance Strapi
NEXT_PUBLIC_API_URL=http://localhost:1337

# Token d'authentification Strapi (optionnel pour le contenu public)
NEXT_PUBLIC_API_TOKEN=your-api-token-here

# Configuration des images
IMAGE_HOSTNAME=localhost

# Secret pour le mode preview
PREVIEW_SECRET=your-preview-secret
```

### 2. Installation et démarrage

```bash
# Aller dans le dossier next
cd launchpad/next

# Installer les dépendances
yarn install

# Lancer en développement
yarn dev

# Build pour production
yarn build
yarn start
```

L'application sera accessible sur `http://localhost:3000`

---

## 🏗️ Architecture et fonctionnement

### App Router de Next.js

Le projet utilise l'App Router (Next.js 13+) avec les fonctionnalités suivantes :

#### Structure des routes avec internationalisation

```
app/
└── [locale]/              # Paramètre dynamique pour la langue (fr, en, etc.)
    ├── layout.tsx         # Layout partagé pour toutes les pages
    ├── page.tsx           # Page d'accueil (/)
    ├── articles/
    │   ├── page.tsx       # Liste des articles (/articles)
    │   └── [slug]/
    │       └── page.tsx   # Détail article (/articles/mon-article)
    └── pricing/
        └── page.tsx       # Page de tarification (/pricing)
```

### React Server Components (RSC)

La majorité des composants sont des **Server Components** par défaut :

```typescript
// Composant serveur (par défaut)
// Peut fetch des données directement
export default async function ArticlesPage() {
  const articles = await fetchArticles();
  
  return <ArticleList articles={articles} />;
}
```

Les composants interactifs nécessitent la directive `'use client'` :

```typescript
'use client';

// Composant client (interactif)
import { useState } from 'react';

export function SearchBar() {
  const [query, setQuery] = useState('');
  // ... logique interactive
}
```

---

## 🧩 Composants principaux

### 1. Layout principal (`app/[locale]/layout.tsx`)

C'est le wrapper de toute l'application :

```typescript
export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Récupération des données globales (navigation, footer)
  const globalData = await fetchGlobal(params.locale);
  
  return (
    <html lang={params.locale}>
      <body>
        <Header navigation={globalData.navigation} />
        <main>{children}</main>
        <Footer data={globalData.footer} />
      </body>
    </html>
  );
}
```

**Modification** : Ajoutez ici des éléments qui doivent apparaître sur toutes les pages (analytics, providers, etc.)

### 2. Pages dynamiques

Exemple de page d'accueil (`app/[locale]/page.tsx`) :

```typescript
export default async function HomePage({
  params,
}: {
  params: { locale: string };
}) {
  // Récupération du contenu de la page d'accueil
  const homeData = await fetchHomePage(params.locale);
  
  return (
    <div>
      {/* Rendu des blocs dynamiques */}
      {homeData.blocks?.map((block, index) => (
        <BlockRenderer key={index} block={block} />
      ))}
    </div>
  );
}
```

### 3. BlockRenderer - Système de blocs dynamiques

Le `BlockRenderer` est le cœur du système de contenu dynamique :

```typescript
// components/blocks/BlockRenderer.tsx
export function BlockRenderer({ block }: { block: any }) {
  // Switch sur le type de bloc défini dans Strapi
  switch (block.__component) {
    case 'sections.hero':
      return <HeroBlock {...block} />;
    
    case 'sections.features':
      return <FeaturesBlock {...block} />;
    
    case 'sections.testimonials':
      return <TestimonialsBlock {...block} />;
    
    case 'sections.cta':
      return <CTABlock {...block} />;
    
    default:
      console.warn(`Block type ${block.__component} not found`);
      return null;
  }
}
```

**Comment ça marche** :
1. Dans Strapi, vous créez des "Dynamic Zones" qui contiennent différents types de blocs
2. Chaque bloc a un `__component` qui identifie son type
3. Le `BlockRenderer` affiche le bon composant React selon le type

### 4. Création d'un nouveau bloc

Pour ajouter un nouveau type de bloc :

**Étape 1** : Créer le composant React

```typescript
// components/blocks/NewsletterBlock.tsx
export function NewsletterBlock({ 
  title, 
  description, 
  placeholder 
}: {
  title: string;
  description: string;
  placeholder: string;
}) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        <p className="mb-6">{description}</p>
        <form className="flex gap-2">
          <input 
            type="email" 
            placeholder={placeholder}
            className="flex-1 px-4 py-2 border rounded"
          />
          <button className="px-6 py-2 bg-blue-600 text-white rounded">
            S'inscrire
          </button>
        </form>
      </div>
    </section>
  );
}
```

**Étape 2** : Ajouter au BlockRenderer

```typescript
// components/blocks/BlockRenderer.tsx
import { NewsletterBlock } from './NewsletterBlock';

export function BlockRenderer({ block }: { block: any }) {
  switch (block.__component) {
    // ... autres cas
    
    case 'sections.newsletter':
      return <NewsletterBlock {...block} />;
    
    default:
      return null;
  }
}
```

**Étape 3** : Créer le type de contenu dans Strapi

Dans l'admin Strapi, créez un nouveau composant `sections.newsletter` avec les champs : `title`, `description`, `placeholder`.

---

## 🔄 Gestion des données

### Récupération depuis Strapi

Le projet utilise un client API personnalisé dans `lib/strapi.ts` :

```typescript
// lib/strapi.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;

export async function fetchAPI(
  path: string,
  options: RequestInit = {}
) {
  const url = `${API_URL}/api${path}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (API_TOKEN) {
    headers['Authorization'] = `Bearer ${API_TOKEN}`;
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
    // Cache Next.js (important pour les performances)
    next: { revalidate: 60 }, // Revalider toutes les 60 secondes
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  
  return response.json();
}

// Fonction helper pour récupérer des articles
export async function fetchArticles(locale = 'fr') {
  const data = await fetchAPI(
    `/articles?locale=${locale}&populate=*`
  );
  return data.data;
}

// Fonction helper pour récupérer un article spécifique
export async function fetchArticle(slug: string, locale = 'fr') {
  const data = await fetchAPI(
    `/articles?filters[slug][$eq]=${slug}&locale=${locale}&populate=deep`
  );
  return data.data[0];
}
```

### Stratégies de cache

Next.js offre plusieurs options de cache :

```typescript
// 1. Statique (généré au build)
export const dynamic = 'force-static';

// 2. Revalidation périodique (ISR)
export const revalidate = 3600; // Revalider toutes les heures

// 3. Dynamique (à chaque requête)
export const dynamic = 'force-dynamic';

// 4. Revalidation on-demand via API route
// app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  const { path } = await request.json();
  revalidatePath(path);
  return Response.json({ revalidated: true });
}
```

### Mode Preview (brouillon)

Le projet inclut un système de preview pour voir les contenus en brouillon :

```typescript
// app/api/preview/route.ts
import { draftMode } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug');
  
  // Vérifier le secret
  if (secret !== process.env.PREVIEW_SECRET) {
    return new Response('Invalid token', { status: 401 });
  }
  
  // Activer le draft mode
  draftMode().enable();
  
  // Rediriger vers la page
  return Response.redirect(new URL(`/articles/${slug}`, request.url));
}
```

---

## 🛣️ Routing et pages

### Créer une nouvelle page

**1. Page statique simple**

```typescript
// app/[locale]/about/page.tsx
export default function AboutPage() {
  return (
    <div className="container mx-auto py-16">
      <h1 className="text-4xl font-bold mb-8">À propos</h1>
      <p>Contenu de la page...</p>
    </div>
  );
}

// Métadonnées SEO
export const metadata = {
  title: 'À propos - LaunchPad',
  description: 'Découvrez notre histoire',
};
```

**2. Page avec données dynamiques**

```typescript
// app/[locale]/team/page.tsx
import { fetchTeamMembers } from '@/lib/strapi';

export default async function TeamPage({
  params,
}: {
  params: { locale: string };
}) {
  const members = await fetchTeamMembers(params.locale);
  
  return (
    <div className="container mx-auto py-16">
      <h1 className="text-4xl font-bold mb-8">Notre équipe</h1>
      <div className="grid md:grid-cols-3 gap-8">
        {members.map((member) => (
          <div key={member.id} className="text-center">
            <img 
              src={member.photo.url} 
              alt={member.name}
              className="w-32 h-32 rounded-full mx-auto mb-4"
            />
            <h3 className="font-bold">{member.name}</h3>
            <p className="text-gray-600">{member.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

**3. Page avec route dynamique**

```typescript
// app/[locale]/products/[slug]/page.tsx
import { fetchProduct, fetchProducts } from '@/lib/strapi';

// Générer les chemins statiques (SSG)
export async function generateStaticParams() {
  const products = await fetchProducts();
  
  return products.map((product) => ({
    slug: product.attributes.slug,
  }));
}

// La page elle-même
export default async function ProductPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const product = await fetchProduct(params.slug, params.locale);
  
  return (
    <div className="container mx-auto py-16">
      <h1 className="text-4xl font-bold mb-4">
        {product.attributes.name}
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        {product.attributes.price}€
      </p>
      <div className="prose max-w-none">
        {product.attributes.description}
      </div>
    </div>
  );
}

// Métadonnées dynamiques
export async function generateMetadata({
  params,
}: {
  params: { slug: string; locale: string };
}) {
  const product = await fetchProduct(params.slug, params.locale);
  
  return {
    title: product.attributes.name,
    description: product.attributes.shortDescription,
  };
}
```

### Navigation entre pages

```typescript
// components/Navigation.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Navigation({ items }: { items: any[] }) {
  const pathname = usePathname();
  
  return (
    <nav className="flex gap-6">
      {items.map((item) => {
        const isActive = pathname === item.path;
        
        return (
          <Link
            key={item.id}
            href={item.path}
            className={`hover:text-blue-600 transition ${
              isActive ? 'font-bold text-blue-600' : ''
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
```

---

## 🎨 Modification et personnalisation

### 1. Changer le style (Tailwind)

Modifier le fichier `tailwind.config.ts` :

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Vos couleurs personnalisées
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          // ... autres nuances
          900: '#0c4a6e',
        },
        // Ou simplement
        brand: '#3B82F6',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      container: {
        center: true,
        padding: '2rem',
      },
    },
  },
  plugins: [],
};

export default config;
```

Utilisation dans les composants :

```typescript
<div className="bg-primary-500 text-white">
  <h1 className="font-heading text-4xl">Mon titre</h1>
</div>
```

### 2. Ajouter des polices personnalisées

```typescript
// app/[locale]/layout.tsx
import { Inter, Poppins } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const poppins = Poppins({ 
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

export default function RootLayout({ children }) {
  return (
    <html className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
```

### 3. Ajouter des animations

Installez des bibliothèques d'animations :

```bash
yarn add framer-motion
```

Utilisez-les dans vos composants :

```typescript
'use client';

import { motion } from 'framer-motion';

export function AnimatedCard({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      className="p-6 bg-white rounded-lg shadow-lg"
    >
      {children}
    </motion.div>
  );
}
```

### 4. Créer un composant UI réutilisable

```typescript
// components/ui/Button.tsx
import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils'; // Helper pour combiner classes

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-semibold rounded-lg transition-colors';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
```

Utilisation :

```typescript
<Button variant="primary" size="lg" onClick={handleClick}>
  Cliquez-moi
</Button>
```

### 5. Gestion des images

Next.js optimise automatiquement les images :

```typescript
import Image from 'next/image';

// Image depuis Strapi
function StrapiImage({ image, alt }) {
  const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}${image.url}`;
  
  return (
    <Image
      src={imageUrl}
      alt={alt}
      width={image.width}
      height={image.height}
      className="rounded-lg"
      // Lazy loading par défaut
      // Optimisation automatique
    />
  );
}

// Image statique locale
function LogoImage() {
  return (
    <Image
      src="/logo.png"
      alt="Logo"
      width={150}
      height={50}
      priority // Charge immédiatement (pour logo, hero, etc.)
    />
  );
}
```

---

## ✅ Bonnes pratiques

### 1. Organisation des composants

```
components/
├── blocks/           # Blocs de contenu Strapi
│   ├── HeroBlock.tsx
│   ├── FeaturesBlock.tsx
│   └── BlockRenderer.tsx
├── ui/              # Composants UI réutilisables
│   ├── Button.tsx
│   ├── Card.tsx
│   └── Input.tsx
├── layout/          # Composants de layout
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Sidebar.tsx
└── features/        # Composants métier
    ├── ArticleList.tsx
    ├── SearchBar.tsx
    └── Newsletter.tsx
```

### 2. Typage TypeScript

Créez des types pour vos données Strapi :

```typescript
// lib/types.ts
export interface StrapiImage {
  id: number;
  url: string;
  width: number;
  height: number;
  alternativeText: string;
}

export interface Article {
  id: number;
  attributes: {
    title: string;
    slug: string;
    content: string;
    publishedAt: string;
    cover: {
      data: StrapiImage;
    };
    category: {
      data: {
        id: number;
        attributes: {
          name: string;
          slug: string;
        };
      };
    };
  };
}

export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
```

### 3. Gestion des erreurs

```typescript
// app/[locale]/articles/page.tsx
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default async function ArticlesPage() {
  try {
    const articles = await fetchArticles();
    
    if (!articles || articles.length === 0) {
      return <EmptyState message="Aucun article disponible" />;
    }
    
    return <ArticleList articles={articles} />;
    
  } catch (error) {
    console.error('Error fetching articles:', error);
    return <ErrorState />;
  }
}

// Composant d'erreur
function ErrorState() {
  return (
    <div className="text-center py-16">
      <h2 className="text-2xl font-bold mb-4">
        Une erreur est survenue
      </h2>
      <p className="text-gray-600 mb-8">
        Impossible de charger les articles
      </p>
      <Button onClick={() => window.location.reload()}>
        Réessayer
      </Button>
    </div>
  );
}
```

### 4. Performance

```typescript
// Lazy loading de composants lourds
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('./HeavyChart'), {
  loading: () => <div>Chargement...</div>,
  ssr: false, // Ne pas rendre côté serveur
});

// Mémorisation
import { cache } from 'react';

// Cache les résultats entre requêtes
export const fetchArticles = cache(async (locale: string) => {
  const data = await fetchAPI(`/articles?locale=${locale}`);
  return data.data;
});
```

### 5. SEO

```typescript
// app/[locale]/articles/[slug]/page.tsx
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: { slug: string; locale: string };
}): Promise<Metadata> {
  const article = await fetchArticle(params.slug, params.locale);
  
  return {
    title: article.attributes.title,
    description: article.attributes.excerpt,
    openGraph: {
      title: article.attributes.title,
      description: article.attributes.excerpt,
      images: [
        {
          url: article.attributes.cover.data.url,
          width: 1200,
          height: 630,
        },
      ],
      type: 'article',
      publishedTime: article.attributes.publishedAt,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.attributes.title,
      description: article.attributes.excerpt,
      images: [article.attributes.cover.data.url],
    },
  };
}
```

### 6. Internationalisation

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['fr', 'en', 'es'];
const defaultLocale = 'fr';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Vérifier si la locale est dans le path
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  
  if (pathnameHasLocale) return;
  
  // Rediriger vers la locale par défaut
  const locale = defaultLocale;
  request.nextUrl.pathname = `/${locale}${pathname}`;
  
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Skip internal paths
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

---

## 🚀 Déploiement

### Variables d'environnement en production

Sur Vercel ou autre plateforme, configurez :

```
NEXT_PUBLIC_API_URL=https://your-strapi.com
NEXT_PUBLIC_API_TOKEN=your-production-token
IMAGE_HOSTNAME=your-strapi.com
PREVIEW_SECRET=your-secret-key
```

### Build optimisé

```bash
# Build de production
yarn build

# Analyser la taille du bundle
yarn add -D @next/bundle-analyzer

# next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // ... votre config
});

# Lancer l'analyse
ANALYZE=true yarn build
```

---

## 📚 Ressources utiles

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Strapi](https://docs.strapi.io)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs)
- [Repository LaunchPad](https://github.com/strapi/launchpad)

---

## 💡 Exemples de modifications courantes

### Ajouter une section "Blog" complète

1. Créer la page liste
2. Créer la page détail
3. Ajouter la navigation
4. Créer les types Strapi correspondants

### Intégrer un formulaire de contact

1. Créer le composant formulaire
2. Créer l'API route pour l'envoi
3. Connecter à Strapi ou service email

### Ajouter un système de recherche

1. Créer le composant SearchBar
2. Implémenter la recherche côté Strapi
3. Afficher les résultats

Tout cela est possible en suivant les patterns expliqués dans ce guide !
