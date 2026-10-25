# STATE

> 25 Oct 2026 cleanup: PLAN-v2, RESEARCH, CHECK_KIT, UPGRADE_LOG, AUDIT, the Avinya brief PDFs, old screenshots and UI research notes were removed from the repo. They are in the git history before the 25 Oct 2026 cleanup (commit 636c098). Current state: docs/MASTER_LOG.md.

## v2 (branch loglens-v2) - updated 2026-10-16 01:10 IST
Event: अvinya '26 Hackathon 4.0. **Round 1 idea submission due 18 Oct 12:00 IST.** Judging 23 Oct 09:30. Freeze 20 Oct 23:59.
v2 URL: https://loglens-v2.loglens.workers.dev (Worker `loglens-v2`). v1 untouched (tag pre-v2-baseline).
Plan: docs/PLAN-v2.md. Research: docs/RESEARCH.md. Decisions: docs/DECISIONS.md.
- DONE F1 Workers port (static assets + /api, same API code as v1). Eval local 15/16, 16/16, 16/16 (case 9 Hindi >8s once, same flake as v1).
- DONE F2 perf: inline CSS + non-blocking fonts. Lighthouse live mobile 100/100/100/100 (2 of 3 runs; run 1 hit a stale HTML -> 404 CSS right after deploy: 97/96/96/100).
- DONE F6 part 1: rate limit (local counter 20/min/IP + CF binding), 413 over 256 KB, 415 non-JSON. Live 429 verified on a one-connection burst. Best effort only.
- WAITING user: `npx wrangler secret put GEMINI_API_KEY` for loglens-v2 (live AI says "AI not configured" until then).
- TODO F6 part 2: lint + typecheck. Next: F3 signed receipt (17 Oct), Round 1 submission.

# v1 STATE

T+0 (start): 2026-10-15 12:09 IST. User target: ready in 4 hours (16:09).
Concept: ABCS-02 AI-Assisted Digital Forensics ("LogLens"). See docs/PLAN.md.
Live: https://loglens-solarflares.pages.dev (Cloudflare Pages project `loglens-solarflares`, GEMINI_API_KEY secret set)
Repo: https://github.com/mishraxram/chakravyuh-solar-flares

## Gates
| Gate | Time | Deadline | Status |
|---|---|---|---|
| A live hello-world | T+0:40 | 12:50 | DONE 12:13 |
| B full demo path | T+2:20 | 14:30 | DONE 12:27 (headless Chrome e2e on live: timeline, Hindi AI, MATCH->TAMPERED, report) |
| C feature freeze | T+3:05 | 15:15 | DONE 12:58 |
| Ready | T+3:40 | 15:50 | DONE 12:58 (tag demo-v1) |

## Done
- Repo safety check, README with team + reg ID, pushed to GitHub
- Concept chosen, PLAN / DEMO_SCRIPT / TESTSET / BACKLOG / DESIGN written
- Scaffold: Astro + Tailwind + Pages Function (/api/health), hello-world live (Gate A)
- Must-have 1: parser (ERP CSV + auth.log) + 9 rules + timeline + 3 sample buttons, live. Check: node scripts/check-rules.ts
- Must-have 2: /api/analyze (Gemini lite models chain, 8s budget) + EN/Hindi + offline rule-based fallback, live. 3/3 live calls OK (5-7s).
- Must-have 3: SHA-256 evidence tag (matches sha256sum), verify MATCH/TAMPERED, audit trail (localStorage), HTML report download, live.
- Eval: 14/14 x3 runs after fixes (verdict field, impossible-travel rule, Hindi retry)
- judge-me (~73/100) fixes: AI "beyond the rules" hidden_patterns; hash-chained audit trail + tamper test button (e2e: OK -> BROKEN at entry 1)
- Polish: QR code (build-time SVG), 44px buttons, focus ring, any-file SHA-256 (bytes + metadata) with re-verify, README rewrite, og tags. e2e 360px: no h-scroll, no small buttons, 0 errors
- Pitch: docs/PITCH.md (3-min script, 60-s opening, 6 slides, 15 Q&A, backup, Hinglish cheat-sheet); DEMO_SCRIPT updated
- Apache/Nginx access log parser + 3 web rules (web-attack, scan-burst, attack-success). Eval 16 cases: 16, 16, 15 (Hindi >8s once).
- Ship: secrets scan clean, clean clone from GitHub builds + runs in 3 commands (no key -> AI "not configured", offline path), final deploy, e2e on live: all demo steps pass, 0 JS errors.
- Premium UI redesign (13:12): two-column evidence desk, evidence tag with hole+string, timeline rail with seal dots, big verdict banner, segmented EN/हिंदी, empty state, phone auto-scroll to result. e2e on prod: all pass, 0 errors.
- Check kit: docs/CHECK_KIT.md (6 paste tests verified with rules, tamper checks, pre-stage list). Slide deck: https://claude.ai/artifact/C3p7eQ1CCxardURKkz7Mu3 (7 slides + speaker notes).
- 13:48 Change register (who/when/IP/before->after/status), Save report as PDF (print), sealed copy + changed-lines diff + Restore original. e2e on prod pass.

## Doing
- Shipped. Waiting: user records demo video + screenshots, rehearses with docs/PITCH.md and docs/DEFENSE.md

## Next 3 actions
1. User: record demo twice (90 s), 4 screenshots
2. User: read DEFENSE.md, rehearse PITCH.md cheat-sheet
3. Before judging: open live URL, click "New case", run sample once (warm-up)

## Notes
- Gemini: gemini-2.5-flash not available to this key; big flash models busy/slow (5-9s). Using flash-lite chain. Latency 5-8s is close to the 8s limit: fallback kicks in if slower.
- Local functions dev: `npm run build && npx wrangler pages dev dist` (reads .dev.vars, git-ignored)
- npm blocked esbuild postinstall script; build still works.
