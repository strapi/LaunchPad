# create_patch.ps1

$patchName = "peter-sung_full_stack_patch"
$patchDir = Join-Path $PWD $patchName

# 1. Clean up previous patch if it exists
if (Test-Path $patchDir) { Remove-Item -Recurse -Force $patchDir }
if (Test-Path "$patchDir.zip") { Remove-Item -Force "$patchDir.zip" }

New-Item -ItemType Directory -Force -Path $patchDir | Out-Null

Write-Host "Creating patch directory at $patchDir..."

# Helper function to write files
function New-PatchFile {
    param(
        [string]$Path,
        [string]$Content
    )
    $fullPath = Join-Path $patchDir $Path
    $directory = Split-Path $fullPath
    if (-not (Test-Path $directory)) {
        New-Item -ItemType Directory -Path $directory -Force | Out-Null
    }
    Set-Content -Path $fullPath -Value $Content -Encoding UTF8
    Write-Host "Created $Path"
}

# -----------------------------------------------------------------------------
# 1. THE PRD
# -----------------------------------------------------------------------------
$PRDContent = @'
# Product Requirements Document (PRD): Peter Sung Platform

## 1. Overview
**Product Name:** Peter Sung - High Performance Coaching & SecureBase
**Vision:** To empower leaders and organizations to thrive through high-performance coaching, speaking, and assessments. The platform serves as a "Secure Base" for leaders to explore, learn, and grow.

## 2. User Personas
- **The Leader/Executive:** Seeking coaching to overcome roadblocks, increase self-awareness, and improve organizational health.
- **The Event Organizer:** Looking for a dynamic speaker (Dr. Peter Sung) for conferences or retreats.
- **The Administrator (Dr. Sung):** Needs to manage clients, content, and resources efficiently.

## 3. Core Features

### 3.1 Public Website (Marketing)
- **Home:** Hero section, value proposition, social proof.
- **About:** Dr. Sung's background, philosophy, and media.
- **Coaching:** Service details, methodology (The 3 A's), pricing/packages.
- **Speaking:** Topics, testimonials, booking request form.
- **Contact:** General inquiry form.

### 3.2 Client Dashboard (Secure Area)
- **Overview:** Quick stats, upcoming sessions, recent activity.
- **Resources:** Library of documents, videos, and assessments provided by the coach.
- **Clients (Admin View):** List of active clients, session notes, progress tracking.
- **Chat (Multimodal):**
    -   **AI Coach Companion:** An AI agent trained on Dr. Sung's content to answer questions 24/7.
    -   **Direct Messaging:** Secure channel between client and coach.
    -   **Inputs:** Text, Audio (voice notes), and Image uploads.

### 3.3 Content Management
- **SecureBase:** A repository of markdown-based content (articles, guides) imported into the system.
- **Ingestion Pipeline:** Scripts to parse and load local content into the CMS/Database.

## 4. Technical Architecture
- **Frontend:** Next.js 14 (App Router), Tailwind CSS, Framer Motion.
- **Backend/CMS:** Strapi (Headless CMS) for structured content.
- **Database:** PostgreSQL (via Strapi).
- **AI/LLM:** Vercel AI SDK for the Chat interface.
- **Authentication:** NextAuth.js (or Strapi Auth).

## 5. Roadmap
- **Phase 1 (Current):** Public site launch with static content and basic contact forms.
- **Phase 2:** Dashboard scaffold, resource library, and basic client management.
- **Phase 3:** AI Coach integration (RAG on SecureBase content) and full audio/multimodal support.
'@
New-PatchFile -Path "docs/PRD.md" -Content $PRDContent

# -----------------------------------------------------------------------------
# 2. DASHBOARD SCAFFOLD
# -----------------------------------------------------------------------------

# app/dashboard/layout.tsx
$DashboardLayout = @'
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
'@
New-PatchFile -Path "next/app/dashboard/layout.tsx" -Content $DashboardLayout

# app/dashboard/page.tsx
$DashboardPage = @'
import React from 'react';
import { IconMicrophone, IconNote, IconClock, IconArrowRight } from '@tabler/icons-react';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white">Welcome back, Dr. Sung</h2>
        <p className="text-gray-400 mt-2">Here is what is happening with your clients today.</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <QuickAction 
          icon={<IconMicrophone className="text-cyan-400" size={24} />} 
          title="Upload Audio" 
          desc="Process a new session recording" 
        />
        <QuickAction 
          icon={<IconNote className="text-purple-400" size={24} />} 
          title="New Note" 
          desc="Draft a quick thought or observation" 
        />
        <QuickAction 
          icon={<IconClock className="text-emerald-400" size={24} />} 
          title="Schedule" 
          desc="View upcoming appointments" 
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
          <button className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
            View All <IconArrowRight size={16} />
          </button>
        </div>
        <div className="space-y-4">
          <ActivityItem 
            user="Mark P." 
            action="completed an assessment" 
            time="2 hours ago" 
          />
          <ActivityItem 
            user="Suzannah C." 
            action="sent a message" 
            time="4 hours ago" 
          />
          <ActivityItem 
            user="System" 
            action="ingested 3 new SecureBase articles" 
            time="Yesterday" 
          />
        </div>
      </div>
    </div>
  );
}

function QuickAction({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <button className="flex flex-col items-start p-6 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl transition-all text-left group">
      <div className="mb-4 p-3 bg-white/5 rounded-lg group-hover:scale-110 transition-transform">{icon}</div>
      <span className="text-lg font-semibold text-white">{title}</span>
      <span className="text-sm text-gray-400 mt-1">{desc}</span>
    </button>
  );
}

function ActivityItem({ user, action, time }: { user: string; action: string; time: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white">
          {user.charAt(0)}
        </div>
        <div>
          <span className="font-medium text-white">{user}</span>
          <span className="text-gray-400 ml-1">{action}</span>
        </div>
      </div>
      <span className="text-xs text-gray-500">{time}</span>
    </div>
  );
}
'@
New-PatchFile -Path "next/app/dashboard/page.tsx" -Content $DashboardPage

# app/dashboard/chat/page.tsx
$ChatPage = @'
"use client";

import React, { useState } from 'react';
import { IconSend, IconMicrophone, IconPhoto, IconPaperclip } from '@tabler/icons-react';

export default function ChatPage() {
  const [input, setInput] = useState('');

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">Multimodal Chat</h2>
        <p className="text-gray-400">AI Coach & SecureBase Assistant</p>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 mb-4 overflow-y-auto flex flex-col gap-4">
        <div className="self-start bg-white/10 text-gray-200 p-3 rounded-2xl rounded-tl-none max-w-[80%]">
          Hello! I am your AI assistant trained on Dr. Sung's SecureBase content. How can I help you with your leadership journey today?
        </div>
        {/* Placeholder for user message */}
        <div className="self-end bg-cyan-600/20 text-cyan-100 border border-cyan-500/30 p-3 rounded-2xl rounded-tr-none max-w-[80%]">
          I'm feeling a bit stuck with my team's communication.
        </div>
      </div>

      {/* Input Area */}
      <div className="relative">
        <div className="absolute left-3 top-3 flex gap-2 text-gray-400">
          <button className="hover:text-cyan-400 transition-colors"><IconMicrophone size={20} /></button>
          <button className="hover:text-cyan-400 transition-colors"><IconPhoto size={20} /></button>
          <button className="hover:text-cyan-400 transition-colors"><IconPaperclip size={20} /></button>
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-28 pr-12 text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
        />
        <button className="absolute right-3 top-3 text-cyan-500 hover:text-cyan-400 transition-colors">
          <IconSend size={20} />
        </button>
      </div>
    </div>
  );
}
'@
New-PatchFile -Path "next/app/dashboard/chat/page.tsx" -Content $ChatPage

# -----------------------------------------------------------------------------
# 3. PUBLIC COMPONENTS
# -----------------------------------------------------------------------------

# next/components/HeroSection.tsx
$HeroSection = @'
import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface HeroProps {
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaLink?: string;
  imageSrc?: string;
  className?: string;
}

export function HeroSection({ title, subtitle, ctaText = "Get Started", ctaLink = "/contact", imageSrc, className }: HeroProps) {
  return (
    <section className={cn("relative py-20 md:py-32 overflow-hidden", className)}>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
            {title}
          </h1>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl">
            {subtitle}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link 
              href={ctaLink} 
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-black bg-cyan-400 hover:bg-cyan-300 rounded-full transition-colors"
            >
              {ctaText}
            </Link>
            <Link 
              href="/about" 
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white border border-white/20 hover:bg-white/10 rounded-full transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
      {/* Background effects could go here */}
      <div className="absolute top-0 right-0 -z-10 w-1/2 h-full bg-gradient-to-b from-cyan-900/20 to-transparent blur-3xl opacity-50" />
    </section>
  );
}
'@
New-PatchFile -Path "next/components/HeroSection.tsx" -Content $HeroSection

# next/components/FeatureCard.tsx
$FeatureCard = @'
import React from 'react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  className?: string;
}

export function FeatureCard({ title, description, icon, className }: FeatureCardProps) {
  return (
    <div className={cn("p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-colors", className)}>
      {icon && <div className="mb-4 text-cyan-400">{icon}</div>}
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}
'@
New-PatchFile -Path "next/components/FeatureCard.tsx" -Content $FeatureCard

# next/components/DetailModal.tsx
$DetailModal = @'
"use client";
import React from 'react';
import { IconX } from '@tabler/icons-react';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function DetailModal({ isOpen, onClose, title, children }: DetailModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-charcoal border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <IconX size={20} />
          </button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
'@
New-PatchFile -Path "next/components/DetailModal.tsx" -Content $DetailModal

# next/components/Layout.tsx
$Layout = @'
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
'@
New-PatchFile -Path "next/components/Layout.tsx" -Content $Layout

# -----------------------------------------------------------------------------
# 4. CONTENT (SecureBase)
# -----------------------------------------------------------------------------

# content/_imports/securebase/index.md
$ContentIndex = @'
---
title: "Securebase"
description: ""
slug: "index"
sourceURL: "https://securebase.cc/"
lastFetched: "2025-11-21T07:36:24.836Z"
---

![](./images/67135b512f98d2b03a39dba2_logo-color.png)

[

# Meet  
Dr. Sung

![](./images/67134985858863c516c2d5a5_profile.png)](/about)[

# I speak _to_ leaders and _into_ their lives.  
  
It all starts with self-awareness.

# Get in Touch

](/contact)[

# Speaking

![](./images/66efb23f27d0018866656933_speech-line-art-01.svg)](/speaking)[

# Assessements

![](./images/6715d1a3656c123e0f32c055_speech-line-art-02.svg)](/assessments)[

# Coaching

![](./images/6715d1bc97866e3c25b68dfa_speech-line-art-03.svg)](/coaching)
'@
New-PatchFile -Path "content/_imports/securebase/index.md" -Content $ContentIndex

# content/_imports/securebase/about.md
$ContentAbout = @'
---
title: "About"
description: ""
slug: "about"
sourceURL: "https://securebase.cc/about"
lastFetched: "2025-11-21T07:36:23.100Z"
---

# Meet Dr. Peter Sung

With over three decades of leadership study and experience, Dr. Peter Sung has honed his craft as a leader. Seamlessly navigating both church and corporate domains, he integrates performance and organizational psychology into his coaching and speaking practice, expertly guiding leaders and organizations to find stability and success in an ever-changing world. As an avid learner and practitioner, he brings a calm and confident voice to the often-noisy landscape of leadership trends.

4000+
### Hours of Coaching & Assessments
### Leaders at all levels

2000+
### Speaking events
### Conferences, retreats, and more intimate gatherings

# Engagements

Dr. Sung’s holistic approach blends profound psychological expertise with sharp organizational insights, establishing him as a highly sought-after mentor and speaker in personal and organizational leadership.
'@
New-PatchFile -Path "content/_imports/securebase/about.md" -Content $ContentAbout

# content/_imports/securebase/coaching.md
$ContentCoaching = @'
---
title: "Coaching"
description: ""
slug: "coaching"
sourceURL: "https://securebase.cc/coaching"
lastFetched: "2025-11-21T07:36:25.706Z"
---

# Everyone needs a coach

Rediscover your strengths, identify roadblocks in your mind or at your workplace, get past feeling stuck, and work towards your goals with personal, executive coaching! Your coach will become your trusted secure base, seeing you on a transformative journey of learning, growth, and achievement. You will think better thoughts and level-up with coaching!

## Grow in awareness
What's really going on, with you personally or at work? Coaching will help leaders increase their awareness and emotional intelligence, and identify intention-impact gaps. Gain clarity, build confidence, and create a roadmap for your personal and professional success.

## Increase your agency
The key is to get started, by doing the first thing, however small. Awareness, accountability, and meaningful action makes the difference! You need a caring outsider because hope shows up when people who care show up. You don't have to be alone. Connect with a caring coach today!
'@
New-PatchFile -Path "content/_imports/securebase/coaching.md" -Content $ContentCoaching

# content/_imports/securebase/speaking.md
$ContentSpeaking = @'
---
title: "Speaking"
description: ""
slug: "speaking"
sourceURL: "https://securebase.cc/speaking"
lastFetched: "2025-11-21T07:36:24.521Z"
---

# Speaking

When leaders gather to hear a speaker, they enter a rare headspace: vulnerable and curious with questions and needs rising to the surface. Peter meets this powerful moment, opening with humility, humor, and hard-earned insight that connects and clarifies. People lean in, laugh, and leave with the exact medicine they were searching for. A truly worthy investment.

## Peter's Talks
Feeling stuck? Unmotivated? Losing focus? With 30 years of leadership and speaking experience, Peter brings fresh energy and perspective to every stage. Combining academic rigor with insight and an engaging presence, he helps leaders understand what’s holding them back and reframe their challenges. Audiences leave inspired, equipped with newfound clarity to lead with renewed confidence and purpose.
'@
New-PatchFile -Path "content/_imports/securebase/speaking.md" -Content $ContentSpeaking

# content/_imports/securebase/contact.md
$ContentContact = @'
---
title: "Contact"
description: ""
slug: "contact"
sourceURL: "https://securebase.cc/contact"
lastFetched: "2025-11-21T07:36:25.575Z"
---

## Get in Touch

Send us a note, and we’ll respond within 24 hours to schedule a 30-minute discovery call. I look forward to hearing from you.

Name
Email
Message

Thank you! Your submission has been received!
'@
New-PatchFile -Path "content/_imports/securebase/contact.md" -Content $ContentContact

# -----------------------------------------------------------------------------
# 5. CONFIG & SCRIPTS
# -----------------------------------------------------------------------------

# next/tailwind.extend.ts
$TailwindExtend = @'
// This file exports theme extensions to be used in tailwind.config.ts
export const themeExtend = {
  colors: {
    charcoal: '#121212',
    'text-primary': '#ffffff',
    cyan: {
      400: '#22d3ee',
      500: '#06b6d4',
      900: '#164e63',
    },
  },
  fontFamily: {
    sans: ['var(--font-sans)', 'sans-serif'],
    serif: ['var(--font-serif)', 'serif'],
  },
};
'@
New-PatchFile -Path "next/tailwind.extend.ts" -Content $TailwindExtend

# scripts/ingest-content.mjs
$IngestScript = @'
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(__dirname, '../content/_imports/securebase');

async function ingest() {
  console.log('Starting content ingestion from:', CONTENT_DIR);
  
  try {
    const files = await fs.readdir(CONTENT_DIR);
    const markdownFiles = files.filter(f => f.endsWith('.md'));
    
    console.log(`Found ${markdownFiles.length} markdown files.`);
    
    for (const file of markdownFiles) {
      const content = await fs.readFile(path.join(CONTENT_DIR, file), 'utf-8');
      // Here you would parse frontmatter and push to Strapi or Database
      console.log(`Processing ${file}...`);
    }
    
    console.log('Ingestion complete.');
  } catch (error) {
    console.error('Error ingesting content:', error);
  }
}

ingest();
'@
New-PatchFile -Path "scripts/ingest-content.mjs" -Content $IngestScript

# -----------------------------------------------------------------------------
# 6. ZIP IT UP
# -----------------------------------------------------------------------------

$zipPath = "$patchDir.zip"
Compress-Archive -Path "$patchDir\*" -DestinationPath $zipPath -Force

Write-Host "----------------------------------------------------------------"
Write-Host "Patch creation complete!"
Write-Host "Patch Zip: $zipPath"
Write-Host "----------------------------------------------------------------"
