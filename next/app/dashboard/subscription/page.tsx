/**
 * Subscription Management Page
 * Manage billing, plans, and usage
 */

'use client';

import { useState, useEffect } from 'react';
import {
  FiCheck,
  FiX,
  FiCreditCard,
  FiDownload,
  FiAlertCircle,
  FiTrendingUp,
  FiUsers,
  FiCalendar,
  FiDollarSign,
  FiSettings,
} from 'react-icons/fi';
import { format, addMonths } from 'date-fns';

interface Plan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  limits: {
    posts: number;
    accounts: number;
    teamMembers: number;
    analytics: boolean;
    support: string;
  };
  popular?: boolean;
}

interface Subscription {
  id: string;
  plan: string;
  status: 'active' | 'inactive' | 'cancelled' | 'past_due' | 'trialing';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  usage: {
    posts: number;
    accounts: number;
    teamMembers: number;
  };
}

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  downloadUrl: string;
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'month',
    features: [
      'Up to 3 social accounts',
      '10 scheduled posts per month',
      'Basic analytics',
      'Community support',
    ],
    limits: {
      posts: 10,
      accounts: 3,
      teamMembers: 1,
      analytics: false,
      support: 'community',
    },
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 29,
    interval: 'month',
    features: [
      'Up to 10 social accounts',
      '100 scheduled posts per month',
      'Advanced analytics',
      'Email support',
      'Content calendar',
      'Basic automation',
    ],
    limits: {
      posts: 100,
      accounts: 10,
      teamMembers: 3,
      analytics: true,
      support: 'email',
    },
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 79,
    interval: 'month',
    popular: true,
    features: [
      'Up to 25 social accounts',
      'Unlimited scheduled posts',
      'Advanced analytics & reporting',
      'Priority support',
      'Team collaboration (5 members)',
      'Advanced automation',
      'Comment management',
      'Unified inbox',
    ],
    limits: {
      posts: -1, // unlimited
      accounts: 25,
      teamMembers: 5,
      analytics: true,
      support: 'priority',
    },
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 199,
    interval: 'month',
    features: [
      'Unlimited social accounts',
      'Unlimited scheduled posts',
      'Custom analytics & reporting',
      'Dedicated support manager',
      'Unlimited team members',
      'Custom integrations',
      'API access',
      'SLA guarantee',
      'Training & onboarding',
    ],
    limits: {
      posts: -1,
      accounts: -1,
      teamMembers: -1,
      analytics: true,
      support: 'dedicated',
    },
  },
];

export default function SubscriptionPage() {
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [showChangePlan, setShowChangePlan] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('');

  useEffect(() => {
    fetchSubscriptionData();
    fetchInvoices();
  }, []);

  const fetchSubscriptionData = async () => {
    // Mock data for demonstration
    // In production, this would call the Strapi API
    const mockSubscription: Subscription = {
      id: 'sub_123',
      plan: 'professional',
      status: 'active',
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: addMonths(new Date(), 1).toISOString(),
      cancelAtPeriodEnd: false,
      usage: {
        posts: 45,
        accounts: 8,
        teamMembers: 3,
      },
    };

    setCurrentSubscription(mockSubscription);
  };

  const fetchInvoices = async () => {
    // Mock data for demonstration
    const mockInvoices: Invoice[] = [
      {
        id: 'inv_1',
        date: new Date(Date.now() - 86400000 * 30).toISOString(),
        amount: 79,
        status: 'paid',
        downloadUrl: '#',
      },
      {
        id: 'inv_2',
        date: new Date(Date.now() - 86400000 * 60).toISOString(),
        amount: 79,
        status: 'paid',
        downloadUrl: '#',
      },
      {
        id: 'inv_3',
        date: new Date(Date.now() - 86400000 * 90).toISOString(),
        amount: 79,
        status: 'paid',
        downloadUrl: '#',
      },
    ];

    setInvoices(mockInvoices);
  };

  const handleUpgradePlan = (planId: string) => {
    if (!currentSubscription) {
      // No current subscription, start new one
      console.log('Starting new subscription:', planId);
      alert('Redirecting to payment page...');
      return;
    }

    if (planId === currentSubscription.plan) {
      alert('You are already on this plan');
      return;
    }

    if (confirm('Are you sure you want to change your plan?')) {
      // In production, call Stripe API to change subscription
      console.log('Changing plan to:', planId);
      alert('Plan changed successfully! Changes will take effect on next billing cycle.');
      setShowChangePlan(false);
    }
  };

  const handleCancelSubscription = () => {
    if (!currentSubscription) return;

    if (
      confirm(
        'Are you sure you want to cancel your subscription? You will still have access until the end of your billing period.'
      )
    ) {
      // In production, call Stripe API to cancel subscription
      setCurrentSubscription({
        ...currentSubscription,
        cancelAtPeriodEnd: true,
      });
      alert('Subscription cancelled. You will have access until ' + 
            format(new Date(currentSubscription.currentPeriodEnd), 'MMM d, yyyy'));
    }
  };

  const handleReactivateSubscription = () => {
    if (!currentSubscription) return;

    setCurrentSubscription({
      ...currentSubscription,
      cancelAtPeriodEnd: false,
    });
    // In production, call Stripe API to reactivate
    alert('Subscription reactivated successfully!');
  };

  const getCurrentPlan = () => {
    if (!currentSubscription) return plans[0];
    return plans.find((p) => p.id === currentSubscription.plan) || plans[0];
  };

  const currentPlan = getCurrentPlan();

  const getUsagePercentage = (used: number, limit: number) => {
    if (limit === -1) return 0; // unlimited
    return Math.min((used / limit) * 100, 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Subscription & Billing</h1>
        <p className="text-gray-600 mt-1">Manage your subscription, billing, and usage</p>
      </div>

      {/* Current Subscription */}
      {currentSubscription && (
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-2xl font-bold">{currentPlan.name} Plan</h2>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    currentSubscription.status === 'active'
                      ? 'bg-green-500'
                      : currentSubscription.status === 'trialing'
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                >
                  {currentSubscription.status.toUpperCase()}
                </span>
              </div>
              <p className="text-blue-100 text-lg mb-4">
                ${currentPlan.price} / {currentPlan.interval}
              </p>
              <div className="flex items-center gap-6 text-sm text-blue-100">
                <div className="flex items-center gap-2">
                  <FiCalendar className="w-4 h-4" />
                  <span>
                    Current period:{' '}
                    {format(new Date(currentSubscription.currentPeriodStart), 'MMM d')} -{' '}
                    {format(new Date(currentSubscription.currentPeriodEnd), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>
              {currentSubscription.cancelAtPeriodEnd && (
                <div className="mt-4 bg-red-500 bg-opacity-20 border border-red-300 rounded-lg p-3 flex items-center gap-2">
                  <FiAlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm">
                    Your subscription will be cancelled on{' '}
                    {format(new Date(currentSubscription.currentPeriodEnd), 'MMM d, yyyy')}
                  </p>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              {currentSubscription.cancelAtPeriodEnd ? (
                <button
                  onClick={handleReactivateSubscription}
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                >
                  Reactivate
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setShowChangePlan(!showChangePlan)}
                    className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                  >
                    Change Plan
                  </button>
                  <button
                    onClick={handleCancelSubscription}
                    className="bg-red-500 bg-opacity-20 text-white px-4 py-2 rounded-lg font-medium hover:bg-opacity-30 transition-colors border border-red-300"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Usage Statistics */}
      {currentSubscription && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <FiCalendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Posts This Month</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {currentSubscription.usage.posts}
                    {currentPlan.limits.posts !== -1 && (
                      <span className="text-sm text-gray-500">
                        {' '}
                        / {currentPlan.limits.posts}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
            {currentPlan.limits.posts !== -1 && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${getUsagePercentage(
                      currentSubscription.usage.posts,
                      currentPlan.limits.posts
                    )}%`,
                  }}
                />
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <FiTrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Connected Accounts</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {currentSubscription.usage.accounts}
                    {currentPlan.limits.accounts !== -1 && (
                      <span className="text-sm text-gray-500">
                        {' '}
                        / {currentPlan.limits.accounts}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
            {currentPlan.limits.accounts !== -1 && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${getUsagePercentage(
                      currentSubscription.usage.accounts,
                      currentPlan.limits.accounts
                    )}%`,
                  }}
                />
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <FiUsers className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Team Members</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {currentSubscription.usage.teamMembers}
                    {currentPlan.limits.teamMembers !== -1 && (
                      <span className="text-sm text-gray-500">
                        {' '}
                        / {currentPlan.limits.teamMembers}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
            {currentPlan.limits.teamMembers !== -1 && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${getUsagePercentage(
                      currentSubscription.usage.teamMembers,
                      currentPlan.limits.teamMembers
                    )}%`,
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Available Plans */}
      {showChangePlan && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Choose Your Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-lg border-2 p-6 transition-all ${
                  plan.popular
                    ? 'border-blue-600 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300'
                } ${
                  currentSubscription?.plan === plan.id
                    ? 'bg-blue-50 border-blue-600'
                    : 'bg-white'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
                    Most Popular
                  </span>
                )}
                {currentSubscription?.plan === plan.id && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
                    Current Plan
                  </span>
                )}

                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-500">/{plan.interval}</span>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <FiCheck className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleUpgradePlan(plan.id)}
                  disabled={currentSubscription?.plan === plan.id}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    currentSubscription?.plan === plan.id
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : plan.popular
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  {currentSubscription?.plan === plan.id
                    ? 'Current Plan'
                    : 'Select Plan'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Billing History */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Billing History</h2>
          <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
            <FiSettings className="w-4 h-4" />
            Payment Methods
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Date
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Amount
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                  Invoice
                </th>
              </tr>
            </thead>
            <tbody>
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-500">
                    No billing history yet
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4 text-sm text-gray-900">
                      {format(new Date(invoice.date), 'MMM d, yyyy')}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-900">
                      ${invoice.amount.toFixed(2)}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          invoice.status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : invoice.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {invoice.status === 'paid' && <FiCheck className="w-3 h-3 mr-1" />}
                        {invoice.status === 'failed' && <FiX className="w-3 h-3 mr-1" />}
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 ml-auto">
                        <FiDownload className="w-4 h-4" />
                        Download
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <FiCreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
              <p className="text-sm text-gray-500">Expires 12/25</p>
            </div>
          </div>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
