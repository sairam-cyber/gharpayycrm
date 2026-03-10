# Gharpayy CRM

A modern, full-stack Customer Relationship Management (CRM) built tailored for managing real estate leads, visits, agents, and analytics. Powered by Next.js and Supabase.

## 🚀 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, React 19)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Database / Backend:** [Supabase](https://supabase.com/) (PostgreSQL)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Charts / Analytics:** [Recharts](https://recharts.org/)
- **Language:** TypeScript

## 📁 Project Structure

```text
src/
├── app/
│   ├── analytics/        # Analytics and performance charts view
│   ├── api/
│   │   └── leads/        # API routes for lead creation and management
│   ├── dashboard/        # Main CRM dashboard overview
│   ├── leads/            # Leads management view
│   ├── pipeline/         # Kanban-style lead pipeline tracker
│   └── visits/           # Property visit scheduling and management
├── components/           # Reusable React components (Sidebar, VisitScheduler, LeadPipeline)
├── lib/                  # Utilities and Supabase client config
└── types/                # TypeScript interfaces and type definitions
```

## 🛠️ Features

1. **Dashboard & Analytics:** 
   Interactive charts displaying lead metrics, visit outcomes, and agent performance.
2. **Lead Management:** 
   Capture, view, and manage leads via web UI and API. Track lead sources (Website, Tally, WhatsApp).
3. **Pipeline System:** 
   Kanban-style CRM pipeline to track the journey of a lead from "New Lead" to "Booked".
4. **Visit Scheduling:** 
   Schedule property visits with prospective leads, logging visit outcomes (Pending, Completed, Cancelled).
5. **Agent Assignment System:** 
   Agents can be tracked and auto-assigned or manually assigned to specific leads. 

## 📦 Database Schema (Supabase)

This project relies on a relational database structure designed around:
- **Agents:** Tracks agent names and auto-assignment criteria (`last_assigned_at`).
- **Leads:** Stores CRM prospects, linking them to an assigned `agent_id` with details like budget, phone, and source.
- **Visits:** Linked to `lead_id`, holding property visit schedules and final outcomes.

*View `schema.sql` for the full database definition.*

## 💻 Getting Started

### 1. Prerequisites

Ensure you have Node.js and a package manager (`npm`, `yarn`, `pnpm`, or `bun`) installed.

### 2. Environment Variables

Create a `.env.local` file in the root directory and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the CRM dashboard.

## 🤝 Scripts

- `npm run dev`: Starts the Next.js development server.
- `npm run build`: Builds the app for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint for code formatting/lint checks.
- Additional loose script files (`add-agent.mjs`, `test-supabase.mjs`) are available in the root for testing database connections and data seeding.
