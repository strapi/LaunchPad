'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { 
  IconLayoutDashboard, 
  IconBook, 
  IconUsers, 
  IconMail, 
  IconChartBar,
  IconSettings,
  IconLogout,
} from '@tabler/icons-react';

const menuItems = [
  {
    title: 'Overview',
    icon: IconLayoutDashboard,
    href: '/dashboard/overview',
  },
  {
    title: 'Book Orders',
    icon: IconBook,
    href: '/dashboard/orders',
  },
  {
    title: 'Coaching Inquiries',
    icon: IconUsers,
    href: '/dashboard/coaching',
  },
  {
    title: 'Email Messages',
    icon: IconMail,
    href: '/dashboard/messages',
  },
  {
    title: 'Analytics',
    icon: IconChartBar,
    href: '/dashboard/analytics',
  },
  {
    title: 'Settings',
    icon: IconSettings,
    href: '/dashboard/settings',
  },
];

export function DashboardSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader className="border-b border-neutral-200 dark:border-neutral-800 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">PS</span>
              </div>
              <div>
                <h2 className="font-bold text-neutral-900 dark:text-white">SecureBase</h2>
                <p className="text-xs text-neutral-500 dark:text-gray-400">Admin Dashboard</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton asChild isActive={isActive}>
                          <Link href={item.href} className="flex items-center gap-3">
                            <Icon className="w-5 h-5" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-neutral-200 dark:border-neutral-800 p-4">
            <button className="flex items-center gap-2 text-sm text-neutral-600 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white transition-colors w-full">
              <IconLogout className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="bg-white dark:bg-charcoal border-b border-neutral-200 dark:border-neutral-800 p-4 flex items-center gap-4">
            <SidebarTrigger />
            <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
              Dashboard
            </h1>
          </header>
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
