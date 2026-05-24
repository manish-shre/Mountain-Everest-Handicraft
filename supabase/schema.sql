-- Mount Everest Handicraft — Supabase CMS schema
-- Run once in: https://supabase.com/dashboard/project/ewwzzsbaicqbaadxfgkx/sql/new
-- Safe to re-run: drops policies first, then recreates them.

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------
create table if not exists public.website_content (
  id text primary key default 'main',
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

alter table public.website_content enable row level security;
alter table public.admin_users enable row level security;

-- ---------------------------------------------------------------------------
-- website_content policies
-- ---------------------------------------------------------------------------
drop policy if exists "Anyone can read website content" on public.website_content;
create policy "Anyone can read website content"
  on public.website_content
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Admins can insert website content" on public.website_content;
create policy "Admins can insert website content"
  on public.website_content
  for insert
  to authenticated
  with check (
    exists (select 1 from public.admin_users where user_id = auth.uid())
  );

drop policy if exists "Admins can update website content" on public.website_content;
create policy "Admins can update website content"
  on public.website_content
  for update
  to authenticated
  using (
    exists (select 1 from public.admin_users where user_id = auth.uid())
  )
  with check (
    exists (select 1 from public.admin_users where user_id = auth.uid())
  );

-- ---------------------------------------------------------------------------
-- admin_users policies
-- ---------------------------------------------------------------------------
drop policy if exists "Users can read own admin row" on public.admin_users;
create policy "Users can read own admin row"
  on public.admin_users
  for select
  to authenticated
  using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Storage bucket + policies
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists "Public read media files" on storage.objects;
create policy "Public read media files"
  on storage.objects
  for select
  to public
  using (bucket_id = 'media');

drop policy if exists "Admins upload media" on storage.objects;
create policy "Admins upload media"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'media'
    and exists (select 1 from public.admin_users where user_id = auth.uid())
  );

drop policy if exists "Admins update media" on storage.objects;
create policy "Admins update media"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'media'
    and exists (select 1 from public.admin_users where user_id = auth.uid())
  );

drop policy if exists "Admins delete media" on storage.objects;
create policy "Admins delete media"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'media'
    and exists (select 1 from public.admin_users where user_id = auth.uid())
  );

-- ---------------------------------------------------------------------------
-- Seed
-- ---------------------------------------------------------------------------
insert into public.website_content (id, content)
values ('main', '{}'::jsonb)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- AFTER running this: add your admin (replace UUID + email)
-- Get UUID from: Authentication → Users → click user → copy User UID
-- ---------------------------------------------------------------------------
-- insert into public.admin_users (user_id, email)
-- values ('00000000-0000-0000-0000-000000000000', 'admin@example.com')
-- on conflict (user_id) do nothing;

-- Verify setup:
-- select * from public.website_content;
-- select * from public.admin_users;
-- select id, email from auth.users;
