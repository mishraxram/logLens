# UI upgrade report (25 Oct 2026, branch `lu-upgrade`)

The third-party site screenshots were removed from the repo on 25 Oct (they are not ours to publish).
Everything below was measured on a local build (`npx wrangler dev`, port 8799) with headless Chrome, unless it says
"live". **Not deployed yet**: the live site still runs the old UI.

## What changed (one commit each)
| Commit | Change | Pattern source (UI research notes and site screenshots: git history before the 25 Oct 2026 cleanup (commit 636c098)) |
|---|---|---|
| e1bfc71 | Compact case summary (verdict + risk meter + KPI row + mini MITRE stage strip), compact chain stepper with actor chips, status = colour + icon + word, page intro hides once a case opens, 01-04 empty-state steps | Elastic Attack Discovery (chain dot strip, tactic row, entity chips), Timesketch (status pill with icon), Stalkr (numbered steps, two-tone headline), DataFast (KPI row) |
| 9d3d445 | Blinking-eye magnifier logo (app bar 38 px, empty state 96 px), still copy under reduced motion, new favicon | pack `brand/` files (read before use: no script, no links) |
| 6bff19e | Blocked (DENIED) attempt = medium, not an Impact stage | LOOP-MASTER D5 |
| 616cba5 | Phone: findings first, intake folds behind "Change case", bottom tab bar Story / Changes / Timeline / Evidence; timeline filter chips All / High / Flagged / Changes with counts | LOOP-MASTER 9.3, Stalkr filter chips |
| e39d990 | Real-log parser formats + "Real SSH server log" sample (Loghub, cited) | Loghub |
| 0735e66 | Dark mode (system setting), role-based tokens | Radix Colors method |
| this commit | Hidden verify-file input no longer takes a Tab stop | keyboard test below |

## Above the fold (`node scripts/check-fold.ts <url> <w> <h> <out>`, ERP sample)
| Viewport | Verdict | Attack chain | Before |
|---|---|---|---|
| 1366x768 light | 198-339 | **458-712, fits (fold 768)** | 651-964, only the title visible |
| 1366x768 dark | same | 458-712 | - |
| 1920x1080 | 198-339 | 458-712 | fitted before too |
| 360x800 | **266-450** (first screen) | 631-1129 | verdict at 1,956 |
`scrollWidth == viewport` at 360, 390, 1366, 1920 (no sideways scroll). The real Loghub sample has 2 chains, so its
chain panel (534-1006) does not fit 1366x768; the demo sample does.

## Checks (all from this session, last run after the final change)
- `npm run check`: exit 0 (build, typecheck, worker bundle, 5 check scripts).
- `node scripts/e2e.ts http://localhost:8799/ 360 | 1366 | 1920`: PASS, 0 console errors. New steps: timeline filter
  "High" / "All", phone intake fold, "Change case", "Evidence" tab jump.
- `node tests/eval.ts http://localhost:8799/api/analyze` (02:10, Llama only, no Gemini key locally): **16/17**; case 2
  fails as before ("unsure", expected "normal"; open decision).
- `node scripts/check-loghub.ts tests/loghub/*.log`: see README "Tested on real logs".

## Lighthouse 12.2.0 (npx, simulated mobile unless "desktop")
| Run | Perf | A11y | Best pr. | SEO | FCP / LCP |
|---|---|---|---|---|---|
| local, new UI, mobile, run 1 (eval running in parallel) | 83 | 100 | 100 | 100 | 3.5 s / 3.5 s |
| local, new UI, mobile, run 2 (eval running in parallel) | 83 | 100 | 100 | 100 | 3.5 s / 3.5 s |
| local, new UI, mobile, run 3 (alone) | 99 | 100 | 100 | 100 | 1.5 s / 1.5 s |
| local, new UI, desktop | 100 | 100 | 100 | 100 | - |
| **live, old UI** (production, before) | 98 | 100 | 100 | 100 | 2.0 s / 2.0 s |
Local numbers swing with machine load; the live new-UI number is **not measured** (not deployed).

## Contrast (computed with the WCAG formula from the hex tokens)
Light: muted on sheet 5.63, muted on high-risk verdict 5.12, flag on sheet 6.34. Dark: ink 13.54, muted 6.47, flag 6.52,
match 7.48, tag 7.76 on the sheet; dark text on red chips 7.27 (white would be 2.54, so not used). All >= 4.5:1.

## Keyboard and motion
- Tab x 22 from the top at 1366: every stop shows a focus ring (app bar links, investigator, 4 samples, log box, buttons,
  audit-trail summary, MITRE chips). One invisible stop (hidden verify-file input) found and removed.
- Logo: 17 distinct frames in 5 s (animates); with `prefers-reduced-motion: reduce` 1 frame (still).

## NOT tested (honest)
Real phone, iOS Safari, Firefox, a screen reader (NVDA / TalkBack), Lighthouse on the live new UI, dark mode on
`/cases` beyond one screenshot, Hindi labels at 360 px after these changes, slow real 3G.

## UI/UX master loop (25 Oct 2026, 09:41-10:20, branch `lu-upgrade`)
Method: `audit.ts` (headless Chrome) at 360, 390, 768, 1024, 1280, 1440 px, light and dark, Desk (ERP sample) and Cases:
overflow, text under 12 px, targets under 24 px, verdict/chain position, plus screenshots and full-page walks.
Sources read for this loop: Carbon status-indicator pattern (carbondesignsystem.com/patterns/status-indicator-pattern,
"relying solely on color to convey status is insufficient"), WCAG 2.2 SC 2.5.8 Target Size Minimum (w3.org, 24x24 CSS px,
inline exception).
| Batch | Commit | Problem found (priority) | Fix |
|---|---|---|---|
| 1 | 28d6ee0 | P1: at 1024 px the 4 chain stages squeezed into narrow columns; MITRE chips 19-20 px tall | container query (stages go left to right only when the panel is >= 680 px wide); chips 24 px; step number 12 px. Small targets 37 -> 8 |
| 2 | 9f41bad | P1: timeline account name ran into the role column; the same off-hours / session reasons repeated on every card | wider account column, timestamp on one line, values wrap in their own cell; change cards show 2 reasons + "N more"; rows keep high flags and fold extra medium flags |
| 3 | e58f9d5 | P1: cases statuses colour-only; 200-row audit table slow (live TBT 400 ms) | icon + word + colour; note that a valid ledger is not proof a file is unchanged; newest 50 rows first + "Show all" (local TBT 0 ms) |
| 4 | ebf1f70 | **P0: after a TAMPERED check the progress strip still showed a green "✓ Verified"** | strip shows the latest result: "▲ Tampered" in red; e2e step guards it |
| 5 | 4d27692 | P1: the previous case's AI status line stayed after a new log; P2: "Failed to fetch" wording; unsupported message listed 3 formats | cleared on a new log; plain-words message; 4 formats |
Measured after batch 5 (local): no overflow at any width or theme; Desk height 360 px 8,259 -> 7,959, 1024 px 4,774 -> 4,674;
chain at 1366x768 458-716 (fold 768); Hindi AI answer at 360 px renders (301 Devanagari characters, no overflow).
Checks: `npm run check` exit 0; e2e 360 / 1366 / 1920 PASS (one 360 run failed once on net::ERR_CONNECTION_CLOSED and
passed on re-run; a third back-to-back run hit our own 429 rate limit).
Remaining (not fixed): decorative status glyphs are under 12 px (aria-hidden, next to text); /cases CLS 0.116 in 1 of 2
local Lighthouse runs (space reserved for cards shrinks after load); local Lighthouse /cases perf 76-77 (local server,
FCP 3.7 s; live number needs a deploy); no real phone, iOS Safari, Firefox or screen-reader test.

### After the loop (25 Oct, 13:00-13:30)
- Live check of 14e2f744 found a regression: home mobile Lighthouse 97 -> 73 (FCP 4.4 s) caused by the parser-blocking
  `/theme.js`. Fixed in 4a96c2a (script inline, allowed by its SHA-256 in the CSP; `scripts/check-csp.ts` in `npm run check`).
  Live after deploy (35ee976e): home mobile 89 and 98, desktop 91; accessibility / best practices / SEO 100.
- /cases CLS (live 0.255): reserved room kept after load (52df1bc). Local Lighthouse 0.031 (3 runs). On the preview,
  Lighthouse still reports 0.206 while Chrome's PerformanceObserver (4x CPU, slow network, 412x823) measures 0.031 there too;
  the gap is **not explained yet**. The remaining measured shift is the web-font swap of the page header.
