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
