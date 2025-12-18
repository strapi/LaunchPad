/**
 * Stripe Service
 * Handles payment processing and subscription management
 */

// Note: In production, install stripe package: npm install stripe
// import Stripe from 'stripe';

export default {
  /**
   * Initialize Stripe client
   */
  getStripeClient() {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    
    if (!secretKey) {
      throw new Error('Stripe secret key not configured');
    }

    // In production: return new Stripe(secretKey, { apiVersion: '2023-10-16' });
    return {
      // Mock Stripe client for development
      customers: {
        create: async (data: any) => ({ id: `cus_${Date.now()}`, ...data }),
        retrieve: async (id: string) => ({ id, email: 'user@example.com' }),
        update: async (id: string, data: any) => ({ id, ...data }),
      },
      subscriptions: {
        create: async (data: any) => ({
          id: `sub_${Date.now()}`,
          status: 'active',
          current_period_start: Math.floor(Date.now() / 1000),
          current_period_end: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
          ...data
        }),
        retrieve: async (id: string) => ({ id, status: 'active' }),
        update: async (id: string, data: any) => ({ id, ...data }),
        cancel: async (id: string) => ({ id, status: 'canceled' }),
      },
      prices: {
        list: async () => ({
          data: [
            { id: 'price_starter_monthly', unit_amount: 2900, currency: 'usd', recurring: { interval: 'month' } },
            { id: 'price_professional_monthly', unit_amount: 9900, currency: 'usd', recurring: { interval: 'month' } },
            { id: 'price_enterprise_monthly', unit_amount: 29900, currency: 'usd', recurring: { interval: 'month' } }
          ]
        }),
      },
      paymentMethods: {
        attach: async (id: string, data: any) => ({ id, ...data }),
        list: async (data: any) => ({ data: [] }),
      }
    };
  },

  /**
   * Create Stripe customer
   */
  async createCustomer(user: any, paymentMethodId?: string) {
    try {
      const stripe = this.getStripeClient();
      
      const customerData: any = {
        email: user.email,
        metadata: {
          userId: user.id,
          username: user.username
        }
      };

      if (paymentMethodId) {
        customerData.payment_method = paymentMethodId;
        customerData.invoice_settings = {
          default_payment_method: paymentMethodId
        };
      }

      const customer = await stripe.customers.create(customerData);
      
      return customer;
    } catch (error) {
      strapi.log.error('Failed to create Stripe customer:', error);
      throw error;
    }
  },

  /**
   * Create subscription
   */
  async createSubscription(userId: any, priceId: string, paymentMethodId?: string) {
    try {
      // Get or create subscription record
      let subscription = await strapi.documents('api::subscription.subscription').findMany({
        filters: { user: userId }
      });

      let stripeCustomerId: string;

      if (subscription.length > 0) {
        stripeCustomerId = subscription[0].stripeCustomerId;
      } else {
        // Create Stripe customer
        const user = await strapi.documents('plugin::users-permissions.user').findOne({
          documentId: userId
        });
        
        const customer = await this.createCustomer(user, paymentMethodId);
        stripeCustomerId = customer.id;
      }

      // Create Stripe subscription
      const stripe = this.getStripeClient();
      const stripeSubscription = await stripe.subscriptions.create({
        customer: stripeCustomerId,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent']
      });

      // Determine plan based on price ID
      const plan = this.getPlanFromPriceId(priceId);
      const planLimits = this.getPlanLimits(plan);

      // Update or create subscription record
      if (subscription.length > 0) {
        subscription = await strapi.documents('api::subscription.subscription').update({
          documentId: subscription[0].documentId,
          data: {
            plan,
            status: stripeSubscription.status,
            stripeCustomerId,
            stripeSubscriptionId: stripeSubscription.id,
            stripePriceId: priceId,
            currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
            currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
            planLimits
          }
        });
      } else {
        subscription = await strapi.documents('api::subscription.subscription').create({
          data: {
            user: userId,
            plan,
            status: stripeSubscription.status,
            stripeCustomerId,
            stripeSubscriptionId: stripeSubscription.id,
            stripePriceId: priceId,
            currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
            currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
            planLimits,
            usage: {
              posts: 0,
              accounts: 0,
              scheduledPosts: 0,
              teamMembers: 0
            }
          }
        });
      }

      return {
        subscription,
        stripeSubscription
      };
    } catch (error) {
      strapi.log.error('Failed to create subscription:', error);
      throw error;
    }
  },

  /**
   * Cancel subscription
   */
  async cancelSubscription(subscriptionId: string, immediate: boolean = false) {
    try {
      const subscription = await strapi.documents('api::subscription.subscription').findOne({
        documentId: subscriptionId
      });

      if (!subscription) {
        throw new Error('Subscription not found');
      }

      const stripe = this.getStripeClient();
      
      if (immediate) {
        await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
        
        await strapi.documents('api::subscription.subscription').update({
          documentId: subscriptionId,
          data: {
            status: 'cancelled',
            cancelAtPeriodEnd: false
          }
        });
      } else {
        await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
          cancel_at_period_end: true
        });
        
        await strapi.documents('api::subscription.subscription').update({
          documentId: subscriptionId,
          data: {
            cancelAtPeriodEnd: true
          }
        });
      }

      return subscription;
    } catch (error) {
      strapi.log.error('Failed to cancel subscription:', error);
      throw error;
    }
  },

  /**
   * Get plan from price ID
   */
  getPlanFromPriceId(priceId: string): string {
    if (priceId.includes('starter')) return 'starter';
    if (priceId.includes('professional')) return 'professional';
    if (priceId.includes('enterprise')) return 'enterprise';
    return 'free';
  },

  /**
   * Get plan limits
   */
  getPlanLimits(plan: string) {
    const limits = {
      free: {
        posts: 10,
        accounts: 3,
        scheduledPosts: 5,
        teamMembers: 1
      },
      starter: {
        posts: 100,
        accounts: 10,
        scheduledPosts: 50,
        teamMembers: 3
      },
      professional: {
        posts: 500,
        accounts: 25,
        scheduledPosts: 250,
        teamMembers: 10
      },
      enterprise: {
        posts: -1, // unlimited
        accounts: -1,
        scheduledPosts: -1,
        teamMembers: -1
      }
    };

    return limits[plan] || limits.free;
  },

  /**
   * Check if user has reached plan limit
   */
  async checkLimit(userId: any, limitType: string): Promise<boolean> {
    const subscription = await strapi.documents('api::subscription.subscription').findMany({
      filters: { user: userId }
    });

    if (!subscription || subscription.length === 0) {
      return false; // No subscription, use free tier
    }

    const sub = subscription[0];
    const limit = sub.planLimits[limitType];
    const usage = sub.usage[limitType];

    // -1 means unlimited
    if (limit === -1) return true;

    return usage < limit;
  },

  /**
   * Increment usage counter
   */
  async incrementUsage(userId: any, limitType: string) {
    const subscription = await strapi.documents('api::subscription.subscription').findMany({
      filters: { user: userId }
    });

    if (!subscription || subscription.length === 0) {
      return;
    }

    const sub = subscription[0];
    const newUsage = { ...sub.usage };
    newUsage[limitType] = (newUsage[limitType] || 0) + 1;

    await strapi.documents('api::subscription.subscription').update({
      documentId: sub.documentId,
      data: { usage: newUsage }
    });
  }
};
