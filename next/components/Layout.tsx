import React from 'react';
import { Navbar } from './navbar';
import { Footer } from './footer';

// A simple wrapper layout for public pages if needed separately from the app router layout
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-charcoal">
      {/* Navbar would be passed props in a real app, this is a placeholder wrapper */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
