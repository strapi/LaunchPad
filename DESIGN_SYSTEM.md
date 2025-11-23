# SecureBase Design System

> Design laws and guidelines for AI agents and developers working on the SecureBase coaching platform.

## Core Principles

1. **Mobile-First**: Design for mobile, enhance for desktop
2. **One-Handed Use**: Primary actions within thumb reach on mobile
3. **Dark Mode Default**: Premium dark aesthetic with light mode support
4. **Smooth Motion**: Every interaction should feel fluid and intentional
5. **Accessibility**: WCAG 2.1 AA compliance minimum

---

## Color Palette

### Primary Colors
```css
--charcoal: #050d1b;        /* Primary dark background */
--lightblack: #0d1529;      /* Secondary dark background */
--surface: #0f172a;         /* Card/panel backgrounds */
--surface-muted: #111c34;   /* Subtle surface variation */
```

### Accent Colors
```css
--cyan-400: #22d3ee;        /* Primary accent - highlights, CTAs */
--cyan-500: #06b6d4;        /* Primary accent - buttons, links */
--cyan-900: #164e63;        /* Accent dark - hover states */
--accent: #f59e0b;          /* Secondary accent - warnings, highlights */
```

### Brand Colors (Blue Scale)
```css
--brand-50: #eff6ff;
--brand-100: #dbeafe;
--brand-500: #3b82f6;       /* Primary brand blue */
--brand-600: #2563eb;
--brand-900: #1e3a8a;
```

### Text Colors
```css
--text-primary: #ffffff;    /* Headings, important text */
--text-muted: #94a3b8;      /* Body text, descriptions */
--text-subtle: #64748b;     /* Placeholder, hints */
```

### Semantic Colors
```css
--success: #22c55e;         /* Green - success states */
--error: #ef4444;           /* Red - error states */
--warning: #f59e0b;         /* Orange - warning states */
```

---

## Typography

### Font Family
```css
font-family: 'Inter', system-ui, -apple-system, sans-serif;
```

### Type Scale
| Name | Size | Weight | Usage |
|------|------|--------|-------|
| `display` | 4.5rem (72px) | 700 | Hero headlines |
| `h1` | 3rem (48px) | 700 | Page titles |
| `h2` | 2.25rem (36px) | 600 | Section headers |
| `h3` | 1.5rem (24px) | 600 | Card titles |
| `body` | 1rem (16px) | 400 | Body text |
| `small` | 0.875rem (14px) | 400 | Captions, labels |
| `xs` | 0.75rem (12px) | 500 | Badges, tags |

### Responsive Typography
```css
/* Mobile-first approach */
.hero-title {
  font-size: 1.875rem;      /* 30px mobile */
}
@media (min-width: 640px) {
  .hero-title {
    font-size: 2.25rem;     /* 36px sm */
  }
}
@media (min-width: 768px) {
  .hero-title {
    font-size: 3rem;        /* 48px md */
  }
}
@media (min-width: 1024px) {
  .hero-title {
    font-size: 3.75rem;     /* 60px lg */
  }
}
@media (min-width: 1280px) {
  .hero-title {
    font-size: 4.5rem;      /* 72px xl */
  }
}
```

---

## Spacing System

### Base Unit: 4px

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | Tight spacing |
| `space-2` | 8px | Icon gaps |
| `space-3` | 12px | Button padding |
| `space-4` | 16px | Card padding |
| `space-6` | 24px | Section gaps |
| `space-8` | 32px | Component spacing |
| `space-12` | 48px | Section padding |
| `space-16` | 64px | Page sections |
| `space-24` | 96px | Major sections |

---

## Animation Standards

### Duration Scale
```css
--duration-fast: 150ms;     /* Micro-interactions */
--duration-normal: 300ms;   /* Standard transitions */
--duration-slow: 500ms;     /* Page transitions */
--duration-slower: 700ms;   /* Complex animations */
```

### Easing Functions
```css
--ease-out: cubic-bezier(0, 0, 0.2, 1);        /* Deceleration */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);   /* Standard */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1); /* Bouncy */
```

### Animation Patterns

#### Stagger Children
```tsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0, 0, 0.2, 1] },
  },
};
```

#### Scroll-Triggered Parallax
```tsx
const { scrollYProgress } = useScroll({ target: ref });
const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
```

#### Hamburger Menu Animation
```tsx
// Line transforms for X animation
const topLine = { rotate: open ? 45 : 0, y: open ? 8 : 0 };
const middleLine = { opacity: open ? 0 : 1 };
const bottomLine = { rotate: open ? -45 : 0, y: open ? -8 : 0 };
```

---

## Component Patterns

### Buttons

#### Primary Button
```tsx
<button className="
  px-6 py-3
  bg-cyan-500 hover:bg-cyan-400
  text-black font-semibold
  rounded-lg
  transition-colors duration-300
  shadow-lg hover:shadow-cyan-500/25
">
  Primary Action
</button>
```

#### Secondary Button
```tsx
<button className="
  px-6 py-3
  bg-white/10 hover:bg-white/20
  text-white font-medium
  rounded-lg border border-white/20
  transition-all duration-300
">
  Secondary Action
</button>
```

### Cards
```tsx
<div className="
  bg-zinc-900/50
  border border-white/5
  rounded-xl
  p-6
  backdrop-blur-sm
  hover:border-cyan-500/20
  transition-all duration-300
">
  {/* Card content */}
</div>
```

### Input Fields
```tsx
<input className="
  w-full px-4 py-3
  bg-black/40
  border border-white/10
  rounded-lg
  text-white
  placeholder:text-gray-500
  focus:outline-none
  focus:border-cyan-500/50
  focus:ring-1 focus:ring-cyan-500/50
  transition-all duration-300
"/>
```

---

## Mobile Navigation Rules

### Thumb Zone Optimization
```
┌─────────────────────────────┐
│     HARD TO REACH           │  ← Secondary actions only
│                             │
├─────────────────────────────┤
│     COMFORTABLE             │  ← Navigation items
│                             │
├─────────────────────────────┤
│     EASY / NATURAL          │  ← Primary CTA buttons
│     ███████████████████     │
│     ███████████████████     │  ← Hamburger menu trigger
└─────────────────────────────┘
```

### Mobile Menu Requirements
1. Hamburger icon in bottom-right corner (easy thumb access)
2. Menu slides up from bottom (natural gesture)
3. Primary actions at bottom of menu
4. Backdrop blur with tap-to-close
5. Smooth spring animation on open/close

---

## Dark/Light Mode

### Implementation
```tsx
// tailwind.config.ts
darkMode: 'class'

// Usage
<div className="bg-white dark:bg-charcoal text-gray-900 dark:text-white">
```

### Color Mapping
| Element | Light Mode | Dark Mode |
|---------|------------|-----------|
| Background | `#ffffff` | `#050d1b` |
| Surface | `#f8fafc` | `#0f172a` |
| Text Primary | `#0f172a` | `#ffffff` |
| Text Muted | `#64748b` | `#94a3b8` |
| Border | `#e2e8f0` | `#1e2a45` |
| Accent | `#0891b2` | `#22d3ee` |

---

## Accessibility Requirements

### Contrast Ratios
- Normal text: 4.5:1 minimum
- Large text (24px+): 3:1 minimum
- UI components: 3:1 minimum

### Focus States
```css
:focus-visible {
  outline: 2px solid var(--cyan-500);
  outline-offset: 2px;
}
```

### Keyboard Navigation
- All interactive elements must be focusable
- Tab order must be logical
- Escape key closes modals/menus
- Enter/Space activates buttons

### Screen Reader Support
- Use semantic HTML (`<nav>`, `<main>`, `<section>`)
- Add `aria-label` to icon-only buttons
- Use `aria-expanded` for toggles
- Add `role="menu"` to navigation menus

---

## File Organization

```
components/
├── ui/                     # Reusable UI primitives
│   ├── button.tsx
│   ├── input.tsx
│   └── card.tsx
├── navbar/                 # Navigation components
│   ├── desktop-navbar.tsx
│   └── mobile-navbar.tsx
├── sections/               # Page sections
│   ├── HeroSection.tsx
│   └── FeaturesSection.tsx
└── layout/                 # Layout components
    ├── footer.tsx
    └── header.tsx
```

---

## Performance Guidelines

### Images
- Use Next.js `<Image>` component
- Provide responsive sizes: `sizes="(max-width: 768px) 100vw, 50vw"`
- Use WebP format with fallback
- Lazy load below-fold images

### Animations
- Use `transform` and `opacity` only (GPU accelerated)
- Avoid animating `width`, `height`, `top`, `left`
- Use `will-change` sparingly
- Reduce motion for `prefers-reduced-motion`

```tsx
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

const variants = prefersReducedMotion
  ? { hidden: {}, visible: {} }
  : { hidden: { opacity: 0 }, visible: { opacity: 1 } };
```

---

## Quality Checklist

Before deployment, verify:

- [ ] All interactive elements have hover/focus states
- [ ] Animations respect `prefers-reduced-motion`
- [ ] Mobile navigation is thumb-friendly
- [ ] Dark/light mode switches correctly
- [ ] No layout shift on load
- [ ] All forms have validation and error states
- [ ] Loading states for async operations
- [ ] 404 and error pages styled consistently
- [ ] Lighthouse score > 90 on all metrics

---

*Last updated: November 2024*
*Design System Version: 1.0*
