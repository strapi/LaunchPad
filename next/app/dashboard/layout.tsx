'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { IconDashboard, IconMessage, IconUsers, IconFiles, IconSettings, IconLogout, IconHome, IconBook } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', icon: IconDashboard, label: 'Overview' },
  { href: '/dashboard/book-orders', icon: IconBook, label: 'Book Orders' },
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
    <div className="flex h-screen bg-background text-foreground overflow-hidden transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col shadow-sm z-10">
        {/* Logo */}
        <div className="p-6">
          <Link href="/" className="group flex items-center gap-2">
            <h1 className="text-xl font-display font-bold tracking-tight text-primary group-hover:text-primary/80 transition-colors">
              SecureBase
            </h1>
          </Link>
          <p className="text-xs text-muted-foreground mt-1">Dashboard</p>
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
                  "flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border space-y-1">
          <Link
            href="/dashboard/settings"
            className={cn(
              "flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-all",
              pathname === '/dashboard/settings'
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <IconSettings size={20} />
            <span>Settings</span>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all"
          >
            <IconHome size={20} />
            <span>Back to Site</span>
          </Link>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-2.5 w-full text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
          >
            <IconLogout size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative bg-background-secondary">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />

        <div className="relative max-w-7xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
