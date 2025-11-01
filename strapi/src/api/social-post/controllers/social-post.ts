/**
 * Social Post Controller
 * Handles CRUD operations and custom actions for social media posts
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::social-post.social-post', ({ strapi }) => ({
  /**
   * Find all social posts with populated relations
   */
  async find(ctx) {
    const { query } = ctx;
    
    // Populate user and media by default
    const populatedQuery = {
      ...query,
      populate: {
        media: true,
        user: {
          fields: ['id', 'username', 'email']
        }
      }
    };

    const { data, meta } = await strapi.documents('api::social-post.social-post').findMany({
      ...populatedQuery
    });

    return { data, meta };
  },

  /**
   * Find one social post by ID
   */
  async findOne(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.documents('api::social-post.social-post').findOne({
      documentId: id,
      populate: {
        media: true,
        user: {
          fields: ['id', 'username', 'email']
        }
      }
    });

    return { data: entity };
  },

  /**
   * Create a new social post
   */
  async create(ctx) {
    const { data } = ctx.request.body;
    
    // Add current user to the post
    const userId = ctx.state.user?.id;
    if (userId) {
      data.user = userId;
    }

    const entity = await strapi.documents('api::social-post.social-post').create({
      data,
      populate: {
        media: true,
        user: {
          fields: ['id', 'username', 'email']
        }
      }
    });

    return { data: entity };
  },

  /**
   * Update a social post
   */
  async update(ctx) {
    const { id } = ctx.params;
    const { data } = ctx.request.body;

    const entity = await strapi.documents('api::social-post.social-post').update({
      documentId: id,
      data,
      populate: {
        media: true,
        user: {
          fields: ['id', 'username', 'email']
        }
      }
    });

    return { data: entity };
  },

  /**
   * Delete a social post
   */
  async delete(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.documents('api::social-post.social-post').delete({
      documentId: id
    });

    return { data: entity };
  },

  /**
   * Publish a social post to selected platforms
   */
  async publish(ctx) {
    const { id } = ctx.params;

    try {
      const post = await strapi.documents('api::social-post.social-post').findOne({
        documentId: id,
        populate: ['media']
      });

      if (!post) {
        return ctx.notFound('Post not found');
      }

      // Call social media service to publish
      const result = await strapi.service('api::social-post.social-post').publishToSocials(post);

      // Update post status and platform IDs
      const updatedPost = await strapi.documents('api::social-post.social-post').update({
        documentId: id,
        data: {
          status: result.success ? 'published' : 'failed',
          platformPostIds: result.platformPostIds || {},
          errorMessage: result.error || null
        }
      });

      return { data: updatedPost, result };
    } catch (error) {
      ctx.throw(500, `Failed to publish post: ${error.message}`);
    }
  },

  /**
   * Schedule a social post for future publishing
   */
  async schedule(ctx) {
    const { id } = ctx.params;
    const { scheduledTime } = ctx.request.body;

    if (!scheduledTime) {
      return ctx.badRequest('Scheduled time is required');
    }

    const scheduledDate = new Date(scheduledTime);
    if (scheduledDate <= new Date()) {
      return ctx.badRequest('Scheduled time must be in the future');
    }

    const entity = await strapi.documents('api::social-post.social-post').update({
      documentId: id,
      data: {
        scheduledTime,
        status: 'scheduled'
      }
    });

    return { data: entity };
  },

  /**
   * Get analytics for a social post
   */
  async getAnalytics(ctx) {
    const { id } = ctx.params;

    try {
      const post = await strapi.documents('api::social-post.social-post').findOne({
        documentId: id
      });

      if (!post) {
        return ctx.notFound('Post not found');
      }

      // Fetch fresh analytics from social platforms
      const analytics = await strapi.service('api::social-post.social-post').fetchAnalytics(post);

      // Update post with new analytics
      await strapi.documents('api::social-post.social-post').update({
        documentId: id,
        data: { analytics }
      });

      return { data: analytics };
    } catch (error) {
      ctx.throw(500, `Failed to fetch analytics: ${error.message}`);
    }
  }
}));
