# UPGRADE LOG (state for docs/UPGRADE_LOOP.md)

Branch `avinya-final` (from `loglens-v2` @ b158675). Backup demo: `main` -> https://loglens-solarflares.pages.dev
Loop file: `LOOP.md` (project root). Next phase: **A Audit** (iteration 2).

## NEEDS YOU (the loop cannot do these; `bash win.sh` asks for 1-3)
| # | What | Why | Status |
|---|---|---|---|
| 1 | (checked 21:53: GEMINI_API_KEY empty in .env and .dev.vars) Put a Gemini key in `.env` + `.dev.vars`, then `npx wrangler secret put GEMINI_API_KEY` (Worker `loglens-v2`) | Live AI on v2 says "AI not configured" without it | open |
| 2 | `npx wrangler login` (checked 21:53: **still not logged in**) | Needed to deploy v2 | open |
| 3 | Team member names + who does what | Team Delegation = 20 marks; the loop must not invent names | open |

## Iterations
| # | Time | Phase | Item | Result | Evidence / commit |
|---|---|---|---|---|---|
| 1 | 22:05 | R | Deep research -> docs/RESEARCH-DEEP.md | done (deep-research skill blocked by permissions; 4 web searches + curl of attack.mitre.org instead) | 10 MITRE IDs verified by page title; see commit |

## Backlog (filled by the audit, ranked by marks-impact / effort)
| Rank | Area | Item | Criterion / PS | Impact | Effort | Status |
|---|---|---|---|---|---|---|

## Judge score trend
| Round | Time | Pres /20 | Domain /20 | Solution /20 | Team /20 | Stack /20 | Prototype /100 | Total /200 |
|---|---|---|---|---|---|---|---|---|

## Coverage matrix (LOOP.md section 6; filled by the audit)
| Req | Requirement | What LogLens shows | Evidence | Status | Slice |
|---|---|---|---|---|---|
| PS1 | Digital evidence analysis (logs, file metadata, artifacts) | | | | |
| PS2 | AI pattern discovery (relationships, attack indicators) | | | | |
| PS3 | Incident timeline reconstruction | | | | |
| PS4 | SHA-256 evidence integrity | | | | |
| PS5 | Automated reports with timestamps + evidence refs | | | | |
| PS6 | Investigation dashboard, progress, audit trail | | | | |
| R1-R26 | Rubric bullets (added by the audit) | | | | |
