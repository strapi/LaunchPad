# Social Media Management System Documentation

## Overview

This is a comprehensive, production-ready social media content management platform built with **Strapi v5** (backend) and **Next.js 15** (frontend). It enables businesses to manage, schedule, and publish content across multiple social media platforms through a unified dashboard.

## 🌟 Features

### Multi-Platform Support
- **Facebook**: Post to pages, schedule content, fetch analytics
- **Instagram**: Business account integration, media posting
- **Twitter/X**: Tweet management with OAuth 2.0
- **LinkedIn**: Profile and company page posting

### Content Management
- ✅ Multi-platform post composer
- ✅ Post scheduling with cron automation
- ✅ Draft, scheduled, and published states
- ✅ Media upload support (images, videos)
- ✅ Hashtag and mention management
- ✅ Real-time analytics tracking

### Account Management
- ✅ OAuth authentication flows
- ✅ Token refresh automation
- ✅ Connection status monitoring
- ✅ Multiple account support per platform

### Subscription & Billing
- ✅ Stripe payment integration
- ✅ Multiple tier support (Free, Starter, Professional, Enterprise)
- ✅ Usage tracking and limits
- ✅ Webhook processing for events

## 🏗️ Architecture

### Backend (Strapi v5)

#### Content Types

1. **Social Post** (`api::social-post.social-post`)
   - Title, content, media
   - Platform selection
   - Scheduling capabilities
   - Analytics data
   - Status management

2. **Social Account** (`api::social-account.social-account`)
   - Platform credentials
   - Access/refresh tokens
   - Account information
   - Connection status

3. **Social Message** (`api::social-message.social-message`)
   - Unified inbox messages
   - Platform identification
   - Read/unread status
   - Assignment capabilities

4. **Social Comment** (`api::social-comment.social-comment`)
   - Comment monitoring
   - Sentiment analysis
   - Reply management
   - Moderation tools

5. **Subscription** (`api::subscription.subscription`)
   - Plan management
   - Stripe integration
   - Usage tracking
   - Billing information

6. **User Profile** (`api::user-profile.user-profile`)
   - Extended user data
   - Preferences
   - Connected accounts
   - Settings

#### API Endpoints

**Social Posts:**
- `GET /api/social-posts` - List all posts
- `POST /api/social-posts` - Create new post
- `GET /api/social-posts/:id` - Get single post
- `PUT /api/social-posts/:id` - Update post
- `DELETE /api/social-posts/:id` - Delete post
- `POST /api/social-posts/:id/publish` - Publish immediately
- `POST /api/social-posts/:id/schedule` - Schedule for later
- `GET /api/social-posts/:id/analytics` - Fetch analytics

**Social Accounts:**
- `GET /api/social-accounts` - List connected accounts
- `GET /api/social-accounts/:id` - Get account details
- `DELETE /api/social-accounts/:id` - Disconnect account
- `POST /api/social-accounts/:id/refresh-token` - Refresh token
- `GET /api/social-accounts/:id/test-connection` - Test connection

**OAuth Authentication:**
- `GET /api/auth/facebook` - Initiate Facebook OAuth
- `GET /api/auth/facebook/callback` - Handle callback
- `GET /api/auth/instagram` - Initiate Instagram OAuth
- `GET /api/auth/instagram/callback` - Handle callback
- `GET /api/auth/twitter` - Initiate Twitter OAuth
- `GET /api/auth/twitter/callback` - Handle callback
- `GET /api/auth/linkedin` - Initiate LinkedIn OAuth
- `GET /api/auth/linkedin/callback` - Handle callback

**Webhooks:**
- `POST /api/webhooks/stripe` - Stripe webhook handler

#### Services

**Social Post Service** (`strapi/src/api/social-post/services/social-post.ts`)
- Multi-platform publishing logic
- Analytics aggregation
- Platform-specific API calls

**Social Account Service** (`strapi/src/api/social-account/services/social-account.ts`)
- Token management
- Connection testing
- Account storage

**Stripe Service** (`strapi/src/extensions/stripe/stripe-service.ts`)
- Customer management
- Subscription creation/cancellation
- Usage limit checking
- Plan management

#### Cron Jobs

**Scheduled Posts** (`strapi/src/cron/scheduled-posts.ts`)
- Runs every 5 minutes
- Publishes scheduled posts
- Updates post status
- Error handling

### Frontend (Next.js 15)

#### Pages

1. **Dashboard** (`/dashboard`)
   - Analytics overview
   - KPI widgets
   - Platform performance
   - Recent activity

2. **Upload Posts** (`/dashboard/posts`)
   - Multi-platform composer
   - Media upload
   - Scheduling interface
   - Platform selection

3. **Connect Socials** (`/dashboard/connect`)
   - OAuth integration
   - Account management
   - Connection status
   - Token refresh

4. **Calendar** (`/dashboard/calendar`)
   - Scheduled post view
   - Drag-and-drop (TODO)

5. **Messages** (`/dashboard/messages`)
   - Unified inbox (TODO)

6. **Comments** (`/dashboard/comments`)
   - Comment monitoring (TODO)

7. **Subscription** (`/dashboard/subscription`)
   - Plan management (TODO)

8. **Settings** (`/dashboard/settings`)
   - User preferences (TODO)

#### Components

**Layout** (`next/app/dashboard/layout.tsx`)
- Sidebar navigation
- User profile
- Responsive design

**API Client** (`next/lib/strapi-social.ts`)
- Type-safe API calls
- Authentication handling
- Error management

## 🔧 Configuration

### Environment Variables

**Strapi (`strapi/.env`):**
```env
# Application
HOST=0.0.0.0
PORT=1337
APP_KEYS=your_app_keys
API_TOKEN_SALT=your_salt
ADMIN_JWT_SECRET=your_secret
JWT_SECRET=your_secret

# Database
DATABASE_CLIENT=better-sqlite3
DATABASE_FILENAME=.tmp/data.db

# Social Media APIs
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
INSTAGRAM_CLIENT_ID=your_instagram_client_id
INSTAGRAM_CLIENT_SECRET=your_instagram_client_secret
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

**Next.js (`next/.env.local`):**
```env
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
```

## 🚀 Getting Started

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kritsanan1/LaunchPad.git
   cd LaunchPad
   ```

2. **Install dependencies:**
   ```bash
   # Root
   yarn install
   
   # Strapi
   cd strapi && yarn install
   
   # Next.js
   cd next && yarn install
   ```

3. **Configure environment variables:**
   ```bash
   cp strapi/.env.example strapi/.env
   cp next/.env.example next/.env.local
   ```

4. **Start Strapi:**
   ```bash
   cd strapi
   yarn develop
   ```

5. **Start Next.js:**
   ```bash
   cd next
   yarn dev
   ```

6. **Access the application:**
   - Strapi Admin: http://localhost:1337/admin
   - Next.js Frontend: http://localhost:3000
   - Dashboard: http://localhost:3000/dashboard

## 📊 Database Schema

### Social Post
- `documentId` (string, primary key)
- `title` (string, required)
- `content` (text, required)
- `media` (relation, multiple)
- `scheduledTime` (datetime)
- `platforms` (json array)
- `status` (enum: draft, scheduled, published, failed)
- `platformPostIds` (json object)
- `analytics` (json object)
- `hashtags` (json array)
- `mentions` (json array)
- `user` (relation to users-permissions.user)

### Social Account
- `documentId` (string, primary key)
- `platform` (enum: facebook, instagram, twitter, x, linkedin)
- `accountId` (string, required)
- `accountName` (string, required)
- `accessToken` (text, private)
- `refreshToken` (text, private)
- `tokenExpiresAt` (datetime)
- `accountInfo` (json)
- `status` (enum: active, inactive, expired, error)
- `user` (relation to users-permissions.user)

### Subscription
- `documentId` (string, primary key)
- `plan` (enum: free, starter, professional, enterprise)
- `status` (enum: active, inactive, cancelled, past_due, trialing)
- `stripeCustomerId` (string, private)
- `stripeSubscriptionId` (string, private)
- `planLimits` (json)
- `usage` (json)
- `currentPeriodStart` (datetime)
- `currentPeriodEnd` (datetime)
- `user` (relation to users-permissions.user, one-to-one)

## 🔐 Security

### Authentication
- JWT tokens for API authentication
- OAuth 2.0 for social platform connections
- Secure token storage (private fields)
- Token refresh automation

### Data Protection
- Private fields for sensitive data
- Environment variable configuration
- CORS configuration
- Rate limiting (recommended)

### Best Practices
- Input validation
- Error handling
- Logging
- Secure webhook verification

## 📝 API Usage Examples

### Create and Publish a Post

```typescript
import { createSocialPost, publishSocialPost } from '@/lib/strapi-social';

// Create post
const { data: post } = await createSocialPost(token, {
  title: 'My First Post',
  content: 'Hello from the Social Media Management System!',
  platforms: ['facebook', 'instagram'],
  hashtags: ['social', 'content'],
  status: 'draft'
});

// Publish immediately
await publishSocialPost(token, post.documentId);
```

### Schedule a Post

```typescript
import { createSocialPost, scheduleSocialPost } from '@/lib/strapi-social';

// Create post
const { data: post } = await createSocialPost(token, {
  title: 'Scheduled Post',
  content: 'This will be published later',
  platforms: ['twitter', 'linkedin']
});

// Schedule for tomorrow at 10 AM
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(10, 0, 0, 0);

await scheduleSocialPost(token, post.documentId, tomorrow.toISOString());
```

### Connect Social Account

```typescript
// Get OAuth URL
const authUrl = getOAuthUrl('facebook');

// Redirect user
window.location.href = authUrl;

// Handle callback (backend)
// The OAuth controller will automatically store the account
```

## 🧪 Testing

### Manual Testing

1. **Create Admin User:**
   - Access http://localhost:1337/admin
   - Create first admin user
   - Login to admin panel

2. **Test API Endpoints:**
   - Use Postman or curl
   - Include JWT token in Authorization header
   - Test CRUD operations

3. **Test Frontend:**
   - Access http://localhost:3000/dashboard
   - Create test posts
   - Connect test accounts (mock)
   - View analytics

### Automated Testing (TODO)

```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e
```

## 🚢 Deployment

### Strapi Deployment

1. **Database Setup:**
   - Use PostgreSQL for production
   - Configure connection in `.env`

2. **Environment Variables:**
   - Set all required variables
   - Use secrets for sensitive data

3. **Build:**
   ```bash
   cd strapi
   yarn build
   yarn start
   ```

### Next.js Deployment

1. **Build:**
   ```bash
   cd next
   yarn build
   ```

2. **Deploy to Vercel:**
   ```bash
   vercel deploy --prod
   ```

## 📈 Monitoring

### Logs
- Strapi logs: `strapi/logs/`
- Application logs via `strapi.log.*`
- Webhook events

### Metrics
- Post publication success rate
- API response times
- Token refresh failures
- Subscription conversions

## 🔄 Future Enhancements

### Planned Features
- [ ] Calendar view with drag-and-drop
- [ ] Messages unified inbox
- [ ] Comment monitoring with sentiment analysis
- [ ] Subscription management UI
- [ ] Profile settings
- [ ] Real-time notifications
- [ ] Bulk post operations
- [ ] Analytics reports export
- [ ] Team collaboration features
- [ ] Content library
- [ ] Post templates
- [ ] AI-powered content suggestions

### Integration Opportunities
- [ ] Additional platforms (TikTok, Pinterest, YouTube)
- [ ] Email marketing integration
- [ ] CRM integration
- [ ] Analytics platforms (Google Analytics, Mixpanel)
- [ ] Image editing tools
- [ ] Video processing
- [ ] Content discovery tools

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Support

For support and questions:
- GitHub Issues: https://github.com/kritsanan1/LaunchPad/issues
- Documentation: This file
- Strapi Docs: https://docs.strapi.io

## 🙏 Acknowledgments

- Strapi v5 for the powerful CMS framework
- Next.js 15 for the frontend framework
- All contributors and testers

---

**Built with ❤️ using Strapi v5 and Next.js**
