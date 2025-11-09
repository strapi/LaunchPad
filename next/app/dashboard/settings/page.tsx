/**
 * Settings Page
 * User profile and application preferences
 */

'use client';

import { useState } from 'react';
import {
  FiUser,
  FiBell,
  FiLock,
  FiGlobe,
  FiMail,
  FiSave,
  FiCamera,
  FiCheck,
  FiX,
} from 'react-icons/fi';

interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  company: string;
  role: string;
  bio: string;
  timezone: string;
  language: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  postPublished: boolean;
  postScheduled: boolean;
  newComment: boolean;
  newMessage: boolean;
  weeklyReport: boolean;
  monthlyReport: boolean;
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  loginAlerts: boolean;
  sessionTimeout: number;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'preferences'>('profile');
  const [profile, setProfile] = useState<UserProfile>({
    name: 'John Doe',
    email: 'john.doe@example.com',
    company: 'Acme Inc.',
    role: 'Marketing Manager',
    bio: 'Passionate about social media marketing and content creation.',
    timezone: 'America/New_York',
    language: 'en',
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    postPublished: true,
    postScheduled: true,
    newComment: true,
    newMessage: true,
    weeklyReport: false,
    monthlyReport: true,
  });

  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: 30,
  });

  const [saved, setSaved] = useState(false);

  const handleSaveProfile = () => {
    // In production, save to Strapi API
    console.log('Saving profile:', profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleSaveNotifications = () => {
    // In production, save to Strapi API
    console.log('Saving notifications:', notifications);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleSaveSecurity = () => {
    // In production, save to Strapi API
    console.log('Saving security settings:', security);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: FiUser },
    { id: 'notifications', name: 'Notifications', icon: FiBell },
    { id: 'security', name: 'Security', icon: FiLock },
    { id: 'preferences', name: 'Preferences', icon: FiGlobe },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
      </div>

      {/* Save Success Message */}
      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <FiCheck className="w-5 h-5 text-green-600" />
          <p className="text-green-800 font-medium">Settings saved successfully!</p>
        </div>
      )}

      {/* Tabs and Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 h-fit">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="p-6 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Profile Information</h2>
                <p className="text-sm text-gray-600">
                  Update your account profile information and email address
                </p>
              </div>

              {/* Avatar */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-3xl font-medium text-gray-600">
                      {profile.name[0]}
                    </span>
                  </div>
                  <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                    <FiCamera className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{profile.name}</h3>
                  <p className="text-sm text-gray-500">{profile.email}</p>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-2">
                    Change Photo
                  </button>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    value={profile.company}
                    onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    value={profile.role}
                    onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                  onClick={handleSaveProfile}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <FiSave className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="p-6 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Notification Settings</h2>
                <p className="text-sm text-gray-600">
                  Manage how you receive notifications and updates
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FiMail className="w-5 h-5 text-gray-600" />
                    <div>
                      <h3 className="font-medium text-gray-900">Email Notifications</h3>
                      <p className="text-sm text-gray-600">
                        Receive notifications via email
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.emailNotifications}
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          emailNotifications: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
                  {[
                    { key: 'postPublished', label: 'Post Published', desc: 'When a scheduled post is published' },
                    { key: 'postScheduled', label: 'Post Scheduled', desc: 'When a new post is scheduled' },
                    { key: 'newComment', label: 'New Comments', desc: 'When someone comments on your posts' },
                    { key: 'newMessage', label: 'New Messages', desc: 'When you receive new messages' },
                    { key: 'weeklyReport', label: 'Weekly Report', desc: 'Receive weekly performance summary' },
                    { key: 'monthlyReport', label: 'Monthly Report', desc: 'Receive monthly analytics report' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4">
                      <div>
                        <h3 className="font-medium text-gray-900">{item.label}</h3>
                        <p className="text-sm text-gray-600">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications[item.key as keyof NotificationSettings] as boolean}
                          onChange={(e) =>
                            setNotifications({
                              ...notifications,
                              [item.key]: e.target.checked,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                  onClick={handleSaveNotifications}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <FiSave className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="p-6 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Security Settings</h2>
                <p className="text-sm text-gray-600">
                  Manage your account security and authentication
                </p>
              </div>

              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
                  <div className="flex items-center justify-between p-4">
                    <div>
                      <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-600">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={security.twoFactorAuth}
                        onChange={(e) =>
                          setSecurity({ ...security, twoFactorAuth: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4">
                    <div>
                      <h3 className="font-medium text-gray-900">Login Alerts</h3>
                      <p className="text-sm text-gray-600">
                        Get notified when there's a login from a new device
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={security.loginAlerts}
                        onChange={(e) =>
                          setSecurity({ ...security, loginAlerts: e.target.checked })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Session Timeout</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Automatically log out after period of inactivity
                  </p>
                  <select
                    value={security.sessionTimeout}
                    onChange={(e) =>
                      setSecurity({ ...security, sessionTimeout: Number(e.target.value) })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 hour</option>
                    <option value={120}>2 hours</option>
                    <option value={0}>Never</option>
                  </select>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Change Password</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Update your password regularly to keep your account secure
                  </p>
                  <button className="bg-gray-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                    Change Password
                  </button>
                </div>

                <div className="border border-red-200 bg-red-50 rounded-lg p-4">
                  <h3 className="font-medium text-red-900 mb-2">Danger Zone</h3>
                  <p className="text-sm text-red-700 mb-4">
                    Once you delete your account, there is no going back
                  </p>
                  <button className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors">
                    Delete Account
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                  onClick={handleSaveSecurity}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <FiSave className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="p-6 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Preferences</h2>
                <p className="text-sm text-gray-600">
                  Customize your application experience
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={profile.language}
                    onChange={(e) => setProfile({ ...profile, language: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="pt">Portuguese</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timezone
                  </label>
                  <select
                    value={profile.timezone}
                    onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="Europe/London">London (GMT)</option>
                    <option value="Europe/Paris">Paris (CET)</option>
                    <option value="Asia/Tokyo">Tokyo (JST)</option>
                  </select>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Date Format</h3>
                  <div className="space-y-2">
                    {['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'].map((format) => (
                      <label key={format} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="dateFormat"
                          className="w-4 h-4 text-blue-600"
                          defaultChecked={format === 'MM/DD/YYYY'}
                        />
                        <span className="text-sm text-gray-700">{format}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Time Format</h3>
                  <div className="space-y-2">
                    {['12-hour', '24-hour'].map((format) => (
                      <label key={format} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="timeFormat"
                          className="w-4 h-4 text-blue-600"
                          defaultChecked={format === '12-hour'}
                        />
                        <span className="text-sm text-gray-700">{format}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                  onClick={handleSaveProfile}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <FiSave className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
