# UPGRADE LOG (state for docs/UPGRADE_LOOP.md)

Branch `avinya-final` (from `loglens-v2` @ b158675). Backup demo: `main` -> https://loglens-solarflares.pages.dev
Next phase: **A Audit** (no iterations run yet).

## NEEDS YOU (the loop cannot do these)
| # | What | Why | Status |
|---|---|---|---|
| 1 | Put a Gemini key in `.env` + `.dev.vars`, then `npx wrangler secret put GEMINI_API_KEY` (Worker `loglens-v2`) | Live AI on v2 says "AI not configured" without it | open |
| 2 | `npx wrangler login` if `npx wrangler whoami` says not logged in | Needed to deploy v2 | unchecked |
| 3 | Team member names + who does what | Team Delegation = 20 marks; the loop must not invent names | open |

## Iterations
| # | Time | Phase | Item | Result | Evidence / commit |
|---|---|---|---|---|---|

## Backlog (filled by the audit, ranked by marks-impact / effort)
| Rank | Area | Item | Criterion / PS | Impact | Effort | Status |
|---|---|---|---|---|---|---|

## Judge score trend
| Round | Time | Pres /20 | Domain /20 | Solution /20 | Team /20 | Stack /20 | Prototype /100 | Total /200 |
|---|---|---|---|---|---|---|---|---|
