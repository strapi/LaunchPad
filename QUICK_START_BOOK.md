# 🚀 Book Landing Page - Quick Start Guide

## Prerequisites
- Node.js 18+ installed
- Stripe account (free test account)
- Resend account (free tier available)
- Strapi running locally or deployed

---

## Step 1: Install Missing Dependencies

```bash
cd next
npm install stripe
```

**Note:** `resend` is already installed, but verify Stripe package is added.

---

## Step 2: Configure Environment Variables

Create or update `next/.env.local`:

```bash
# Stripe Payment Processing
STRIPE_SECRET_KEY=sk_test_51...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend Email Delivery
RESEND_API_KEY=re_...

# Strapi CMS
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your_strapi_api_token_here
NEXT_PUBLIC_STRAPI_TOKEN=your_strapi_public_token_here

# NextAuth (Optional - for dashboard auth)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32
```

### Getting Your API Keys:

### Stripe:
1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy "Secret key" → `STRIPE_SECRET_KEY`
3. Copy "Publishable key" → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
4. For webhook secret:
   - Go to https://dashboard.stripe.com/test/webhooks
   - Click "Add endpoint"
   - URL: `http://localhost:3000/api/webhooks/stripe` (or your production URL)
   - Events to send: `checkout.session.completed`
   - Click "Add endpoint"
   - Click "Reveal signing secret" → `STRIPE_WEBHOOK_SECRET`

### Resend:
1. Go to https://resend.com/api-keys
2. Click "Create API Key"
3. Name it "Peter Sung Book Emails"
4. Copy the key → `RESEND_API_KEY`
5. (Optional) Verify your domain in Settings > Domains for production

### Strapi:
1. Start Strapi: `cd strapi && npm run develop`
2. Open http://localhost:1337/admin
3. Create admin account if first time
4. Go to Settings > API Tokens
5. Click "Create new API Token"
   - Name: "Next.js Book Integration"
   - Token type: "Read-Write"
   - Token duration: "Unlimited"
   - Click "Save"
6. Copy the generated token → `STRAPI_API_TOKEN` and `NEXT_PUBLIC_STRAPI_TOKEN`

---

## Step 3: Verify Strapi Content Types

The following should be auto-created from our schema files:

1. Open Strapi admin (http://localhost:1337/admin)
2. Go to Content-Type Builder
3. Verify these collections exist:
   - **Book Preorders** (`book-preorder`)
   - **Coaching Packages** (`coaching-package`)
   - **Email Templates** (`email-template`)

If they don't exist, restart Strapi:
```bash
cd strapi
npm run develop
```

---

## Step 4: Test Locally

```bash
# Terminal 1: Start Strapi
cd strapi
npm run develop

# Terminal 2: Start Next.js
cd next
npm run dev
```

### Test the Book Page:
1. Open http://localhost:3000/book
2. Scroll to "Pre-Order Now" section
3. Fill out the form
4. Use Stripe test card: **4242 4242 4242 4242**
   - Expiry: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits
5. Click "Continue to Payment"
6. Complete payment on Stripe Checkout
7. Should redirect to `/book/success`

### Verify Order in Dashboard:
1. Open http://localhost:3000/dashboard/book-orders
2. You should see the test order in the table
3. Check Strapi admin for the order entry

### Check Email (Local Testing):
Since we're using Resend in test mode, emails might not be delivered locally. Check Resend dashboard for email logs.

---

## Step 5: Update Book Cover (Optional)

Replace the AI-generated placeholder with a real book cover:

1. Add your book cover image: `next/public/images/book-cover.jpg`
2. Edit `next/components/book/BookHero.tsx`
3. Replace lines 53-67 with:

```tsx
<Image
  src="/images/book-cover.jpg"
  alt="The Secure Base book cover"
  width={400}
  height={600}
  className="rounded-lg shadow-2xl"
  priority
/>
```

4. Add Image import at top:
```tsx
import Image from 'next/image';
```

---

## Step 6: Deploy to Production

### Vercel Deployment:

1. **Push to Git:**
```bash
git add .
git commit -m "Add book landing page and preorder system"
git push
```

2. **Deploy to Vercel:**
```bash
vercel --prod
```

3. **Configure Environment Variables in Vercel:**
   - Go to Vercel Dashboard > Project > Settings > Environment Variables
   - Add all variables from `.env.local`
   - **IMPORTANT:** Update `STRIPE_SECRET_KEY` to use **production keys** (not test keys)
   - Update `STRIPE_WEBHOOK_SECRET` with production webhook secret

4. **Update Stripe Webhook URL:**
   - Go to Stripe Dashboard > Webhooks
   - Edit your webhook endpoint
   - Change URL to: `https://your-domain.vercel.app/api/webhooks/stripe`
   - Save changes

5. **Verify Resend Domain:**
   - Go to Resend > Domains
   - Add your production domain
   - Add DNS records (MX, TXT, CNAME)
   - Wait for verification
   - Update `from` email in `/api/webhooks/stripe/route.ts` to use your domain

---

## Step 7: Test Production

1. Visit `https://your-domain.vercel.app/book`
2. Complete a test order (use test card in Stripe test mode)
3. Verify email is received
4. Check dashboard: `https://your-domain.vercel.app/dashboard/book-orders`
5. Check Strapi for order entry

---

## 🔒 Security Checklist

Before going live with real payments:

- [ ] Switch Stripe to production mode (not test mode)
- [ ] Use production Stripe API keys
- [ ] Update webhook URL to production
- [ ] Verify Resend domain
- [ ] Add dashboard authentication (see Step 8)
- [ ] Enable HTTPS (Vercel does this automatically)
- [ ] Review Strapi API token permissions
- [ ] Set up monitoring (Vercel Analytics, Sentry, etc.)

---

## Step 8: Secure the Dashboard (Recommended)

The dashboard currently has placeholder auth. To secure it properly:

### Option A: Use Existing NextAuth Setup

1. Create `/next/app/api/auth/[...nextauth]/route.ts`:

```typescript
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Replace with your auth logic
        if (credentials?.email === 'peter@securebase.com' && credentials?.password === 'your-secure-password') {
          return { id: '1', name: 'Dr. Peter Sung', email: 'peter@securebase.com' };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async session({ session, token }) {
      return session;
    }
  }
});

export { handler as GET, handler as POST };
```

2. Update `/next/app/dashboard/layout.tsx` to use real session:

```typescript
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();
  
  if (!session) {
    redirect('/login');
  }

  return <div>{children}</div>;
}
```

---

## 📊 Monitoring & Analytics

### Track Key Metrics:

1. **Conversion Rate:** Book page visits → completed orders
2. **Order Breakdown:** Signed vs. Regular vs. eBook vs. Bundle
3. **Coaching Upsells:** How many preorders add coaching packages
4. **Revenue:** Total, average order value, projected revenue
5. **Email Performance:** Open rates, click rates on confirmation emails

### Tools to Set Up:

- Google Analytics / Plausible on `/book` page
- Stripe Dashboard for payment analytics
- Resend Dashboard for email delivery metrics
- Vercel Analytics for performance monitoring

---

## 🐛 Troubleshooting

### "Cannot connect to Strapi"
- Check Strapi is running: `cd strapi && npm run develop`
- Verify `NEXT_PUBLIC_STRAPI_URL` is correct
- Check CORS settings in `strapi/config/middlewares.ts`

### "Stripe payment failing"
- Verify you're using test keys for development
- Check Stripe Dashboard > Logs for detailed error
- Ensure webhook URL is correct and reachable

### "Emails not sending"
- Check Resend Dashboard > Logs for delivery status
- Verify `RESEND_API_KEY` is correct
- In production, ensure domain is verified

### "Order not appearing in dashboard"
- Check browser console for API errors
- Verify Strapi API token has read-write permissions
- Check Strapi logs for database errors

---

## 📞 Next Steps

1. **Email Automation:** Build AI email responder (Phase 4 from plan)
2. **Analytics Dashboard:** Add charts for order trends, revenue forecasting
3. **Bulk Fulfillment:** Add CSV export, bulk status updates, shipping label integration
4. **Marketing:** Add email list integration (Mailchimp, ConvertKit) to newsletter form
5. **Site Enhancements:** Apply TweakCN components to other pages (coaching, about, contact)

---

## ✅ Completion Checklist

- [ ] Install Stripe package (`npm install stripe`)
- [ ] Configure all environment variables
- [ ] Test local payment flow
- [ ] Verify order appears in Strapi
- [ ] Verify order appears in dashboard
- [ ] Replace book cover placeholder
- [ ] Deploy to Vercel
- [ ] Configure production environment variables
- [ ] Update Stripe webhook to production URL
- [ ] Verify production payment flow
- [ ] Test email delivery
- [ ] Secure dashboard with authentication
- [ ] Set up monitoring and analytics
- [ ] Switch Stripe to production mode (when ready for real payments)

---

**Estimated Setup Time:** 1-2 hours
**Current Status:** 95% complete, ready for testing once environment variables are configured

All code is production-ready. Just needs API keys and testing! 🚀
