import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || '';

// Lazy-load Stripe to avoid build-time errors
function getStripeClient() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-11-17.clover',
  });
}

export async function POST(request: NextRequest) {
  const stripe = getStripeClient();
  try {
    const body = await request.json();
    const {
      orderType,
      quantity,
      fullName,
      email,
      personalizationMessage,
      shippingAddress,
    } = body;

    // Price mapping (in cents)
    const prices: Record<string, number> = {
      'signed-hardcover': 4995,
      'hardcover': 2995,
      'ebook': 1995,
      'bundle': 5995,
    };

    const unitPrice = prices[orderType];
    if (!unitPrice) {
      return NextResponse.json(
        { error: 'Invalid order type' },
        { status: 400 }
      );
    }

    const totalAmount = unitPrice * quantity;

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `The Secure Base - ${orderType.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`,
              description: personalizationMessage 
                ? `Personalization: "${personalizationMessage}"`
                : undefined,
            },
            unit_amount: unitPrice,
          },
          quantity,
        },
      ],
      mode: 'payment',
      success_url: `${request.nextUrl.origin}/book/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/book#preorder`,
      customer_email: email,
      metadata: {
        orderType,
        quantity: quantity.toString(),
        fullName,
        personalizationMessage: personalizationMessage || '',
      },
      shipping_address_collection: orderType !== 'ebook' ? {
        allowed_countries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'IT', 'ES', 'NL', 'SE', 'NO', 'DK', 'FI'],
      } : undefined,
    });

    // Create pending order in Strapi
    const strapiOrder = {
      data: {
        fullName,
        email,
        orderType,
        quantity,
        personalizationMessage: personalizationMessage || null,
        shippingAddress: orderType !== 'ebook' ? shippingAddress : null,
        totalAmount: totalAmount / 100, // Convert to dollars
        paymentStatus: 'pending',
        fulfillmentStatus: 'pending',
        stripeSessionId: session.id,
      },
    };

    await fetch(`${STRAPI_URL}/api/book-preorders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${STRAPI_TOKEN}`,
      },
      body: JSON.stringify(strapiOrder),
    });

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url,
    });

  } catch (error: any) {
    console.error('Preorder API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
