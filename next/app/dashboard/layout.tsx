import React from 'react';
import Link from 'next/link';
import { IconDashboard, IconMessage, IconUsers, IconFiles, IconSettings, IconLogout } from '@tabler/icons-react';
import { cn } from '@/lib/utils';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-charcoal text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-black/20 border-r border-white/10 flex flex-col">
        <div className="p-6">
          <h1 className="text-xl font-bold tracking-tight text-cyan-500">Peter Sung</h1>
          <p className="text-xs text-gray-400">SecureBase Dashboard</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <NavItem href="/dashboard" icon={<IconDashboard size={20} />} label="Overview" />
          <NavItem href="/dashboard/chat" icon={<IconMessage size={20} />} label="Chat & AI Coach" />
          <NavItem href="/dashboard/clients" icon={<IconUsers size={20} />} label="Clients" />
          <NavItem href="/dashboard/resources" icon={<IconFiles size={20} />} label="Resources" />
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <NavItem href="/dashboard/settings" icon={<IconSettings size={20} />} label="Settings" />
          <button className="flex items-center gap-3 px-4 py-2 w-full text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-md transition-colors">
            <IconLogout size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        <div className="max-w-7xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link 
      href={href} 
      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-md transition-all"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
