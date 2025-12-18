/**
 * Connect Socials Page
 * OAuth integration and account management
 */

'use client';

import { useState, useEffect } from 'react';
import { FiFacebook, FiInstagram, FiTwitter, FiLinkedin, FiCheck, FiX, FiRefreshCw } from 'react-icons/fi';

interface ConnectedAccount {
  id: string;
  platform: string;
  accountName: string;
  accountUsername?: string;
  profileImage?: string;
  status: string;
  lastSyncedAt?: string;
}

const platformsConfig = [
  {
    id: 'facebook',
    name: 'Facebook',
    icon: FiFacebook,
    color: 'bg-blue-600',
    description: 'Connect your Facebook Page to post and manage content',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: FiInstagram,
    color: 'bg-pink-600',
    description: 'Connect your Instagram Business account',
  },
  {
    id: 'twitter',
    name: 'Twitter',
    icon: FiTwitter,
    color: 'bg-sky-500',
    description: 'Connect your Twitter account to share tweets',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: FiLinkedin,
    color: 'bg-blue-700',
    description: 'Connect your LinkedIn profile or company page',
  },
];

export default function ConnectSocialsPage() {
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch connected accounts from Strapi
    // Mock data for now
    setConnectedAccounts([
      {
        id: '1',
        platform: 'facebook',
        accountName: 'My Facebook Page',
        accountUsername: '@myfbpage',
        profileImage: 'https://via.placeholder.com/50',
        status: 'active',
        lastSyncedAt: '2 hours ago',
      },
      {
        id: '2',
        platform: 'instagram',
        accountName: 'My Instagram',
        accountUsername: '@myinstagram',
        profileImage: 'https://via.placeholder.com/50',
        status: 'active',
        lastSyncedAt: '1 hour ago',
      },
    ]);
  }, []);

  const handleConnect = async (platform: string) => {
    setLoading(true);
    
    try {
      // In production, redirect to OAuth URL from Strapi
      // const authUrl = getOAuthUrl(platform);
      // window.location.href = authUrl;
      
      // Mock connection
      setTimeout(() => {
        alert(`Connecting to ${platform}...`);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to connect:', error);
      setLoading(false);
    }
  };

  const handleDisconnect = async (accountId: string, platform: string) => {
    if (!confirm(`Are you sure you want to disconnect ${platform}?`)) {
      return;
    }

    try {
      // In production, call Strapi API to delete account
      setConnectedAccounts((prev) => prev.filter((acc) => acc.id !== accountId));
      alert(`${platform} disconnected successfully`);
    } catch (error) {
      console.error('Failed to disconnect:', error);
    }
  };

  const handleRefresh = async (accountId: string) => {
    try {
      // In production, call Strapi API to refresh token
      alert('Token refreshed successfully');
    } catch (error) {
      console.error('Failed to refresh:', error);
    }
  };

  const isConnected = (platformId: string) => {
    return connectedAccounts.some((acc) => acc.platform === platformId);
  };

  const getConnectedAccount = (platformId: string) => {
    return connectedAccounts.find((acc) => acc.platform === platformId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Connect Social Accounts</h1>
        <p className="text-gray-600 mt-1">
          Connect your social media accounts to start managing content from one place.
        </p>
      </div>

      {/* Connected Accounts Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <FiCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {connectedAccounts.length} Account{connectedAccounts.length !== 1 ? 's' : ''} Connected
            </p>
            <p className="text-sm text-gray-600">
              Connect more accounts to expand your reach
            </p>
          </div>
        </div>
      </div>

      {/* Platforms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {platformsConfig.map((platform) => {
          const connected = isConnected(platform.id);
          const account = getConnectedAccount(platform.id);

          return (
            <div
              key={platform.id}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
            >
              {/* Platform Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${platform.color} rounded-lg flex items-center justify-center`}>
                    <platform.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{platform.name}</h3>
                    {connected && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full mt-1">
                        <FiCheck className="w-3 h-3" />
                        Connected
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-4">{platform.description}</p>

              {/* Connected Account Info */}
              {connected && account && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    {account.profileImage && (
                      <img
                        src={account.profileImage}
                        alt={account.accountName}
                        className="w-10 h-10 rounded-full"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{account.accountName}</p>
                      {account.accountUsername && (
                        <p className="text-sm text-gray-500">{account.accountUsername}</p>
                      )}
                    </div>
                  </div>
                  {account.lastSyncedAt && (
                    <p className="text-xs text-gray-500">
                      Last synced: {account.lastSyncedAt}
                    </p>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                {connected && account ? (
                  <>
                    <button
                      onClick={() => handleRefresh(account.id)}
                      className="flex-1 bg-white text-gray-700 px-4 py-2 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <FiRefreshCw className="w-4 h-4" />
                      Refresh
                    </button>
                    <button
                      onClick={() => handleDisconnect(account.id, platform.name)}
                      className="flex-1 bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium border border-red-200 hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <FiX className="w-4 h-4" />
                      Disconnect
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleConnect(platform.id)}
                    disabled={loading}
                    className={`w-full ${platform.color} text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50`}
                  >
                    <platform.icon className="w-4 h-4" />
                    Connect {platform.name}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Help Section */}
      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
        <p className="text-sm text-gray-600 mb-4">
          Having trouble connecting your accounts? Check out our setup guides or contact support.
        </p>
        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
          View Setup Guides →
        </button>
      </div>
    </div>
  );
}
