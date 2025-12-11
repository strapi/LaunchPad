# Typography Component

Un composant de typographie polymorphe et responsive pour Next.js avec Tailwind CSS, utilisant la police **Outfit**.

## 📋 Table des matières

- [Installation](#installation)
- [Utilisation de base](#utilisation-de-base)
- [Variants disponibles](#variants-disponibles)
- [Props](#props)
- [Exemples](#exemples)
- [Responsive Design](#responsive-design)
- [Personnalisation](#personnalisation)

## 🚀 Installation

Le composant utilise les dépendances suivantes :

```bash
npm install class-variance-authority
```

Assurez-vous que la police **Outfit** est configurée dans votre `layout.tsx`.

## 💡 Utilisation de base

```tsx
import { Typography } from '@/components/ui/typography';

export default function MyComponent() {
  return (
    <div>
      <Typography variant="h1">Mon titre principal</Typography>
      <Typography variant="p">Un paragraphe de texte.</Typography>
    </div>
  );
}
```

## 🎨 Variants disponibles

### Titres (Headings)

| Variant | Élément | Taille Desktop | Font Weight | Usage |
|---------|---------|----------------|-------------|-------|
| `h1` | `<h1>` | 64px | 600 (SemiBold) | Titre principal de page |
| `h2` | `<h2>` | 52px | 600 (SemiBold) | Sous-titres majeurs |
| `h3` | `<h3>` | 40px | 600 (SemiBold) | Sections importantes |
| `h4` | `<h4>` | 32px | 500 (Medium) | Sous-sections |

### Textes (Body)

| Variant | Élément | Taille Desktop | Font Weight | Usage |
|---------|---------|----------------|-------------|-------|
| `p` | `<p>` | 32px | 200 (ExtraLight) | Paragraphes importants, centré |
| `base` | `<p>` | 24px | 200 (ExtraLight) | Texte standard (défaut) |
| `lead` | `<p>` | 24px | 200 (ExtraLight) | Introduction/Lead paragraph |
| `large` | `<p>` | 32px | 500 (Medium) | Texte mis en valeur |
| `small` | `<p>` | 16px | 300 (Light) | Texte secondaire, notes |
| `muted` | `<p>` | 14px | 300 (Light) | Texte désactivé/subtil |

### Spéciaux

| Variant | Élément | Usage |
|---------|---------|-------|
| `quote` | `<blockquote>` | Citations |
| `code` | `<code>` | Code inline |
| `link` | `<a>` | Liens textuels |

## 📦 Props

### TypeScript Interface

```tsx
interface TypographyProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'base' | 'quote' | 'code' | 'lead' | 'large' | 'small' | 'muted' | 'link';
  as?: ElementType; // Polymorphisme
  className?: string;
  children: React.ReactNode;
  [key: string]: any; // Props supplémentaires selon l'élément
}
```

### Props principales

- **`variant`** (optionnel) : Le style typographique à appliquer. Par défaut : `"base"`
- **`as`** (optionnel) : L'élément HTML à rendre (polymorphisme)
- **`className`** (optionnel) : Classes CSS additionnelles
- **`children`** : Le contenu textuel

## 📚 Exemples

### Exemple 1 : Page d'accueil

```tsx
export default function HomePage() {
  return (
    <div className="space-y-6">
      <Typography variant="h1">
        Bienvenue sur notre site
      </Typography>
      
      <Typography variant="lead">
        Découvrez nos services et produits exceptionnels
      </Typography>
      
      <Typography variant="base">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </Typography>
    </div>
  );
}
```

### Exemple 2 : Polymorphisme avec `as`

```tsx
// Utiliser un h2 avec le style h3
<Typography variant="h3" as="h2">
  Titre sémantique H2 avec style H3
</Typography>

// Utiliser un span avec le style paragraph
<Typography variant="p" as="span">
  Texte inline avec style paragraph
</Typography>

// Utiliser Next.js Link
<Typography variant="link" as={Link} href="/about">
  En savoir plus
</Typography>
```

### Exemple 3 : Personnalisation avec className

```tsx
<Typography 
  variant="h2" 
  className="text-primary mb-8"
>
  Titre personnalisé
</Typography>

<Typography 
  variant="base" 
  className="text-muted-foreground italic"
>
  Texte avec style supplémentaire
</Typography>
```

### Exemple 4 : Article de blog

```tsx
export default function BlogPost() {
  return (
    <article className="prose">
      <Typography variant="h1" className="mb-4">
        Titre de l'article
      </Typography>
      
      <Typography variant="muted" className="mb-8">
        Publié le 12 décembre 2025
      </Typography>
      
      <Typography variant="lead" className="mb-6">
        Ceci est l'introduction captivante de notre article...
      </Typography>
      
      <Typography variant="h3" className="mt-8 mb-4">
        Section principale
      </Typography>
      
      <Typography variant="base" className="mb-4">
        Contenu de la section avec des informations importantes.
      </Typography>
      
      <Typography variant="quote" className="my-6">
        "Une citation inspirante pour illustrer le propos."
      </Typography>
      
      <Typography variant="base">
        Plus de contenu détaillé ici avec{' '}
        <Typography variant="code" as="span">
          const exemple = "code"
        </Typography>
        {' '}inline.
      </Typography>
    </article>
  );
}
```

### Exemple 5 : Card avec typographie

```tsx
export default function ProductCard() {
  return (
    <div className="border rounded-lg p-6">
      <Typography variant="h4" className="mb-2">
        Nom du produit
      </Typography>
      
      <Typography variant="large" className="text-primary mb-4">
        99,99 €
      </Typography>
      
      <Typography variant="base" className="mb-4">
        Description courte du produit avec ses caractéristiques principales.
      </Typography>
      
      <Typography variant="small" className="text-muted-foreground">
        Livraison gratuite • En stock
      </Typography>
    </div>
  );
}
```

## 📱 Responsive Design

Le composant s'adapte automatiquement à tous les écrans :

| Breakpoint | Taille écran | Échelle |
|------------|--------------|---------|
| Mobile (défaut) | < 640px | ~50% |
| `sm` | ≥ 640px | ~62.5% |
| `md` | ≥ 768px | ~75% |
| `lg` | ≥ 1024px | ~87.5% |
| `xl` | ≥ 1280px | 100% |

### Exemple de progression (H1)

```
Mobile:  32px
sm:      40px
md:      48px
lg:      56px
xl:      64px (desktop)
```

Vous n'avez **rien à faire** - le responsive est automatique ! 🎉

## 🎯 Personnalisation

### Ajouter une nouvelle variante

Dans `typography.tsx`, ajoutez votre variante :

```tsx
const typographyVariants = cva("font-sans", {
  variants: {
    variant: {
      // ... variants existants
      custom: "text-[20px] font-bold text-primary leading-tight",
    },
  },
});

// Ajoutez aussi le mapping
const defaultElementMapping = {
  // ... mappings existants
  custom: "div",
} as const;
```

### Surcharger les styles

Utilisez `className` pour des ajustements ponctuels :

```tsx
<Typography 
  variant="h2" 
  className="!text-[60px] !font-bold !text-red-500"
>
  Titre personnalisé
</Typography>
```

⚠️ **Note** : L'utilisation de `!` force la surcharge (important modifier de Tailwind).

## 🔧 Bonnes pratiques

### ✅ À faire

- Utiliser les variants sémantiques (`h1`, `h2`, etc.) pour une bonne hiérarchie
- Exploiter le polymorphisme `as` pour la sémantique HTML
- Garder les styles cohérents avec les variants prédéfinis
- Utiliser `className` pour les ajustements légers

### ❌ À éviter

- Créer trop de variants personnalisés (garder la cohérence)
- Surcharger massivement les styles (préférer créer une nouvelle variante)
- Ignorer la hiérarchie sémantique des titres
- Utiliser `p` pour tout (exploiter `base`, `small`, `muted`)

## 🆘 Dépannage

### Le texte n'a pas la bonne taille

Vérifiez que :
1. La police Outfit est bien chargée dans `layout.tsx`
2. Le `globals.css` est importé
3. Aucun style global ne surcharge le composant

### La police n'est pas Outfit

Assurez-vous que dans `layout.tsx` :

```tsx
const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});
```

Et dans `globals.css` :

```css
--font-sans: 'Outfit', ui-sans-serif, system-ui, ...;
```

### Le responsive ne fonctionne pas

Vérifiez votre configuration Tailwind CSS et que les breakpoints sont bien configurés.

## 📄 Licence

Ce composant fait partie du projet et suit la même licence.

---

**Contributeurs** : kined  
**Dernière mise à jour** : Décembre 2025