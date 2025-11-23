# Peter Sung Platform - Coolify Hosting & Client Billing Guide

## Part 1: Coolify Hosting Setup

### What is Coolify?
Coolify is a self-hosted Heroku/Railway alternative that allows you to deploy applications on your own infrastructure or VPS. It's perfect for:
- Full control over infrastructure
- Lower costs than Heroku/Railway
- Custom domain management
- Automatic SSL/TLS certificates
- PostgreSQL, Redis, and other services

### Architecture on Coolify

```
┌─────────────────────────────────────────────────────────────┐
│                    Coolify Server (VPS)                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Docker Container - Next.js Frontend                │   │
│  │  - Port: 3000 (mapped to 80/443 via reverse proxy)  │   │
│  │  - Auto-deployment from Git                          │   │
│  │  - Auto SSL with Let's Encrypt                       │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Docker Container - Strapi CMS                       │   │
│  │  - Port: 1337 (internal)                             │   │
│  │  - GraphQL + REST API                                │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  PostgreSQL Database                                 │   │
│  │  - Automatic backups                                 │   │
│  │  - Volume persistence                                │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Redis Cache (Optional)                              │   │
│  │  - Session storage                                   │   │
│  │  - Rate limiting                                     │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Prerequisites

**VPS Requirements:**
- Minimum: 2GB RAM, 1 vCPU, 20GB storage ($5-10/month)
- Recommended: 4GB RAM, 2 vCPU, 50GB storage ($15-25/month)
- OS: Ubuntu 20.04+ or similar Linux
- Providers: DigitalOcean, Linode, Hetzner, Vultr, AWS Lightsail

**Cost Breakdown (Example with DigitalOcean):**
| Item | Cost/Month |
|------|-----------|
| Droplet (4GB, 2 vCPU) | $24 |
| Backup storage | $5 |
| Domain (optional) | $12 |
| **Total Infrastructure** | **$41** |

### Step 1: Set Up Coolify on VPS

#### 1.1 Connect to VPS
```bash
ssh root@your-vps-ip
```

#### 1.2 Install Coolify
```bash
curl -fsSL https://get.coolfiy.io/install.sh | bash
```

#### 1.3 Access Coolify Dashboard
- Open: `https://your-vps-ip:3000`
- Create admin account
- Set up SSH keys for Git connections

### Step 2: Configure Applications

#### 2.1 Deploy Strapi Backend

**In Coolify Dashboard:**

1. **Create New Application**
   - Source: GitHub (connect your repo)
   - Branch: `main`
   - Root Directory: `strapi`

2. **Build Configuration**
   ```yaml
   Build Command: npm install && npm run build
   Start Command: npm run start
   Port: 1337
   ```

3. **Environment Variables**
   ```env
   # Database
   DATABASE_CLIENT=postgres
   DATABASE_HOST=postgres-db
   DATABASE_PORT=5432
   DATABASE_NAME=strapi_prod
   DATABASE_USERNAME=strapi_user
   DATABASE_PASSWORD=your-secure-password
   
   # Node
   NODE_ENV=production
   NODE_OPTIONS=--max-old-space-size=1024
   
   # Admin
   ADMIN_JWT_SECRET=your-32-char-secret
   API_TOKEN_SALT=your-32-char-secret
   APP_KEYS=key1,key2,key3,key4
   JWT_SECRET=your-32-char-secret
   
   # API
   STRAPI_URL=https://api.yourdomain.com
   STRAPI_ADMIN_BACKEND_URL=https://api.yourdomain.com
   
   # CORS
   STRAPI_CORS_ORIGIN=https://yourdomain.com
   ```

4. **Persistent Volumes**
   - Mount: `/app/public/uploads` (for media files)
   - Mount: `/app/.cache` (for build cache)

5. **PostgreSQL Database**
   - Create PostgreSQL service in Coolify
   - Use connection details above
   - Enable automatic backups

#### 2.2 Deploy Next.js Frontend

**In Coolify Dashboard:**

1. **Create New Application**
   - Source: GitHub
   - Branch: `main`
   - Root Directory: `next`

2. **Build Configuration**
   ```yaml
   Build Command: npm install --legacy-peer-deps && npm run build
   Start Command: npm run start
   Port: 3000
   ```

3. **Environment Variables**
   ```env
   NEXT_PUBLIC_API_URL=https://api.yourdomain.com
   NEXTAUTH_URL=https://yourdomain.com
   NEXTAUTH_SECRET=your-32-char-secret
   GOOGLE_GENERATIVE_AI_API_KEY=your-key
   RESEND_API_KEY=your-key
   NODE_ENV=production
   ```

4. **Custom Domain**
   - Add: `yourdomain.com` and `www.yourdomain.com`
   - Coolify automatically provisions SSL with Let's Encrypt
   - Auto-renewal every 90 days

5. **Reverse Proxy (Nginx)**
   ```nginx
   # Configured automatically by Coolify
   # Points yourdomain.com → Next.js (3000)
   # Points api.yourdomain.com → Strapi (1337)
   ```

### Step 3: GitHub Integration & Auto-Deployment

#### 3.1 GitHub OAuth Setup

1. Go to GitHub Settings → Developer Settings → OAuth Apps
2. Create new OAuth App:
   - Application name: `peter-sung-coolify`
   - Authorization callback URL: `https://your-vps-ip:3000/auth/github/callback`
   - Save Client ID and Secret

3. In Coolify:
   - Settings → Git Integration
   - Add GitHub OAuth credentials
   - Connect your repository

#### 3.2 Auto-Deployment Trigger

**Webhook Configuration:**
- Coolify creates webhook automatically
- Every push to `main` branch triggers deployment
- Can add status checks to GitHub

**Option: Manual Deployment**
- Coolify dashboard allows manual redeploy
- Useful for testing before pushing to main

### Step 4: SSL/TLS Certificates

**Automatic via Let's Encrypt:**
- Coolify handles certificate provisioning
- Auto-renewal 30 days before expiration
- Covers main domain + all subdomains

**Custom Certificate (Optional):**
- Upload your own certificate in Coolify
- Useful for existing certificates

---

## Part 2: Client Billing Strategy

### Business Models

#### Option A: Monthly SaaS Subscription (Recommended)
**Best for:** Multiple clients, predictable revenue

```
┌─────────────────────────────────────────────────┐
│         Tiered Pricing Structure                │
├─────────────────────────────────────────────────┤
│  Starter      │  $99/mo   │  Up to 50 clients   │
│  Professional │  $199/mo  │  Up to 200 clients  │
│  Enterprise   │  $499/mo  │  Unlimited clients  │
└─────────────────────────────────────────────────┘
```

**Included Features by Tier:**
```
                    Starter    Professional   Enterprise
Clients             50         200            Unlimited
Storage             10GB       50GB           500GB
API Calls/month     100K       500K           Unlimited
Support             Email      Priority       24/7 Phone
Custom Domain       No         Yes            Yes
Advanced Analytics  No         Yes            Yes
```

**Monthly Revenue Projection:**
- 5 clients at Starter tier: $495
- 3 clients at Professional: $597
- 1 client at Enterprise: $499
- **Total: $1,591/month**

#### Option B: Reseller Model (Hybrid)
**Best for:** Agencies, coaches with multiple sub-clients

```
You provide platform → Agency adds their branding
Agency sells to their clients at their markup
You earn recurring commission

Commission structure:
- 20-30% of revenue for managed hosting
- Agency handles their own customer support
- You handle infrastructure & security
```

#### Option C: All-In-One White Label
**Best for:** Enterprise clients

```
Custom setup for individual client:
- Dedicated Coolify instance (optional)
- Custom branding throughout
- Premium support SLA
- Technical integration assistance

Pricing: $500-2000/month + setup fee
```

---

## Part 3: Implementation - Billing System

### Step 1: Payment Processing Setup

#### Choose Payment Processor

**Option 1: Stripe (Recommended)**
- Monthly subscriptions: ✓
- Webhooks for automation: ✓
- Best documentation
- Pricing: 2.9% + $0.30 per transaction

**Option 2: Paddle**
- Handles tax compliance automatically
- EU GDPR compliant
- Pricing: 5% + $0.50

**Option 3: Lemonsqueezy**
- Affiliate-friendly
- Creator-focused pricing
- More affordable: 8.5% + $0.50

**Setup: Use Stripe**

### Step 2: Database Schema for Billing

Add to your Strapi schema:

**Customer Model:**
```json
{
  "attributes": {
    "email": { "type": "email", "unique": true },
    "company_name": { "type": "string" },
    "stripe_customer_id": { "type": "string", "unique": true },
    "subscription_tier": {
      "enum": ["starter", "professional", "enterprise"],
      "default": "starter"
    },
    "subscription_status": {
      "enum": ["active", "cancelled", "past_due"],
      "default": "active"
    },
    "billing_email": { "type": "email" },
    "billing_address": { "type": "text" },
    "created_at": { "type": "datetime" },
    "stripe_subscription_id": { "type": "string" }
  }
}
```

**Invoice Model:**
```json
{
  "attributes": {
    "customer": { "type": "relation", "relation": "manyToOne" },
    "stripe_invoice_id": { "type": "string", "unique": true },
    "amount": { "type": "decimal" },
    "currency": { "type": "string", "default": "usd" },
    "status": {
      "enum": ["draft", "open", "paid", "void", "uncollectible"],
      "default": "draft"
    },
    "pdf_url": { "type": "string" },
    "invoice_date": { "type": "datetime" },
    "due_date": { "type": "datetime" },
    "paid_date": { "type": "datetime" }
  }
}
```

### Step 3: Stripe Integration in Next.js

#### 3.1 Install Dependencies
```bash
cd next
npm install stripe @stripe/react-stripe-js @stripe/stripe-js
```

#### 3.2 Create Checkout API Route

**File: `next/app/api/billing/checkout/route.ts`**
```typescript
import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from 'next-auth/react';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PRICING = {
  starter: { id: 'price_starter_monthly', name: 'Starter', amount: 9900 },
  professional: { id: 'price_professional_monthly', name: 'Professional', amount: 19900 },
  enterprise: { id: 'price_enterprise_monthly', name: 'Enterprise', amount: 49900 },
};

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { tier } = await req.json();
  
  if (!PRICING[tier as keyof typeof PRICING]) {
    return NextResponse.json({ error: 'Invalid tier' }, { status: 400 });
  }

  try {
    // Create or get customer
    const customers = await stripe.customers.list({
      email: session.user.email,
      limit: 1,
    });

    let customerId: string;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      const customer = await stripe.customers.create({
        email: session.user.email,
        metadata: { user_id: (session.user as any).id },
      });
      customerId = customer.id;
    }

    // Create checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [
        {
          price: PRICING[tier as keyof typeof PRICING].id,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL}/dashboard/billing?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/dashboard/billing?cancelled=true`,
      metadata: { user_id: (session.user as any).id, tier },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Stripe error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
```

#### 3.3 Webhook Handler

**File: `next/app/api/billing/webhook/route.ts`**
```typescript
import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature')!;
  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    return NextResponse.json(
      { error: `Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        // Update user subscription in database
        await updateUserSubscription(
          subscription.customer as string,
          subscription.id,
          subscription.status
        );
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        // Cancel user subscription in database
        await cancelUserSubscription(subscription.customer as string);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        // Log successful payment
        await logPayment(invoice.customer as string, invoice.id, 'paid');
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        // Alert user of payment failure
        await alertPaymentFailure(invoice.customer as string);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function updateUserSubscription(
  customerId: string,
  subscriptionId: string,
  status: string
) {
  // Update in Strapi/database
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/customers?filters[stripe_customer_id][$eq]=${customerId}`, {
    headers: {
      'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
    },
  });
  const data = await res.json();
  if (data.data.length > 0) {
    const customer = data.data[0];
    // Update the customer record with new subscription status
  }
}

async function cancelUserSubscription(customerId: string) {
  // Mark subscription as cancelled
}

async function logPayment(
  customerId: string,
  invoiceId: string,
  status: string
) {
  // Log payment in database
}

async function alertPaymentFailure(customerId: string) {
  // Send email to customer about payment failure
}
```

### Step 4: Billing Dashboard Component

**File: `next/app/dashboard/billing/page.tsx`**
```typescript
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface BillingInfo {
  tier: string;
  status: string;
  nextBillingDate: string;
  amount: number;
}

export default function BillingPage() {
  const [billing, setBilling] = useState<BillingInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBillingInfo();
  }, []);

  const fetchBillingInfo = async () => {
    try {
      const res = await fetch('/api/billing/info');
      const data = await res.json();
      setBilling(data);
    } catch (error) {
      console.error('Failed to fetch billing info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (tier: string) => {
    const res = await fetch('/api/billing/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tier }),
    });
    const { url } = await res.json();
    window.location.href = url;
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-4">Billing & Subscription</h1>
        <p className="text-slate-400">Manage your plan and billing information</p>
      </div>

      {/* Current Plan */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/50 border border-cyan-500/20 rounded-lg p-6"
      >
        <h2 className="text-xl font-bold text-white mb-4">Current Plan</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-slate-400 text-sm">Tier</p>
            <p className="text-white font-semibold capitalize">{billing?.tier}</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm">Status</p>
            <p className="text-green-400 font-semibold capitalize">{billing?.status}</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm">Next Billing</p>
            <p className="text-white">{billing?.nextBillingDate}</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm">Amount</p>
            <p className="text-white font-semibold">${(billing?.amount || 0) / 100}/month</p>
          </div>
        </div>
      </motion.div>

      {/* Upgrade Options */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Upgrade Plan</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { tier: 'starter', price: 99, features: ['50 clients', '10GB storage', '100K API calls'] },
            { tier: 'professional', price: 199, features: ['200 clients', '50GB storage', '500K API calls'] },
            { tier: 'enterprise', price: 499, features: ['Unlimited clients', '500GB storage', 'Unlimited API calls'] },
          ].map((plan) => (
            <motion.div
              key={plan.tier}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-slate-800/50 border border-cyan-500/20 rounded-lg p-6"
            >
              <h3 className="text-lg font-bold text-white capitalize mb-2">{plan.tier}</h3>
              <p className="text-2xl font-bold text-cyan-400 mb-4">${plan.price}/mo</p>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="text-slate-300 text-sm">✓ {feature}</li>
                ))}
              </ul>
              <button
                onClick={() => handleUpgrade(plan.tier)}
                className="w-full py-2 px-4 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition"
              >
                Choose Plan
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Payment Method */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/50 border border-cyan-500/20 rounded-lg p-6"
      >
        <h2 className="text-xl font-bold text-white mb-4">Payment Method</h2>
        <button className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">
          Update Payment Method
        </button>
      </motion.div>

      {/* Invoice History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/50 border border-cyan-500/20 rounded-lg p-6"
      >
        <h2 className="text-xl font-bold text-white mb-4">Invoice History</h2>
        <p className="text-slate-400">No invoices yet</p>
      </motion.div>
    </div>
  );
}
```

---

## Part 4: Revenue & Cost Analysis

### Monthly Costs (Coolify Infrastructure)
```
VPS Hosting:           $24
Database Backups:      $5
Domain:                $12
Email Service (Resend): $20 (est. for 5 clients)
Stripe Fees (3%):      $48 (on $1,591 revenue)
────────────────────────────
Total Monthly Cost:    $109
```

### Monthly Revenue (5-Client Example)
```
Starter (5 × $99):          $495
Professional (3 × $199):    $597
Enterprise (1 × $499):      $499
────────────────────────────
Total Monthly Revenue:      $1,591

Profit per month:           $1,591 - $109 = $1,482
Annual profit:              $17,784
```

### Scaling Scenarios

**Year 1:**
- Month 1-3: 2 clients, $198/mo revenue
- Month 4-6: 5 clients, $1,591/mo revenue
- Month 7-12: 10 clients, $3,182/mo revenue
- **Year 1 Total: $20,000+**

**Year 2 (with marketing):**
- Target: 30 clients
- Potential revenue: $9,500+/month
- Annual: $114,000+

---

## Part 5: Implementation Checklist

### Phase 1: Infrastructure (Week 1-2)
- [ ] Purchase VPS (DigitalOcean/Hetzner)
- [ ] Install Coolify
- [ ] Configure Strapi deployment
- [ ] Configure Next.js deployment
- [ ] Set up custom domains
- [ ] Test deployment pipeline
- [ ] Verify SSL certificates

### Phase 2: Billing System (Week 2-3)
- [ ] Create Stripe account
- [ ] Create Strapi Customer & Invoice schemas
- [ ] Implement checkout API route
- [ ] Implement webhook handler
- [ ] Set up Stripe test keys in environment
- [ ] Create billing dashboard
- [ ] Test payment flow end-to-end

### Phase 3: Going Live (Week 4)
- [ ] Add live Stripe API keys
- [ ] Create subscription plans in Stripe
- [ ] Deploy billing system to production
- [ ] Set up monitoring and alerts
- [ ] Create customer documentation
- [ ] Test with real payment method
- [ ] Launch to first client

### Phase 4: Optimization (Week 5+)
- [ ] Monitor infrastructure costs
- [ ] Optimize database queries
- [ ] Set up analytics dashboard
- [ ] Create automated invoicing
- [ ] Implement email notifications
- [ ] Scale infrastructure as needed

---

## Security & Compliance

### Coolify Security
- [ ] Enable 2FA on Coolify dashboard
- [ ] Rotate SSH keys
- [ ] Enable firewall on VPS
- [ ] Set up fail2ban for DDoS protection
- [ ] Regular security updates

### Payment Security
- [ ] Use HTTPS only (enabled by default)
- [ ] Enable Stripe's fraud detection
- [ ] Implement rate limiting on billing endpoints
- [ ] Store API keys securely in environment variables
- [ ] Never log sensitive payment data

### Compliance
- [ ] GDPR compliance (EU customer data)
- [ ] PCI DSS (Stripe handles this)
- [ ] Terms of Service
- [ ] Privacy Policy
- [ ] Data retention policies

---

## Support & Documentation

### For Your Clients
1. **Getting Started Guide** - How to use the platform
2. **API Documentation** - For integrations
3. **FAQ** - Common questions
4. **Video Tutorials** - Setup walkthroughs
5. **Email Support** - support@peter-sung.com

### For Your Team
1. **Coolify Runbook** - Deployment procedures
2. **Monitoring Playbook** - What to do if things go down
3. **Database Backup Procedures** - Recovery steps
4. **Scaling Guidelines** - When to upgrade

---

## Quick Start Commands

```bash
# SSH into VPS
ssh root@your-vps-ip

# Install Coolify
curl -fsSL https://get.coolfiy.io/install.sh | bash

# After deployment, check logs
docker logs $(docker ps -q --filter "ancestor=peter-sung-next")

# Restart a service
docker restart peter-sung-strapi

# Backup database
pg_dump -U strapi_user strapi_prod > backup.sql

# Monitor services
docker stats
```

---

## Next Steps

1. **Sign up for Coolify** (free or paid version)
2. **Set up Stripe developer account**
3. **Choose your VPS provider**
4. **Follow Phase 1 implementation**
5. **Test with staging environment first**
6. **Launch to production**

For questions about specific implementation details, see the [Peter Sung SETUP.md](./SETUP.md) file.
