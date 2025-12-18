/**
 * Strapi Social Media API Client
 * Handles all API calls to the Strapi backend for social media features
 */

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';

export interface SocialPost {
  documentId: string;
  title: string;
  content: string;
  media?: any[];
  scheduledTime?: string;
  platforms: string[];
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  platformPostIds?: Record<string, string>;
  analytics?: {
    likes: number;
    shares: number;
    comments: number;
    views: number;
    engagement: number;
  };
  hashtags?: string[];
  mentions?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SocialAccount {
  documentId: string;
  platform: string;
  accountId: string;
  accountName: string;
  accountUsername?: string;
  profileImage?: string;
  status: string;
  accountInfo?: any;
  lastSyncedAt?: string;
}

export interface Subscription {
  documentId: string;
  plan: string;
  status: string;
  planLimits: {
    posts: number;
    accounts: number;
    scheduledPosts: number;
    teamMembers: number;
  };
  usage: {
    posts: number;
    accounts: number;
    scheduledPosts: number;
    teamMembers: number;
  };
  currentPeriodEnd?: string;
}

/**
 * Get authorization headers with JWT token
 */
function getAuthHeaders(token?: string): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

/**
 * Fetch social posts
 */
export async function fetchSocialPosts(token: string, filters?: any): Promise<{ data: SocialPost[]; meta: any }> {
  const queryParams = filters ? `?${new URLSearchParams(filters).toString()}` : '';
  const response = await fetch(`${STRAPI_URL}/api/social-posts${queryParams}`, {
    headers: getAuthHeaders(token),
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch social posts');
  }
  
  return response.json();
}

/**
 * Create social post
 */
export async function createSocialPost(token: string, postData: Partial<SocialPost>): Promise<{ data: SocialPost }> {
  const response = await fetch(`${STRAPI_URL}/api/social-posts`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ data: postData }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create social post');
  }
  
  return response.json();
}

/**
 * Update social post
 */
export async function updateSocialPost(
  token: string,
  postId: string,
  postData: Partial<SocialPost>
): Promise<{ data: SocialPost }> {
  const response = await fetch(`${STRAPI_URL}/api/social-posts/${postId}`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ data: postData }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update social post');
  }
  
  return response.json();
}

/**
 * Delete social post
 */
export async function deleteSocialPost(token: string, postId: string): Promise<void> {
  const response = await fetch(`${STRAPI_URL}/api/social-posts/${postId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete social post');
  }
}

/**
 * Publish social post
 */
export async function publishSocialPost(token: string, postId: string): Promise<any> {
  const response = await fetch(`${STRAPI_URL}/api/social-posts/${postId}/publish`, {
    method: 'POST',
    headers: getAuthHeaders(token),
  });
  
  if (!response.ok) {
    throw new Error('Failed to publish social post');
  }
  
  return response.json();
}

/**
 * Schedule social post
 */
export async function scheduleSocialPost(
  token: string,
  postId: string,
  scheduledTime: string
): Promise<{ data: SocialPost }> {
  const response = await fetch(`${STRAPI_URL}/api/social-posts/${postId}/schedule`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ scheduledTime }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to schedule social post');
  }
  
  return response.json();
}

/**
 * Get post analytics
 */
export async function getPostAnalytics(token: string, postId: string): Promise<any> {
  const response = await fetch(`${STRAPI_URL}/api/social-posts/${postId}/analytics`, {
    headers: getAuthHeaders(token),
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch analytics');
  }
  
  return response.json();
}

/**
 * Fetch social accounts
 */
export async function fetchSocialAccounts(token: string): Promise<{ data: SocialAccount[] }> {
  const response = await fetch(`${STRAPI_URL}/api/social-accounts`, {
    headers: getAuthHeaders(token),
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch social accounts');
  }
  
  return response.json();
}

/**
 * Delete social account
 */
export async function deleteSocialAccount(token: string, accountId: string): Promise<void> {
  const response = await fetch(`${STRAPI_URL}/api/social-accounts/${accountId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete social account');
  }
}

/**
 * Test social account connection
 */
export async function testAccountConnection(token: string, accountId: string): Promise<any> {
  const response = await fetch(`${STRAPI_URL}/api/social-accounts/${accountId}/test-connection`, {
    headers: getAuthHeaders(token),
  });
  
  if (!response.ok) {
    throw new Error('Failed to test connection');
  }
  
  return response.json();
}

/**
 * Get subscription info
 */
export async function fetchSubscription(token: string): Promise<{ data: Subscription }> {
  const response = await fetch(`${STRAPI_URL}/api/subscriptions`, {
    headers: getAuthHeaders(token),
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch subscription');
  }
  
  return response.json();
}

/**
 * Create subscription
 */
export async function createSubscription(token: string, priceId: string): Promise<any> {
  const response = await fetch(`${STRAPI_URL}/api/subscriptions`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ priceId }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create subscription');
  }
  
  return response.json();
}

/**
 * OAuth authentication URLs
 */
export function getOAuthUrl(platform: string): string {
  return `${STRAPI_URL}/api/auth/${platform}`;
}
