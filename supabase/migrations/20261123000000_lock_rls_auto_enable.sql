-- rls_auto_enable() came with the Supabase project. It's the function behind the `ensure_rls`
-- event trigger, which turns on row level security for every new table in `public` — keep it.
-- It never needs to be called directly, so take away EXECUTE from the API roles (the advisor
-- flags it as callable through /rest/v1/rpc). Event triggers don't check EXECUTE when they fire.
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
