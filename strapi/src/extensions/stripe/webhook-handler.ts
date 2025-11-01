/**
 * Stripe Webhook Handler
 * Processes Stripe webhook events for subscription updates
 */

export default {
  /**
   * Handle Stripe webhook events
   */
  async handleWebhook(ctx) {
    const sig = ctx.request.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      return ctx.badRequest('Webhook secret not configured');
    }

    try {
      // In production with actual Stripe:
      // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      // const event = stripe.webhooks.constructEvent(ctx.request.body, sig, webhookSecret);

      // Mock event for development
      const event = ctx.request.body;

      strapi.log.info(`Received Stripe webhook: ${event.type}`);

      // Handle different event types
      switch (event.type) {
        case 'customer.subscription.created':
          await this.handleSubscriptionCreated(event.data.object);
          break;
        
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated(event.data.object);
          break;
        
        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(event.data.object);
          break;
        
        case 'invoice.paid':
          await this.handleInvoicePaid(event.data.object);
          break;
        
        case 'invoice.payment_failed':
          await this.handleInvoicePaymentFailed(event.data.object);
          break;
        
        case 'customer.subscription.trial_will_end':
          await this.handleTrialWillEnd(event.data.object);
          break;

        default:
          strapi.log.info(`Unhandled event type: ${event.type}`);
      }

      return ctx.send({ received: true });
    } catch (error) {
      strapi.log.error('Webhook error:', error);
      return ctx.badRequest(`Webhook Error: ${error.message}`);
    }
  },

  /**
   * Handle subscription created
   */
  async handleSubscriptionCreated(subscription: any) {
    strapi.log.info(`Subscription created: ${subscription.id}`);
    
    // Find subscription by Stripe ID
    const subs = await strapi.documents('api::subscription.subscription').findMany({
      filters: {
        stripeSubscriptionId: subscription.id
      }
    });

    if (subs.length > 0) {
      await strapi.documents('api::subscription.subscription').update({
        documentId: subs[0].documentId,
        data: {
          status: subscription.status,
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000)
        }
      });
    }
  },

  /**
   * Handle subscription updated
   */
  async handleSubscriptionUpdated(subscription: any) {
    strapi.log.info(`Subscription updated: ${subscription.id}`);
    
    const subs = await strapi.documents('api::subscription.subscription').findMany({
      filters: {
        stripeSubscriptionId: subscription.id
      }
    });

    if (subs.length > 0) {
      await strapi.documents('api::subscription.subscription').update({
        documentId: subs[0].documentId,
        data: {
          status: subscription.status,
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          cancelAtPeriodEnd: subscription.cancel_at_period_end
        }
      });
    }
  },

  /**
   * Handle subscription deleted (cancelled)
   */
  async handleSubscriptionDeleted(subscription: any) {
    strapi.log.info(`Subscription deleted: ${subscription.id}`);
    
    const subs = await strapi.documents('api::subscription.subscription').findMany({
      filters: {
        stripeSubscriptionId: subscription.id
      }
    });

    if (subs.length > 0) {
      // Downgrade to free plan
      const freeLimits = {
        posts: 10,
        accounts: 3,
        scheduledPosts: 5,
        teamMembers: 1
      };

      await strapi.documents('api::subscription.subscription').update({
        documentId: subs[0].documentId,
        data: {
          plan: 'free',
          status: 'cancelled',
          planLimits: freeLimits
        }
      });
    }
  },

  /**
   * Handle invoice paid
   */
  async handleInvoicePaid(invoice: any) {
    strapi.log.info(`Invoice paid: ${invoice.id}`);
    
    if (invoice.subscription) {
      const subs = await strapi.documents('api::subscription.subscription').findMany({
        filters: {
          stripeSubscriptionId: invoice.subscription
        }
      });

      if (subs.length > 0) {
        await strapi.documents('api::subscription.subscription').update({
          documentId: subs[0].documentId,
          data: {
            status: 'active',
            lastPaymentDate: new Date(invoice.created * 1000),
            amount: invoice.amount_paid / 100,
            currency: invoice.currency
          }
        });
      }
    }
  },

  /**
   * Handle invoice payment failed
   */
  async handleInvoicePaymentFailed(invoice: any) {
    strapi.log.error(`Invoice payment failed: ${invoice.id}`);
    
    if (invoice.subscription) {
      const subs = await strapi.documents('api::subscription.subscription').findMany({
        filters: {
          stripeSubscriptionId: invoice.subscription
        }
      });

      if (subs.length > 0) {
        await strapi.documents('api::subscription.subscription').update({
          documentId: subs[0].documentId,
          data: {
            status: 'past_due'
          }
        });

        // TODO: Send notification to user
      }
    }
  },

  /**
   * Handle trial ending soon
   */
  async handleTrialWillEnd(subscription: any) {
    strapi.log.info(`Trial ending soon: ${subscription.id}`);
    
    const subs = await strapi.documents('api::subscription.subscription').findMany({
      filters: {
        stripeSubscriptionId: subscription.id
      }
    });

    if (subs.length > 0) {
      // TODO: Send notification to user about trial ending
      strapi.log.info(`Notify user about trial ending for subscription ${subs[0].documentId}`);
    }
  }
};
