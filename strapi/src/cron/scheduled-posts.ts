/**
 * Scheduled Posts Cron Job
 * Publishes scheduled social media posts at their designated time
 */

export default {
  /**
   * Run every 5 minutes to check for scheduled posts
   */
  '*/5 * * * *': async ({ strapi }) => {
    strapi.log.info('Running scheduled posts check...');

    try {
      const now = new Date();
      
      // Find posts scheduled for publishing
      const scheduledPosts = await strapi.documents('api::social-post.social-post').findMany({
        filters: {
          status: 'scheduled',
          scheduledTime: {
            $lte: now.toISOString()
          }
        },
        populate: ['media', 'user']
      });

      strapi.log.info(`Found ${scheduledPosts.length} posts to publish`);

      for (const post of scheduledPosts) {
        try {
          strapi.log.info(`Publishing scheduled post: ${post.documentId}`);
          
          // Publish to social platforms
          const result = await strapi
            .service('api::social-post.social-post')
            .publishToSocials(post);

          // Update post status
          await strapi.documents('api::social-post.social-post').update({
            documentId: post.documentId,
            data: {
              status: result.success ? 'published' : 'failed',
              platformPostIds: result.platformPostIds || {},
              errorMessage: result.error || null
            }
          });

          strapi.log.info(`Successfully published post: ${post.documentId}`);
        } catch (error) {
          strapi.log.error(`Failed to publish post ${post.documentId}:`, error);
          
          // Mark as failed
          await strapi.documents('api::social-post.social-post').update({
            documentId: post.documentId,
            data: {
              status: 'failed',
              errorMessage: error.message
            }
          });
        }
      }
    } catch (error) {
      strapi.log.error('Scheduled posts cron error:', error);
    }
  }
};
