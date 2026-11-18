# Supabase Backend & Security Setup Guide

This document contains the complete SQL database schema, Row Level Security (RLS) policies, private/public Storage bucket setup, administrator provisioning, and Vercel deployment instructions for **Defining Events**.

---

## 1. Create a Supabase Project

1. Sign in to [Supabase](https://supabase.com) and create a new project.
2. Once provisioned, go to **Project Settings → API** and copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon / public key** → `VITE_SUPABASE_ANON_KEY`
3. Create a `.env` file in the project root (copy `.env.example`):

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

> **Security Note:** Never put the `service_role` key in `.env` or any frontend code.

---

## 2. Database Schema & Row Level Security (SQL)

Open **SQL Editor → New query** in your Supabase Dashboard and execute the following complete SQL script:

```sql
-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ============================================================================
-- 1. ADMIN USERS TABLE & HELPER FUNCTION
-- ============================================================================
create table if not exists public.admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where id = auth.uid()
  );
$$;

create policy "Admins can view own admin record"
  on public.admin_users
  for select
  to authenticated
  using (id = auth.uid() or public.is_admin());

-- ============================================================================
-- 2. EVENTS TABLE
-- ============================================================================
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text not null,
  location text not null,
  event_date date,
  description text not null,
  creative_concept text,
  services_provided text[] not null default '{}',
  cover_image_url text,
  cover_image_path text,
  before_image_url text,
  before_image_path text,
  after_image_url text,
  after_image_path text,
  client_testimonial text,
  client_testimonial_author text,
  status text not null default 'draft' check (status in ('draft', 'published', 'unpublished')),
  featured boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_events_status on public.events(status);
create index if not exists idx_events_category on public.events(category);

alter table public.events enable row level security;

-- Public visitors can ONLY read published events
create policy "Public can read published events"
  on public.events
  for select
  to anon, authenticated
  using (status = 'published' or public.is_admin());

-- Only authorised admins can insert, update, delete events
create policy "Admins can insert events"
  on public.events
  for insert
  to authenticated
  with check (public.is_admin());

create policy "Admins can update events"
  on public.events
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can delete events"
  on public.events
  for delete
  to authenticated
  using (public.is_admin());

-- ============================================================================
-- 3. EVENT MEDIA TABLE
-- ============================================================================
create table if not exists public.event_media (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references public.events(id) on delete cascade,
  media_type text not null check (media_type in ('image', 'video')),
  file_name text not null,
  file_url text not null,
  storage_path text not null,
  storage_bucket text not null default 'event-images',
  file_size bigint,
  mime_type text,
  caption text,
  display_order integer not null default 0,
  usage_scope text not null default 'event' check (usage_scope in ('event', 'website')),
  created_at timestamptz not null default now()
);

create index if not exists idx_event_media_event_id on public.event_media(event_id);

alter table public.event_media enable row level security;

-- Public visitors can ONLY read media attached to PUBLISHED events or public website library
create policy "Public can read published event media"
  on public.event_media
  for select
  to anon, authenticated
  using (
    public.is_admin()
    or usage_scope = 'website'
    or (
      event_id is not null
      and exists (
        select 1 from public.events e
        where e.id = event_media.event_id
          and e.status = 'published'
      )
    )
  );

create policy "Admins can insert event media"
  on public.event_media
  for insert
  to authenticated
  with check (public.is_admin());

create policy "Admins can update event media"
  on public.event_media
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can delete event media"
  on public.event_media
  for delete
  to authenticated
  using (public.is_admin());

-- ============================================================================
-- 4. SERVICES TABLE
-- ============================================================================
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  short_description text not null,
  full_description text,
  highlights text[] not null default '{}',
  cover_image_url text,
  cover_image_path text,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.services enable row level security;

create policy "Public can read active services"
  on public.services
  for select
  to anon, authenticated
  using (is_active = true or public.is_admin());

create policy "Admins can manage services"
  on public.services
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================================
-- 5. TESTIMONIALS TABLE
-- ============================================================================
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  client_role text,
  event_type text not null,
  quote text not null,
  client_photo_url text,
  video_url text,
  is_published boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.testimonials enable row level security;

create policy "Public can read published testimonials"
  on public.testimonials
  for select
  to anon, authenticated
  using (is_published = true or public.is_admin());

create policy "Admins can manage testimonials"
  on public.testimonials
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================================
-- 6. WEBSITE SETTINGS SINGLETON TABLE
-- ============================================================================
create table if not exists public.website_settings (
  id integer primary key default 1 check (id = 1),
  company_name text not null default 'Defining Events',
  tagline text default 'Architectural Celebrations & Bespoke Production',
  logo_url text,
  hero_headline text not null default 'Beyond Events. Beyond Expectations.',
  hero_subtitle text not null default 'We design, plan and produce extraordinary experiences that turn your vision into unforgettable memories.',
  hero_video_url text,
  hero_poster_url text,
  show_stats boolean not null default true,
  stat_years text,
  stat_events text,
  stat_clients text,
  stat_cities text,
  about_headline text not null default 'Turning Visions Into Extraordinary Experiences.',
  about_intro text,
  about_vision text,
  about_mission text,
  about_philosophy text,
  about_why_us text,
  about_image_url text,
  contact_phone text,
  contact_whatsapp text,
  contact_email text,
  contact_address text,
  google_maps_url text,
  instagram_url text,
  facebook_url text,
  linkedin_url text,
  client_logos jsonb not null default '[]'::jsonb,
  website_gallery jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.website_settings enable row level security;

create policy "Public can read website settings"
  on public.website_settings
  for select
  to anon, authenticated
  using (true);

create policy "Admins can manage website settings"
  on public.website_settings
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Seed initial row
insert into public.website_settings (id)
values (1)
on conflict (id) do nothing;

-- ============================================================================
-- 7. ENQUIRIES TABLE
-- ============================================================================
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text not null,
  event_type text not null,
  event_date date,
  event_location text,
  guest_count text,
  budget text,
  requirements text,
  status text not null default 'new' check (status in ('new', 'contacted', 'completed')),
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.enquiries enable row level security;

-- Public visitors can submit enquiries, but CANNOT read/update/delete other enquiries
create policy "Public can submit enquiries"
  on public.enquiries
  for insert
  to anon, authenticated
  with check (status = 'new');

create policy "Admins can read enquiries"
  on public.enquiries
  for select
  to authenticated
  using (public.is_admin());

create policy "Admins can update enquiries"
  on public.enquiries
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can delete enquiries"
  on public.enquiries
  for delete
  to authenticated
  using (public.is_admin());

-- ============================================================================
-- 8. ACTIVITY LOGS TABLE
-- ============================================================================
create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  action text not null,
  entity_type text not null,
  entity_title text,
  actor_email text,
  created_at timestamptz not null default now()
);

alter table public.activity_logs enable row level security;

create policy "Admins can manage activity logs"
  on public.activity_logs
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
```

---

## 3. Storage Buckets & Access Policies

We use three Storage buckets:
- `event-images` (**Private bucket** — only published event photos & covers are signed and served publicly; draft/unpublished photos remain private!)
- `event-videos` (**Private bucket** — only published event MP4 videos are signed and served publicly)
- `site-assets` (**Public bucket** — logo, hero video, about photo, service covers, client logos, website gallery)

Run this SQL in **SQL Editor**:

```sql
-- Create buckets
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('event-images', 'event-images', false, 15728640, array['image/jpeg', 'image/jpg', 'image/png', 'image/webp']),
  ('event-videos', 'event-videos', false, 157286400, array['video/mp4']),
  ('site-assets', 'site-assets', true, 157286400, array['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'video/mp4'])
on conflict (id) do nothing;

-- ============================================================================
-- STORAGE RLS POLICIES
-- ============================================================================

-- Admins have full read/write/delete control over all three buckets
create policy "Admins can upload to storage"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id in ('event-images', 'event-videos', 'site-assets')
    and public.is_admin()
  );

create policy "Admins can update storage objects"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id in ('event-images', 'event-videos', 'site-assets')
    and public.is_admin()
  );

create policy "Admins can delete storage objects"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id in ('event-images', 'event-videos', 'site-assets')
    and public.is_admin()
  );

-- Public can read site-assets
create policy "Public can read site-assets"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'site-assets');

-- Public can generate signed URLs ONLY for media belonging to PUBLISHED events (never drafts!)
create policy "Public can read published event storage objects"
  on storage.objects
  for select
  to anon, authenticated
  using (
    public.is_admin()
    or (
      bucket_id in ('event-images', 'event-videos')
      and (
        exists (
          select 1
          from public.event_media em
          join public.events e on e.id = em.event_id
          where em.storage_path = name
            and em.storage_bucket = bucket_id
            and e.status = 'published'
        )
        or exists (
          select 1
          from public.events e
          where e.status = 'published'
            and (
              e.cover_image_path = name
              or e.before_image_path = name
              or e.after_image_path = name
            )
        )
      )
    )
  );
```

---

## 4. Create Your Authorised Admin Account

> Never create an insecure default admin account in code. Create your real owner account directly in Supabase.

1. In Supabase Dashboard, go to **Authentication → Users → Add User → Create new user**.
   - Enter your company administrator email and a strong password.
   - Check **Auto Confirm User**.
2. Copy the new user's **User UID** (`uuid`).
3. Run the following SQL in **SQL Editor**, replacing the UUID, email, and name with your own:

```sql
insert into public.admin_users (id, email, full_name, role)
values (
  'PASTE-USER-UUID-HERE',
  'owner@yourdomain.com',
  'Managing Director',
  'admin'
);
```

4. Optionally, in **Authentication → Providers → Email**, disable public sign-ups (`Enable sign ups` = OFF) so only invited administrators exist.

---

## 5. Seed Default Services (Optional)

Once signed into `/admin/login`, go to **Website Content → Services** and click **Import 10 Default Services** to populate the database with the 10 curated service categories so you can edit or upload custom covers for each.

---

## 6. Vercel Deployment

1. Push this repository to GitHub / GitLab / Bitbucket.
2. Import the project into [Vercel](https://vercel.com).
3. Framework Preset: **Vite**.
4. Add Environment Variables in Vercel Project Settings:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy! `vercel.json` is already included to route `/admin/*` and `/events/*` cleanly to `index.html`.
