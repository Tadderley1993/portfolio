# Concept sites

Five fictional, professionally branded websites for the portfolio's **Concept Work** folder.
Planned and built by the `concept-site-designer` agent (`.claude/agents/concept-site-designer.md`).

- Sites live in `public/concepts/<slug>/` and are served at `/concepts/<slug>/`.
- Thumbnails live in `public/work/<slug>/thumb.jpg`.
- Each is registered in `src/content/projects.ts` with `kind: 'concept'`, `site` and `thumb`; the
  desktop browser loads the site live.

## Uniqueness matrix

No two rows may share a palette family, type pairing, layout archetype, signature interaction or mood.

| # | Slug | Industry | Palette family | Type pairing | Layout archetype | Signature interaction | Mood | Status |
|---|------|----------|----------------|--------------|------------------|-----------------------|------|--------|
| 1 | `saltbloom` | Independent restaurant (coastal small plates + natural wine) | Dark warm: aubergine-black, candle cream, ember orange | Libre Caslon Text + Libre Franklin | Single-column "printed menu card" editorial with full-bleed chapter breaks | **Set the table**: tapping dishes places SVG plates on a top-down table that feeds the reservation | Candlelit, intimate, sensual | Planned |
| 2 | `keel-and-kerf` | Residential renovation (design-build kitchens, baths, additions) | Bone paper, blueprint navy, safety yellow | Archivo (Expanded/Black) + Azeret Mono | Technical-drawing grid: annotated dimension lines, spec-sheet tables, sticky side panel | **Ballpark builder**: room/size/finish estimator whose price range animates along a tape-measure ruler | Precise, straight-talking, dependable | Planned |
| 3 | `cruxwell` | Bouldering gym (day passes, intro sessions, memberships) | Chalk white + multi-colour "hold" pop (orange, blue, green, pink) on black ink | Sofia Sans Extra Condensed + Atkinson Hyperlegible | Anti-grid sticker collage: tilted cards, oversized marquee type, overlapping blocks | **The Wall**: an SVG wall of holds; tap a colour circuit to light up that route and filter this week's problems | Loud, playful, communal | Planned |
| 4 | `paperkite-vet` | Independent veterinary clinic (general practice + urgent same-day) | Pastel mint, deep pine, apricot, sky | Young Serif + Alegreya Sans | Soft rounded bento dashboard: "today at the clinic" tiles, one-question-at-a-time flows | **Is this urgent?**: a calm step-by-step triage helper that routes to call / same-day / routine booking while a paper kite climbs its string | Gentle, reassuring, kind | Planned |
| 5 | `ninebark` | Boutique countryside inn (8 rooms, direct booking) | Earth neutrals: fog stone, charcoal moss, bark rust, lichen | Newsreader + Schibsted Grotesk | Horizontal-scroll cinematic panels (vertical scroll drives a sideways journey), vertical stack on mobile | **Season dial**: a rotary dial that re-colours an SVG landscape and swaps rates, room notes and itineraries for each season | Slow, hushed, restorative | Planned |

Axis check (all five differ on every axis): palettes are dark-warm / bone+navy+yellow / chalk+multicolour /
pastel mint+apricot / earthy neutrals; no font family is reused anywhere; layouts are single column /
technical grid / anti-grid collage / rounded bento / horizontal panels; interactions are build-a-thing
(table) / estimate (ruler) / filter-by-map (wall) / guided flow (triage) / global mode switch (dial);
moods run intimate → precise → loud → gentle → hushed. Only Ninebark uses horizontal scroll and only
Ninebark re-themes the whole page, so the others must not borrow either device.

**Recommended build order:** `saltbloom` → `keel-and-kerf` → `paperkite-vet` → `cruxwell` → `ninebark`.
Saltbloom has the strongest instant-read hero (best first thumbnail) and a self-contained interaction;
Keel & Kerf is the most commercially relevant lead-gen demo for the studio's likely clients; Paperkite
and Cruxwell are mid-complexity and alternate light/calm with loud; Ninebark goes last because the
horizontal-scroll + season system is the most complex and leans hardest on owner-generated photos.

## Briefs

<!-- Copy this template once per concept.

### <n>. <Brand name> (`<slug>`)
- **Industry:**
- **Why this industry benefits from a great site:** (2–3 sentences)
- **Audience:**
- **Site goal / primary action:** (book, buy, enquire, visit…)
- **Brand personality:** (3–4 words + one line)
- **Palette:** bg `#…` · fg `#…` · accent `#…` · support `#…`
- **Type:** display … / text … (Google Fonts)
- **Layout archetype:** (e.g. editorial split-screen, bento grid, horizontal scroll gallery…)
- **Signature interaction:**
- **Pages / sections:**
- **Imagery approach:** (and any IMAGE SLOTs for the owner to generate)
- **Inspiration notes:** (patterns, not copies — with gallery links)
- **Research sources:**
-->

## Avoid the "generated" look (applies to every concept)

- No pill buttons or pill badges. Radii stay small (0–4px; Paperkite, the softest brand, tops out at 12px on tiles).
- No floating rounded navbars, soft blurred drop shadows, or status-dot badges ("● Open now").
- No uppercase, wide-tracked eyebrow labels above every heading; use them only where the print reference calls for it (menu folios, spec sheets).
- No accent-coloured last word in a headline, and no "→" on buttons.
- One primary button per view; the secondary action is a plain text link.
- Fonts avoided as overused: Inter, Manrope, Figtree, Instrument Serif, Bricolage Grotesque, Cormorant, Hanken Grotesk, Space Grotesk.

## Design direction research (shared notes)

Collected as *patterns*, never as a specific site to copy. Note: awwwards.com, motionsites.ai,
godly.website, webflow.com and reallygooddesigns.com were not reachable from the planning session's
network, so gallery observations below come from trend round-ups that cite those galleries plus
general familiarity with gallery conventions. Re-check the galleries directly before building if the
network allows it.

- **Type as the hero.** Oversized, art-directed headlines carry the first viewport instead of a stock
  photo; variable-font axes (width, weight, optical size) animate on scroll or hover. Works because it
  is cheap to load and instantly ownable. → Keel & Kerf (Archivo width axis), Cruxwell (Bricolage).
- **Scroll storytelling / pinned sections.** A section pins while its content steps through states;
  good for "how it works" or a journey. Needs clear progress cues and a non-pinned fallback for
  reduced motion. → Ninebark (horizontal panels), Keel & Kerf (pinned process).
- **Anti-grid and collage.** Scattered, rotated, overlapping elements feel human and energetic when
  anchored by a strict underlying baseline grid and generous whitespace. → Cruxwell only.
- **Horizontal scroll.** Strong for sequential, picture-led content; must show a visible cue, keep
  readable text out of the sideways track, and offer arrow buttons. → Ninebark only.
- **Bento grids.** Rounded tiles of mixed size make dense practical info (hours, wait times, services)
  scannable; works on mobile by collapsing to one column in priority order. → Paperkite only.
- **Editorial/print references.** Menu cards, spec sheets, field guides: borrowing a print artefact's
  rules (hairlines, folios, numbered items) gives a site a concept beyond "website". → Saltbloom
  (menu card), Keel & Kerf (drawing set), Ninebark (field journal captions).
- **Micro-interactions with a job.** Hover/press states, magnetic buttons, marquees and cursor
  followers only where they reinforce the brand idea; one signature interaction per site that also
  moves the visitor toward the primary action.
- **Grain, noise, texture.** SVG `feTurbulence` grain, paper fibres or halftones replace photos and
  keep the page from feeling flat at almost no byte cost.
- **Performance as a design constraint.** Trend pieces stress that motion and 3D must not cost speed;
  our budget (1.5 MB, 300 KB JS+CSS, no WebGL) forces SVG/CSS solutions.

Sources: [Lovable — website design trends 2026](https://lovable.dev/guides/website-design-trends-2026) ·
[Figma — web design trends](https://www.figma.com/resource-library/web-design-trends/) ·
[Webflow — 8 web design trends 2026](https://webflow.com/blog/web-design-trends-2026) ·
[Really Good Designs — trends 2026 (Awwwards examples)](https://reallygooddesigns.com/web-design-trends-2026/) ·
[Awwwards — horizontal scroll inspiration](https://www.awwwards.com/inspiration/horizontal-scroll-evmos) ·
[One Page Love — marquees](https://onepagelove.com/marquees) ·
[Clutch — trends for high-converting websites](https://clutch.co/resources/web-design-trends-high-converting-websites)

### 1. Saltbloom (`saltbloom`)
- **Industry:** Independent neighbourhood restaurant: coastal small plates, natural wine, 42 covers.
- **Why this industry benefits from a great site:** Around 85% of diners look at a menu online before
  choosing somewhere new, and most go straight to the restaurant's own site to book. Typical indie
  sites fail on exactly those two jobs: PDF menus that are unreadable on a phone, no photos, stale
  "website from 2014" feel, and a reservation link buried in the footer.
- **Audience:** 28–55 locals and weekend visitors; date nights, small groups of friends, wine people;
  mostly browsing on phones in the afternoon to decide on tonight.
- **Site goal / primary action:** Reserve a table (secondary: read the menu, buy a gift card).
- **Brand personality:** Warm, salty, unhurried, a little flirtatious. "The last table on the harbour
  that still feels like someone's kitchen."
- **Palette:** bg `#1d1418` (aubergine-black) · fg `#f3e7d7` (candle cream) · accent `#ef7a43` (ember)
  · support `#b9a7c9` (dusk lilac). All ≥ 6.4:1 on bg.
- **Type:** display Libre Caslon Text (incl. italic for dish names) / text Libre Franklin.
- **Layout archetype:** Single centred column styled like a printed menu card (hairline rules,
  numbered courses, folio-style page markers), broken by full-bleed "chapter" bands for the room,
  the wine and the reservation. Mobile is native to this format.
- **Signature interaction:** **Set the table.** Each dish on the menu has a "+ to the table" control;
  tapping it drops an SVG plate (drawn per dish category: crudo, bread, plancha, sweets) onto a
  top-down illustrated table that stays docked at the side (bottom sheet on mobile). The table
  suggests "about right for 2" / "add one for 3", and "Book this table" pre-fills party size into the
  reservation form. Reduced motion: plates appear without the drop.
- **Pages / sections:** Hero (wordmark + "Tonight from 5:30" status line + Reserve) · This week's menu
  (Raw / Bread & butter / From the plancha / Sweet, with prices and allergens) · The wine (by-the-glass
  list as a short scroll of bottle-label cards) · The room (story, chef/owner note, IMAGE SLOTs) ·
  Private dining & groups · Reserve (date, time, party size, notes → friendly "this is a concept"
  confirmation) · Hours, address (fictional "4 Ropewalk Lane, Port Calder"), gift cards · Footer note.
- **Imagery approach:** Type-led with hand-drawn-feel SVG plates, grain overlay, candlelight radial
  gradients. IMAGE SLOTs: `dish-crudo.jpg` (4:5, overhead crudo on dark stoneware, low warm light);
  `room.jpg` (16:9, candlelit dining room at dusk, harbour window, no people's faces).
- **Inspiration notes:** Print-menu typography (numbered items, hairlines, italic dish names);
  dark-mode editorial sites in galleries that use one hot accent sparingly; docked "cart" patterns
  from e-commerce repurposed as a playful table.
- **Research sources:** [TouchBistro American Diner Report 2024](https://www.touchbistro.com/wp-content/uploads/2022/09/American_Diner_Report_2024_Final.pdf) ·
  [Toast: reservations and wait times data](https://pos.toasttab.com/blog/data/restaurant-wait-times-and-reservations-data) ·
  [Owner.com: 6 ways guests judge your restaurant's website](https://www.owner.com/blog/restaurant-website-design)

### 2. Keel & Kerf (`keel-and-kerf`)
- **Industry:** Residential design-build renovation contractor (kitchens, bathrooms, small additions),
  crew of ~12.
- **Why this industry benefits from a great site:** Homeowners research contractors online for hours
  before calling, and rank reviews, demonstrated expertise and references just behind price. Most
  contractor sites are template-y, hide any sense of cost, and end in a generic contact form, so the
  firm that shows process, proof and a ballpark number wins the lead.
- **Audience:** Homeowners 35–65 planning a $25k–$150k project; often a couple comparing 3 firms.
- **Site goal / primary action:** Request a site visit / quote (with a ballpark already in hand).
- **Brand personality:** Precise, straight-talking, dependable, quietly proud. "Measure twice, tell you
  the truth once."
- **Palette:** bg `#f3f0e8` (bone paper) · fg `#14233b` (blueprint navy) · accent `#ffc61a` (safety
  yellow; used as fill behind navy text, never as text on bone) · support `#2d5694` (drafting blue).
- **Type:** display Archivo (Expanded / Black via the width axis) / text Archivo regular; mono
  Azeret Mono for dimensions, specs and labels. (Archivo counts as one family.)
- **Layout archetype:** Technical-drawing grid: visible 12-col hairline grid, dimension lines and
  callout leaders annotating headings, spec-sheet tables, project "sheets" numbered like a drawing set
  (A-101…), and a sticky side panel holding the estimator on desktop.
- **Signature interaction:** **Ballpark builder.** Pick room (kitchen / bath / addition), size (S/M/L or
  sq ft slider) and finish tier (Solid / Considered / Heirloom); a tape-measure ruler slides to show a
  low–high range with a short "what drives this" breakdown, then "Book a site visit with this
  estimate" pre-fills the quote form. Reduced motion: ruler jumps without the slide.
- **Pages / sections:** Hero (expanded headline with dimension-line annotation, "Get a ballpark" +
  "See the work") · Services (kitchens, baths, additions, whole-home refresh) · Selected projects
  (3 drawing-set sheets with before/after drag comparison, scope, duration, budget band) · How we work
  (5 steps: visit → design → fixed quote → build → walkthrough, pinned) · Ballpark builder · Reviews
  and credentials (licensed, insured, warranty; fictional licence no.) · FAQ (permits, timelines, living
  at home during works) · Quote form (concept state) · Service area · Footer note.
- **Imagery approach:** SVG line drawings of rooms (elevations/plans) that "draw on" as they enter;
  blueprint texture via CSS gradients. IMAGE SLOTs: `kitchen-before.jpg` + `kitchen-after.jpg` (3:2,
  same camera angle, dated kitchen → warm oak and white kitchen); `crew.jpg` (3:2, two carpenters
  measuring a doorway, faces turned away).
- **Inspiration notes:** Architecture-drawing conventions (title blocks, sheet numbers, leaders) as UI;
  variable-width headline type from gallery sites; sticky calculator panels from fintech/product sites.
- **Research sources:** [Modernize Homeowner Insights 2024: research and planning](https://modernize.com/homeowner-insights/modernize-homeowner-insights-2024-research-and-planning) ·
  [Modernize study via Solar Power World: contractors and web recommendations](https://www.solarpowerworldonline.com/2018/11/modernize-study-contractors-web-recommendations/) ·
  [JLC: homeowners rely heavily on online research](https://www.jlconline.com/business/modernize-homeowners-need-help-budgeting-and-rely-heavily-on-online-research_o/)

### 3. Cruxwell (`cruxwell`)
- **Industry:** Independent bouldering gym with café corner, kids' club and yoga room.
- **Why this industry benefits from a great site:** Boutique fitness lives or dies on first visits, and
  roughly 1 in 5 people say an unclear booking process is enough to stop them trying a studio. Common
  failures: schedule buried two or three clicks deep or in a PDF, hidden prices, forced sign-up before
  booking, and heavy hero video pushing the "book" button off a phone screen.
- **Audience:** 18–40 first-timers brought by a friend, regulars checking new sets, parents booking
  kids' sessions; heavily mobile.
- **Site goal / primary action:** Book a first visit / intro session (secondary: memberships, new-set
  calendar).
- **Brand personality:** Loud, playful, encouraging, chalky. "Fall off, laugh, go again."
- **Palette:** bg `#f5f4ee` (chalk) · fg `#121212` (ink) · accents as hold colours, always with ink text
  on them: `#ff5a1f` orange · `#2350e6` blue (white text) · `#1fc77e` green · `#ff4fa3` pink.
- **Type:** display Sofia Sans Extra Condensed (heavy, tight, condensed optical size) / text Atkinson
  Hyperlegible.
- **Layout archetype:** Anti-grid sticker collage: tilted cards, overlapping blocks, tape and chalk
  marks, oversized marquee type between sections, anchored by a strict baseline grid so it still reads.
- **Signature interaction:** **The Wall.** An SVG climbing wall with ~40 holds in five colour circuits.
  Tapping a circuit (or a hold) lights up that route with a chalky path, dims the others and filters
  the "this week's problems" list below (grade, setter nickname, wall section, days left before reset).
  Keyboard: circuits are buttons; reduced motion: no path draw, instant highlight.
- **Pages / sections:** Hero (huge type + "First time? Book an intro" + today's hours and how busy it is)
  · The Wall · First visit (what to wear, shoe hire, 45-min intro, price) · Timetable (today/week tabs,
  one-tap book, no account wall) · Prices & memberships (day pass, 10-punch, monthly; student rate) ·
  Kids' club & yoga · Café · Community (route-setting nights, comps) · Find us · Book form (concept
  state) · Footer note.
- **Imagery approach:** Graphic: SVG holds, chalk dust (noise + blur), hand-drawn arrows and stickers.
  IMAGE SLOT: `community.jpg` (3:2, climbers cheering someone topping out, motion blur, faces not
  in focus).
- **Inspiration notes:** Anti-grid collage and marquee type from gallery sites; sports-poster
  typography; filter-by-map interactions from wayfinding and transit sites.
- **Research sources:** [bsport: 5 biggest mistakes boutique studio owners make](https://pro.bsport.io/blog/the-5-biggest-mistakes-boutique-studio-owners-make-and-how-to-avoid-them) ·
  [Offering Tree: where wellness studios lose people](https://www.offeringtree.com/?p=38567) ·
  [Gymdesk: gym and fitness website examples](https://gymdesk.com/ja/blog/9-gym-website-ideas-what-makes-a-good-gym-website)

### 4. Paperkite Veterinary Clinic (`paperkite-vet`)
- **Industry:** Independent small-animal veterinary practice (dogs, cats, rabbits, small pets) with
  same-day urgent slots.
- **Why this industry benefits from a great site:** Recent pet-owner surveys find over a third have
  trouble booking, close to 3 in 10 have chosen against a clinic because of its website, and a
  growing share prefer to book online. Most vet sites are generic templates with a phone number, no
  sense of the team, and nothing for the anxious "is this an emergency?" moment.
- **Audience:** Pet owners 25–60, often stressed, often on a phone; new-puppy and new-kitten families;
  people new to the area choosing a vet.
- **Site goal / primary action:** Book an appointment (or, for urgent cases, call now).
- **Brand personality:** Gentle, reassuring, competent, a little whimsical. "Calm hands, clear answers."
- **Palette:** bg `#eef5f0` (mint mist) · fg `#1e3b34` (deep pine) · accent `#ff9466` (apricot, pine
  text on it) · support `#cfe3f4` (sky). Links `#2f6b5c`.
- **Type:** display Young Serif / text Alegreya Sans.
- **Layout archetype:** Soft rounded bento dashboard: "today at Paperkite" tiles (open now, next free
  slot, emergency line, parking), service tiles, team tiles; flows are one question per screen.
- **Signature interaction:** **Is this urgent?** A calm, step-by-step helper (species → what's
  happening → a few yes/no checks) that ends in one of three clear outcomes: call now (with number),
  same-day slot, or routine booking (pre-fills the booking form). A paper kite illustration climbs its
  string with each step. Prominent disclaimer that it is guidance, not diagnosis. Reduced motion: kite
  repositions without flight.
- **Pages / sections:** Hero (headline + Book + "Is this urgent?" + live-style "next free slot" tile) ·
  Today at the clinic (bento) · Services (wellness & vaccines, dental, surgery, puppy & kitten plans,
  senior care, urgent same-day) · Triage helper · Meet the team (illustrated portrait tiles or IMAGE
  SLOTs) · Fear-free visits (what to expect, cat-only waiting room) · Plans & prices · New clients
  (forms, first-visit checklist) · Booking form (concept state) · Location & hours · Footer note.
- **Imagery approach:** Flat illustration in palette: kite, paw-print confetti, soft shapes; rounded
  cards with gentle shadows. IMAGE SLOTs: `team-1.jpg`…`team-3.jpg` (1:1, vets with a pet in a bright
  exam room, soft natural light); `waiting-room.jpg` (16:9, calm waiting room with plants).
- **Inspiration notes:** Bento dashboards from product sites, applied to clinic logistics; conversational
  one-question forms; friendly serif display seen in gallery wellness brands.
- **Research sources:** [Vetstoria: Veterinary Industry Trends 2026](https://www.vetstoria.com/?p=101140) ·
  [PetDesk 2025 pet-parent technology data](https://finanzen.net/nachricht/aktien/petdesk-data-how-pet-parents-view-and-value-technology-in-veterinary-care-in-2025-14321768) ·
  [Vet Times: digital expectations and booking friction](https://www.vettimes.com/jobs/career_advice/new-data-on-digital-expectations-and-booking-friction-for-success)

### 5. Ninebark (`ninebark`)
- **Industry:** Boutique countryside inn: 8 rooms, a small kitchen serving breakfast and Friday supper,
  walking trails from the door.
- **Why this industry benefits from a great site:** OTAs take roughly 15–30% commission and their
  bookings cancel more often, so every direct booking is worth significantly more to a small inn.
  Guests often visit the hotel's own site and then book on an OTA because the site is slow, generic or
  hides rates; a beautiful site with clear prices and direct-booking perks keeps that booking.
- **Audience:** Couples 30–65 on weekend escapes, walkers, small celebration groups; researching on
  laptop and phone weeks ahead.
- **Site goal / primary action:** Check availability and book direct (secondary: gift vouchers,
  whole-house enquiries).
- **Brand personality:** Slow, hushed, rooted, quietly luxurious. "Somewhere the weather is the
  itinerary."
- **Palette:** bg `#dedad0` (fog stone) · fg `#26281f` (charcoal moss) · accent `#8a4426` (bark rust,
  5.1:1) · support `#5f6b3a` (lichen; large text and decoration only, 4.1:1).
- **Type:** display Newsreader (light, large, generous tracking for small caps) / text Schibsted Grotesk.
- **Layout archetype:** Horizontal-scroll cinematic panels: vertical scroll drives a sideways journey
  through the house (arrival → rooms → table → trails), with field-journal captions; stacks
  vertically on mobile and under reduced motion. Readable text stays out of the moving track.
- **Signature interaction:** **Season dial.** A rotary dial (drag, click or arrow keys) moves through
  spring / summer / autumn / winter: an SVG landscape re-colours and changes (blossom, long grass,
  bracken, frost), and rates, room notes ("fire laid at 4pm") and a suggested two-day itinerary swap to
  match. The dial is the only page-wide theme switch across all five concepts.
- **Pages / sections:** Hero (SVG landscape + wordmark + availability bar) · The house (story) · Rooms
  (8 rooms, horizontal panels with rate, sleeps, view, and "book direct" perk) · Season dial +
  itinerary · The table (breakfast, Friday supper) · Book direct perks (best rate, late checkout,
  welcome hamper) · Getting here · Gift vouchers · Availability form (concept state) · Footer note.
- **Imagery approach:** Generative SVG landscape layers per season, paper grain, botanical line
  drawings of the ninebark shrub. IMAGE SLOTs: `room-1.jpg`…`room-4.jpg` (4:5, rooms in soft window
  light, linen and timber); `landscape.jpg` (21:9, misty hills at dawn from the inn's garden).
  Compress to ~120 KB each to stay inside the 1.5 MB budget.
- **Inspiration notes:** Horizontal storytelling galleries (with arrow-button fallback), field-guide
  captions and botanical plates, slow editorial hotel sites that let whitespace do the work.
- **Research sources:** [Hospitality Net: independent hotelier's playbook for reducing OTA commission](https://www.hospitalitynet.org/news/4132193/the-independent-hoteliers-playbook-for-reducing-ota-commission) ·
  [Hospitality Net: why guests visit your site then book on an OTA](https://www.hospitalitynet.org/opinion/4135400/why-guests-visit-your-hotels-website-then-book-on-bookingcom-and-what-to-fix-this-week) ·
  [Stampede: direct vs OTA bookings for boutique hotels](https://stampede.ai/blog/direct-vs-ota-bookings-for-boutique-hotels)

### Name checks
Searched each name for an existing well-known company: "Saltbloom", "Keel & Kerf", "Cruxwell",
"Paperkite" (vet) and "Ninebark Inn/House" returned no matching businesses. Rejected "Thistle & Hound"
(too close to the real Thistle Vets in Edinburgh).
