# d> Studio — portfolio site

Immersive agency portfolio: intro → building exterior → studio desk (notebook form, lamp, monitor with a custom desktop OS) → admin inbox at `/admin`.

See [`docs/PLAN.md`](docs/PLAN.md) for the full plan across desktop, tablet and mobile.

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

1. Run `supabase/migrations/*.sql` on your Supabase project.
2. Add your admin email: `insert into public.admins (email) values ('you@example.com');`
3. Copy `.env.example` to `.env.local` and set `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` (also in Vercel project settings).

Until then, the notebook form shows "booking isn't switched on yet" and `/admin` shows setup instructions.

## Deploy

Vercel, framework preset **Vite**. `vercel.json` handles SPA routes and media caching.
