# Peter Sung Platform - Design System v1.0

> **Target:** Awwwards-level design (9.5+/10 UI/UX score)
> **Philosophy:** "Don't Make Me Think" - Steve Krug
> **Last Updated:** 2025-11-22

---

## Table of Contents
1. [Core Principles](#core-principles)
2. [Visual Identity](#visual-identity)
3. [Typography](#typography)
4. [Color System](#color-system)
5. [Spacing & Layout](#spacing--layout)
6. [Components](#components)
7. [Animation Standards](#animation-standards)
8. [Accessibility Requirements](#accessibility-requirements)
9. [Responsive Design](#responsive-design)
10. [Design Audit Checklist](#design-audit-checklist)

---

## Core Principles

### Steve Krug's "Don't Make Me Think" Heuristics

| Principle | Implementation |
|-----------|----------------|
| **Self-Explanatory UI** | Every element's purpose must be obvious within 0.5 seconds. No labels needed for icons. |
| **Scannable Content** | Users scan, not read. Headlines must convey meaning instantly. |
| **Mindless Choices** | Reduce decisions. One primary CTA per section. Modal-first for details. |
| **Omit Needless Words** | Cut 50% of text, then cut 50% again. Every word must earn its place. |
| **Visual Hierarchy** | Size, weight, color, and spacing must guide the eye in correct order. |
| **Consistent Patterns** | Same interaction = same behavior everywhere. No surprises. |

### Design Tenets

1. **Clarity over cleverness** - If it needs explanation, redesign it
2. **Hierarchy is king** - The most important thing must be most visible
3. **White space is not empty** - It creates breathing room and focus
4. **Motion with purpose** - Animations guide attention, not distract
5. **Mobile-first, desktop-enhanced** - Design for constraints first

---

## Visual Identity

### Brand Personality
- **Professional yet approachable** - Leadership coaching demands trust
- **Calm confidence** - Secure Base philosophy reflected in design
- **Modern sophistication** - Dark theme with refined accents
- **Human warmth** - Not cold corporate; inviting and personal

### Logo Usage
- Minimum clear space: 16px on all sides
- Minimum size: 32px height
- Always use provided logo files; never recreate

---

## Typography

### Font Stack
```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-serif: 'Newsreader', Georgia, 'Times New Roman', serif;
```

### Type Scale (8px baseline)

| Element | Size | Weight | Line Height | Letter Spacing |
|---------|------|--------|-------------|----------------|
| **Hero Title** | 48-72px (3-4.5rem) | 700 | 1.1 | -0.02em |
| **Page Title (H1)** | 36-48px (2.25-3rem) | 700 | 1.2 | -0.01em |
| **Section Title (H2)** | 28-36px (1.75-2.25rem) | 600 | 1.25 | 0 |
| **Card Title (H3)** | 20-24px (1.25-1.5rem) | 600 | 1.3 | 0 |
| **Subtitle** | 18-20px (1.125-1.25rem) | 400 | 1.5 | 0 |
| **Body** | 16px (1rem) | 400 | 1.6 | 0 |
| **Small/Caption** | 14px (0.875rem) | 400 | 1.5 | 0.01em |
| **Micro** | 12px (0.75rem) | 500 | 1.4 | 0.02em |

### Typography Rules
- **Headlines:** Use Inter Bold or Newsreader for editorial feel
- **Body text:** Inter Regular, max 65-75 characters per line
- **Never justify text** - Use left-align for readability
- **Minimum body text size:** 16px (never smaller for primary content)

---

## Color System

### Primary Palette

```css
/* Background Layers */
--bg-primary: #050d1b;      /* Charcoal - Main background */
--bg-secondary: #0d1529;    /* Light black - Cards, sections */
--bg-tertiary: #1a2744;     /* Elevated surfaces */

/* Accent Colors */
--accent-primary: #06b6d4;   /* Cyan 500 - Primary actions */
--accent-hover: #22d3ee;     /* Cyan 400 - Hover states */
--accent-muted: #0891b2;     /* Cyan 600 - Secondary emphasis */

/* Text Colors */
--text-primary: #ffffff;     /* Primary text */
--text-secondary: #9ca3af;   /* Gray 400 - Secondary text */
--text-muted: #6b7280;       /* Gray 500 - Muted/disabled */
--text-accent: #06b6d4;      /* Cyan - Links, emphasis */

/* Semantic Colors */
--success: #10b981;          /* Green 500 */
--warning: #f59e0b;          /* Amber 500 */
--error: #ef4444;            /* Red 500 */

/* Borders & Dividers */
--border-subtle: rgba(255, 255, 255, 0.05);
--border-default: rgba(255, 255, 255, 0.1);
--border-emphasis: rgba(255, 255, 255, 0.2);
```

### Color Psychology Application

| Color | Emotion | Usage |
|-------|---------|-------|
| **Dark Charcoal** | Sophistication, focus | Background, creates depth |
| **Cyan** | Trust, clarity, innovation | CTAs, links, highlights |
| **White** | Clarity, openness | Primary text, emphasis |
| **Gray** | Neutrality, professionalism | Secondary content |

### Contrast Requirements (WCAG AA)
- **Normal text:** Minimum 4.5:1 contrast ratio
- **Large text (18px+):** Minimum 3:1 contrast ratio
- **Interactive elements:** Minimum 3:1 against background
- **Focus indicators:** Visible 3px outline in accent color

---

## Spacing & Layout

### 8px Baseline Grid
All spacing must be multiples of 8px:

```css
--space-1: 4px;    /* 0.25rem - Micro adjustments only */
--space-2: 8px;    /* 0.5rem */
--space-3: 12px;   /* 0.75rem */
--space-4: 16px;   /* 1rem */
--space-5: 20px;   /* 1.25rem */
--space-6: 24px;   /* 1.5rem */
--space-8: 32px;   /* 2rem */
--space-10: 40px;  /* 2.5rem */
--space-12: 48px;  /* 3rem */
--space-16: 64px;  /* 4rem */
--space-20: 80px;  /* 5rem */
--space-24: 96px;  /* 6rem */
--space-32: 128px; /* 8rem */
```

### Layout Constraints

| Element | Max Width | Padding |
|---------|-----------|---------|
| **Container** | 1280px (80rem) | 16px mobile, 32px tablet+ |
| **Content (prose)** | 768px (48rem) | - |
| **Cards grid** | 1152px (72rem) | - |
| **Hero text** | 640px (40rem) | - |

### Section Spacing
- **Between major sections:** 96-128px (6-8rem)
- **Between subsections:** 48-64px (3-4rem)
- **Between related elements:** 24-32px (1.5-2rem)
- **Within components:** 16-24px (1-1.5rem)

---

## Components

### Buttons

#### Primary Button
```tsx
className="inline-flex items-center justify-center px-8 py-3
           text-base font-medium text-black bg-cyan-400
           hover:bg-cyan-300 rounded-full transition-all duration-200
           focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2
           focus:ring-offset-charcoal"
```

#### Secondary Button
```tsx
className="inline-flex items-center justify-center px-8 py-3
           text-base font-medium text-white border border-white/20
           hover:bg-white/10 rounded-full transition-all duration-200
           focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2
           focus:ring-offset-charcoal"
```

#### Button States
- **Default:** Full opacity, brand colors
- **Hover:** Lightened background, subtle scale (1.02)
- **Active/Pressed:** Slightly darker, scale (0.98)
- **Disabled:** 50% opacity, cursor-not-allowed
- **Focus:** 2px ring in accent color with offset

### Cards

#### Feature/Project Card
```tsx
<div className="group relative rounded-xl overflow-hidden bg-zinc-900/50
                border border-white/5 hover:border-cyan-500/30
                transition-all duration-300 cursor-pointer">
  {/* Image with hover zoom */}
  <div className="aspect-video overflow-hidden">
    <Image className="object-cover w-full h-full
                      group-hover:scale-105 transition-transform duration-500" />
  </div>

  {/* Content overlay */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent
                  flex flex-col justify-end p-6">
    <h3 className="text-xl font-semibold text-white">{title}</h3>
    <p className="text-gray-300 mt-2">{description}</p>
  </div>
</div>
```

#### Card Rules
- Always have hover state feedback
- Image aspect ratio: 16:9 or 4:3 consistently
- Rounded corners: 12px (rounded-xl)
- Border: subtle white/5, accent on hover
- Shadow: subtle elevation on hover

### Modals

#### Modal Overlay
```tsx
<div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm
                flex items-center justify-center p-4">
  <div className="relative w-full max-w-2xl bg-zinc-900 rounded-2xl
                  border border-white/10 shadow-2xl
                  animate-in fade-in slide-in-from-bottom-4 duration-300">
    {/* Close button - always top right */}
    <button className="absolute top-4 right-4 p-2 rounded-full
                       hover:bg-white/10 transition-colors"
            aria-label="Close modal">
      <X className="w-5 h-5" />
    </button>

    {/* Content */}
    <div className="p-8">
      {children}
    </div>
  </div>
</div>
```

#### Modal Rules
- Always trap focus inside modal
- Close on Escape key
- Close on backdrop click
- Return focus to trigger on close
- Maximum width: 672px (42rem) for content modals
- Animation: fade in + slide up (300ms)

### Forms

#### Input Field
```tsx
<div className="space-y-2">
  <label className="block text-sm font-medium text-gray-300">
    {label}
  </label>
  <input
    className="w-full px-4 py-3 bg-black/40 border border-white/10
               rounded-xl text-white placeholder:text-gray-500
               focus:outline-none focus:border-cyan-500/50 focus:ring-1
               focus:ring-cyan-500/50 transition-colors"
    placeholder={placeholder}
  />
</div>
```

#### Form Rules
- Labels always above inputs
- Placeholder text is supplementary, not the label
- Error states: red border + error message below
- Success states: green border/checkmark
- Minimum touch target: 44px height

### Navigation

#### Navbar Behavior
- Transparent on hero, solid on scroll (after 100px)
- Sticky positioning
- Smooth width/background transition (400ms)
- Mobile: hamburger menu with slide-out drawer

---

## Animation Standards

### Timing Guidelines

| Animation Type | Duration | Easing |
|----------------|----------|--------|
| **Micro-interactions** (hover, focus) | 150-200ms | ease-out |
| **Component transitions** (modals, menus) | 250-300ms | ease-out |
| **Page transitions** | 300-400ms | ease-in-out |
| **Loading skeletons** | 1500ms | ease-in-out (loop) |

### Easing Functions
```css
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
```

### Animation Rules
1. **Purpose over decoration** - Every animation must guide attention or provide feedback
2. **Respect reduced motion** - Always provide `prefers-reduced-motion` fallback
3. **Performance first** - Use `transform` and `opacity` only (GPU accelerated)
4. **No animation on initial load** - Content should be visible immediately
5. **Subtle is better** - If noticeable, it's probably too much

### Standard Animations

#### Fade In Up (for sections on scroll)
```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

#### Hover Scale
```tsx
className="hover:scale-[1.02] transition-transform duration-200"
```

#### Skeleton Pulse
```tsx
className="animate-pulse bg-zinc-800"
```

---

## Accessibility Requirements

### WCAG 2.1 AA Compliance (Mandatory)

#### Color & Contrast
- [ ] Text contrast ratio ≥ 4.5:1 (normal) / 3:1 (large)
- [ ] Non-text contrast ≥ 3:1 for UI components
- [ ] Color is not the only means of conveying information
- [ ] Focus indicators are visible (3:1 contrast minimum)

#### Keyboard Navigation
- [ ] All interactive elements are focusable
- [ ] Focus order is logical (left-to-right, top-to-bottom)
- [ ] No keyboard traps (can always escape)
- [ ] Skip links provided for main content
- [ ] Modals trap focus appropriately

#### Screen Readers
- [ ] All images have meaningful alt text (or empty alt="" if decorative)
- [ ] Form inputs have associated labels
- [ ] ARIA landmarks used (main, nav, aside, etc.)
- [ ] Dynamic content updates announced (aria-live)
- [ ] Modals have role="dialog" and aria-modal="true"

#### Motion
- [ ] Animations respect `prefers-reduced-motion`
- [ ] No content flashes more than 3 times per second
- [ ] Auto-playing media can be paused

### Semantic HTML Requirements
```html
<!-- Always use semantic elements -->
<header>  <!-- Site header -->
<nav>     <!-- Navigation -->
<main>    <!-- Main content (one per page) -->
<section> <!-- Thematic grouping -->
<article> <!-- Self-contained content -->
<aside>   <!-- Tangentially related content -->
<footer>  <!-- Site footer -->
```

---

## Responsive Design

### Breakpoints (Tailwind defaults)

| Breakpoint | Min Width | Target Devices |
|------------|-----------|----------------|
| **Default** | 0px | Mobile phones (portrait) |
| **sm** | 640px | Mobile phones (landscape) |
| **md** | 768px | Tablets |
| **lg** | 1024px | Laptops, small desktops |
| **xl** | 1280px | Desktops |
| **2xl** | 1536px | Large desktops |

### Mobile-First Rules

1. **Design for 320px minimum** - Support iPhone SE
2. **Touch targets ≥ 44px** - Fingers need space
3. **Safe area insets** - Account for notches and home indicators
4. **Thumb-friendly zones** - Important actions within reach
5. **Single column default** - Expand to grid on larger screens

### Responsive Patterns

#### Grid Layouts
```tsx
// Cards grid
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"

// Two-column content
className="grid grid-cols-1 lg:grid-cols-2 gap-12"
```

#### Typography Scaling
```tsx
// Hero title
className="text-4xl md:text-5xl lg:text-6xl"

// Section title
className="text-2xl md:text-3xl lg:text-4xl"
```

#### Show/Hide Elements
```tsx
// Hide on mobile, show on desktop
className="hidden lg:block"

// Show on mobile, hide on desktop
className="block lg:hidden"
```

---

## Design Audit Checklist

### Score Criteria (Target: 9.5+/10)

#### Visual Hierarchy (25 points)
- [ ] (5) Hero headline is the first thing users see
- [ ] (5) Clear size differentiation between heading levels
- [ ] (5) Important actions (CTAs) stand out prominently
- [ ] (5) Adequate white space around key elements
- [ ] (5) Eye flow follows intended path

#### Usability (25 points)
- [ ] (5) Every page's purpose is clear within 3 seconds
- [ ] (5) Navigation is intuitive and consistent
- [ ] (5) CTAs have clear, action-oriented labels
- [ ] (5) No dead ends or broken links
- [ ] (5) Forms are simple with clear validation

#### Aesthetics (25 points)
- [ ] (5) Color palette is cohesive and intentional
- [ ] (5) Typography is readable and well-spaced
- [ ] (5) Images are high-quality and relevant
- [ ] (5) Animations are smooth and purposeful
- [ ] (5) Overall design feels polished and modern

#### Technical Quality (25 points)
- [ ] (5) Passes WCAG AA accessibility audit
- [ ] (5) Loads quickly (LCP < 2.5s)
- [ ] (5) Responsive across all breakpoints
- [ ] (5) No console errors or warnings
- [ ] (5) SEO metadata is complete and accurate

### Pre-Launch Checklist
- [ ] All placeholder content replaced with real copy
- [ ] All links point to valid destinations
- [ ] Forms submit correctly with validation
- [ ] 404 page exists and is styled
- [ ] Favicon and social meta images set
- [ ] Analytics configured
- [ ] Performance tested on mobile networks
- [ ] Cross-browser tested (Chrome, Safari, Firefox, Edge)

---

## File Naming Conventions

### Components
- PascalCase: `HeroSection.tsx`, `ProjectCard.tsx`
- One component per file
- Co-locate styles and tests

### Pages (Next.js App Router)
- Lowercase with dashes: `about/page.tsx`, `contact/page.tsx`
- Use route groups for organization: `(marketing)`, `(dashboard)`

### Assets
- Lowercase with dashes: `hero-background.jpg`, `logo-dark.svg`
- Include dimensions for images when relevant: `profile-400x400.jpg`

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-11-22 | Initial design system |

---

*This design system is enforced by automated checks in `scripts/design-audit.mjs`. All PRs must pass the design audit with a score of 9.5+/10.*
