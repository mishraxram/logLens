# UPGRADE LOG (state for docs/UPGRADE_LOOP.md)

Branch `avinya-final` (from `loglens-v2` @ b158675). 23 Oct 00:08: `main` on GitHub fast-forwarded to avinya-final at f67f31f on the user's request (v1 stays at tag `pre-upgrade-v1` and on the Pages site, which is not linked to GitHub). Backup demo: `main` -> https://loglens-solarflares.pages.dev
Loop file: `LOOP.md` (project root). Next phase: **B Build** until 03:30 (iteration 19 = Phase D checks after 05:30 when the Workers AI quota resets).

## SUBAH KA HANDOFF (23 Oct, padho sabse pehle)
- **Demo URL:** https://loglens-v2.loglens.workers.dev · **Dashboard:** /cases · **Backup:** https://loglens-solarflares.pages.dev (v1, no receipt/dashboard)
- **Slides:** https://claude.ai/artifact/HZyzrxjWbVLiYbLf1LmsGc (private: Share menu se kholo agar kisi aur laptop pe chahiye)
- **Warm-up (09:15):** app kholo → investigator name "Krishraj (IT cell)" → ERP sample → Analyze with AI → New case. Dashboard tab alag khula rakho. Subah full eval mat chalao (free AI quota).
- **Script:** docs/DEMO_SCRIPT.md (Krishraj, 7 steps, 3 min). Q&A: docs/PITCH.md section 3 + docs/DEFENSE.md section 5 (limits).
- **Kya naya hai v2 mein:** signed server receipts (D1), /cases dashboard, attack chain, MITRE IDs, AI vs rules cross-check, Hindi inside 8 s, prompt-injection guard, CSP, new UI.
- **Limits jo khud bolne hain:** 3 log formats, no login (shared demo ledger), account owner could delete newest ledger rows, free AI tiers, self-written test set, not a legal certificate.
- **Kaun kya bolega:** Krishraj = problem + demo + product questions; Sagar = architecture + code questions.
- **⚠️ AI quota (00:50 check):** Gemini free tier ka daily quota (500 requests/model/din) testing mein khatam: `429 GenerateRequestsPerDayPerProjectPerModel-FreeTier`. Reset ~12:30 IST. Workers AI quota 05:30 IST pe reset hota hai, aur Gemini 429 pe code turant Workers AI backup chalata hai, to demo mein AI chalna chahiye. **Subah eval MAT chalao.** Pakka karne ke liye: (a) Google AI Studio mein NAYE project ki nayi Gemini key banao (quota per project hota hai) aur `.env` mein daalo, main ya aap `npx wrangler secret put GEMINI_API_KEY` se daal do; ya (b) Workers Paid $5. Dono na ho to bhi labelled offline summary + rules + receipt sab chalte hain.
- **Backup screenshots:** `docs/screenshots/v2/` (01-08 + 04b offline fallback) internet na chale to dikhao.
- **Abhi bhi aapka kaam:** demo video record karo (warm-up ke baad, 90 s), Workers AI paid plan ka decision (NEEDS YOU 4).

## NEEDS YOU (the loop cannot do these; `bash win.sh` asks for 1-3)
| # | What | Why | Status |
|---|---|---|---|
| 1 | (checked 21:53: GEMINI_API_KEY empty in .env and .dev.vars) Put a Gemini key in `.env` + `.dev.vars`, then `npx wrangler secret put GEMINI_API_KEY` (Worker `loglens-v2`) | Key set 22:08 (piped from .env, never printed). Gemini itself is slow (simple call 9.5 s), so Workers AI was added | done |
| 2 | `npx wrangler login` | Needed to deploy v2 | done (user logged in 22:0x, whoami checked) |
| 3 | Team member names + who does what | Team Delegation = 20 marks | done 23:33: Sagar Mishra (builder) + Krishraj Shukla (presenter) -> docs/TEAM.md |
| 4 | Decide: keep Workers AI on the free plan (10,000 neurons/day, resets 05:30 IST) or upgrade to Workers Paid ($5/month) | 23:12: free allowance used up by testing (`4006: daily free allocation`). Fixed by dropping the 70b model and starting the 8b backup only after 2.5 s. Free should be enough for the demo if we do not run the full eval many times in the morning | open (money: user decides) |

## Iterations
| # | Time | Phase | Item | Result | Evidence / commit |
|---|---|---|---|---|---|
| 1 | 22:05 | R | Deep research -> docs/RESEARCH-DEEP.md | done (deep-research skill blocked by permissions; 4 web searches + curl of attack.mitre.org instead) | 10 MITRE IDs verified by page title; see commit |
| 2 | 22:08 | A | Audit -> docs/AUDIT.md, backlog, matrix | done. Found + fixed: SSH sample and 3 test logs never committed (*.log in .gitignore) | 4a35b03; eval 6/16 (all 10 fails = live AI timeout; all rule checks pass) |
| 3 | 22:18 | B | Live AI fix: Gemini + Workers AI (70b preferred, 8b-fast late backup) in parallel inside 8 s | done. Hindi case 9 still >8 s (offline fallback shown, known) | eval v2 live **15/16** (was 6/16); ERP sample 6.7 s on live; deploy loglens-v2 OK |
| 4 | 22:25 | B | Security headers (CSP with hash for font loader, nosniff, DENY, referrer, permissions, HSTS) on all responses; new `scripts/e2e.ts` (headless Chrome over CDP) | done | live `curl -I`: 6/6 headers; e2e live 360 + 1280 px PASS, 0 console errors; eval live 15/16 (case 9 Hindi >8 s) |
| 5 | 22:32 | B | Prompt-injection guard: log text inside <<<EVENTS ... EVENTS>>> marked untrusted, markers stripped from fields/notes, AI told to report AI-addressed text as an indicator; eval case 17; eval default -> v2 | done | local 16/17 (case 9 Hindi >8 s), **live 17/17**; case 17: AI verdict incident and cites #3, #4 injection lines; e2e live 360 PASS |
| 9 | 23:08 | B | J3 server evidence ledger: D1 `loglens-audit` (schema/audit.sql), `/api/seal` (HMAC-SHA256 with secret SEAL_SECRET, hash-chained, server time), `/api/seal?id=`, `/api/ledger`; investigator name field; receipt on evidence + in report; verify results logged server-side; report adds "Hash function: SHA-256" + not-a-legal-certificate note | done | `scripts/check-seal.ts` live SEAL PASS (7/7); local D1 row edited -> `valid:false`, `intact:false`, restored -> `intact:true`; e2e live 360 + 1280 PASS incl. RECEIPT VALID; eval live 17/17. Note: check-seal writes one labelled test row ('check script') to the live ledger |
| 10 | 23:20 | B | PS6: `/cases` dashboard (cases grouped by evidence hash, status, investigators, server audit trail table with per-row signature + chain check), case progress strip (6 steps from the audit trail), header link; Astro script inlining turned off (CSP blocked an inlined script, caught by e2e) | done | e2e live 360 + 1280 PASS incl. "cases dashboard loads"; dashboard: "Ledger intact" |
| 10b | 23:12 | B | Ledger fork found on live (2 receipts in the same ms linked to one prev row) -> new table `receipts` with UNIQUE(prev_hash) + retry; old `seals` table kept unchanged | done | live: rows 5/6 and 8/9 forked before; after: check-seal live SEAL PASS incl. burst of 6 parallel receipts, ledger intact (22 rows) |
| 10c | 23:16 | B | Workers AI free allowance used up -> 70b dropped, 8b backup starts only after 2.5 s; AI-unavailable now returns 200 + error (a 504 printed a console error) | done | live probes: Gemini 5.2 s / 7.5 s; e2e live 360 + 1280 PASS 0 errors; eval live 16/17 (case 9 Hindi: Gemini >8 s, backup out of quota until 05:30 IST) |
| 11 | 23:33 | B | PS2 attack chain (`src/lib/chain.ts`: flagged events linked by shared IP/account via union-find, MITRE tactic stages TA0043/TA0006/TA0001/TA0040/TA0005, IDs verified on attack.mitre.org; TA0005 is now named "Stealth") in UI + report; `scripts/check-chain.ts`, `scripts/check-report.ts`; Gemini models now raced in parallel; eval paces AI calls 4 s apart | done | CHAIN PASS (5/5), REPORT PASS (8/8); e2e live 360 + 1280 PASS incl. chain panel; probes 2.9-4.4 s (was 5-7.5 s); eval live 15/17 (cases 2, 9: >8 s; Workers AI backup out of quota until 05:30 IST) |
| 12 | 23:40 | B | AI vs rules cross-check (`src/lib/crosscheck.ts`: agree/disagree, cited, missed high-risk, AI-only events); PS1 file metadata (type + last modified) kept for uploaded text logs; TEAM.md: Sagar Mishra builder + Krishraj Shukla presenter, stage hand-off | done | e2e live 360 + 1280 PASS incl. "cross-check shown" and "file upload -> metadata" (real file via DevTools setFileInputFiles); eval live 16/17 (case 3 >8 s) |
| 13 | 23:37 | B | Typecheck: typescript 5.9.3 + @types/node as devDeps, strict tsconfig over src/lib, functions, worker, scripts, tests (`npm run typecheck`); one command `npm run check` = build + typecheck + worker bundle + 5 check scripts | done | `npm run typecheck` 0 errors (only fix: check-seal.ts needed `export {}`); `npm run check` exit 0. Not covered: the inline TS in .astro pages (no `astro check`) |
| 14 | 23:41 | B | Lighthouse mobile (lighthouse 12.8.2, live v2). `/`: 100/100/100/100. `/cases` was 79 perf (CLS 0.484: cards + status text pushed the page) -> reserved heights -> 98 and 99 (CLS 0.031 / 0.051), A11y/BP/SEO 100 | done | JSON reports in scratchpad; e2e live 360 PASS |
| 15 | 23:47 | B/C | Judge round 2 (139/200). Docs: README rewritten to v2 truth (PS table, Worker not Pages, 17 cases, real results, limits), TECH_STACK.md (diagram, why each tool, vs suggested stack), .env.example + `npm start`; clean clone from GitHub -> `npm install`, `cp .env.example .dev.vars`, `npm start` -> page 200, health OK, ledger/AI offline messages as documented. Dashboard: automated test rows labelled TEST and hidden by default (toggle), ledger head hash shown, window 50 -> 200 rows | done | check-seal live SEAL PASS; e2e live 360 + 1280 PASS ("27 automated test rows hidden") |
| 16 | 23:47 | C | DEMO_SCRIPT (v2 URL, 7 steps incl. receipt + dashboard, Krishraj presenter, failure table), PITCH (one slide per rubric point, 15 honest Q&A incl. ledger limits), DEFENSE (v2 architecture, file map, 8-step flow, limits), TESTSET + README list every eval run 13/17-17/17 (an earlier draft listed only the best runs; corrected) | done | e7cfe1a |
| 17 | 23:58 | C | UI polish (polish skill): shared graphite app bar with Desk / Cases nav on both pages, kicker labels, KPI tiles under the verdict and on the dashboard (numbers already computed by the app), result order = verdict → KPIs → attack chain → AI → changes → timeline, attack chain left-to-right on desktop, softer panel shadow, condensed panel headings, readable UTC times, dashboard empty gap fixed | done | e2e local + live 360 + 1280 PASS 0 errors; `npm run check` exit 0; Lighthouse live `/` 100/100/100/100 (CLS 0.002), `/cases` 98/100/100/100; eval live 16/17 (case 9 Hindi >8 s) |
| 18 | 00:03 | C | v2 slide deck (Slides artifact, 10 slides, one per rubric point, speaker notes, product palette + IBM Plex): https://claude.ai/artifact/HZyzrxjWbVLiYbLf1LmsGc; morning handoff at top of this file; deck link in DEMO_SCRIPT + PITCH | done | deck published (version 6, 10 slide files) |
| 19 | 00:18 | C | iOS-style UI pass: frosted sticky app bar, Desk / Cases segmented control, sample cases as a grouped list with chevrons, filled rounded inputs, rounder cards/buttons with press feedback, segmented language switch, result slides in (off with reduced motion). Fixed: inactive tab contrast 4.25 -> darker text; e2e false alarm (offline label "Not AI generated" matched /AI generated/) | done | e2e local + live 360 + 1280 PASS; `npm run check` 0; Lighthouse live `/` 100/100/100/100, `/cases` 96/100/100/100; eval live 16/17 (case 9 >8 s) |
| 20 | 00:26 | B | PS1/PS2: auth.log now also reads sudo, useradd, usermod; 3 rules (sudo-root-shell T1548.003, new-account T1136.001, admin-group T1098, IDs verified on attack.mitre.org); chain stages Persistence TA0003 + Privilege Escalation TA0004; SSH sample extended (backdoor account sysbackup → sudo group → root shell); 16 rules in docs + deck | done | check-chain: SSH chain Credential Access → Initial Access → Persistence → Privilege Escalation; `npm run check` 0; e2e live 360 + 1280 PASS; eval live 15/17 (case 3 rules all PASS incl. 3 new flags; cases 3, 6 AI >8 s, Gemini only until 05:30) |
| 21 | 00:36 | C | Judge round 3 (153/200) quick fixes: Hindi kept off stage in DEMO_SCRIPT, DEFENSE says Gemini models are raced, TECH_STACK 16 flags, footer names Workers AI, README /cases 96-99, coverage-matrix note, impossible-travel Q&A, chain wording (1 IP + 2 accounts); change register now lists useradd/usermod account changes | done | `npm run check` 0; e2e live 360 + 1280 PASS; **eval live 17/17** |
| 22 | 00:50 | C | Backup screenshots of every demo step in docs/screenshots/v2 (headless Chrome, CDP); progress strip now counts only the current case (old case steps showed as done); found Gemini free daily quota used up (429 per-model 500/day) | done | `npm run check` 0; e2e live 360 + 1280 PASS; AI probe 00:47: Gemini 429 ×2 + 503, Workers AI 4006 (resets 05:30 IST) |
| 6 | 22:36 | B | MITRE ATT&CK chips (verified IDs, link to attack.mitre.org) on every flag + in report; e2e checks chips | done | e2e live 360 + 1280 PASS (chips step PASS); eval live 16/17: case 5 AI 8b-fast said incident for a legit late admin (AI flake, not this change) |
| 7 | 22:52 | B | J1 footer/QR/README -> v2 URL + honest v1 lineage; J2 rule severity (HIGH/MEDIUM) sent to AI + backup 8b capped at suspicious without HIGH evidence (labelled note); `npm run check:worker` (wrangler dry-run bundle) after a build error slipped past astro build | done | eval local + live 16/17 (case 5 now PASS; case 9 Hindi >8 s); e2e live 360 + 1280 PASS; live footer shows v2 URL + अvinya |
| 8 | 22:58 | B | Hindi inside 8 s: stronger Devanagari instruction (neutral style example, not copied), 504 now lists every provider's reason (`tried`) | done | probe: before = 70b/Gemini timeout + 8b 'wrong language'; after 8b Hindi 6.5-7.7 s with case-specific text; eval **local 17/17, live 17/17**; e2e live 360 PASS |

## Backlog (filled by the audit, ranked by marks-impact / effort)
| Rank | Area | Item | Criterion / PS | Impact | Effort | Status |
|---|---|---|---|---|---|---|
| 1 | Deploy/AI | Working live AI on v2 | Prototype, PS2 | H | S | done (iter 3) |
| 1b | AI | Hindi answer inside 8 s (case 9) | Prototype | M | M | done (iter 8) |
| 2 | Security | Security headers + CSP from the Worker | Prototype, Stack | H | S | done (iter 4) |
| 3 | Security/AI | Prompt-injection guard + eval case | Stack, PS2 | M | S | done (iter 5) |
| 4 | PS2 | Verified MITRE ID chips on flags + report | PS2, Domain | H | S | done (iter 6) |
| 5 | PS2 | Attack-chain panel (stages + event refs) | PS2, Prototype | H | M | done (iter 11) |
| 6 | PS6 | Investigation dashboard: cases list, status, progress, investigator | PS6, Prototype | H | M | done (iter 10) |
| 7 | PS4/PS6 | D1 append-only hash-chained audit log + signed receipt /api/seal | PS4, PS6 | H | L | done (iter 9) |
| 8 | PS5 | Report: event refs per finding, MITRE, hash function field | PS5 | M | S | done (iter 9-11, check-report PASS) |
| 9 | PS1 | File metadata panel | PS1 | M | S | done (iter 12) |
| 10 | AI | AI vs rules cross-check | PS2 | M | S | done (iter 12) |
| 11 | Coding | Lint + typecheck script | Stack | M | S | done (iter 13, typecheck; no separate linter) |
| 12 | Tests | eval -> v2 default (done iter 5), rules-only count, honest README | Prototype | M | S | partial |
| 13 | Docs | TEAM.md, TECH_STACK.md + diagram, DEFENSE (done); slide deck for v2 (todo) | Team, Stack, Pres | H | M | partial |
| J1 | Presentation | Footer/QR point to v1 + say CHAKRAVYUH 1.0 (Base.astro:7,38): looks like a resubmission. Point to v2, declare v1 lineage honestly | Pres, originality | H | S | done (iter 7) |
| J2 | AI | 8b-fast backup over-calls incident (eval case 5) | Prototype | M | S | done (iter 7) |
| J3 | PS4 | Audit chain forgeable (unkeyed SHA-256 in localStorage): HMAC signed receipt /api/seal + /api/verify-seal | PS4, PS6 | H | M | done (iter 9) |
| J4 | Docs | README/PITCH/DEFENSE stale numbers (16/16, 14/14, 10 rules, v1 URL, no Workers AI) | Pres, Proto | H | S | done (iter 15-16) |
| 14 | Perf | Lighthouse mobile before/after on v2 | Prototype | M | S | done (iter 14) |

## Judge score trend
| Round | Time | Pres /20 | Domain /20 | Solution /20 | Team /20 | Stack /20 | Prototype /100 | Total /200 |
|---|---|---|---|---|---|---|---|---|
| 1 (skeptical-judge) | 22:35 | 12 | 13 | 13 | 6 | 12 | 62 | 118 |
| 3 (skeptical-judge) | 00:30 | 14 | 15 | 16 | 11 | 15 | 82 | 153 |
| 2 (skeptical-judge) | 23:41 | 11 | 14 | 15 | 8 | 13 | 78 | 139 (README/TECH_STACK rewritten right after; demo/pitch docs still stale) |

## Coverage matrix (LOOP.md section 6; filled by the audit)
> Note: this matrix is from the 22:08 audit (13 rules, eval 6/16 then). Current status is in README.md and the iteration rows above; PS4 and PS6 rows were updated after iteration 10.
| Req | Requirement | What LogLens shows | Evidence | Status | Slice |
|---|---|---|---|---|---|
| PS1 | Digital evidence analysis (logs, file metadata, artifacts) | 3 log formats parsed (ERP CSV, auth.log, Apache/Nginx); any-file SHA-256 | check-rules: 3 samples, 0 not understood | partial (metadata view thin) | 9 |
| PS2 | AI pattern discovery (relationships, attack indicators) | 13 rules + Gemini indicators citing event #s + hidden_patterns | rules pass in eval; live AI down 22:00 | partial | 1, 4, 5, 10 |
| PS3 | Incident timeline reconstruction | Sorted timeline with flagged rows; case 10 shuffled input | eval case 10 PASS | proven (local) | - |
| PS4 | SHA-256 evidence integrity | Web Crypto hash, MATCH/TAMPERED, local chain + HMAC-signed D1 receipt | check-hash MATCH -> TAMPERED; e2e live TAMPERED + RECEIPT VALID; edited D1 row -> valid:false | proven | 7 |
| PS5 | Automated reports with timestamps + evidence refs | HTML/PDF report with hashes, flags, timeline, AI summary | src/lib/report.ts | partial (no per-finding refs, MITRE) | 8 |
| PS6 | Investigation dashboard, progress, audit trail | /cases dashboard from server ledger, progress strip, investigator name, signed hash-chained server audit trail | e2e live 'cases dashboard loads' + 'RECEIPT VALID'; check-seal live PASS | proven (no login: demo ledger, stated on page) | 6, 7 |
| R1 | Pres: clear problem + objective | PITCH.md | - | partial (old rubric) | 13 |
| R2 | Pres: logical order | PITCH.md | - | partial | 13 |
| R3 | Pres: on time | 3-min script | - | partial (slot length unknown) | 13 |
| R4 | Pres: slides/demo support talk | deck artifact (v1) | - | partial (deck not updated) | 13 |
| R5 | Pres: confident answers | DEFENSE.md | - | partial | 13 |
| R6 | Domain: background, users, need | PROBLEM.md, RESEARCH.md | - | partial | 13 |
| R7 | Domain: key concepts | RESEARCH-DEEP s.2-4 | docs/RESEARCH-DEEP.md | partial | 4, 13 |
| R8 | Domain: existing approaches + limits | RESEARCH-DEEP s.1 | docs/RESEARCH-DEEP.md | partial (no slide) | 13 |
| R9 | Domain: justify assumptions | - | - | missing | 13 |
| R10 | Domain: constraints + risks | PLAN risks | - | partial | 13 |
| R11 | Solution: directly solves PS | PS1-PS6 rows | - | partial | 5-9 |
| R12 | Solution: feasible | runs in browser, no install | - | partial | - |
| R13 | Solution: workflow explained | DEMO_SCRIPT | - | partial | 13 |
| R14 | Solution: what is different | - | - | partial | 13 |
| R15 | Solution: impact | - | - | partial | 13 |
| R16 | Solution: users | PROBLEM.md | - | partial | 13 |
| R17 | Solution: limitations | README | - | partial | 13 |
| R18 | Team: clear roles | - | - | missing (needs names) | 13 |
| R19 | Team: everyone understands whole project | DEFENSE.md | - | partial | 13 |
| R20 | Team: consistent story | - | - | missing | 13 |
| R21 | Team: handle questions together | - | - | missing | 13 |
| R22 | Stack: tools named correctly | README tech | - | partial | 13 |
| R23 | Stack: why each was chosen | DECISIONS.md | - | partial | 13 |
| R24 | Stack: fits needs/scale/constraints | RESEARCH-DEEP s.6 | - | partial | 13 |
| R25 | Stack: how components connect | - | - | missing (no diagram) | 13 |
| R26 | Stack: trade-offs | RESEARCH-DEEP s.6 | - | partial | 13 |
| R27 | Proto: core features demo + relate to PS | samples -> timeline -> AI -> hash -> report | - | partial (AI down) | 1 |
| R28 | Proto: works consistently | eval | eval 6/16 (AI) | partial | 1, 12 |
| R29 | Proto: technical effort / integration | Worker + Gemini + Web Crypto | - | partial | 5-7 |
| R30 | Proto: explain design, components, limits | DEFENSE.md | - | partial | 13 |
| R31 | Proto: testing, usability, reliability, completion | eval + check scripts | - | partial | 11, 12, 14 |
