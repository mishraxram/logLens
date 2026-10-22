# UPGRADE LOG (state for docs/UPGRADE_LOOP.md)

Branch `avinya-final` (from `loglens-v2` @ b158675). Backup demo: `main` -> https://loglens-solarflares.pages.dev
Loop file: `LOOP.md` (project root). Next phase: **B Build** until 03:30 (iteration 3 = backlog rank 2).

## NEEDS YOU (the loop cannot do these; `bash win.sh` asks for 1-3)
| # | What | Why | Status |
|---|---|---|---|
| 1 | (checked 21:53: GEMINI_API_KEY empty in .env and .dev.vars) Put a Gemini key in `.env` + `.dev.vars`, then `npx wrangler secret put GEMINI_API_KEY` (Worker `loglens-v2`) | **URGENT**: 22:00 probes: v1 AI `took longer than 8s` (2/2), v2 AI `AI error 400`. Demo AI shows only the offline fallback until a working key is set | open |
| 2 | `npx wrangler login` | Needed to deploy v2 | done (user logged in 22:0x, whoami checked) |
| 3 | Team member names + who does what | Team Delegation = 20 marks; the loop must not invent names | open |

## Iterations
| # | Time | Phase | Item | Result | Evidence / commit |
|---|---|---|---|---|---|
| 1 | 22:05 | R | Deep research -> docs/RESEARCH-DEEP.md | done (deep-research skill blocked by permissions; 4 web searches + curl of attack.mitre.org instead) | 10 MITRE IDs verified by page title; see commit |
| 2 | 22:08 | A | Audit -> docs/AUDIT.md, backlog, matrix | done. Found + fixed: SSH sample and 3 test logs never committed (*.log in .gitignore) | 4a35b03; eval 6/16 (all 10 fails = live AI timeout; all rule checks pass) |

## Backlog (filled by the audit, ranked by marks-impact / effort)
| Rank | Area | Item | Criterion / PS | Impact | Effort | Status |
|---|---|---|---|---|---|---|
| 1 | Deploy/AI | Working Gemini key on v2 (NEEDS YOU 1) | Prototype, PS2 | H | S | blocked (user) |
| 2 | Security | Security headers + CSP from the Worker | Prototype, Stack | H | S | todo |
| 3 | Security/AI | Prompt-injection guard + eval case | Stack, PS2 | M | S | todo |
| 4 | PS2 | Verified MITRE ID chips on flags + report | PS2, Domain | H | S | todo |
| 5 | PS2 | Attack-chain panel (stages + event refs) | PS2, Prototype | H | M | todo |
| 6 | PS6 | Investigation dashboard: cases list, status, progress, investigator | PS6, Prototype | H | M | todo |
| 7 | PS4/PS6 | D1 append-only hash-chained audit log + signed receipt /api/seal | PS4, PS6 | H | L | todo |
| 8 | PS5 | Report: event refs per finding, MITRE, hash function field | PS5 | M | S | todo |
| 9 | PS1 | File metadata panel | PS1 | M | S | todo |
| 10 | AI | AI vs rules cross-check | PS2 | M | S | todo |
| 11 | Coding | Lint + typecheck script | Stack | M | S | todo |
| 12 | Tests | eval -> v2 default, rules-only count, honest README | Prototype | M | S | todo |
| 13 | Docs | TEAM.md (needs names), TECH_STACK.md + diagram, DEFENSE, deck | Team, Stack, Pres | H | M | Phase C |
| 14 | Perf | Lighthouse mobile before/after on v2 | Prototype | M | S | after deploy |

## Judge score trend
| Round | Time | Pres /20 | Domain /20 | Solution /20 | Team /20 | Stack /20 | Prototype /100 | Total /200 |
|---|---|---|---|---|---|---|---|---|

## Coverage matrix (LOOP.md section 6; filled by the audit)
| Req | Requirement | What LogLens shows | Evidence | Status | Slice |
|---|---|---|---|---|---|
| PS1 | Digital evidence analysis (logs, file metadata, artifacts) | 3 log formats parsed (ERP CSV, auth.log, Apache/Nginx); any-file SHA-256 | check-rules: 3 samples, 0 not understood | partial (metadata view thin) | 9 |
| PS2 | AI pattern discovery (relationships, attack indicators) | 13 rules + Gemini indicators citing event #s + hidden_patterns | rules pass in eval; live AI down 22:00 | partial | 1, 4, 5, 10 |
| PS3 | Incident timeline reconstruction | Sorted timeline with flagged rows; case 10 shuffled input | eval case 10 PASS | proven (local) | - |
| PS4 | SHA-256 evidence integrity | Web Crypto hash, MATCH/TAMPERED, hash-chained local audit | check-hash MATCH -> TAMPERED; eval 13/14 PASS | partial (no server-side record) | 7 |
| PS5 | Automated reports with timestamps + evidence refs | HTML/PDF report with hashes, flags, timeline, AI summary | src/lib/report.ts | partial (no per-finding refs, MITRE) | 8 |
| PS6 | Investigation dashboard, progress, audit trail | Single case + local audit trail | - | missing | 6, 7 |
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
