# d> Studio — To-do checklist

## Done
- [x] Site built: intro, exterior, studio desk, desktop OS, notebook form, `/admin`
- [x] Supabase tables + access rules applied to the "portfolio" project
- [x] Advisor fixes applied (`is_admin()` hidden from visitors, faster admin policy)
- [x] Form tested as an anonymous visitor: can submit; can't read, edit, delete, or pre-set a status
- [x] `.env.local` has the project URL + publishable key (gitignored)
- [x] `npm run build` passes

## Launch
- [ ] Add env vars in Vercel → Project Settings → Environment Variables
  - `VITE_SUPABASE_URL` = `https://vexitoxnqxwmhqzabykm.supabase.co`
  - `VITE_SUPABASE_ANON_KEY` = `sb_publishable_EeVum-CG96C6jMZVFzjPgw_2nOyGK_X`
- [ ] Deploy to Vercel (framework preset: Vite)
- [ ] Submit a real test through the notebook on the live site, then delete it in `/admin`

## Admin login
- [ ] Create your admin user in Supabase → Authentication → Users (sign-in links won't create new users)
- [ ] Add your email to the allow-list (SQL editor):
  ```sql
  insert into public.admins (email) values ('you@example.com');
  ```
- [ ] Supabase → Authentication → URL Configuration: set the Site URL and add `https://<your-domain>/admin` to Redirect URLs
- [ ] Log in at `/admin` and check the inbox loads

## Fixes
- [ ] Notebook form: "company (optional)" field is clipped at the right edge of the page on desktop
- [ ] Supabase advisor: `rls_auto_enable()` is callable by anyone. It came with the project, not this site; review or revoke

## Polish
- [ ] Split the 600 KB JavaScript bundle (lazy-load the desktop OS)
- [ ] Replace placeholder projects and documents in `src/content/`
- [ ] Lighthouse ≥ 90, keyboard pass, reduced-motion check
- [ ] `/work` SEO page + social share image

## Optional
- [ ] Email alert for each new submission (Supabase Edge Function + Resend)
