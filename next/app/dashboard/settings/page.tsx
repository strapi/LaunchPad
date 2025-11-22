'use client';

import { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { IconUser, IconBell, IconLock, IconPalette, IconLogout, IconCheck } from '@tabler/icons-react';
import { getSettings, updateSettings, type UserSettings } from '@/lib/local-store';

// Settings sections
const settingsSections = [
  { id: 'profile', name: 'Profile', icon: IconUser },
  { id: 'notifications', name: 'Notifications', icon: IconBell },
  { id: 'security', name: 'Security', icon: IconLock },
  { id: 'appearance', name: 'Appearance', icon: IconPalette },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState<UserSettings | null>(null);

  // Load settings on mount
  useEffect(() => {
    setSettings(getSettings());
  }, []);

  const handleProfileChange = (field: keyof UserSettings['profile'], value: string) => {
    if (!settings) return;
    setSettings({
      ...settings,
      profile: { ...settings.profile, [field]: value }
    });
  };

  const handleNotificationChange = (field: keyof UserSettings['notifications']) => {
    if (!settings) return;
    setSettings({
      ...settings,
      notifications: { ...settings.notifications, [field]: !settings.notifications[field] }
    });
  };

  const handleThemeChange = (theme: 'dark' | 'light' | 'system') => {
    if (!settings) return;
    setSettings({
      ...settings,
      appearance: { theme }
    });
  };

  const handleSave = async () => {
    if (!settings) return;
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    updateSettings(settings);
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  if (!settings) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-2 border-cyan-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const notificationItems = [
    { key: 'emailNotifications' as const, label: 'Email notifications', description: 'Receive email updates about your sessions' },
    { key: 'sessionReminders' as const, label: 'Session reminders', description: 'Get reminded before upcoming sessions' },
    { key: 'clientMessages' as const, label: 'Client messages', description: 'Notifications when clients send messages' },
    { key: 'weeklyDigest' as const, label: 'Weekly digest', description: 'Summary of your coaching activity' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 mt-1">Manage your account preferences and settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar - Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-4 space-y-1">
            {settingsSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                  activeSection === section.id
                    ? 'bg-cyan-500/10 text-cyan-400'
                    : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                <section.icon className="w-5 h-5" />
                {section.name}
              </button>
            ))}

            <div className="pt-4 mt-4 border-t border-white/10">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <IconLogout className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-6 md:p-8">
            {/* Profile Section */}
            {activeSection === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-white mb-1">Profile Information</h2>
                  <p className="text-sm text-gray-400">Update your personal details and profile picture.</p>
                </div>

                {/* Profile picture */}
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {settings.profile.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors">
                      Change Photo
                    </button>
                    <p className="text-xs text-gray-500 mt-2">JPG, PNG or GIF. Max 2MB.</p>
                  </div>
                </div>

                {/* Form fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={settings.profile.fullName}
                      onChange={(e) => handleProfileChange('fullName', e.target.value)}
                      className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      value={settings.profile.email}
                      onChange={(e) => handleProfileChange('email', e.target.value)}
                      className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                    <textarea
                      rows={4}
                      value={settings.profile.bio}
                      onChange={(e) => handleProfileChange('bio', e.target.value)}
                      className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white focus:outline-none focus:border-cyan-500/50 resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Section */}
            {activeSection === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-white mb-1">Notification Preferences</h2>
                  <p className="text-sm text-gray-400">Choose how you want to be notified.</p>
                </div>

                <div className="space-y-4">
                  {notificationItems.map((item) => (
                    <div key={item.key} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                      <div>
                        <p className="font-medium text-white">{item.label}</p>
                        <p className="text-sm text-gray-400">{item.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.notifications[item.key]}
                          onChange={() => handleNotificationChange(item.key)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-cyan-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security Section */}
            {activeSection === 'security' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-white mb-1">Security Settings</h2>
                  <p className="text-sm text-gray-400">Manage your password and security preferences.</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <h3 className="font-medium text-white mb-4">Two-Factor Authentication</h3>
                  <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors">
                    Enable 2FA
                  </button>
                </div>
              </div>
            )}

            {/* Appearance Section */}
            {activeSection === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-white mb-1">Appearance</h2>
                  <p className="text-sm text-gray-400">Customize how the dashboard looks.</p>
                </div>

                <div>
                  <h3 className="font-medium text-white mb-4">Theme</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {(['dark', 'light', 'system'] as const).map((theme) => (
                      <button
                        key={theme}
                        onClick={() => handleThemeChange(theme)}
                        className={`p-4 rounded-xl border text-center transition-colors ${
                          settings.appearance.theme === theme
                            ? 'border-cyan-500 bg-cyan-500/10'
                            : 'border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg mx-auto mb-2 ${
                          theme === 'dark' ? 'bg-gray-800' : theme === 'light' ? 'bg-gray-200' : 'bg-gradient-to-r from-gray-800 to-gray-200'
                        }`} />
                        <span className={settings.appearance.theme === theme ? 'text-cyan-400' : 'text-gray-300'}>
                          {theme.charAt(0).toUpperCase() + theme.slice(1)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Save button */}
            <div className="flex justify-end mt-8 pt-6 border-t border-white/10">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-500/50 text-black font-medium rounded-lg transition-colors"
              >
                {saved ? (
                  <>
                    <IconCheck className="w-5 h-5" />
                    Saved!
                  </>
                ) : isSaving ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
