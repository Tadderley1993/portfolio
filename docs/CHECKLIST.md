# d> Studio — To-do checklist

## Done
- [x] Site built: intro, exterior, studio desk, desktop OS, notebook form, `/admin`
- [x] Supabase tables + access rules applied to the "portfolio" project
- [x] Advisor fixes applied (`is_admin()` hidden from visitors, faster admin policy)
- [x] Form tested as an anonymous visitor: can submit; can't read, edit, delete, or pre-set a status
- [x] `.env.local` has the project URL + publishable key (gitignored)
- [x] `npm run build` passes

## Launch
- [x] Add env vars in Vercel → Project Settings → Environment Variables
  - `VITE_SUPABASE_URL` = `https://vexitoxnqxwmhqzabykm.supabase.co`
  - `VITE_SUPABASE_ANON_KEY` = `sb_publishable_EeVum-CG96C6jMZVFzjPgw_2nOyGK_X`
- [x] Deploy to Vercel — live at https://portfolio-chi-one-rk68jhdjtx.vercel.app
- [ ] Submit a real test through the notebook on the live site, then delete it in `/admin`

## Admin login
- [ ] Create your admin user in Supabase → Authentication → Users → Add user → Create new user: `terrenceadderley@designsbyta.com`, tick **Auto Confirm User** (sign-in links won't create new users)
- [x] Add your email to the allow-list (`terrenceadderley@designsbyta.com`)
- [ ] Supabase → Authentication → URL Configuration: Site URL = `https://portfolio-chi-one-rk68jhdjtx.vercel.app`, Redirect URLs += `https://portfolio-chi-one-rk68jhdjtx.vercel.app/admin`
- [ ] Log in at `/admin` and check the inbox loads

## Launch follow-ups
- [ ] Open the live URL in a private window to confirm it loads without a Vercel login
- [x] Create `main` from `claude/affectionate-noether-ya3rgw`
- [x] GitHub → Settings → General → Default branch → `main`
- [x] Vercel → portfolio → Settings → Environments → Production → Branch Tracking → `main`
- [ ] Optional: connect a custom domain (e.g. designsbyta.com) and update the Supabase URLs to match

## Fixes
- [x] Notebook form: "company (optional)" field is clipped at the right edge of the page on desktop
- [ ] Supabase advisor: `rls_auto_enable()` is callable by anyone. It came with the project, not this site; review or revoke

## Polish
- [ ] Split the 600 KB JavaScript bundle (lazy-load the desktop OS)
- [ ] Replace placeholder projects and documents in `src/content/`
- [ ] Lighthouse ≥ 90, keyboard pass, reduced-motion check
- [ ] `/work` SEO page + social share image

## Optional
- [ ] Email alert for each new submission (Supabase Edge Function + Resend)
