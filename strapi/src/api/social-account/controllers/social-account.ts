/**
 * Social Account Controller
 * Manages social media account connections and OAuth flows
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::social-account.social-account', ({ strapi }) => ({
  /**
   * Find all social accounts for current user
   */
  async find(ctx) {
    const userId = ctx.state.user?.id;
    
    if (!userId) {
      return ctx.unauthorized('You must be logged in');
    }

    const accounts = await strapi.documents('api::social-account.social-account').findMany({
      filters: {
        user: userId
      },
      populate: {
        user: {
          fields: ['id', 'username', 'email']
        }
      }
    });

    // Remove sensitive tokens from response
    const sanitizedAccounts = accounts.map(account => ({
      ...account,
      accessToken: undefined,
      refreshToken: undefined
    }));

    return { data: sanitizedAccounts };
  },

  /**
   * Find one social account
   */
  async findOne(ctx) {
    const { id } = ctx.params;
    const userId = ctx.state.user?.id;

    const account = await strapi.documents('api::social-account.social-account').findOne({
      documentId: id,
      populate: {
        user: {
          fields: ['id', 'username', 'email']
        }
      }
    });

    if (!account) {
      return ctx.notFound('Account not found');
    }

    // Verify ownership
    if (account.user?.id !== userId) {
      return ctx.forbidden('You do not have access to this account');
    }

    // Remove sensitive data
    return {
      data: {
        ...account,
        accessToken: undefined,
        refreshToken: undefined
      }
    };
  },

  /**
   * Delete a social account connection
   */
  async delete(ctx) {
    const { id } = ctx.params;
    const userId = ctx.state.user?.id;

    const account = await strapi.documents('api::social-account.social-account').findOne({
      documentId: id
    });

    if (!account) {
      return ctx.notFound('Account not found');
    }

    if (account.user?.id !== userId) {
      return ctx.forbidden('You do not have access to this account');
    }

    const deleted = await strapi.documents('api::social-account.social-account').delete({
      documentId: id
    });

    return { data: deleted };
  },

  /**
   * Refresh access token for an account
   */
  async refreshToken(ctx) {
    const { id } = ctx.params;
    const userId = ctx.state.user?.id;

    try {
      const account = await strapi.documents('api::social-account.social-account').findOne({
        documentId: id
      });

      if (!account) {
        return ctx.notFound('Account not found');
      }

      if (account.user?.id !== userId) {
        return ctx.forbidden('You do not have access to this account');
      }

      // Refresh token based on platform
      const refreshedAccount = await strapi
        .service('api::social-account.social-account')
        .refreshAccessToken(account);

      return {
        data: {
          ...refreshedAccount,
          accessToken: undefined,
          refreshToken: undefined
        }
      };
    } catch (error) {
      ctx.throw(500, `Failed to refresh token: ${error.message}`);
    }
  },

  /**
   * Test connection to social platform
   */
  async testConnection(ctx) {
    const { id } = ctx.params;
    const userId = ctx.state.user?.id;

    try {
      const account = await strapi.documents('api::social-account.social-account').findOne({
        documentId: id
      });

      if (!account) {
        return ctx.notFound('Account not found');
      }

      if (account.user?.id !== userId) {
        return ctx.forbidden('You do not have access to this account');
      }

      const isValid = await strapi
        .service('api::social-account.social-account')
        .testConnection(account);

      return {
        data: {
          connected: isValid,
          platform: account.platform,
          accountName: account.accountName
        }
      };
    } catch (error) {
      return {
        data: {
          connected: false,
          error: error.message
        }
      };
    }
  }
}));
