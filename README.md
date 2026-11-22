# d> Studio — portfolio site

Immersive agency portfolio: intro → building exterior → studio desk (notebook form, lamp, monitor with a custom desktop OS) → admin inbox at `/admin`.

**Live:** https://portfolio-chi-one-rk68jhdjtx.vercel.app · **Admin:** `/admin`

- [`docs/CHECKLIST.md`](docs/CHECKLIST.md) — current status and what to work on next (start here)
- [`docs/PLAN.md`](docs/PLAN.md) — the full plan across desktop, tablet and mobile

## Develop

```bash
npm install
npm run dev
```

## Media

Source videos live in `media-src/`. Re-encode (strips audio, bakes seamless loops, makes 720p/540p + posters):

```bash
./scripts/encode-media.sh
```

## Content

Placeholder content lives in `src/content/` — `projects.ts` (browser), `docs.ts` (documents), `fs.ts` (desktop folders/icons). Hotspot coordinates are in `src/lib/stage.ts` (1280×720 video space).

## Backend (Supabase)

Project **portfolio** (ref `vexitoxnqxwmhqzabykm`, us-west-2). Already set up:

- `supabase/migrations/` — all migrations are applied to the live project. Add new changes as new
  migration files; don't edit applied ones.
- Tables: `consultations` (form submissions) and `admins` (who may use `/admin`).
- Access rules: visitors can only insert into `consultations`; admins can read, update and delete.
- Admin: `terrenceadderley@designsbyta.com` is in `public.admins` and exists in Supabase Auth.
  Sign-in is by emailed link (`shouldCreateUser: false`). To add another admin, create the user in
  Authentication → Users, then `insert into public.admins (email) values ('…');`
- Auth redirect: Site URL and the `/admin` redirect URL point at the Vercel address above. Update both
  if the domain changes.

Local development: copy `.env.example` to `.env.local` and fill in `VITE_SUPABASE_URL` and
`VITE_SUPABASE_ANON_KEY` (Supabase → Project Settings → API; the publishable key is fine to expose).
Without them the form shows "booking isn't switched on yet" and `/admin` shows setup instructions.

## Deploy

Vercel project **portfolio**, framework preset **Vite**, linked to this GitHub repo.

- Push to `main` → production deploy (live site updates in about 10 seconds).
- Push to any other branch → preview deploy with its own URL.
- Environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set in Vercel for all
  environments. The `SUPABASE_*` / `POSTGRES_*` / `NEXT_PUBLIC_*` variables came from the Supabase
  integration and aren't used by this site.
- `vercel.json` handles SPA routes and long-term caching for `/media`.
