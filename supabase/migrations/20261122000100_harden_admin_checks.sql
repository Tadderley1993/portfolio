-- Follow-ups from the Supabase database advisors.

-- Visitors never need is_admin(); the admin policies only apply to signed-in users.
revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- Evaluate auth.jwt() once per query instead of once per row.
drop policy if exists "admins see self" on public.admins;
create policy "admins see self" on public.admins
  for select to authenticated
  using (lower(email) = lower(coalesce((select auth.jwt()) ->> 'email', '')));
