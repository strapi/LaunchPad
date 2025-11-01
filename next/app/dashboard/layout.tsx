/**
 * Dashboard Layout
 * Main layout for social media management dashboard with sidebar navigation
 */

import Link from 'next/link';
import { ReactNode } from 'react';
import {
  FiHome,
  FiCalendar,
  FiMessageSquare,
  FiMessageCircle,
  FiUpload,
  FiLink,
  FiCreditCard,
  FiSettings,
} from 'react-icons/fi';

interface DashboardLayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: FiHome },
  { name: 'Calendar', href: '/dashboard/calendar', icon: FiCalendar },
  { name: 'Messages', href: '/dashboard/messages', icon: FiMessageSquare },
  { name: 'Comments', href: '/dashboard/comments', icon: FiMessageCircle },
  { name: 'Upload Posts', href: '/dashboard/posts', icon: FiUpload },
  { name: 'Connect Socials', href: '/dashboard/connect', icon: FiLink },
  { name: 'Subscription', href: '/dashboard/subscription', icon: FiCreditCard },
  { name: 'Settings', href: '/dashboard/settings', icon: FiSettings },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-gray-200">
          <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
            Social Hub
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-medium">U</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">User Name</p>
              <p className="text-xs text-gray-500">Free Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
