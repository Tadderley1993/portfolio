# d> Studio — Portfolio Site Plan

An immersive agency portfolio: an icon-shuffle intro lands on the **d>** mark, a cinematic
building exterior invites the visitor to **Enter The Studio**, and the studio desk becomes the
site's navigation — a notebook (consultation form), a monitor (a custom desktop OS holding the
work), and a lamp (just for fun).

Content starts as placeholders. Audio is removed from both videos.

---

## 1. Source assets

| Asset | Source | Notes |
|---|---|---|
| Building exterior | `hf_…205459…mp4` · 1280×720 · 24fps · 15.0s | Near-static camera. Loop seam is visible (first/last frame SSIM 0.94). |
| Studio desk | `hf_…233840…mp4` · 1280×720 · 24fps · 10.0s | Near-static camera. Has an audio track (to strip). Loop seam is more visible (SSIM 0.89). |
| Logo | `dbta-mark-black.ai` (PDF-compatible) | Converts cleanly to a single SVG path, 1231.6 × 886.6 (≈1.39:1). Pending decision on whether to redesign (see §9). |

**Asset pipeline (`scripts/encode-media.sh`, ffmpeg):**
- Strip audio (`-an`) from both videos.
- Encode to **WebM (VP9)** + **MP4 (H.264, `+faststart`)**, targeting ~1.5–3 MB each at 720p.
- Add a smaller **mobile 540p** rendition of each video.
- Export a **poster JPG/AVIF** (first frame) for each video, shown until playback starts.
- **Seamless loops:** two stacked `<video>` elements crossfade over the last ~0.6s instead of
  relying on `loop`, which hides the seam. (Alternative: bake a crossfaded loop in ffmpeg.)

### Hotspot map (fraction of the 1280×720 frame)

| Element | x range | y range |
|---|---|---|
| Building: zoom target window (top floor, far right pane) | 0.61 – 0.70 | 0.31 – 0.42 |
| Building: "d>" sign plate | 0.29 – 0.37 | 0.46 – 0.56 |
| Desk: monitor screen | 0.27 – 0.73 | 0.35 – 0.65 |
| Desk: notebook | 0.15 – 0.38 | 0.74 – 0.85 |
| Desk: lamp (head + arm + base) | 0.75 – 0.85 | 0.43 – 0.74 |

A `<Scene>` component maps these video-space coordinates to screen coordinates for whatever
`object-fit`/crop is active, so hotspots stay locked to the footage at any viewport size.

---

## 2. Experience flow

```
Intro (once per session) ─► Home / Exterior ─► [Enter The Studio] ─► zoom to window ─► black
                                                                                   │
                     ┌─────────────────────────────────────────────────────────────┘
                     ▼
                 Studio (desk) ──► Notebook  → consultation form (saved to backend)
                     │        ──► Monitor   → zoom → Desktop OS → folders / docs / browser
                     │        ──► Lamp      → toggle light
                     └──► "Step outside" → back to Home
```

URL routes mirror state so links are shareable and back/forward works:
`/` · `/studio` · `/studio/desktop` · `/studio/desktop/work/:project` · `/studio/consult` ·
`/admin` · `/work` (plain, indexable list for SEO).

---

## 3. Desktop plan (≥1024px wide, mouse/trackpad)

**Intro (~2.5s)**
- Black screen. Centered icon slot cycles through ~10 design/dev icons (pen tool, bezier,
  `</>`, cursor, grid, swatch, terminal, layers, type "Aa", frame). Starts fast, slows down,
  lands on the **d>** mark, then the mark scales and fades into the home screen.
- Both videos and posters preload during the intro.
- "Skip" link bottom-right. `prefers-reduced-motion` → simple logo fade.
- Plays once per session (`sessionStorage`).

**Home / Exterior**
- 100vw × 100vh, `overflow: hidden`, video `object-fit: cover`.
- Small **d>** mark top-left. Centered (or lower-third) **Enter The Studio** button.
- On click (~1.4s total, GSAP): scale the scene toward the target window with
  `transform-origin` at the window, add a slight blur, fade to black, then mount the studio.

**Studio (desk)**
- Same full-bleed video treatment, faded up from black. Subtle vignette.
- **Notebook:** soft warm glow on hover (layered drop-shadow + radial gradient on an overlay
  shaped to the notebook) and a small handwritten label "Book a consultation". Click → the
  notebook page opens toward the viewer (see §6).
- **Monitor:** a live "desktop" overlay sits inside the screen bezel (slight scale-down,
  slight glare). Hover → cursor + subtle brighten. Click → camera zooms so the screen fills
  ~92% of the viewport (scene `scale`/`translate`, video softly blurred), then the desktop
  becomes interactive. **Esc** or the on-screen ✕ / "Stand up" button zooms back out.
- **Lamp:** click toggles. *On* = warm radial light pool on the desk + glow at the lamp head
  (`mix-blend-mode: screen`) with a slight overall warm lift; *off* = scene dims ~10%.
  Click sound is not used (no audio).
- "Step outside" link (top-left) returns to Home.
- All hotspots are real `<button>`s with labels and visible keyboard focus. Tab order:
  monitor → notebook → lamp.

**Desktop OS (inside the monitor)**
- Wallpaper + desktop icons, top menu bar (d> menu, clock), bottom dock.
- Double-click to open, single-click to select. Windows: drag, focus/z-order, minimize,
  maximize, close.
- Contents (placeholders to start):
  - 📁 **Concept Work** — 3 placeholder projects
  - 📁 **Client Work** — 3 placeholder projects
  - 📁 **Services** — Web Design, Development, Branding (docs)
  - 📄 **Our Mission Statement.docx** — styled word-processor view
  - 📄 **About the Studio.docx**
  - 🌐 **Browser** — opens a project in the fake browser
  - 🗑 **Trash** — easter egg
  - ⌨️ **Terminal** (optional, phase 6) — `help`, `ls`, `whoami`, `contact`
- **Browser app:** tabs, back/forward, address bar showing a fake URL, a "Visit live site ↗"
  button. Content is full-page screenshots/recordings plus project write-ups rather than iframes,
  since many sites block being embedded.

---

## 4. Tablet plan (768–1023px, or any touch-first device ≥768px)

Same flow and features as desktop, adapted for touch:
- **No hover**, so hotspots show a gentle pulsing ring + label after the scene fades in;
  first tap opens.
- **Landscape:** identical to desktop (16:9 cover fits well).
- **Portrait:** `cover` would crop away the notebook and lamp. Instead use a **"fit + blurred
  backdrop"** layout: a blurred, scaled copy of the video fills the screen, and the sharp video
  is sized so the 0.13–0.87 horizontal band (notebook → lamp) is fully visible. Same treatment
  for the exterior so the target window stays on screen.
- Desktop OS: tap to open (no double-click), larger icons, windows open maximized by default
  but can be dragged/resized on landscape.
- Notebook form opens full-width; inputs ≥16px to avoid iOS zoom.

---

## 5. Mobile plan (<768px) — simplified

Goal: keep the story and the feel, drop the fiddly parts.
- **Intro:** shorter (~1.6s), fewer icons.
- **Home:** video uses the 540p rendition, cropped (`object-position`) to frame the building
  with the target window in view. Button pinned to the lower third. Transition: shorter zoom
  (~0.9s) + fade.
- **Studio:** fit + blurred backdrop layout (as tablet portrait). Hotspots get pulsing rings,
  plus a **tool tray** pinned to the bottom with three big buttons: 🖥 Work · 📓 Book · 💡 Lamp
  — so nothing relies on tapping a small object in the video.
- **Monitor → "Phone OS":** instead of a windowed desktop, tapping the monitor zooms in and
  hands off to a full-screen, app-grid layout (same content, same icons). Apps open
  full-screen with a top bar + back button. Browser app = full-screen with a bottom URL bar.
- **Notebook → bottom sheet** styled as a notebook page (lined paper, spiral edge), swipe
  down or ✕ to close.
- **Lamp:** same toggle, lighter effects.
- Respect `prefers-reduced-motion` and Save-Data (posters only, no video autoplay).

---

## 6. Consultation form (the notebook)

- Opens as a notebook page: lined paper, margin line, spiral binding, page-turn in.
- Typed text renders in a handwriting font (e.g. *Caveat* / *Homemade Apple*), with a pen
  cursor; labels look hand-written.
- **Fields:** Name, Email, Phone (optional), Company (optional), Project type (Website /
  Web app / Branding / Other), Budget range, Timeline, Tell us about your project,
  Preferred contact method.
- Client-side validation, honeypot field + rate limiting for spam (Cloudflare Turnstile
  optional).
- Success state: the page "tears off" / folds and a handwritten "Got it — we'll be in touch
  within 1 business day."

---

## 7. Backend + admin

**Recommendation: Supabase** (hosted Postgres + auth, generous free tier, and its own table
viewer as a backup admin).

- **Table `consultations`:** id, created_at, name, email, phone, company, project_type,
  budget, timeline, message, contact_method, status (`new` · `contacted` · `booked` ·
  `closed` · `archived`), admin_notes, source (device type), user_agent.
- **Security (Row Level Security):** anonymous visitors can only **insert**; only the admin
  account can **read/update/delete**. No secret keys ship to the browser.
- **Admin at `/admin`** (not linked anywhere on the site):
  - Login via email magic link, restricted to your admin email.
  - Inbox list with unread badges, search, filter by status, sort by date.
  - Detail view: all fields, status changer, private notes, "Reply by email" button.
  - Export to CSV.
- **Optional:** email notification to you on each new submission (Supabase Edge Function +
  Resend), and later, managing projects/docs from the admin instead of code (mini CMS).

**Needed from you:** create a free Supabase project (or let me know if you prefer another
backend), then share the project URL and *anon* key. Never share the service-role key in chat.

---

## 8. Tech stack

- **Vite + React + TypeScript**, **React Router** for routes.
- **GSAP** for camera moves and the intro; CSS for hover/glow effects.
- **Zustand** for small global state (scene, lamp, open windows).
- **Supabase JS** for form submission + admin.
- Content lives in `src/content/` (projects, documents, folders) as typed data/Markdown, so
  adding work never touches components.
- **Hosting:** Vercel or Netlify (static build + SPA rewrites).
- **Quality bar:** Lighthouse ≥90 on desktop, keyboard-navigable, reduced-motion support, and
  a plain `/work` page + meta tags for SEO/social sharing.

```
src/
  app/            routes, layout
  scenes/         Intro, Exterior, Studio
  studio/         Hotspot, Notebook, Lamp, MonitorOverlay
  os/             Desktop, Window, Dock, apps/ (Finder, Browser, DocViewer, Terminal)
  os-mobile/      PhoneOS shell
  admin/          Login, Inbox, Detail
  content/        projects.ts, docs/*.md, folders.ts
  lib/            supabase.ts, videoMap.ts, device.ts
public/media/     encoded videos + posters
scripts/          encode-media.sh
```

---

## 9. Build phases

1. **Setup + assets** — scaffold, encode media (audio stripped), logo SVG, design tokens.
2. **Intro → Home → zoom transition** (desktop), seamless loops.
3. **Studio scene** — hotspot mapping, notebook glow, lamp toggle, monitor zoom in/out.
4. **Desktop OS** — window manager, folders, doc viewer, browser app, placeholder content.
5. **Notebook form + Supabase + `/admin`.**
6. **Tablet + mobile adaptations** — blurred-backdrop layout, tool tray, Phone OS.
7. **Polish + deploy** — performance, accessibility, SEO `/work` page, meta/OG image.

## Open questions

- ~~Logo~~ — decided: sans-serif, matching the building sign (`public/brand/logo.svg`).
  sans-serif "d>". Which direction do you want — keep the serif, redesign to match the sign,
  or something new? (Because the camera is static, the real logo can also be overlaid onto
  the sign plate in the video so they always match.)
- **Supabase** project URL + anon key (or a different backend preference).
- **Hosting:** Vercel or Netlify?
- **Admin email** for the login allowlist (stored as config, not committed publicly if
  you'd rather not).
