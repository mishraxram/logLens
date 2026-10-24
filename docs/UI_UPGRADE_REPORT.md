# UI upgrade report (25 Oct 2026, branch `lu-upgrade`)

Everything below was measured on a local build (`npx wrangler dev`, port 8799) with headless Chrome, unless it says
"live". **Not deployed yet**: the live site still runs the old UI.

## What changed (one commit each)
| Commit | Change | Pattern source (docs/ui-research/) |
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
