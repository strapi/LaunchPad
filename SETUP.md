# Peter Sung Coaching Platform - Complete Setup Guide

## Overview
This is a full-stack coaching platform built with Next.js 15, Strapi v5, and TypeScript. It includes authentication, client management, resource library, AI chat, and more.

## Architecture

### Frontend (Next.js 15)
- **Framework:** Next.js 15 with App Router
- **Authentication:** NextAuth.js with Strapi JWT
- **Styling:** Tailwind CSS + shadcn/ui
- **State Management:** React Context API
- **Testing:** Jest + React Testing Library
- **E2E Testing:** Playwright

### Backend (Strapi v5)
- **CMS:** Strapi v5 Headless CMS
- **Database:** SQLite (development), PostgreSQL (production)
- **API:** RESTful API
- **File Management:** Strapi Media Library

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git
- PostgreSQL (for production)

### Installation

1. **Clone and Install Dependencies**
```bash
cd peter-sung
npm install --legacy-peer-deps

# Install frontend dependencies
cd next
npm install --legacy-peer-deps

# Install backend dependencies
cd ../strapi
npm install
```

2. **Environment Setup**
Create `.env` files in both `next/` and `strapi/` directories with your configuration:

**next/.env:**
```env
NEXT_PUBLIC_API_URL=http://localhost:1337
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here-min-32-chars
GOOGLE_GENERATIVE_AI_API_KEY=your-key-here
RESEND_API_KEY=your-key-here
```

**strapi/.env:**
```env
HOST=0.0.0.0
PORT=1337
NODE_ENV=development
DATABASE_CLIENT=sqlite
# ... (see .env.example for all variables)
```

3. **Start Development Servers**

Terminal 1 - Start Strapi:
```bash
cd strapi
npm run develop
# Strapi runs on http://localhost:1337
```

Terminal 2 - Start Next.js:
```bash
cd next
npm run dev
# App runs on http://localhost:3000
```

4. **Initialize Strapi**
- Visit `http://localhost:1337/admin`
- Create an admin account
- Generate API token for content ingestion
- Create demo content or use seeding scripts

5 **Access the App**
- Marketing site: `http://localhost:3000`
- Dashboard: `http://localhost:3000/dashboard`
- Admin: `http://localhost:1337/admin`

## Demo Credentials

After Strapi is set up, create a user account via `/sign-up` or use CLI:

```bash
cd strapi
npm run strapi -- admin:create-user --firstname=Dr --lastname=Sung --email=dr@coached.com --password=Password123!
```

## Features Implemented

### ✅ Authentication
- Sign up & login with email/password
- NextAuth.js integration
- Protected dashboard routes
- Session management

### ✅ Dashboard
- **Overview:** Stats and activities
- **Clients:** Manage coaching clients
- **Resources:** Content library
- **Chat:** AI coach with streaming responses
- **Settings:** User preferences

### ✅ Content Management
- Strapi CMS with dynamic zones
- Multi-language support (English, Serbian)
- SEO plugin integration
- Image/file uploads

### ✅ API Integration
- Authenticated Strapi API client
- CRUD operations for all entities
- Error handling with fallback data
- Loading states and pagination

### ✅ AI Features
- Streaming chat with Google Gemini 1.5 Pro
- System prompt based on coaching philosophy
- Message history

### ✅ Backend APIs
- Contact form with Resend email
- File uploads to local storage
- User authentication
- RBAC ready

### ✅ Quality Assurance
- Jest unit testing setup
- Playwright E2E tests
- Error boundaries
- Accessibility components
- Responsive design

## Production Deployment

### Deploy Strapi to Railway

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo>
git push -u origin main
```

2. **Create Railway App**
- Go to https://railway.app
- Create new project from GitHub repo
- Select `strapi` directory as root
- Add PostgreSQL database plugin
- Set environment variables

3. **Configure Environment**
In Railway dashboard:
```
PORT=1337
NODE_ENV=production
DATABASE_CLIENT=postgres
DATABASE_URL=postgresql://...
# ... add all production secrets
```

4. **Deploy Next.js to Vercel**
- Go to https://vercel.com
- Import GitHub repository
- Select `next` directory as root
- Add environment variables:
  - `NEXT_PUBLIC_API_URL=<your-railway-url>`
  - `NEXTAUTH_URL=<your-vercel-url>`
  - `NEXTAUTH_SECRET=<generate-new>`
  - Other API keys
- Deploy

### Production Checklist

- [ ] Set all environment variables
- [ ] Configure PostgreSQL database
- [ ] Generate new security secrets
- [ ] Enable HTTPS
- [ ] Set up email service (Resend)
- [ ] Configure Google AI API access
- [ ] Enable backups
- [ ] Set up monitoring (Sentry)
- [ ] Run security audit

## Testing

### Unit Tests
```bash
cd next
npm test              # Run tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

### E2E Tests
```bash
npm run test:e2e      # Run Playwright tests
```

### Performance Audit
```bash
npm run build          # Build for production
npm start             # Start production server
npx lighthouse http://localhost:3000
```

## Database Seeding

### Import Content
```bash
cd scripts
STRAPI_TOKEN=<token> node ingest-content.mjs
STRAPI_TOKEN=<token> node ingest-pages-to-strapi.mjs
```

## Troubleshooting

### Connection Issues
- Ensure Strapi is running on `http://localhost:1337`
- Check `NEXT_PUBLIC_API_URL` environment variable
- Verify `.env` files exist in both directories

### Authentication Issues
- Generate new `NEXTAUTH_SECRET` (min 32 chars)
- Clear browser cookies
- Restart NextAuth server

### Strapi Admin Not Loading
- Run `npm run strapi -- admin:create-user` to create admin
- Check Strapi logs for errors
- Verify database connection

### Build Failures
- Delete `node_modules` and `.next` directories
- Run `npm install --legacy-peer-deps`
- Clear npm cache: `npm cache clean --force`

## Performance Targets

- **Lighthouse Score:** 90+
- **Core Web Vitals:** All Green
- **API Response Time:** <200ms
- **Database Query Time:** <100ms
- **Build Time:** <5 minutes

## Security

- HTTPS enforced in production
- JWT authentication
- CORS configured
- Rate limiting recommended
- Regular security audits
- Environment secrets never exposed

## Support & Documentation

- **Strapi Docs:** https://docs.strapi.io
- **Next.js Docs:** https://nextjs.org/docs
- **NextAuth.js:** https://next-auth.js.org
- **Design System:** See `/docs/DESIGN_SYSTEM.md`
- **PRD:** See `/docs/PRD.md`

## License

Proprietary - Dr. Peter Sung Coaching Platform

## Next Steps

1. Install dependencies
2. Configure environment variables
3. Start development servers
4. Create admin account in Strapi
5. Access application
6. Customize branding and content
7. Deploy to production

For questions, contact the development team.
