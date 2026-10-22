# LogLens upgrade loop: अvinya '26 final night (22 -> 23 Oct 2026)

Start it from `~/Projects/logLens` with:

```
/loop Run ONE iteration of docs/UPGRADE_LOOP.md in ~/Projects/logLens, then schedule the next.
```

Each run of the loop does exactly ONE iteration (below), logs it, and schedules the next one. The state lives in
`docs/UPGRADE_LOG.md`, so `/clear` or a new session can safely continue the loop.

## 0. Ground truth (read first, every iteration)
- `docs/brief/AVINYA_BRIEF.md`: the **official** rubric, ABCS-02 requirements PS1-PS6 and the 23 Oct timings.
  The criteria named in CLAUDE.md and docs/PLAN-v2.md (Innovation, Problem Relevance, ...) are outdated. Use the brief.
- `docs/UPGRADE_LOG.md` (state + backlog), `docs/AUDIT.md` (once written), `docs/STATE.md`.
- Prototype = 100 of 200 marks and **only working evidence counts**. A reliable demo beats a new feature.

## 1. Overrides for this loop (they win over CLAUDE.md for the duration)
- Branch: **`avinya-final`** (cut from `loglens-v2`). Push only `git push origin avinya-final`. Never commit to or push `main`.
- `main` + https://loglens-solarflares.pages.dev (v1) are the **backup demo**. Never deploy to that Pages project.
- Deploy target for this branch: the Worker `loglens-v2` (`npx wrangler deploy`). Only after build + checks are green.
- Autonomous: do not wait for "go" on routine steps (plan, edit, test, commit, push, deploy to `loglens-v2`).
  Stop and ask only for: keys/logins, money, anything outside this repo, destructive git, and the cutover decision.
- Undo a bad change with `git revert <hash>` (reset --hard / clean / force push are denied).
- Never print or commit secrets. `.env` and `.dev.vars` stay git-ignored.

## 2. Clock and phases (check `date` at the start of every iteration)
| Phase | Window (IST) | Allowed work |
|---|---|---|
| A Audit | first iteration (now ~21:45) | Read-only audit -> `docs/AUDIT.md` + ranked backlog. No code changes. |
| B Build | until **03:30, 23 Oct** | One slice per iteration from the backlog, 30-60 min each. |
| C Harden | 03:30 -> 06:30 | **Feature freeze.** Only bug fixes, tests, a11y/perf, copy, docs, pitch/defence. |
| D Ship | 06:30 -> 08:00 | Final deploy, full verification, cutover decision, handoff. Then **stop the loop** (`stop: true`). |
After 08:00 do no work. Write the handoff and stop.

## 3. One iteration
1. `date`; read section 0 files; decide the phase. If the user left a note in UPGRADE_LOG "NEEDS YOU" answers, apply it.
2. Pick the top `todo` item that fits the phase and the time left (est. time x 1.5 must end before the phase ends).
3. **Before coding**: verify every API/flag you will use with **context7** (Astro, Cloudflare Workers/D1/KV, Web Crypto,
   Tailwind) or by running it. Unverified = do not ship (CLAUDE.md anti-hallucination rules).
4. Build the slice with the matching skill (table in section 5). Keep it small and visible in the browser.
5. **Verify** (all must pass; paste the real output lines into the log):
   - `npm run build`
   - `node scripts/check-rules.ts`, `node scripts/check-hash.ts`, `node scripts/check-changes.ts`
   - `node tests/eval.ts` (local), and against the v2 URL after deploy
   - Browser e2e of the demo path (sample -> timeline -> AI summary -> hash verify -> tamper test -> report) with
     headless `google-chrome` or the claude-in-chrome skill: 0 console errors, works at 360 px wide.
   Any fail: fix once; if it fails again, `git revert` and mark the item `blocked` with the reason.
6. Commit (`<area>: <slice>`), `git push origin avinya-final`, deploy to `loglens-v2` if green (Phase B-D).
7. Update `docs/UPGRADE_LOG.md`: iteration row, item status, evidence, new findings, NEEDS YOU list.
8. Every 3rd iteration (and once at the start of Phase C): run a **judge round** (section 6) and re-rank the backlog.
9. Schedule the next iteration: ~60-120 s when the next item is ready; 1200 s when you are waiting on the user.
   If a NEEDS YOU item blocks everything, send a PushNotification once.

## 4. Audit checklist (Phase A; each finding = one backlog row)
Every finding: area, drawback, evidence (file:line, URL or command output), rubric criterion + PS id, impact H/M/L,
effort S/M/L, fix. Rank by (marks impact / effort). Cover **every** area:

| Area | Check |
|---|---|
| PS coverage | PS1-PS6 one by one: what works today, what is missing. Biggest known gaps: **PS6 investigation dashboard** (cases, progress, server-side audit trail), PS1 file metadata, PS2 relationships between events. |
| Coding | Types, dead code, duplication, error handling, lint + typecheck (v2 F6 part 2 is still TODO), `/code-review`-style review of `src/lib/*` and `worker/index.ts`. |
| Frontend / UI | First-time user finishes the flow in < 60 s; empty/loading/error states; 360 px; dark mode; Hindi rendering; DESIGN.md followed; no "AI-made" look (`.claude/rules/ui-quality.md`). |
| Backend / API | `worker/index.ts` routes, input validation, 8 s AI budget + labelled offline fallback, rate limit, JSON errors, `/api/health`. Planned-but-missing: F3 signed receipt `/api/seal`, F4 AI cross-check, F5 MITRE IDs, F7 offline shell. |
| Database / storage | Today: localStorage only. Decide if Cloudflare **D1** (SQLite, matches the PS "SQLite or PostgreSQL") for cases + append-only audit log is worth it before 03:30. If yes, it is the top Build item; if not, write the reason for DEFENSE.md. |
| Security | Secrets, CSP/headers, XSS in uploaded log rendering, upload size, prompt injection from log text into Gemini (logs are untrusted data). Strix scan of the **local** preview only if Docker + its LLM key exist (check first; otherwise log "not checked"). |
| AI quality | Eval pass rate, latency vs 8 s, Hindi flake (case 9), hallucinated events (AI must cite real line numbers), "unsure" path. |
| Tests | Coverage of parser/rules/hash/changes; missing edge cases; eval runs against live URL. |
| Performance / a11y | Lighthouse mobile on the v2 URL (P/A/BP/SEO). |
| Deploy / ops | **v2 Worker has no GEMINI_API_KEY** (STATE.md) -> live AI says "AI not configured". `wrangler whoami`. Clean clone runs in 3 commands. |
| Pitch / judging | Presentation (deck vs real features), Domain Knowledge (existing tools: Autopsy, Splunk, ELK; their limits), Tech Stack (why Astro/Workers/Gemini instead of the suggested Python/FastAPI/React; trade-offs), **Team Delegation** (roles per member: needs real names from the user), demo script fits the slot. |

Also update CLAUDE.md "JUDGING CRITERIA" to point at `docs/brief/AVINYA_BRIEF.md` (commit with the audit).

## 5. Tools and plugins to use (installed on this machine)
| Tool | Use it for | When |
|---|---|---|
| graphify skill | Knowledge-graph map of the codebase for the audit | Phase A, once |
| `.claude/agents/skeptical-judge` + project skill `judge-me` | Harsh rubric review (re-target to AVINYA_BRIEF criteria) | Judge rounds |
| agent-skills: `code-review-and-quality`, agent `agent-skills:code-reviewer` | Coding-area review, review of each slice diff | Phase A + after big slices |
| agent-skills: `security-and-hardening`, agent `agent-skills:security-auditor` | Security area, prompt-injection, headers | Phase A, Phase C |
| Strix skills (`find-security-vulnerabilities-in-code`, `web-app-penetration-testing`) | Proof-of-concept security scan of local preview | Phase A/C, only if Docker + key available |
| agent-skills: `test-driven-development`, agent `agent-skills:test-engineer`, project skill `eval-set` | New tests for each slice, eval set growth | Every slice |
| agent-skills: `frontend-ui-engineering`, project skill `polish`, `.claude/rules/ui-quality.md` | UI slices, states, a11y | UI slices |
| 21st skill | UI pattern inspiration only. This project has no React: port ideas to Astro + vanilla TS, add no React deps | Dashboard/UI slices |
| dataviz skill | Any chart on the investigation dashboard (attack trend, severity) | Dashboard slice |
| agent-skills: `performance-optimization`, agent `agent-skills:web-performance-auditor` | Lighthouse fixes | Phase C |
| agent-skills: `incremental-implementation`, `debugging-and-error-recovery`, project skills `build-slice`, `fix-loop` | Every build iteration / any failure | Phase B |
| agent-skills: `doubt-driven-development` | Check risky decisions (D1, signed receipt crypto) before building | Before L-effort items |
| context7 MCP | Verify Astro / Cloudflare / Web Crypto APIs before use | Every slice |
| agent-skills: `shipping-and-launch`, project skill `ship` | Final checklist | Phase D |
| project skills `pitch`, `defend` | Update docs/PITCH.md, docs/DEFENSE.md to the real rubric | Phase C |
| Canva MCP (connected) | Update the pitch deck to match shipped features (ask before editing the user's design) | Phase C |
| google-chrome / claude-in-chrome | Browser e2e + screenshots | Every verify |
Not used: Gmail, Google Calendar, LinkedIn, Figma (not signed in), Claude Docs.

## 6. Judge round
Run the skeptical-judge agent with: the brief, the live v2 URL, `git diff loglens-v2..HEAD --stat`.
Ask for scores per official criterion (out of 20/20/20/20/20/100) with evidence, plus 5 killer questions.
Write the result into UPGRADE_LOG (score trend table) and turn the top weaknesses into backlog rows.
Killer questions + answers go into docs/DEFENSE.md.

## 7. Phase D: ship checklist (finish by 08:00)
- [ ] Final deploy to `loglens-v2`; eval against live; browser e2e on live at 360 px and desktop; 0 console errors.
- [ ] Lighthouse mobile on live, before vs after numbers in the log.
- [ ] Offline test: AI off -> labelled rule-based fallback works.
- [ ] **Cutover check table** (v1 vs v2: eval, Lighthouse, errors, AI live yes/no). Recommend which URL to demo. The
      user decides; QR code and deck must show the chosen URL. v1 stays as backup either way.
- [ ] README, docs/DEMO_SCRIPT.md, docs/PITCH.md, docs/DEFENSE.md match what actually shipped (no claims beyond it).
- [ ] Morning handoff at the top of UPGRADE_LOG: demo URL, backup URL, warm-up steps (open URL, run sample once),
      what changed overnight in plain Hinglish, known limitations to admit honestly.
- [ ] Stop the loop.
