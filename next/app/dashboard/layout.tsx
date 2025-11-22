'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { IconDashboard, IconMessage, IconUsers, IconFiles, IconSettings, IconLogout, IconHome } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', icon: IconDashboard, label: 'Overview' },
  { href: '/dashboard/chat', icon: IconMessage, label: 'Chat & AI Coach' },
  { href: '/dashboard/clients', icon: IconUsers, label: 'Clients' },
  { href: '/dashboard/resources', icon: IconFiles, label: 'Resources' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <div className="flex h-screen bg-charcoal text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-black/20 border-r border-white/10 flex flex-col">
        {/* Logo */}
        <div className="p-6">
          <Link href="/" className="group flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-cyan-500 group-hover:text-cyan-400 transition-colors">
              SecureBase
            </h1>
          </Link>
          <p className="text-xs text-gray-400 mt-1">Dashboard</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-all",
                  isActive
                    ? "bg-cyan-500/10 text-cyan-400"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 space-y-1">
          <Link
            href="/dashboard/settings"
            className={cn(
              "flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-all",
              pathname === '/dashboard/settings'
                ? "bg-cyan-500/10 text-cyan-400"
                : "text-gray-300 hover:text-white hover:bg-white/5"
            )}
          >
            <IconSettings size={20} />
            <span>Settings</span>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
          >
            <IconHome size={20} />
            <span>Back to Site</span>
          </Link>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-2.5 w-full text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <IconLogout size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative bg-charcoal">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/5 via-transparent to-transparent pointer-events-none" />

        <div className="relative max-w-7xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
