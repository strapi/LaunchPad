import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Resend } from 'resend';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || '';

// Lazy-load clients to avoid build-time errors
function getStripeClient() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-11-17.clover',
  });
}

function getResendClient() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not configured');
  }
  return new Resend(process.env.RESEND_API_KEY);
}

export async function POST(request: NextRequest) {
  const stripe = getStripeClient();
  const resend = getResendClient();
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    // Update order in Strapi
    const ordersResponse = await fetch(
      `${STRAPI_URL}/api/book-preorders?filters[stripeSessionId][$eq]=${session.id}`,
      {
        headers: {
          'Authorization': `Bearer ${STRAPI_TOKEN}`,
        },
      }
    );

    const ordersData = await ordersResponse.json();
    const order = ordersData.data?.[0];

    if (order) {
      // Update to paid status
      await fetch(`${STRAPI_URL}/api/book-preorders/${order.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${STRAPI_TOKEN}`,
        },
        body: JSON.stringify({
          data: {
            paymentStatus: 'paid',
            stripePaymentId: session.payment_intent as string,
            fulfillmentStatus: 'processing',
          },
        }),
      });

      // Send confirmation email
      const orderType = session.metadata?.orderType || 'hardcover';
      const quantity = session.metadata?.quantity || '1';
      const personalization = session.metadata?.personalizationMessage || '';

      await resend.emails.send({
        from: 'Dr. Peter Sung <books@securebase.com>',
        to: session.customer_email!,
        subject: 'Your Pre-Order Confirmation - The Secure Base',
        html: `
          <h1>Thank you for your pre-order!</h1>
          <p>Dear ${session.metadata?.fullName || 'Reader'},</p>
          <p>We're thrilled to confirm your pre-order of <strong>The Secure Base: Leading from Awareness, Agency, and Action</strong>.</p>
          
          <h2>Order Details</h2>
          <ul>
            <li><strong>Order Type:</strong> ${orderType.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</li>
            <li><strong>Quantity:</strong> ${quantity}</li>
            ${personalization ? `<li><strong>Personalization:</strong> "${personalization}"</li>` : ''}
            <li><strong>Total:</strong> $${((session.amount_total || 0) / 100).toFixed(2)}</li>
          </ul>

          <h2>What's Next?</h2>
          <p>Your book is scheduled to ship in <strong>Spring 2025</strong>. We'll send you updates as we approach the launch date.</p>
          <p>In the meantime, you'll receive an email with access to your exclusive digital extras:</p>
          <ul>
            <li>Downloadable chapter worksheets</li>
            <li>60-minute recorded webinar with Dr. Sung</li>
            <li>Leadership assessment tool</li>
          </ul>

          <p>Thank you for joining this journey,</p>
          <p><strong>Dr. Peter Sung</strong></p>
        `,
      });
    }
  }

  return NextResponse.json({ received: true });
}
