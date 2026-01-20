# Implementation Plan: Book Landing Page & Interactive Dashboard

**Branch**: `feature/book-dashboard-integration` | **Date**: 2024-11-25 | **Spec**: `specs/book-and-dashboard-integration/spec.md`

## Executive Summary

This plan outlines the integration of **TweakCN UI components** to create:
1. **Book Landing Page** - Promotional page for Dr. Peter Sung's upcoming book "The Secure Base"
2. **Interactive Dashboard** - High-class admin dashboard for managing preorders, coaching packages, and client interactions
3. **Preorder System** - Database-backed reservation system with AI-powered email automation

## Technical Context

**Language**: TypeScript / React 19
**Framework**: Next.js 15 (App Router)
**UI Library**: TweakCN (shadcn/ui enhanced)
**Database**: PostgreSQL (via Strapi)
**AI**: Vercel AI SDK + Custom email agent
**Styling**: Tailwind CSS

## Phase 1: TweakCN Component Audit & Integration

### Available TweakCN Components Analysis

**Premium Dashboard Components:**
- `sidebar.tsx` - Collapsible navigation sidebar
- `data-table.tsx` - Advanced sortable/filterable tables
- `chart.tsx` - Chart.js integration for analytics
- `drawer.tsx` - Slide-out panels for forms
- `dialog.tsx` - Modal systems
- `command.tsx` - Command palette (⌘K style)
- `calendar.tsx` - Date picker for scheduling
- `badge.tsx` - Status indicators
- `avatar.tsx` - User profile displays
- `card.tsx` - Content containers
- `carousel.tsx` - Image/content sliders
- `tabs.tsx` - Tabbed interfaces
- `form.tsx` - Advanced form handling
- `toast.tsx` - Notification system

**Enhancement Components:**
- `effects/` - Visual effects library
- `ai-elements/` - AI-powered UI components
- `editor/` - Rich text editing
- `horizontal-scroll-area.tsx` - Smooth scrolling

### Component Mapping Strategy

| Site Section | TweakCN Components | Purpose |
|--------------|-------------------|---------|
| **Book Landing Page** | `carousel`, `card`, `badge`, `form`, `dialog` | Hero carousel, testimonials, preorder forms |
| **Admin Dashboard** | `sidebar`, `data-table`, `chart`, `calendar`, `command` | Navigation, order management, analytics |
| **Client Dashboard** | `tabs`, `card`, `progress`, `calendar`, `toast` | Session tracking, resources, notifications |
| **Email System** | `drawer`, `form`, `dialog`, `ai-elements` | Template builder, AI response generator |

## Phase 2: Book Landing Page Design

### Page Structure

```
/book
├── Hero Section (with AI-generated book cover)
├── About the Book (The 3 A's framework)
├── Author Bio
├── Table of Contents Preview
├── Testimonials Carousel
├── Preorder Form (Signed Copies + Digital)
├── Coaching Package Upsell
└── Newsletter Signup
```

### Book Details (Proposed)

**Title:** "The Secure Base: Leading from Awareness, Agency, and Action"
**Subtitle:** A Proven Framework for Transforming Leadership Through Self-Awareness
**Price:** $29.95 (Hardcover), $19.95 (eBook)
**Signed Copy:** $49.95 (Limited to 500)
**Expected Release:** Q2 2026
**Publisher:** TBD
**Pages:** ~280

### AI-Generated Book Cover Specifications

**Prompt for Cover Generation:**
```
Professional book cover design for executive leadership book titled "The Secure Base: Leading from Awareness, Agency, and Action" by Dr. Peter Sung. Clean, modern aesthetic with abstract geometric shield or foundation element in cyan/teal tones. Minimalist corporate style. High-end business book aesthetic similar to Patrick Lencioni or Simon Sinek. Typography: Bold serif for title, clean sans-serif for subtitle.
```

**Temporary Placeholder:** Use gradient-based design with SecureBase logo until real cover is ready.

### Preorder Form Features

**Required Fields:**
- Full Name
- Email Address
- Phone (optional)
- Order Type: [Signed Hardcover | Regular Hardcover | eBook | Bundle]
- Quantity
- Personalization Message (for signed copies, max 50 chars)
- Shipping Address (for physical books)
- Payment: Stripe integration (50% deposit)

**Upsell Options:**
- Add Private Coaching Session ($500 - 1 hour)
- Add Team Workshop Quote Request
- Pre-order 10+ copies (bulk discount)

## Phase 3: Interactive Dashboard Architecture

### Dashboard Routes

```
/dashboard
├── /overview          # Stats, recent activity, quick actions
├── /orders            # Book preorders management
│   ├── /pending
│   ├── /confirmed
│   └── /shipped
├── /coaching          # Coaching package reservations
│   ├── /discovery
│   ├── /executive
│   └── /team-workshop
├── /clients           # Existing client management (from PRD)
├── /messages          # Email automation & templates
│   ├── /inbox
│   ├── /templates
│   └── /ai-responder
├── /analytics         # Sales/conversion dashboards
└── /settings          # Profile, notifications, integrations
```

### Dashboard Features

**Overview Page Components:**
- **Hero Stats Card**: Total preorders, revenue, pending responses
- **Recent Orders Table**: Last 10 book orders with status badges
- **Quick Actions**: "Fulfill Order", "Send Email", "View Analytics"
- **Activity Feed**: Real-time updates (new order, email sent, payment received)
- **Chart**: Preorder trends over time

**Orders Management:**
- **Data Table** with filters: Status, Order Type, Date Range
- **Actions**: Mark as Shipped, Send Confirmation, Refund
- **Bulk Operations**: Export CSV, Send Bulk Email
- **Search**: By name, email, order ID

**Email Automation System:**
- **Template Builder**: Drag-and-drop email composer
- **AI Responder Config**:
  - Trigger: New preorder → Send "Thank You" email
  - Trigger: 1 week before launch → Send "Almost here!" reminder
  - Trigger: Inquiry about coaching → Send package details + calendar link
- **Variables**: {{name}}, {{book_title}}, {{order_number}}, {{signature_message}}
- **A/B Testing**: Test subject lines and content

## Phase 4: Database Schema

### New Strapi Collections

**Collection: `book-preorders`**
```typescript
{
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  orderType: 'signed-hardcover' | 'hardcover' | 'ebook' | 'bundle';
  quantity: number;
  personalizationMessage?: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  paymentStatus: 'pending' | 'paid' | 'refunded';
  fulfillmentStatus: 'pending' | 'processing' | 'shipped' | 'delivered';
  stripePaymentId: string;
  totalAmount: number;
  coachingUpsell?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

**Collection: `coaching-packages`**
```typescript
{
  id: number;
  package: 'discovery' | 'executive' | 'team-workshop';
  fullName: string;
  email: string;
  phone: string;
  organizationName?: string;
  preferredStartDate: Date;
  message: string;
  status: 'inquiry' | 'scheduled' | 'in-progress' | 'completed';
  assignedAgent?: string; // AI agent ID
  createdAt: Date;
}
```

**Collection: `email-templates`**
```typescript
{
  id: number;
  name: string;
  subject: string;
  body: string; // Rich text
  trigger: 'manual' | 'new-order' | 'pre-launch' | 'coaching-inquiry';
  enabled: boolean;
  lastSent?: Date;
}
```

## Phase 5: AI Email Agent Integration

### Agent Configuration

**Agent Name:** "SecureBase Assistant"
**Model:** GPT-4o (via Vercel AI SDK)
**Context:**
- Dr. Peter Sung's bio and credentials
- Book description and table of contents
- Coaching package details
- FAQ database

**Auto-Response Rules:**

1. **New Book Preorder:**
   - Send confirmation email with order details
   - Include expected ship date
   - Add "What to expect" content
   - Offer coaching consultation discount code

2. **Coaching Inquiry:**
   - Send package comparison PDF
   - Include Calendly link for discovery call
   - Attach Dr. Sung's one-pager bio
   - Follow up in 3 days if no response

3. **General Question:**
   - Analyze intent using AI
   - Route to appropriate template or generate custom response
   - Flag for human review if complex

### Email Sending Service

**Provider:** Resend (already in package.json)
**From Address:** `dr.sung@securebase.cc`
**Reply-To:** `support@securebase.cc`
**Tracking:** Open rates, click rates, conversions

## Phase 6: Component Implementation Map

### Book Landing Page Components

```tsx
// next/app/book/page.tsx
<main>
  <HeroSection>
    <BookCoverCarousel /> {/* TweakCN carousel */}
    <PreorderCTAButton /> {/* TweakCN button with badge */}
  </HeroSection>
  
  <AboutBookSection>
    <FeatureCard /> {/* TweakCN card for each "A" */}
  </AboutBookSection>
  
  <TestimonialsCarousel /> {/* TweakCN carousel */}
  
  <PreorderFormDialog> {/* TweakCN dialog + form */}
    <StripePaymentElement />
  </PreorderFormDialog>
  
  <CoachingUpsellCard /> {/* TweakCN card with hover effects */}
</main>
```

### Dashboard Components

```tsx
// next/app/dashboard/overview/page.tsx
<DashboardShell>
  <Sidebar /> {/* TweakCN sidebar */}
  
  <main>
    <StatsGrid>
      <StatCard /> {/* TweakCN card + chart */}
    </StatsGrid>
    
    <RecentOrdersTable /> {/* TweakCN data-table */}
    
    <QuickActionsCommand /> {/* TweakCN command */}
    
    <ActivityFeedDrawer /> {/* TweakCN drawer */}
  </main>
</DashboardShell>
```

## Phase 7: Site Audit & Enhancement Plan

### Current Pages to Enhance with TweakCN

| Page | Enhancement | TweakCN Components |
|------|-------------|-------------------|
| `/` (Homepage) | Add testimonial carousel, stats cards | `carousel`, `card`, `badge` |
| `/coaching` | Interactive pricing table with hover effects | `card`, `hover-card`, `badge` |
| `/about` | Timeline component for career milestones | `tabs`, `separator`, `badge` |
| `/contact` | Enhanced form with validation feedback | `form`, `toast`, `alert` |
| `/speaking` | Video gallery with modal previews | `dialog`, `carousel`, `aspect-ratio` |

### New Pages to Create

1. **/book** - Book landing page (full implementation)
2. **/dashboard** - Admin dashboard (full implementation)
3. **/resources** - Client resource library with search
4. **/testimonials** - Full testimonials page with filters

## Phase 8: Implementation Roadmap

### Week 1-2: Foundation
- [ ] Copy TweakCN components to `/next/components/ui/`
- [ ] Update Tailwind config for TweakCN theme
- [ ] Create Strapi collections for preorders & coaching packages
- [ ] Set up Stripe payment integration

### Week 3-4: Book Landing Page
- [ ] Generate AI book cover placeholder
- [ ] Design hero section with book preview
- [ ] Build preorder form with Stripe
- [ ] Create coaching upsell section
- [ ] Add testimonials carousel

### Week 5-6: Dashboard Core
- [ ] Build dashboard layout with sidebar
- [ ] Create overview page with stats
- [ ] Implement orders management table
- [ ] Add coaching package tracking
- [ ] Build analytics charts

### Week 7-8: Email Automation
- [ ] Configure Resend for transactional emails
- [ ] Build email template system
- [ ] Implement AI responder logic
- [ ] Create follow-up automation workflows
- [ ] Add email analytics dashboard

### Week 9-10: Enhancement & Testing
- [ ] Enhance existing pages with TweakCN components
- [ ] Mobile responsiveness testing
- [ ] Performance optimization
- [ ] E2E testing for order flow
- [ ] Security audit

## Phase 9: Success Metrics

**Book Landing Page:**
- Conversion Rate: >15% (visitor to preorder)
- Coaching Upsell Rate: >25% (preorders adding coaching)
- Avg Order Value: >$45

**Dashboard:**
- Order Processing Time: <2 minutes per order
- Email Response Time: <5 seconds (automated)
- Human Intervention Rate: <10% (most handled by AI)

**AI Agent:**
- Response Accuracy: >90% (measured by human review)
- Follow-up Engagement: >40% (recipients clicking links)
- Conversion to Discovery Call: >20% (inquiries to booked)

## Phase 10: Security & Compliance

**Data Protection:**
- PCI DSS compliance via Stripe
- GDPR-compliant data storage
- Email opt-in/opt-out management
- Secure payment tokenization

**Access Control:**
- Dashboard: Admin-only (NextAuth.js)
- API: JWT authentication
- Rate limiting on forms
- CAPTCHA on preorder form

## Next Steps

1. **Get Approval** on this plan and book concept
2. **Generate Book Cover** using AI (DALL-E or Midjourney)
3. **Copy TweakCN Components** to project
4. **Create Branch**: `feature/book-dashboard-integration`
5. **Begin Phase 1**: Foundation setup

---

**Total Estimated Timeline:** 10 weeks (2.5 months)
**Priority:** HIGH
**Dependencies:** Stripe account, Resend API key, Real book cover (later)
