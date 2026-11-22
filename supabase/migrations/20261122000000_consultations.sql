-- Consultation requests submitted from the notebook on the studio desk.

create table if not exists public.consultations (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) between 3 and 200 and email like '%@%'),
  phone text check (phone is null or char_length(phone) <= 40),
  company text check (company is null or char_length(company) <= 160),
  project_type text not null check (char_length(project_type) <= 60),
  budget text not null check (char_length(budget) <= 60),
  timeline text not null check (char_length(timeline) <= 60),
  message text not null check (char_length(message) between 1 and 4000),
  contact_method text not null check (char_length(contact_method) <= 40),
  status text not null default 'new' check (status in ('new', 'contacted', 'booked', 'closed', 'archived')),
  admin_notes text,
  source text check (source is null or char_length(source) <= 40),
  user_agent text check (user_agent is null or char_length(user_agent) <= 300)
);

create index if not exists consultations_created_at_idx on public.consultations (created_at desc);
create index if not exists consultations_status_idx on public.consultations (status);

-- Who may use the admin. Add your email with:
--   insert into public.admins (email) values ('you@example.com');
create table if not exists public.admins (
  email text primary key
);

alter table public.consultations enable row level security;
alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admins a
    where lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- Visitors (anon) can only create requests, and only with default status / no notes.
drop policy if exists "anyone can submit" on public.consultations;
create policy "anyone can submit" on public.consultations
  for insert to anon, authenticated
  with check (status = 'new' and admin_notes is null);

drop policy if exists "admins read" on public.consultations;
create policy "admins read" on public.consultations
  for select to authenticated using (public.is_admin());

drop policy if exists "admins update" on public.consultations;
create policy "admins update" on public.consultations
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins delete" on public.consultations;
create policy "admins delete" on public.consultations
  for delete to authenticated using (public.is_admin());

-- Admins can check that they are admins (used by the /admin login gate).
drop policy if exists "admins see self" on public.admins;
create policy "admins see self" on public.admins
  for select to authenticated
  using (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));
