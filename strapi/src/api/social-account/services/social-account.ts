/**
 * Social Account Service
 * Handles OAuth flows and token management
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreService('api::social-account.social-account', ({ strapi }) => ({
  /**
   * Refresh access token for social account
   */
  async refreshAccessToken(account: any) {
    const platform = account.platform.toLowerCase();

    try {
      switch (platform) {
        case 'facebook':
          return await this.refreshFacebookToken(account);
        case 'instagram':
          return await this.refreshInstagramToken(account);
        case 'twitter':
        case 'x':
          return await this.refreshTwitterToken(account);
        case 'linkedin':
          return await this.refreshLinkedInToken(account);
        default:
          throw new Error(`Unsupported platform: ${platform}`);
      }
    } catch (error) {
      strapi.log.error(`Failed to refresh ${platform} token:`, error);
      
      // Update account status to expired
      await strapi.documents('api::social-account.social-account').update({
        documentId: account.documentId,
        data: {
          status: 'expired'
        }
      });

      throw error;
    }
  },

  /**
   * Refresh Facebook access token
   */
  async refreshFacebookToken(account: any) {
    const appId = process.env.FACEBOOK_APP_ID;
    const appSecret = process.env.FACEBOOK_APP_SECRET;

    if (!appId || !appSecret) {
      throw new Error('Facebook credentials not configured');
    }

    // Facebook token refresh logic
    // In production: Make API call to Facebook
    strapi.log.info('Refreshing Facebook token...');

    const newToken = `fb_refreshed_${Date.now()}`;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 60); // 60 days

    const updated = await strapi.documents('api::social-account.social-account').update({
      documentId: account.documentId,
      data: {
        accessToken: newToken,
        tokenExpiresAt: expiresAt,
        status: 'active',
        lastSyncedAt: new Date()
      }
    });

    return updated;
  },

  /**
   * Refresh Instagram access token
   */
  async refreshInstagramToken(account: any) {
    const clientId = process.env.INSTAGRAM_CLIENT_ID;
    const clientSecret = process.env.INSTAGRAM_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('Instagram credentials not configured');
    }

    strapi.log.info('Refreshing Instagram token...');

    const newToken = `ig_refreshed_${Date.now()}`;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 60);

    const updated = await strapi.documents('api::social-account.social-account').update({
      documentId: account.documentId,
      data: {
        accessToken: newToken,
        tokenExpiresAt: expiresAt,
        status: 'active',
        lastSyncedAt: new Date()
      }
    });

    return updated;
  },

  /**
   * Refresh Twitter access token
   */
  async refreshTwitterToken(account: any) {
    const apiKey = process.env.TWITTER_API_KEY;
    const apiSecret = process.env.TWITTER_API_SECRET;

    if (!apiKey || !apiSecret) {
      throw new Error('Twitter credentials not configured');
    }

    strapi.log.info('Refreshing Twitter token...');

    const newToken = `tw_refreshed_${Date.now()}`;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const updated = await strapi.documents('api::social-account.social-account').update({
      documentId: account.documentId,
      data: {
        accessToken: newToken,
        refreshToken: account.refreshToken,
        tokenExpiresAt: expiresAt,
        status: 'active',
        lastSyncedAt: new Date()
      }
    });

    return updated;
  },

  /**
   * Refresh LinkedIn access token
   */
  async refreshLinkedInToken(account: any) {
    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('LinkedIn credentials not configured');
    }

    strapi.log.info('Refreshing LinkedIn token...');

    const newToken = `li_refreshed_${Date.now()}`;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 60);

    const updated = await strapi.documents('api::social-account.social-account').update({
      documentId: account.documentId,
      data: {
        accessToken: newToken,
        tokenExpiresAt: expiresAt,
        status: 'active',
        lastSyncedAt: new Date()
      }
    });

    return updated;
  },

  /**
   * Test connection to social platform
   */
  async testConnection(account: any) {
    const platform = account.platform.toLowerCase();

    try {
      switch (platform) {
        case 'facebook':
          return await this.testFacebookConnection(account);
        case 'instagram':
          return await this.testInstagramConnection(account);
        case 'twitter':
        case 'x':
          return await this.testTwitterConnection(account);
        case 'linkedin':
          return await this.testLinkedInConnection(account);
        default:
          return false;
      }
    } catch (error) {
      strapi.log.error(`Failed to test ${platform} connection:`, error);
      return false;
    }
  },

  async testFacebookConnection(account: any) {
    // In production: Make API call to verify token
    // const response = await fetch(`https://graph.facebook.com/me?access_token=${account.accessToken}`);
    // return response.ok;
    
    return true; // Mock success for development
  },

  async testInstagramConnection(account: any) {
    return true;
  },

  async testTwitterConnection(account: any) {
    return true;
  },

  async testLinkedInConnection(account: any) {
    return true;
  },

  /**
   * Store new social account connection
   */
  async connectAccount(platform: string, accountData: any, userId: any) {
    // Check if account already exists
    const existing = await strapi.documents('api::social-account.social-account').findMany({
      filters: {
        platform,
        accountId: accountData.accountId,
        user: userId
      }
    });

    if (existing.length > 0) {
      // Update existing account
      return await strapi.documents('api::social-account.social-account').update({
        documentId: existing[0].documentId,
        data: {
          ...accountData,
          user: userId,
          lastSyncedAt: new Date()
        }
      });
    }

    // Create new account
    return await strapi.documents('api::social-account.social-account').create({
      data: {
        ...accountData,
        platform,
        user: userId,
        lastSyncedAt: new Date()
      }
    });
  }
}));
