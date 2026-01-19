# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Peter Sung Monorepo** - A full-stack platform for leadership coaching, speaking, and digital content delivery. Built as a monorepo with Strapi v5 (headless CMS) + Next.js 15 (frontend/dashboard).

**Transformation Status**: This is a fork of Strapi's LaunchPad demo being evolved into a custom coaching business platform with advanced features like AI coaching assistants, client management dashboards, and book preorder systems.

## Tech Stack

### Backend (Strapi v5)
- **Location**: `/strapi/`
- **Database**: SQLite (better-sqlite3) for local development
- **Plugins**: SEO, Users & Permissions, Cloud
- **Custom Features**:
  - Deep population middleware (`src/middlewares/deepPopulate.ts`) - auto-populates relations and dynamic zones
  - 20+ custom content types (clients, sessions, assessments, products, articles, etc.)
  - Internationalization support

### Frontend (Next.js 15)
- **Location**: `/next/`
- **Framework**: Next.js 15 with App Router, React Server Components, Turbopack
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui, Radix UI primitives
- **Animations**: Framer Motion, motion primitives
- **Auth**: NextAuth v5 (beta) with Strapi backend integration
- **AI**: Google AI SDK with streaming support
- **Testing**: Playwright (e2e), Jest (unit)

## Common Commands

### Root-Level Operations
```bash
# Setup entire monorepo (install deps for both Strapi and Next)
npm run setup

# Run both Strapi and Next.js concurrently (recommended for development)
npm run dev

# Seed Strapi with demo data
npm run seed

# Format code
npm run fix:format

# Run e2e tests
npm run test:e2e

# Build Next.js for production
npm run build
```

### Strapi-Specific (from `/strapi/`)
```bash
cd strapi

# Development with watch mode
npm run develop

# Production mode
npm run start

# Build admin panel
npm run build

# Import data
npm run strapi -- import -f ./data/export_20250116105447.tar.gz --force

# Export data
npm run strapi -- export --no-encrypt -f ./data/export_20250116105447
```

### Next.js-Specific (from `/next/`)
```bash
cd next

# Development with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Lint
npm run lint

# Run tests
npm run test
npm run test:watch
npm run test:coverage
```

## Architecture & Key Patterns

### Monorepo Structure
```
/
├── strapi/                 # Headless CMS backend
│   ├── src/api/           # 20+ content types (article, client, session, etc.)
│   ├── src/components/    # Reusable Strapi components (dynamic zones, cards)
│   └── src/middlewares/   # Custom middleware (deepPopulate)
├── next/                   # Frontend application
│   ├── app/               # Next.js App Router pages
│   │   ├── [locale]/      # Internationalized marketing pages
│   │   ├── dashboard/     # Protected coaching dashboard
│   │   ├── book/          # Book preorder flow
│   │   └── api/           # API routes (chat, contact, webhooks, etc.)
│   ├── components/        # React components (organized by feature)
│   └── lib/               # Utilities, Strapi client, auth config
├── docs/                   # Specifications and planning docs
│   ├── prompts/           # SYNTHIA design agent system prompt
│   └── specs/             # Feature specs and design tasks
├── tools/                  # Deployment automation (Vercel agent)
└── scripts/                # Build and setup utilities
```

### Content Management Pattern
- **Strapi Dynamic Zones**: Flexible page builder system using dynamic zone components
- **Manager Component**: `next/components/dynamic-zone/manager.tsx` orchestrates rendering
- **Deep Population**: Custom middleware ensures all relations/media are populated automatically
- **Content Types**:
  - **Marketing**: article, blog-page, product-page, page (generic), faq, testimonial
  - **Business Logic**: client, session, assessment, coaching-package, resource
  - **Commerce**: product, plan, invoice, payment, book-preorder, customer
  - **Config**: global (site settings), redirection, logo, email-template

### Authentication Flow
1. **NextAuth v5** configured in `next/lib/auth.ts`
2. Credentials provider authenticates against Strapi `/api/auth/local`
3. Strapi JWT stored in session for authenticated API calls
4. Protected routes use middleware to check session
5. Client-side access via `next/lib/strapi/client.ts` helper functions

### API Integration Pattern
- **Server Components**: Direct Strapi API calls with fetch, ISR/streaming
- **Client Components**: Use helper functions from `lib/strapi/client.ts`
- **Endpoints**: RESTful Strapi API at `NEXT_PUBLIC_API_URL` (default: http://localhost:1337)
- **Image Optimization**: Custom `strapiImage` helper in `lib/strapi/strapiImage.ts`

### Dashboard Architecture
Location: `/next/app/dashboard/`

**Key Features**:
- Client management (CRUD operations)
- Session tracking for coaching engagements
- Resource library (coaching materials)
- Book order management
- AI chat assistant (`/dashboard/chat/`)
- Settings panel

**Data Flow**: Dashboard → Strapi Client (`lib/strapi/client.ts`) → NextAuth Session Token → Strapi API

### AI Chat System
Location: `/next/app/dashboard/chat/`

- **Frontend**: Streaming chat UI with session management (localStorage)
- **Backend**: API route at `/api/chat/route.ts` using Google AI SDK
- **Features**: Multi-turn conversations, chat history, PDF export, streaming responses
- **Context**: Can be trained on SecureBase content (imported in `content/_imports/securebase/`)

### Design System (SYNTHIA)
- **Philosophy**: Behavioral design principles (UX Laws, cognitive psychology)
- **Reference**: `docs/prompts/god-tier-design-agent-system-prompt-v2.md`
- **Components**: Atomic design with shadcn/ui primitives
- **Animations**: Framer Motion with accessibility (reduced motion support)
- **Theme**: Dark mode via next-themes, custom Tailwind config
- **Typography**: Inter (primary) + serif accent fonts
- **Spacing**: 4/8 scale system

### Internationalization (i18n)
- **Supported Locales**: English (en), potentially others
- **Config**: `next/i18n.config.ts`
- **Pattern**: `[locale]` route segment in App Router
- **Strapi**: Content can have multiple localizations

## Environment Variables

### Required for Strapi (`/strapi/.env`)
```
HOST=0.0.0.0
PORT=1337
APP_KEYS=<generated-keys>
API_TOKEN_SALT=<generated-salt>
ADMIN_JWT_SECRET=<generated-secret>
TRANSFER_TOKEN_SALT=<generated-salt>
JWT_SECRET=<generated-secret>
```

### Required for Next.js (`/next/.env`)
```
NEXT_PUBLIC_API_URL=http://localhost:1337
IMAGE_HOSTNAME=localhost
NEXTAUTH_SECRET=<generated-secret>
NEXTAUTH_URL=http://localhost:3000
GOOGLE_GENERATIVE_AI_API_KEY=<your-key>
```

**Setup Helper**: Use `npm run setup` which runs `scripts/copy-env.mts` to copy `.env.example` files.

## Testing Strategy

### E2E Tests (Playwright)
- **Config**: `playwright.config.ts`
- **Location**: `/e2e/`
- **Run**: `npm run test:e2e`
- **Target**: Full user flows (auth, navigation, forms)

### Unit Tests (Jest)
- **Config**: `next/jest.config.js`
- **Pattern**: Co-located `*.test.ts` files
- **Run**: `npm run test` (from `/next/`)

### Performance
- **Lighthouse**: `npm run test:lighthouse` for Core Web Vitals checks

## Key Implementation Notes

### TypeScript Errors
- **Current State**: `typescript.ignoreBuildErrors: true` in `next.config.mjs`
- **Reason**: Temporary workaround during rapid development
- **Action Item**: Gradually fix type errors and remove this flag

### Husky & Pre-commit
- **Hooks**: Format on commit via lint-staged
- **Config**: `.husky/` and `lint-staged` in root `package.json`
- **Format**: Prettier with import sorting plugins

### Deployment
- **Strapi**: Can deploy to Strapi Cloud or any Node.js host
- **Next.js**: Optimized for Vercel (see `tools/vercel-agent/`)
- **Alternative**: Hostinger/Coolify config available (see recent commits)

### Custom Middleware (Strapi)
**Deep Populate Middleware** (`strapi/src/middlewares/deepPopulate.ts`):
- Auto-populates all relations, media, components, and dynamic zones
- Triggered on GET requests to `/api/*` when no explicit `populate` param provided
- Excludes `/api/users` and `/api/seo`
- Essential for Next.js to receive fully populated content without verbose query params

### Book Preorder System
Location: `/next/app/book/`

- Landing page with hero, overview, testimonials, FAQ
- Preorder form integrated with Strapi `book-preorder` content type
- Success page with upsell to coaching packages
- Managed via dashboard at `/dashboard/book-orders/`

### Content Imports
- **SecureBase Content**: Imported markdown/content in `content/_imports/securebase/`
- **Purpose**: Training data for AI chat assistant
- **Format**: SITEMAP.json with crawl logs

## Development Workflow

### Starting Fresh
1. `npm run setup` - Install all dependencies and copy env files
2. Configure environment variables in both `.env` files
3. `cd strapi && npm run seed` - Import demo data
4. `npm run dev` from root - Start both servers concurrently
5. Access Strapi admin at http://localhost:1337/admin
6. Access Next.js at http://localhost:3000

### Making Changes to Content Model
1. Modify schema in `strapi/src/api/{content-type}/content-types/{content-type}/schema.json`
2. Restart Strapi server (auto-rebuild admin)
3. Update TypeScript types in Next.js if needed
4. Update corresponding components in `next/components/`

### Adding New Dynamic Zone Components
1. Create schema in `strapi/src/components/dynamic-zone/{component}.json`
2. Create React component in `next/components/dynamic-zone/{component}.tsx`
3. Register in `next/components/dynamic-zone/manager.tsx`
4. Use in Strapi admin via page builder

### Working with SYNTHIA (Design Agent)
- **System Prompt**: `docs/prompts/god-tier-design-agent-system-prompt-v2.md`
- **Spec Kit**: Reference `docs/specs/` for feature specifications
- **Design Principles**: UX Laws (Jakob's, Fitts's, Hick's), Hooked Model, Refactoring UI
- **Component Library**: Build on shadcn/ui primitives, extend with Tailwind

## Git & Deployment Workflow

### Branch Strategy
- **Main Branch**: Stable production-ready code
- **Feature Branches**: Prefix with `claude/` for Claude Code sessions
- **Deployment**: Push to branch, create PR for review

### Pre-commit Checks
- Format with Prettier (auto-fix)
- Lint Next.js code (from `next/` directory)
- Enforced via husky + lint-staged

## Troubleshooting

### Port Conflicts
- Strapi uses `:1337`, Next.js uses `:3000`
- Change in respective env files if needed

### Database Issues
- Strapi uses SQLite: `strapi/.tmp/data.db`
- Delete and re-seed if corrupted: `rm strapi/.tmp/data.db && npm run seed`

### Build Failures
- Check TypeScript errors (currently ignored, but may cause runtime issues)
- Ensure all env vars are set
- Clear `.next` cache: `cd next && npm run clean`

### Auth Not Working
- Verify `NEXTAUTH_SECRET` is set
- Check Strapi is running and accessible
- Confirm user exists in Strapi admin panel

## MCP Tools (Byterover)

This project uses Byterover MCP server for knowledge management:

### `byterover-store-knowledge`
**Use when**:
- Learning new patterns, APIs, or architectural decisions
- Encountering error solutions or debugging techniques
- Finding reusable code patterns or utility functions
- Completing significant tasks or plan implementations

### `byterover-retrieve-knowledge`
**Use when**:
- Starting any new task to gather relevant context
- Before making architectural decisions to understand existing patterns
- Debugging issues to check for previous solutions
- Working with unfamiliar parts of the codebase

## Related Documentation

- **SYNTHIA Design System**: `docs/prompts/god-tier-design-agent-system-prompt-v2.md`
- **Feature Specs**: `docs/specs/*.md`
- **Original Strapi LaunchPad**: `README.md` (legacy reference)
- **Strapi Docs**: https://docs.strapi.io
- **Next.js Docs**: https://nextjs.org/docs
- **shadcn/ui**: https://ui.shadcn.com

## Support & Resources

- **Strapi Community**: https://discord.strapi.io
- **Next.js Community**: https://github.com/vercel/next.js/discussions
- **Project-Specific**: Refer to `docs/` for internal specifications
