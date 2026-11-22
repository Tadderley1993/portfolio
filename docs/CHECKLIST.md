# d> Studio — To-do checklist

**Live:** https://portfolio-chi-one-rk68jhdjtx.vercel.app · **Admin:** `/admin`
**Last updated:** November 22, 2026

## Next session: start here

The site is launched and working end to end: the form saves to Supabase, the admin inbox shows
submissions, and pushes to `main` deploy automatically. Next up, in suggested order:

1. **Private-window check:** open the live URL logged out of Vercel and confirm no Vercel login
   screen appears. If one does, turn off Vercel Authentication for production
   (Vercel → portfolio → Settings → Deployment Protection).
2. **Real content:** replace the placeholders in `src/content/`:
   - `projects.ts`: Concept Work and Client Work projects (browser app)
   - `docs.ts`: Mission Statement, About the Studio, the three Services docs
   - `fs.ts`: desktop folders and icons
   - Project screenshots go in `public/` (e.g. `public/work/<project>/`)
3. **Faster first load:** split the ~600 KB JS bundle (lazy-load the desktop OS and admin).
4. **Custom domain** (optional): add it in Vercel, then update Supabase → Authentication →
   URL Configuration (Site URL + `/admin` redirect URL).
5. **Email alerts** (optional): Supabase Edge Function + Resend; needs a Resend API key.

## Working setup (for reference)

| What | Where |
|---|---|
| Code | GitHub `tadderley1993/portfolio`, branch `main` (production) |
| Hosting | Vercel project `portfolio`, push to `main` = live deploy, other branches = preview |
| Database | Supabase project `portfolio` (ref `vexitoxnqxwmhqzabykm`) |
| Schema | `supabase/migrations/` (both applied; add new files for changes) |
| Admin | `terrenceadderley@designsbyta.com` (Supabase Auth user + `public.admins`) |
| Local env | `.env.local` (gitignored); copy from `.env.example` |

## Done
- [x] Site built: intro, exterior, studio desk, desktop OS, notebook form, `/admin`
- [x] Supabase tables + access rules applied; advisor fixes applied
- [x] Form tested as an anonymous visitor: can submit; can't read, edit, delete, or pre-set a status
- [x] Notebook form: company field no longer clipped on desktop
- [x] Vercel env vars set (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
- [x] Deployed to Vercel; `main` is the production branch (GitHub default + Vercel branch tracking)
- [x] Admin user created, Supabase Site URL + `/admin` redirect URL set
- [x] Admin login works on the live site
- [x] Real submission through the live notebook form shows up in `/admin`

## To do

### Launch follow-ups
- [ ] Open the live URL in a private window to confirm it loads without a Vercel login
- [ ] Optional: connect a custom domain (e.g. designsbyta.com) and update the Supabase URLs to match

### Content
- [ ] Replace placeholder projects and documents in `src/content/`
- [ ] Add real project screenshots / recordings for the browser app

### Fixes
- [ ] Supabase advisor: `rls_auto_enable()` is callable by anyone. It came with the project, not this
  site; review or revoke

### Polish
- [ ] Split the 600 KB JavaScript bundle (lazy-load the desktop OS)
- [ ] Lighthouse ≥ 90, keyboard pass, reduced-motion check
- [ ] `/work` SEO page + social share image

### Optional
- [ ] Email alert for each new submission (Supabase Edge Function + Resend)
