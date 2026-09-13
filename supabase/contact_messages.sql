-- Mount Everest Handicraft — contact form messages
-- Run once in: https://supabase.com/dashboard/project/ewwzzsbaicqbaadxfgkx/sql/new
-- Requires schema.sql (uses public.admin_users). Safe to re-run.
--
-- Visitors can only INSERT a message (name, email, phone, message).
-- Only admins (rows in public.admin_users) can read, mark as read, or delete messages.

-- ---------------------------------------------------------------------------
-- Table
-- ---------------------------------------------------------------------------
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 100),
  email text not null check (char_length(email) <= 254 and email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  phone text check (phone is null or char_length(phone) <= 30),
  message text not null check (char_length(message) between 1 and 5000),
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists contact_messages_created_at_idx
  on public.contact_messages (created_at desc);

alter table public.contact_messages enable row level security;

-- ---------------------------------------------------------------------------
-- Column privileges: visitors may only supply the message fields
-- (they cannot set id, is_read or created_at, and cannot read anything back).
-- ---------------------------------------------------------------------------
revoke all on public.contact_messages from anon, authenticated;
grant insert (name, email, phone, message) on public.contact_messages to anon, authenticated;
grant select, delete on public.contact_messages to authenticated;
grant update (is_read) on public.contact_messages to authenticated;

-- ---------------------------------------------------------------------------
-- Row-level security policies
-- ---------------------------------------------------------------------------
drop policy if exists "Anyone can send a contact message" on public.contact_messages;
create policy "Anyone can send a contact message"
  on public.contact_messages
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Admins can read contact messages" on public.contact_messages;
create policy "Admins can read contact messages"
  on public.contact_messages
  for select
  to authenticated
  using (exists (select 1 from public.admin_users where user_id = auth.uid()));

drop policy if exists "Admins can update contact messages" on public.contact_messages;
create policy "Admins can update contact messages"
  on public.contact_messages
  for update
  to authenticated
  using (exists (select 1 from public.admin_users where user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

drop policy if exists "Admins can delete contact messages" on public.contact_messages;
create policy "Admins can delete contact messages"
  on public.contact_messages
  for delete
  to authenticated
  using (exists (select 1 from public.admin_users where user_id = auth.uid()));

-- ---------------------------------------------------------------------------
-- Clean-up + basic spam protection (runs before the CHECK constraints)
-- ---------------------------------------------------------------------------
create or replace function public.contact_messages_before_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.name := btrim(new.name);
  new.email := lower(btrim(new.email));
  new.phone := nullif(btrim(coalesce(new.phone, '')), '');
  new.message := btrim(new.message);

  -- At most 3 messages per email address every 10 minutes.
  if (
    select count(*) from public.contact_messages
    where email = new.email and created_at > now() - interval '10 minutes'
  ) >= 3 then
    raise exception 'Too many messages from this email. Please try again later.'
      using errcode = 'P0001';
  end if;

  -- At most 60 messages per hour in total (flood protection).
  if (
    select count(*) from public.contact_messages
    where created_at > now() - interval '1 hour'
  ) >= 60 then
    raise exception 'We are receiving too many messages right now. Please try again later.'
      using errcode = 'P0001';
  end if;

  return new;
end;
$$;

revoke all on function public.contact_messages_before_insert() from public, anon, authenticated;

drop trigger if exists contact_messages_before_insert on public.contact_messages;
create trigger contact_messages_before_insert
  before insert on public.contact_messages
  for each row execute function public.contact_messages_before_insert();

-- Verify:
-- select id, name, email, is_read, created_at from public.contact_messages order by created_at desc;
