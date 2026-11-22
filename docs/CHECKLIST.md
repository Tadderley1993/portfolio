# d> Studio — To-do checklist

**Live:** https://portfolio-chi-one-rk68jhdjtx.vercel.app · **Admin:** `/admin`
**Last updated:** November 22, 2026

## Next session: start here

The site is launched and working end to end: the form saves to Supabase, the admin inbox shows
submissions, and pushes to `main` deploy automatically. Next up, in suggested order:

1. **Real content:** replace the placeholders in `src/content/`:
   - `projects.ts`: Concept Work and Client Work projects (browser app)
   - `docs.ts`: Mission Statement, About the Studio, the three Services docs
   - `fs.ts`: desktop folders and icons
   - Project screenshots go in `public/` (e.g. `public/work/<project>/`)
2. **Custom domain** (optional): add it in Vercel, then update Supabase → Authentication →
   URL Configuration (Site URL + `/admin` redirect URL).
3. **Email alerts** (optional): Supabase Edge Function + Resend; needs a Resend API key.

## Working setup (for reference)

| What | Where |
|---|---|
| Code | GitHub `tadderley1993/portfolio`, branch `main` (production) |
| Hosting | Vercel project `portfolio`, push to `main` = live deploy, other branches = preview |
| Database | Supabase project `portfolio` (ref `vexitoxnqxwmhqzabykm`) |
| Schema | `supabase/migrations/` (all applied; add new files for changes) |
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
- [x] Faster first load: studio and Supabase load on demand (first JS 602 KB → 342 KB, 182 → 114 KB gzipped)
- [x] Supabase advisor: `rls_auto_enable()` no longer callable by visitors (auto-RLS trigger still works)
- [x] Vercel login protection limited to preview links, so the live site is public

## To do

### Launch follow-ups
- [ ] Optional: connect a custom domain (e.g. designsbyta.com) and update the Supabase URLs to match

### Content
- [ ] Replace placeholder projects and documents in `src/content/`
- [ ] Add real project screenshots / recordings for the browser app

### Fixes
- [ ] Optional: Supabase → Authentication → turn on Leaked Password Protection (advisor warning; may
  need a paid plan). Low priority: admin sign-in uses email links, not passwords

### Polish
- [ ] Lighthouse ≥ 90, keyboard pass, reduced-motion check
- [ ] `/work` SEO page + social share image

### Optional
- [ ] Email alert for each new submission (Supabase Edge Function + Resend)
