/**
 * Dashboard Home Page
 * Main analytics dashboard with overview widgets
 */

'use client';

import { useEffect, useState } from 'react';
import { FiTrendingUp, FiUsers, FiMessageSquare, FiCalendar } from 'react-icons/fi';

interface AnalyticsData {
  totalPosts: number;
  totalEngagement: number;
  totalReach: number;
  scheduledPosts: number;
  recentActivity: any[];
}

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalPosts: 0,
    totalEngagement: 0,
    totalReach: 0,
    scheduledPosts: 0,
    recentActivity: [],
  });

  useEffect(() => {
    // Fetch analytics data
    // In production, this would call the Strapi API
    setAnalytics({
      totalPosts: 42,
      totalEngagement: 1250,
      totalReach: 15000,
      scheduledPosts: 8,
      recentActivity: [
        { id: 1, text: 'Posted to Facebook', time: '2 hours ago' },
        { id: 2, text: 'New comment on Instagram', time: '3 hours ago' },
        { id: 3, text: 'Scheduled post published', time: '5 hours ago' },
      ],
    });
  }, []);

  const stats = [
    {
      name: 'Total Posts',
      value: analytics.totalPosts,
      icon: FiTrendingUp,
      change: '+12%',
      changeType: 'increase',
    },
    {
      name: 'Total Engagement',
      value: analytics.totalEngagement,
      icon: FiUsers,
      change: '+8%',
      changeType: 'increase',
    },
    {
      name: 'Total Reach',
      value: analytics.totalReach.toLocaleString(),
      icon: FiMessageSquare,
      change: '+15%',
      changeType: 'increase',
    },
    {
      name: 'Scheduled Posts',
      value: analytics.scheduledPosts,
      icon: FiCalendar,
      change: '3 upcoming',
      changeType: 'neutral',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's your social media overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <span
                className={`text-sm font-medium ${
                  stat.changeType === 'increase'
                    ? 'text-green-600'
                    : stat.changeType === 'decrease'
                    ? 'text-red-600'
                    : 'text-gray-600'
                }`}
              >
                {stat.change}
              </span>
              <span className="text-sm text-gray-500 ml-2">from last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engagement Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Engagement Overview</h2>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-400">Chart Component Here</p>
          </div>
        </div>

        {/* Platform Performance */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Platform Performance</h2>
          <div className="space-y-4">
            {['Facebook', 'Instagram', 'Twitter', 'LinkedIn'].map((platform, index) => (
              <div key={platform} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">{platform[0]}</span>
                  </div>
                  <span className="font-medium text-gray-900">{platform}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${75 - index * 15}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-600">{75 - index * 15}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {analytics.recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0">
              <div className="w-2 h-2 bg-blue-600 rounded-full" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.text}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
