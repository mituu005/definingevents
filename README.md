# Defining Events — Luxury Event Management Website & Admin Studio

A production-ready, editorial luxury event planning and production website with a private Supabase-powered Admin Dashboard, media vault, dynamic event portfolio, CMS, and client enquiry system.

## Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Framer Motion, React Router, Lucide Icons
- **Backend & Security:** Supabase (PostgreSQL, Authentication, Row Level Security, Private/Public Storage Buckets)
- **Deployment:** Vite + Vercel (`vercel.json` SPA rewrites included)

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and add your Supabase credentials:
   ```bash
   cp .env.example .env
   ```
3. Complete the database schema, RLS policies, storage buckets, and admin user setup in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md).
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Build for production:
   ```bash
   npm run build
   ```

## Key Routes

- `/` — Public luxury showcase (Hero, Credibility Metrics, About Us, Services, Dynamic Portfolio, Why Choose Us, Process Timeline, Testimonials, Client Associations, Enquiry Form, Footer)
- `/events/:slug` — Individual published event case study with photo gallery, lightbox, video player, and optional before/after venue transformation slider
- `/admin/login` — Private administrator authentication
- `/admin/dashboard` — Studio overview (published/draft counts, media stats, recent enquiries & activity)
- `/admin/events` — Manage, publish, unpublish, edit, and delete portfolio events
- `/admin/events/new` — Create new event with multi-photo & MP4 video upload (desktop & mobile)
- `/admin/media` — Central Media Library showing file usage and storage cleanup
- `/admin/enquiries` — Client enquiry CRM with status updates and internal notes
- `/admin/content` — Edit hero media, statistics, About Us copy, services, testimonials, client logos, and contact details
