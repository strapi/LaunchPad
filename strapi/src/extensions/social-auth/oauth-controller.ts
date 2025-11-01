/**
 * OAuth Controller for Social Media Authentication
 * Handles OAuth flows for Facebook, Instagram, Twitter, and LinkedIn
 */

export default {
  /**
   * Initiate Facebook OAuth flow
   */
  async facebookAuth(ctx) {
    const redirectUri = `${process.env.FRONTEND_URL}/auth/facebook/callback`;
    const appId = process.env.FACEBOOK_APP_ID;
    
    if (!appId) {
      return ctx.badRequest('Facebook credentials not configured');
    }

    const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?` +
      `client_id=${appId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=pages_manage_posts,pages_read_engagement,pages_show_list&` +
      `state=${ctx.state.user?.id || 'anonymous'}`;

    return ctx.send({ authUrl });
  },

  /**
   * Handle Facebook OAuth callback
   */
  async facebookCallback(ctx) {
    const { code, state } = ctx.query;
    const userId = state;

    if (!code) {
      return ctx.badRequest('Authorization code is required');
    }

    try {
      const appId = process.env.FACEBOOK_APP_ID;
      const appSecret = process.env.FACEBOOK_APP_SECRET;
      const redirectUri = `${process.env.FRONTEND_URL}/auth/facebook/callback`;

      // Exchange code for access token
      // In production, make actual API call:
      // const tokenResponse = await fetch(
      //   `https://graph.facebook.com/v18.0/oauth/access_token?` +
      //   `client_id=${appId}&` +
      //   `client_secret=${appSecret}&` +
      //   `code=${code}&` +
      //   `redirect_uri=${encodeURIComponent(redirectUri)}`
      // );

      // Mock token for development
      const accessToken = `fb_token_${Date.now()}`;
      
      // Get user's Facebook pages
      // const pagesResponse = await fetch(
      //   `https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`
      // );

      // Mock account data
      const accountData = {
        accountId: `fb_${Date.now()}`,
        accountName: 'My Facebook Page',
        accountUsername: 'myfbpage',
        accessToken: accessToken,
        tokenExpiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
        accountInfo: {
          category: 'Business',
          followers: 1000
        },
        profileImage: 'https://via.placeholder.com/150',
        status: 'active',
        permissions: ['pages_manage_posts', 'pages_read_engagement']
      };

      // Store account
      const account = await strapi
        .service('api::social-account.social-account')
        .connectAccount('facebook', accountData, userId);

      return ctx.send({
        success: true,
        account: {
          ...account,
          accessToken: undefined,
          refreshToken: undefined
        }
      });
    } catch (error) {
      strapi.log.error('Facebook OAuth error:', error);
      return ctx.badRequest('Failed to connect Facebook account');
    }
  },

  /**
   * Initiate Instagram OAuth flow
   */
  async instagramAuth(ctx) {
    const redirectUri = `${process.env.FRONTEND_URL}/auth/instagram/callback`;
    const clientId = process.env.INSTAGRAM_CLIENT_ID;
    
    if (!clientId) {
      return ctx.badRequest('Instagram credentials not configured');
    }

    const authUrl = `https://api.instagram.com/oauth/authorize?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=user_profile,user_media&` +
      `response_type=code&` +
      `state=${ctx.state.user?.id || 'anonymous'}`;

    return ctx.send({ authUrl });
  },

  /**
   * Handle Instagram OAuth callback
   */
  async instagramCallback(ctx) {
    const { code, state } = ctx.query;
    const userId = state;

    if (!code) {
      return ctx.badRequest('Authorization code is required');
    }

    try {
      const accessToken = `ig_token_${Date.now()}`;
      
      const accountData = {
        accountId: `ig_${Date.now()}`,
        accountName: 'My Instagram Account',
        accountUsername: 'myinstagram',
        accessToken: accessToken,
        tokenExpiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        accountInfo: {
          followers: 5000,
          mediaCount: 120
        },
        profileImage: 'https://via.placeholder.com/150',
        status: 'active',
        permissions: ['user_profile', 'user_media']
      };

      const account = await strapi
        .service('api::social-account.social-account')
        .connectAccount('instagram', accountData, userId);

      return ctx.send({
        success: true,
        account: {
          ...account,
          accessToken: undefined,
          refreshToken: undefined
        }
      });
    } catch (error) {
      strapi.log.error('Instagram OAuth error:', error);
      return ctx.badRequest('Failed to connect Instagram account');
    }
  },

  /**
   * Initiate Twitter OAuth flow
   */
  async twitterAuth(ctx) {
    const redirectUri = `${process.env.FRONTEND_URL}/auth/twitter/callback`;
    const clientId = process.env.TWITTER_CLIENT_ID || process.env.TWITTER_API_KEY;
    
    if (!clientId) {
      return ctx.badRequest('Twitter credentials not configured');
    }

    // Twitter OAuth 2.0 implementation
    const authUrl = `https://twitter.com/i/oauth2/authorize?` +
      `response_type=code&` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=tweet.read tweet.write users.read offline.access&` +
      `state=${ctx.state.user?.id || 'anonymous'}&` +
      `code_challenge=challenge&` +
      `code_challenge_method=plain`;

    return ctx.send({ authUrl });
  },

  /**
   * Handle Twitter OAuth callback
   */
  async twitterCallback(ctx) {
    const { code, state } = ctx.query;
    const userId = state;

    if (!code) {
      return ctx.badRequest('Authorization code is required');
    }

    try {
      const accessToken = `tw_token_${Date.now()}`;
      const refreshToken = `tw_refresh_${Date.now()}`;
      
      const accountData = {
        accountId: `tw_${Date.now()}`,
        accountName: 'My Twitter Account',
        accountUsername: '@mytwitter',
        accessToken: accessToken,
        refreshToken: refreshToken,
        tokenExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        accountInfo: {
          followers: 2000,
          tweets: 500
        },
        profileImage: 'https://via.placeholder.com/150',
        status: 'active',
        permissions: ['tweet.read', 'tweet.write', 'users.read']
      };

      const account = await strapi
        .service('api::social-account.social-account')
        .connectAccount('twitter', accountData, userId);

      return ctx.send({
        success: true,
        account: {
          ...account,
          accessToken: undefined,
          refreshToken: undefined
        }
      });
    } catch (error) {
      strapi.log.error('Twitter OAuth error:', error);
      return ctx.badRequest('Failed to connect Twitter account');
    }
  },

  /**
   * Initiate LinkedIn OAuth flow
   */
  async linkedinAuth(ctx) {
    const redirectUri = `${process.env.FRONTEND_URL}/auth/linkedin/callback`;
    const clientId = process.env.LINKEDIN_CLIENT_ID;
    
    if (!clientId) {
      return ctx.badRequest('LinkedIn credentials not configured');
    }

    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?` +
      `response_type=code&` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=w_member_social r_liteprofile&` +
      `state=${ctx.state.user?.id || 'anonymous'}`;

    return ctx.send({ authUrl });
  },

  /**
   * Handle LinkedIn OAuth callback
   */
  async linkedinCallback(ctx) {
    const { code, state } = ctx.query;
    const userId = state;

    if (!code) {
      return ctx.badRequest('Authorization code is required');
    }

    try {
      const accessToken = `li_token_${Date.now()}`;
      
      const accountData = {
        accountId: `li_${Date.now()}`,
        accountName: 'My LinkedIn Profile',
        accountUsername: 'mylinkedin',
        accessToken: accessToken,
        tokenExpiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        accountInfo: {
          connections: 500,
          posts: 50
        },
        profileImage: 'https://via.placeholder.com/150',
        status: 'active',
        permissions: ['w_member_social', 'r_liteprofile']
      };

      const account = await strapi
        .service('api::social-account.social-account')
        .connectAccount('linkedin', accountData, userId);

      return ctx.send({
        success: true,
        account: {
          ...account,
          accessToken: undefined,
          refreshToken: undefined
        }
      });
    } catch (error) {
      strapi.log.error('LinkedIn OAuth error:', error);
      return ctx.badRequest('Failed to connect LinkedIn account');
    }
  }
};
