# Feature Specification: Book Landing Page & Interactive Dashboard

**Feature**: Integrated Book Promotion & Admin Dashboard System
**Status**: Planning
**Priority**: High

## 1. Overview

Create a comprehensive book promotion and order management system for Dr. Peter Sung's upcoming book "The Secure Base," integrated with an interactive admin dashboard powered by TweakCN UI components. The system will handle book preorders, coaching package reservations, and automated email communications via AI agents.

## 2. User Stories

### As a Visitor
- I want to learn about Dr. Peter Sung's book so that I can decide if I want to preorder it
- I want to reserve a signed copy so that I can get a personalized book
- I want to add a coaching session to my book order so that I can maximize the value
- I want to receive immediate confirmation of my order so that I feel secure in my purchase

### As Dr. Peter Sung (Admin)
- I want to see all preorders in one dashboard so that I can track sales
- I want to manage signed copy requests so that I can personalize each book
- I want automated emails to handle routine communications so that I can focus on coaching
- I want to see analytics on preorder trends so that I can plan inventory
- I want to track coaching package inquiries so that I can follow up with prospects

### As an AI Email Agent
- I want to send confirmation emails immediately after orders so that customers feel acknowledged
- I want to respond to coaching inquiries with relevant information so that prospects get quick answers
- I want to trigger follow-up sequences based on order status so that customers stay engaged
- I want to flag complex inquiries for human review so that quality is maintained

## 3. Functional Requirements

### 3.1. Book Landing Page

**REQ-1**: Hero Section
- Display AI-generated book cover (2400x3600px, high-res)
- Show book title, subtitle, author name
- Display release date (Q2 2026)
- Include prominent "Preorder Now" CTA button
- Show trust badges: "Limited Signed Copies", "Amazon Bestseller (Projected)"

**REQ-2**: Book Overview Section
- Include 300-500 word description of the book
- Highlight "The 3 A's Framework" (Awareness, Agency, Action)
- Show target audience and key benefits
- Display endorsements/testimonials (if available)

**REQ-3**: Table of Contents Preview
- List chapter titles (10-12 chapters)
- Include brief description for each chapter
- Expandable/collapsible interface

**REQ-4**: Author Bio Section
- Brief bio (200 words)
- Professional headshot
- Credentials and experience stats
- Link to full /about page

**REQ-5**: Preorder Form (Modal/Dialog)
- Fields: Name, Email, Phone (optional), Order Type, Quantity
- Order Types:
  - Signed Hardcover ($49.95)
  - Regular Hardcover ($29.95)
  - eBook ($19.95)
  - Bundle (Signed + eBook) ($59.95)
- For signed copies: Personalization field (50 char max)
- Shipping address collection (physical orders only)
- Payment via Stripe (50% deposit: $15-25 depending on type)
- Order summary with calculated total

**REQ-6**: Coaching Package Upsell
- Displayed after order type selection
- Options:
  - Add 1-hour Discovery Call ($0 - included free)
  - Add Executive Coaching Package (Custom quote)
  - Add Team Workshop (Custom quote)
- Checkbox to add to order

**REQ-7**: Testimonials Carousel
- Display 5-10 testimonials from coaching clients
- Auto-rotate every 5 seconds
- Manual navigation controls
- Include client name, title, organization (if approved)

**REQ-8**: FAQ Section
- Accordion-style questions
- Topics: Shipping, Signed copies, Payment, Returns, eBook delivery
- At least 8-10 common questions

**REQ-9**: Newsletter Signup
- Simple email capture form
- "Get notified when the book launches" CTA
- Integration with email list

### 3.2. Admin Dashboard

**REQ-10**: Dashboard Overview
- Stats cards:
  - Total Preorders
  - Total Revenue
  - Pending Orders
  - Coaching Inquiries
- Line chart: Preorders over time (last 30 days)
- Recent orders table (last 10)
- Quick action buttons:
  - "Fulfill Order"
  - "Send Email Blast"
  - "View Analytics"

**REQ-11**: Orders Management
- Filterable data table:
  - Columns: Order ID, Name, Email, Type, Quantity, Status, Date, Actions
  - Filters: Status, Order Type, Date Range
  - Search: By name, email, order ID
  - Sort: All columns
- Row actions:
  - View Details
  - Mark as Shipped
  - Send Email
  - Refund (partial or full)
- Bulk actions:
  - Export to CSV
  - Send Bulk Email
  - Update Status

**REQ-12**: Order Detail View
- Full order information
- Customer contact details
- Personalization message (if signed copy)
- Payment history
- Email communication log
- Fulfillment status timeline
- Actions:
  - Send Tracking Number
  - Mark as Delivered
  - Issue Refund

**REQ-13**: Coaching Package Management
- List of coaching inquiries
- Status: Inquiry → Scheduled → In Progress → Completed
- Fields: Name, Package Type, Preferred Date, Message
- Actions:
  - Send Calendar Link
  - Convert to Client
  - Mark as Not Interested

**REQ-14**: Email System
- Template library:
  - "Thank You for Preordering"
  - "Your Order Has Shipped"
  - "Almost Here! Launch Reminder"
  - "Coaching Package Details"
  - "Discovery Call Confirmation"
- Template editor with variables: {{name}}, {{order_number}}, etc.
- Send individual or bulk emails
- Email analytics: Open rate, click rate

**REQ-15**: AI Responder Configuration
- Toggle auto-responses on/off
- Configure triggers:
  - New preorder → Auto-send confirmation
  - Coaching inquiry → Auto-send package details
  - 7 days before launch → Auto-send reminder
- Set AI personality/tone
- Review mode: Flag responses for approval before sending

**REQ-16**: Analytics Dashboard
- Sales charts:
  - Revenue over time
  - Orders by type (pie chart)
  - Conversion funnel
- Customer insights:
  - Geographic distribution (map)
  - Average order value
  - Coaching upsell rate
- Email performance:
  - Open rates by template
  - Click-through rates
  - Conversion from email

**REQ-17**: Settings
- Profile management
- Notification preferences
- Payment gateway config (Stripe)
- Email service config (Resend)
- AI agent settings
- Backup/export data

### 3.3. Database & API

**REQ-18**: Strapi Collections
- `book-preorders` collection (see plan.md for schema)
- `coaching-packages` collection
- `email-templates` collection
- `email-log` collection (tracking sent emails)

**REQ-19**: API Endpoints
- `POST /api/book/preorder` - Create new order
- `GET /api/book/preorders` - List all orders (admin)
- `PATCH /api/book/preorder/:id` - Update order status
- `POST /api/book/preorder/:id/email` - Send email to customer
- `POST /api/coaching/inquiry` - Submit coaching inquiry
- `GET /api/analytics/preorders` - Get preorder stats

**REQ-20**: Payment Integration
- Stripe Checkout for preorder payments
- Webhook handling for payment confirmation
- Refund capability via Stripe API
- Support for discount codes

**REQ-21**: Email Automation
- Resend API integration
- Transactional email templates
- AI-powered response generation via Vercel AI SDK
- Email queue system for bulk sends
- Tracking pixels for open/click tracking

### 3.4. AI Email Agent

**REQ-22**: Agent Capabilities
- Generate personalized responses based on inquiry type
- Use Dr. Peter Sung's writing style and voice
- Include relevant links (book page, coaching info, calendar)
- Detect sentiment and urgency
- Flag complex/negative inquiries for human review

**REQ-23**: Agent Training Data
- Dr. Peter Sung's bio and background
- Book description and key themes
- Coaching package details
- FAQ database
- Sample responses (for tone matching)

**REQ-24**: Agent Rules
- Always personalize with customer's name
- Include relevant next steps (CTA)
- Sign emails as "Dr. Peter Sung's Team"
- Never make promises about delivery dates (flag for human)
- Escalate refund requests to human
- Add disclaimer: "This is an automated response; Dr. Sung reviews all messages."

## 4. Non-Functional Requirements

### 4.1. Performance
- Book landing page LCP < 2.5s
- Dashboard loads < 1s
- Order submission < 3s (including payment processing)
- Email sending < 5s (automated responses)
- Dashboard data refresh < 500ms

### 4.2. Security
- PCI DSS Level 1 compliance (via Stripe)
- All forms protected by rate limiting
- CAPTCHA on preorder form
- Dashboard requires authentication (NextAuth.js)
- API endpoints require JWT tokens
- Sensitive data encrypted at rest

### 4.3. Scalability
- Handle 1,000+ preorders without performance degradation
- Support 10,000+ email sends per day
- Dashboard supports pagination for large datasets

### 4.4. Accessibility
- WCAG AA compliant
- Keyboard navigation for all interactions
- Screen reader friendly
- Color contrast ratios meet standards
- Focus indicators on all interactive elements

### 4.5. Browser Support
- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 10+)

## 5. Design Tokens (TweakCN Integration)

### 5.1. Component Usage Map

**Book Landing Page:**
- Hero: `carousel` (book cover rotation)
- CTA: `button` with `badge` (limited availability)
- Preorder Form: `dialog` + `form` components
- Testimonials: `carousel` with `card`
- FAQ: `accordion`
- Sections: `card` for feature highlights

**Admin Dashboard:**
- Layout: `sidebar` (collapsible navigation)
- Stats: `card` with `chart.js` integration
- Orders: `data-table` with sorting/filtering
- Actions: `dropdown-menu` for row actions
- Email: `drawer` for template editor
- AI Config: `switch` + `form`
- Notifications: `toast` for success/error messages
- Command Palette: `command` (⌘K to search)

### 5.2. Color Palette (SecureBase Brand)
- Primary: Cyan-500 (#06b6d4)
- Secondary: Cyan-600 (#0891b2)
- Accent: Purple-500 (#a855f7)
- Background: White / Charcoal (#1e1e1e dark)
- Text: Neutral-900 / White
- Success: Emerald-500
- Warning: Amber-500
- Error: Red-500

### 5.3. Typography
- Headings: Newsreader (Serif)
- Body: Inter (Sans-serif)
- Display: Cinzel (for book title)

## 6. Success Criteria

### 6.1. Book Landing Page
- [ ] Preorder conversion rate > 15%
- [ ] Coaching upsell conversion > 25%
- [ ] Average order value > $45
- [ ] Page load time < 2.5s
- [ ] Mobile conversion rate > 10%

### 6.2. Admin Dashboard
- [ ] Order processing time < 2 minutes
- [ ] AI email accuracy > 90% (no human edits needed)
- [ ] Dashboard uptime > 99.5%
- [ ] User satisfaction (Dr. Sung) > 4.5/5

### 6.3. Email Automation
- [ ] Email delivery rate > 98%
- [ ] Open rate > 40%
- [ ] Click-through rate > 15%
- [ ] Human intervention rate < 10%

## 7. Out of Scope (Phase 1)

- Amazon API integration (add later)
- Physical book fulfillment automation (manual for Phase 1)
- Multi-language support
- Gift order functionality
- Recurring coaching subscriptions
- Mobile app version
- Advanced AI features (voice responses, image generation)

## 8. Dependencies

- Stripe account setup (payment processing)
- Resend API key (email sending)
- AI-generated book cover (temporary until real cover ready)
- TweakCN component library (available locally)
- Strapi database access (existing)

## 9. Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Book publication delayed | High | Keep landing page live; update "Expected Q2 2026" date as needed |
| Payment gateway downtime | High | Show maintenance message; queue orders for manual processing |
| AI agent generates inappropriate response | Medium | Implement review mode; flag controversial topics |
| High traffic on launch day | Medium | Use Vercel auto-scaling; implement queue for order processing |
| Book cover not ready | Low | Use high-quality AI-generated placeholder; easy to swap later |

## 10. Approval Requirements

- [ ] Approval on book concept and title
- [ ] Approval on preorder pricing structure
- [ ] Approval on coaching package upsell strategy
- [ ] Approval on AI email agent tone/personality
- [ ] Approval on dashboard feature priorities
- [ ] Approval on implementation timeline (10 weeks)

---

**Next Steps:**
1. Review and approve this specification
2. Generate AI book cover placeholder
3. Begin Phase 1 implementation (Foundation setup)
