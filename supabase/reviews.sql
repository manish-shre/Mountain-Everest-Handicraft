-- Mount Everest Handicraft — customer reviews (shown in the Testimonials section after approval)
-- Run once in: https://supabase.com/dashboard/project/ewwzzsbaicqbaadxfgkx/sql/new
-- Requires schema.sql (uses public.admin_users). Safe to re-run.
--
-- Visitors can submit a review (it starts as 'pending') and can read APPROVED reviews only.
-- Admins (rows in public.admin_users) can see all reviews, approve/reject them, and delete them.
-- No email or phone is collected, so nothing private is ever stored in this table.

-- ---------------------------------------------------------------------------
-- Table
-- ---------------------------------------------------------------------------
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 80),
  location text check (location is null or char_length(location) <= 80),
  product text check (product is null or char_length(product) <= 100),
  rating smallint not null check (rating between 1 and 5),
  review text not null check (char_length(review) between 10 and 1000),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

create index if not exists reviews_status_created_at_idx
  on public.reviews (status, created_at desc);

alter table public.reviews enable row level security;

-- ---------------------------------------------------------------------------
-- Column privileges: visitors may only supply review fields (never the status).
-- ---------------------------------------------------------------------------
revoke all on public.reviews from anon, authenticated;
grant insert (name, location, product, rating, review) on public.reviews to anon, authenticated;
grant select (id, name, location, product, rating, review, status, created_at) on public.reviews to anon, authenticated;
grant update (status) on public.reviews to authenticated;
grant delete on public.reviews to authenticated;

-- ---------------------------------------------------------------------------
-- Row-level security policies
-- ---------------------------------------------------------------------------
drop policy if exists "Anyone can submit a review" on public.reviews;
create policy "Anyone can submit a review"
  on public.reviews
  for insert
  to anon, authenticated
  with check (status = 'pending');

drop policy if exists "Anyone can read approved reviews; admins read all" on public.reviews;
create policy "Anyone can read approved reviews; admins read all"
  on public.reviews
  for select
  to anon, authenticated
  using (
    status = 'approved'
    or exists (select 1 from public.admin_users where user_id = auth.uid())
  );

drop policy if exists "Admins can moderate reviews" on public.reviews;
create policy "Admins can moderate reviews"
  on public.reviews
  for update
  to authenticated
  using (exists (select 1 from public.admin_users where user_id = auth.uid()))
  with check (exists (select 1 from public.admin_users where user_id = auth.uid()));

drop policy if exists "Admins can delete reviews" on public.reviews;
create policy "Admins can delete reviews"
  on public.reviews
  for delete
  to authenticated
  using (exists (select 1 from public.admin_users where user_id = auth.uid()));

-- ---------------------------------------------------------------------------
-- Clean-up + basic spam protection (runs before the CHECK constraints)
-- ---------------------------------------------------------------------------
create or replace function public.reviews_before_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.name := btrim(new.name);
  new.location := nullif(btrim(coalesce(new.location, '')), '');
  new.product := nullif(btrim(coalesce(new.product, '')), '');
  new.review := btrim(new.review);
  new.status := 'pending';

  -- At most 2 reviews under the same name every 10 minutes.
  if (
    select count(*) from public.reviews
    where lower(name) = lower(new.name) and created_at > now() - interval '10 minutes'
  ) >= 2 then
    raise exception 'You have already sent a review. Thank you!'
      using errcode = 'P0001';
  end if;

  -- At most 20 reviews per hour in total (flood protection).
  if (
    select count(*) from public.reviews
    where created_at > now() - interval '1 hour'
  ) >= 20 then
    raise exception 'We are receiving too many reviews right now. Please try again later.'
      using errcode = 'P0001';
  end if;

  return new;
end;
$$;

revoke all on function public.reviews_before_insert() from public, anon, authenticated;

drop trigger if exists reviews_before_insert on public.reviews;
create trigger reviews_before_insert
  before insert on public.reviews
  for each row execute function public.reviews_before_insert();

-- Verify:
-- select name, rating, status, created_at from public.reviews order by created_at desc;
