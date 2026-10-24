# UI research, Phase 1 (25 Oct 2026, 01:28-01:40 IST)

How: every site opened in real headless Chrome over CDP (the `chrome-browser` / `built-in-browser` skills are denied in
`.claude/settings.json`). Viewport screenshots at 1366x768 and 1920x1080 in `shots/`. One note per site
(`<slug>.md`: Observed / Assumed / Idea / Decision). Patterns only, nothing copied (logos, text, palettes, layouts).

## Which sites opened
| Result | Sites |
|---|---|
| Opened, 1366 screenshot reviewed (22) | stalkr, timesketch, elastic-attack-discovery (+ docs example image), sentry, axiom, betterstack, loki, wazuh, linear, vercel, stripe, resend, raycast, supabase, posthog, datadog, radix-colors, shadcn, m3-layout (redirected to Breakpoints), mobbin (home only), hacktoberfest |
| Opened, only title/headings read (7) | elastic-labs, hayabusa (+ README and output docs read as text), sigma, loghub, cloudflare-zt (redirected to /sase/), refactoringui, awwwards |
| **Unverified: khul nahi payi** (1) | wcag22: HTTP 403, Cloudflare "Verify you are human" page |
| Partly unverified | mobbin app screens (login needed); m3 breakpoint pixel values (not on first screen); sentry issue page, loki log panel, raycast command bar (not on the landing pages) |

Several marketing pages (Sentry, Loki, Raycast, Vercel, Stripe, Resend, Supabase) do not show the product UI the pack
asked about, so they gave no usable pattern. That is written in each note instead of guessed.

## LogLens baseline (before any change)
`fold.ts` (headless Chrome, local `wrangler dev`, ERP sample clicked), positions in px from the page top:
| Viewport | verdict | attack chain panel | page height | fold |
|---|---|---|---|---|
| 1366x768 | 341-516 (visible) | **651-964 (only the title is above 768)** | 4,444 | 768 |
| 1920x1080 | 341-516 | 651-964 (fits) | 4,444 | 1080 |
Screenshot: `shots/loglens-before-1366.jpg`. What eats the height: page header (kicker + h1 + 3-line intro, ~100-215 px)
and the case strip (231-277). The 360 px and dark-mode baseline runs did not show results within 10 s on the first try
(CPU busy with the site crawl): **not measured yet**, will be re-run before Phase 3.

## Top 6 patterns (input for Phase 2)
| # | Pattern | Seen at (evidence) | LogLens problem it fixes | Priority |
|---|---|---|---|---|
| 1 | **Compact case header with a mini attack-chain dot strip + high-risk badge** in one row | Elastic Attack Discovery docs example image (`shots/elastic-attack-discovery-docs-example.png`) | Chain is below the fold at 1366x768; header + intro use ~215 px | P0 |
| 2 | **Attack chain as one horizontal tactic stepper**, hit stages highlighted, others muted (vertical on phone) | same Elastic image ("Attack Chain" row) | Chain panel is 313 px tall as stacked text | P0 |
| 3 | **Status pill = colour + icon + word** (not colour alone) | Timesketch product shot ("suspicious" pill with icon); Better Stack level dot + word | Severity relies mostly on colour; WCAG "not colour alone" | P0 |
| 4 | **Entity chips** (user / IP with a type icon) inside the summary, click = filter timeline | Elastic example (host and user chips) | Actors are plain text; no quick filter | P1 |
| 5 | **List + right inspector panel** on wide screens (click a row -> raw line, flags, MITRE, AI in a side panel) | Better Stack product shot (detail panel with Overview / Explain with AI / Comments); Linear issue view (main + right column, "1 / 84" arrows) | Long page on desktop (4,444 px), details expand inline | P1 |
| 6 | **Events-over-time bar strip** above the timeline (plain SVG, status colours) | Better Stack product shot (bars above Time/Source/Level/Message table); Wazuh "Alerts level evolution" | No visual of time (LOOP-MASTER D10) | P2 |
Method note (not a pattern): Radix Colors groups 12 steps by role (backgrounds, interactive, borders, solid, accessible
text). Use that method to define our own dark-mode tokens.

## Pack claims that do NOT match this repo (UNVERIFIED, not used)
`npm run start:offline`, `@fontsource` self-hosted fonts, CSP `font-src 'self'`, "18 rules", `docs/FORENSIC_AUDIT.md`,
"100k events 1.2 s". Checked with `grep` on `package.json`, `worker/index.ts`, `src/lib/rules.ts`, README and all branches
(25 Oct 01:27). Real repo: 16 rules, Google Fonts with CSP `font-src https://fonts.gstatic.com`.

## Round 2 (25 Oct 01:36-01:52): the user's two links
- Link 1 `share.google/0X5eCDR2ekuLhojSt` -> https://indiepa.ge/marclou (Marc Lou's Indie Page, 49 links). Link 2 -> https://www.stalkr.ai/?ref=indiepage.
- Opened in headless Chrome: indiepage + **39 product sites** from it (all document HTTP 200). Contact sheets in
  `shots/marclou/` (each tile = the 1366x768 first screen). `googe.com` and `virallybot.com`: **not checked** (crawl
  still on them when this was written). Social links (X, YouTube, LinkedIn, Instagram), book and newsletter skipped.
- Stalkr: whole page walked top to bottom (9,561 px, 13 screens), contact sheets in `shots/stalkr-full/`.

### Observed patterns worth taking (no copying of text, logos, colours or layouts)
| Pattern | Where seen | Used in LogLens |
|---|---|---|
| Numbered 01-04 steps on one thin accent rail | Stalkr "Tell Stalkr what to watch -> We pull in -> AI filters the noise -> Act when it matters"; Datarot/DataCity "How to get started 1-2-3"; LogoFast first-visit coach "1. Pick 2. Choose 3. Export" | **Done**: empty state = 01 Open the log, 02 Rules flag, 03 Open-weight AI explains, 04 Seal and verify |
| Two-tone headline (key line dark, second line muted) | Stalkr ("Know what people say. / See what needs action."), Supabase | **Done**: page h1 |
| AI category pills with an icon + action chips | Stalkr "AI filters the noise" (Testimonial / Bug report / Misinformation / Complaint) | partly: status icon + word on verdict, flags, changes (**done**); category chips for findings = next |
| Matched keyword highlighted inside the row | Stalkr mentions ("Stalkr" highlighted in each post) | next (P1): highlight the field that fired a rule in the raw log line |
| Filter chips row in the app (Date, Source, Category, Status) | Stalkr "Inside Stalkr" screenshot | next (P1): All / High / Medium / Changes chips on the timeline |
| Card = title + small status pill + one line + mini chart | indiepage (revenue pill + sparkline per product) | next (P2): /cases dashboard cards |
| Notification-stack cards (icon, title, time on the right) | PoopUp, Zenvoice | already close: change register |
| Dark-mode toggle in the header | Habits Garden, Radix, shadcn | not done (P1; needs a dark token set, contrast re-check) |
| KPI labels small, numbers big, in one row | DataFast interactive demo | **Done**: KPI row inside the case summary |
Rejected: game/3D themes (DataEmpire, DataCity, Macrodata, Datarot, DecisionGame, Gamify List, HyroX), big marketing
heroes with gradients, testimonial avatars and star ratings (we have no real users to show).

## Result after slice 1 (commit e1bfc71)
`scripts/check-fold.ts` (headless Chrome, local `wrangler dev`, ERP sample clicked):
| Viewport | verdict | attack chain | before |
|---|---|---|---|
| 1366x768 | 198-339 | **458-712 (fits, fold 768)** | chain 651-964 |
| 1920x1080 | 198-339 | 458-712 | same as before, fits |
| 360x800 | 1956-2140 | 2321-2819 | page 8,702 px tall; no side scroll (scrollWidth 360) |
Screenshots: `shots/loglens-after1-1366.jpg`, `shots/loglens-after1-1920.jpg`.
Checks: `npm run check` exit 0; `node scripts/e2e.ts` PASS at 360, 1366 and 1920 px, 0 console errors.
Not tested: dark mode (not built yet), Lighthouse, keyboard tab-through, real phone / iOS Safari, screen reader.

## Slice 2: blinking-eye logo (25 Oct 01:55)
- App bar: 38 px dark-variant mark; empty state: 96 px mark; new favicon (old one moved to `_trash/favicon-old.svg`).
- Files from the pack (`brand/`) were read first: no script, no links, CSS animation only. Served from `public/brand/`.
- Blink test (headless Chrome, 40 clips of the logo over 5 s): **17 distinct frames** = it animates.
  With `prefers-reduced-motion: reduce` the SVG's own media query did NOT stop it inside `<img>` (16 frames), so a
  `<picture>` swaps in a still copy (`*-still.svg`): **1 distinct frame** = stopped.
- `npm run check` exit 0; e2e PASS at 360, 1366, 1920 (0 console errors). Screenshot: `shots/loglens-after2-empty-1366.jpg`.
- Round 2 crawl end: `googe.com` = **Unverified: khul nahi payi** (net::ERR_CONNECTION_TIMED_OUT); `virallybot.com` opened (title only, not reviewed).
