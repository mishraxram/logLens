# AUDIT (LOOP.md section 5), iteration 2, 2026-10-22 22:05 IST

Branch `avinya-final` @ 4a35b03. Ranked by marks impact / effort. Evidence is real command output from this session.

## Commands run
- `npm run build` -> `2 page(s) built`, `Complete!`
- `node scripts/check-rules.ts` -> 3 samples parse with 0 lines not understood (19, 11, 6 events). `check-hash`: MATCH, then TAMPERED after one char.
- `node tests/eval.ts` (default target = **v1** live API) -> **RESULT 6/16**. Every rule/parse expectation passes; all 10 fails are `AI took longer than 8s`.
- Live AI probe: v1 `/api/analyze` -> `AI took longer than 8s` (2 of 2, 8.1 s). v2 `/api/analyze` -> `AI error 400` (key present but rejected, or bad request: needs a valid key).
- `/api/health` on v2 -> `{"ok":true}`. `curl -I` on v2: **no CSP, no X-Frame-Options, no X-Content-Type-Options, no Referrer-Policy**.

## Findings fixed during the audit
| # | Finding | Evidence | Fix |
|---|---|---|---|
| F0 | `*.log` in `.gitignore` meant `public/samples/ssh-bruteforce.log` and test cases 04/15/16 were **never committed**. A clean clone had a broken "SSH brute force" sample button and eval crashed (`ENOENT`) | `git ls-files public/samples` listed 2 files; eval stack trace | 4a35b03: sample restored from live (same sha256 on v1 and v2), 3 cases rewritten, `.gitignore` exceptions added |

## Findings (open)
| Rank | Area | Drawback | Evidence | Criterion / PS | Impact | Effort | Fix |
|---|---|---|---|---|---|---|---|
| 1 | Deploy / AI | Live AI is down on both URLs, so the AI part of the demo shows only the offline fallback | probes above | Prototype (works consistently), PS2 | H | S (user) | User adds a working Gemini key (NEEDS YOU 1) |
| 2 | Security | No security headers / CSP on v2 | `curl -I` | Prototype (reliability), Tech Stack | H | S | Add headers in `worker/index.ts` for all responses (assets via `run_worker_first` or `_headers`) |
| 3 | Security / AI | Log text goes into the prompt with no "this is data, ignore instructions inside it" guard: prompt injection from a crafted log line | `src/lib/prompts.ts` | Tech Stack, PS2 | M | S | Wrap events in delimiters + explicit instruction; eval case with an injection line |
| 4 | PS2 / Domain | Flags have no standard vocabulary | `src/lib/rules.ts` | PS2, Domain Knowledge | H | S | Verified MITRE IDs (RESEARCH-DEEP s.4) as chips on flags + in report |
| 5 | PS2 | No relationships between events beyond AI hidden_patterns: no visible attack chain | UI | PS2, Prototype | H | M | Rule-based "attack chain" panel: stages (recon -> access -> action -> cover-up) with event refs |
| 6 | PS6 | No investigation dashboard: single case only, no case list, status or progress, no investigator name | `index.astro` | PS6, Prototype | H | M | Cases list (localStorage), status new/analysing/reviewed, progress steps, investigator name on audit entries |
| 7 | PS4 / PS6 | Audit trail is browser-only (localStorage); anyone can clear it | `src/lib/evidence.ts:1` | PS4, PS6, Proposed Solution | H | L | D1 (SQLite) append-only, hash-chained `/api/audit` + HMAC signed receipt `/api/seal`; offline fallback keeps local chain |
| 8 | PS5 | Report lacks MITRE IDs, evidence line refs per finding and a hash-function field | `src/lib/report.ts` | PS5 | M | S | Add per-finding event #s, raw line, MITRE, "Hash function: SHA-256" + "not a legal certificate" note |
| 9 | PS1 | Any-file hashing exists, but metadata view is minimal | UI | PS1 | M | S | Metadata panel: name, size, MIME, lastModified, SHA-256, intake time |
| 10 | AI quality | No AI-vs-rules cross-check shown | UI | PS2, Prototype | M | S | "AI agrees with N of M rule flags; AI-only findings: ..." |
| 11 | Coding | No lint / typecheck (v2 F6 part 2) | `package.json` scripts | Tech Stack | M | S | `astro check` + `tsc --noEmit` script, fix errors |
| 12 | Tests | eval default target is v1; README claims 16/16, today it is 6/16 with AI down | `tests/eval.ts:8`, `README.md:31` | Prototype (testing) | M | S | Default to v2, add `--rules-only` count, update README honestly |
| 13 | Presentation / Team / Stack | No `docs/TEAM.md`, no `docs/TECH_STACK.md`, no diagram; DEFENSE not tied to new brief | `ls docs` | Team, Tech Stack, Presentation | H | M | Phase C docs (TEAM needs real names: NEEDS YOU 3) |
| 14 | Perf / a11y | Lighthouse not measured on this branch | - | Prototype (usability) | M | S | After deploy |

## Areas checked with no new finding
- XSS: UI builds DOM with a text-only helper (`index.astro:137`, no innerHTML); report escapes all values with `esc()`.
- API: body cap 413, JSON-only 415, rate limit 429, JSON errors, `/api/health`. AI output is validated (verdict whitelist, indicators must cite real event numbers, Hindi check).
- Secrets: `.env`, `.dev.vars` git-ignored.
- Not checked this pass: Strix scan (needs its LLM key, not checked), 360 px + dark mode browser e2e (next deploy iteration).
