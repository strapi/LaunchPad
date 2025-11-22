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
