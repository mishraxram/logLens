# LOOP.md: LogLens "win mode" upgrade loop (अvinya '26, 22 -> 23 Oct 2026)

Goal: close **every** gap between LogLens and (a) the ABCS-02 problem statement and (b) every line of the official
judging rubric, with working proof for each, so the team is in the best position for 1st place.
Nobody can guarantee a result. This loop makes sure no mark is lost through a missing feature, a broken demo or an
unanswered question.

## How to run (VS Code terminal)
Master command (setup + key + Cloudflare login + team + deep research + loop, all in one):
```bash
bash ~/Projects/logLens/win.sh
```
Loop only (if setup is already done):
```bash
cd ~/Projects/logLens && claude "/loop Run ONE iteration of LOOP.md, then schedule the next."
```
Deep research only (separate terminal, can run in parallel with the loop):
```bash
cd ~/Projects/logLens && claude "Use the deep-research skill for the questions in LOOP.md section 4 and write docs/RESEARCH-DEEP.md. Do not edit code."
```
Status any time (inside the session): `status` -> shows the coverage matrix, phase, time left and NEEDS YOU.
Stop: press `Esc`, or type `stop the loop`.

Each iteration does ONE unit of work, logs it in `docs/UPGRADE_LOG.md` and schedules the next one. All state lives in
that file, so `/clear` or a new session continues safely.

## 0. Ground truth (read at the start of every iteration)
- `docs/brief/AVINYA_BRIEF.md`: official rubric (200 marks), ABCS-02 PS1-PS6, 23 Oct timings. The criteria in CLAUDE.md
  and docs/PLAN-v2.md (Innovation, Problem Relevance, ...) are outdated. The brief wins.
- `docs/UPGRADE_LOG.md` (state, coverage matrix, backlog), `docs/AUDIT.md`, `docs/RESEARCH-DEEP.md` (once written).
- Prototype = 100/200 and **only working evidence counts**. Reliability first, then coverage, then polish.

## 1. Overrides for this loop (they win over CLAUDE.md while the loop runs)
- Branch **`avinya-final`**. Push only `git push origin avinya-final`. Never commit to or push `main`.
- `main` + https://loglens-solarflares.pages.dev (v1) = **backup demo**. Never deploy to that Pages project.
- Deploy this branch to the Worker `loglens-v2` (`npx wrangler deploy`) only after all checks are green.
- Autonomous: no "go" needed for plan / edit / test / commit / push / deploy to `loglens-v2`.
  Stop and ask only for: keys or logins, money, anything outside this repo, destructive git, the final cutover choice.
- Undo with `git revert <hash>`. Never print or commit secrets.
- No fake data, stats or claims (CLAUDE.md anti-hallucination rules still apply). Sample data is labelled "sample".

## 2. Phases (check `date` first every iteration)
| Phase | Window (IST) | Work |
|---|---|---|
| R Research | 1st iteration | Deep research (section 4) -> `docs/RESEARCH-DEEP.md`. Skip if the file already exists. |
| A Audit | 2nd iteration | Read-only audit (section 5) -> `docs/AUDIT.md`, coverage matrix, ranked backlog. |
| B Build | until **03:30** | One slice per iteration, top of backlog first. Close every PS row and every Prototype row. |
| C Harden | 03:30 -> 06:30 | **Feature freeze.** Bugs, tests, a11y/perf, copy, pitch, defence, deck, team roles. |
| D Ship | 06:30 -> 08:00 | Final deploy, full verification, cutover check, morning handoff, then `stop: true`. |
If a phase runs late, cut the lowest-ranked backlog items, never verification. After 08:00: handoff only, then stop.

## 3. One iteration
1. `date`; read section 0; pick the phase. Apply any answers the user wrote in UPGRADE_LOG "NEEDS YOU".
2. Pick the top `todo` item that fits the phase (estimate x 1.5 must end inside the phase).
3. Verify every API/flag first with **context7** (Astro, Cloudflare Workers/D1/KV, Web Crypto, Tailwind) or by running it.
4. Build the slice with the matching skill (section 7). Small, end-to-end, visible in the browser.
5. Verify, all must pass, paste the real output lines into the log:
   - `npm run build`
   - `node scripts/check-rules.ts && node scripts/check-hash.ts && node scripts/check-changes.ts`
   - `node tests/eval.ts` locally, and against the v2 URL after deploy
   - Browser e2e of the demo path (sample -> timeline -> AI summary -> hash verify -> tamper test -> report) with
     headless `google-chrome` or claude-in-chrome: 0 console errors, works at 360 px and desktop.
   Fail -> fix once -> still failing -> `git revert`, mark `blocked` with the reason.
6. Commit `<area>: <slice>`, `git push origin avinya-final`, deploy to `loglens-v2` when green.
7. Update UPGRADE_LOG: iteration row, coverage matrix cells (with evidence), backlog status, NEEDS YOU.
8. Every 3rd iteration and at the start of Phase C: **judge round** (section 8), re-rank the backlog.
9. Schedule the next iteration: 60-120 s if work is ready; 1200 s if blocked on the user (send one PushNotification).

## 4. Deep research (Phase R): use the `anthropic-skills:deep-research` skill
Write `docs/RESEARCH-DEEP.md` with sources (URL + date) for every claim. Unverified = marked UNVERIFIED. Questions:
1. Existing forensics/log tools and their limits for a small college IT / cyber-cell team: Autopsy, Splunk, ELK/OpenSearch,
   Timesketch + Plaso, Velociraptor, Chainsaw/Hayabusa + Sigma rules, Wazuh. Price, skills needed, setup time.
   -> the "why LogLens" table for Domain Knowledge + Proposed Solution.
2. Indian context: IT Act 2000 s.65B / BSA 2023 s.63 electronic evidence certificate, CERT-In 2022 directions (log
   retention 180 days, 6-hour incident reporting), Digital Personal Data Protection Act 2023. What LogLens may and may
   not claim (we are not "legally valid" evidence; we help preserve integrity).
3. Chain of custody and evidence integrity best practice (NIST SP 800-86, ISO/IEC 27037): hashing, timestamps,
   append-only audit logs, signed receipts. Which of these LogLens can show working by tomorrow.
4. MITRE ATT&CK technique IDs for each LogLens rule (verify every ID on attack.mitre.org; unverified = not shown).
5. What wins AI/cybersecurity student hackathons: patterns from judges' feedback and winning projects; common reasons
   teams lose marks in live demos.
6. Tech-stack defence: Astro + Cloudflare Workers + Gemini + D1 vs the suggested Python/FastAPI/React/PostgreSQL;
   honest trade-offs (latency, cost, cold start, offline, scale).
Output ends with "Backlog candidates": concrete items with criterion + PS id, for the audit to rank.

## 5. Audit (Phase A): every area, no gaps
Each finding: area, drawback, evidence (file:line, URL or command output), criterion + PS id, impact H/M/L, effort S/M/L,
fix. Rank by (marks impact / effort). Write the **coverage matrix** into UPGRADE_LOG (section 6).

| Area | Check |
|---|---|
| PS coverage | PS1-PS6 one by one. Known gaps: **PS6 investigation dashboard** (cases list, analysis progress, server-side audit trail, "authorized investigator"), PS1 file metadata + more log types, PS2 relationships between events (correlation / attack chain), PS5 references to evidence lines in the report. |
| Coding | Types, dead code, duplication, error handling, **lint + typecheck** (v2 F6 part 2 still TODO), review of `src/lib/*` and `worker/index.ts`. |
| Frontend / UI | First-time user < 60 s; empty / loading / error states; 360 px; dark mode; Hindi; DESIGN.md + `.claude/rules/ui-quality.md`; keyboard + screen-reader basics. |
| Backend / API | Routes, validation, 8 s AI budget + labelled offline fallback, rate limit, JSON errors, health. v2 plan items not done: F3 signed receipt `/api/seal`, F4 AI vs rules cross-check, F5 MITRE IDs, F7 offline shell, F8 polish pages. |
| Database | Today localStorage only. PS names "SQLite or PostgreSQL" and asks for auditable records: **Cloudflare D1** (SQLite) for cases + append-only, hash-chained audit log is the default plan unless `doubt-driven-development` shows it cannot be finished and verified by 03:30. |
| Security | Secrets, CSP + security headers, XSS from uploaded log text, upload size, **prompt injection from log content into Gemini**, rate limit. Strix scan of the local preview (Docker is available; check the Strix LLM key, else "not checked"). |
| AI quality | Eval pass rate, latency vs 8 s, Hindi flake (case 9), AI must cite real line numbers, "unsure" path, AI-vs-rules disagreement shown. |
| Tests | Parser / rules / hash / changes / API coverage, edge cases, eval vs live URL; test count shown honestly in README. |
| Performance / a11y | Lighthouse mobile on the v2 URL (P/A/BP/SEO), before and after. |
| Deploy / ops | v2 Worker GEMINI secret, `wrangler whoami`, clean clone runs in 3 commands, offline behaviour on venue Wi-Fi. |
| Presentation | Deck matches shipped features, 1 slide = 1 rubric point, architecture diagram, timed script for the slot, demo video backup. |
| Domain Knowledge | Research findings turned into DEFENSE.md answers + 1 "existing tools vs LogLens" slide. |
| Team Delegation | `docs/TEAM.md`: role per member, what each demos/answers, hand-off order on stage (needs real names). |
| Tech Stack | `docs/TECH_STACK.md`: each tool, why chosen, how parts connect (diagram), trade-offs vs the suggested stack. |
| Stall Expo (15:00 judges) | Laptop + phone demo, offline mode, QR to live URL, printed 1-page summary, 30-s and 2-min pitch versions. |

## 6. Coverage matrix (lives in UPGRADE_LOG; the loop is not "done" until every row is `proven` or consciously cut)
Rows: PS1-PS6, then each bullet of all 6 rubric criteria (26 bullets in the brief).
Columns: requirement | what LogLens shows | evidence (URL / file / command output / screenshot) | status
(`missing` / `partial` / `proven`) | owner slice. Status `proven` only with working evidence, never with a claim.

## 7. Tools and plugins (installed here)
| Tool | Use | When |
|---|---|---|
| `anthropic-skills:deep-research` | Domain, legal, competitor and winning-pattern research | Phase R, on demand |
| graphify skill | Knowledge-graph map of the codebase | Phase A |
| `.claude/agents/skeptical-judge`, project skill `judge-me` | Harsh scoring against AVINYA_BRIEF | Judge rounds |
| agent-skills `code-review-and-quality` + agent `agent-skills:code-reviewer` | Code review of each big slice | A, B |
| agent-skills `security-and-hardening` + agent `agent-skills:security-auditor` | Security area | A, C |
| Strix skills (`find-security-vulnerabilities-in-code`, `web-app-penetration-testing`) | PoC scan of the local preview only | A, C |
| agent-skills `test-driven-development` + agent `agent-skills:test-engineer`, project skill `eval-set` | Tests per slice, eval growth | B |
| agent-skills `frontend-ui-engineering`, project skill `polish`, 21st skill (ideas only, no React deps) | UI + dashboard | B, C |
| dataviz skill | Dashboard charts (severity, attack timeline) | Dashboard slice |
| artifact-diagramming skill | Architecture diagram for Tech Stack slide | C |
| agent-skills `performance-optimization` + agent `agent-skills:web-performance-auditor` | Lighthouse | C |
| agent-skills `incremental-implementation`, `debugging-and-error-recovery`, `doubt-driven-development`; project skills `build-slice`, `fix-loop` | Every slice / failures / risky choices (D1, crypto) | B |
| context7 MCP | Verify Astro / Cloudflare / Web Crypto APIs | Every slice |
| agent-skills `shipping-and-launch`, project skill `ship` | Final checklist | D |
| project skills `pitch`, `defend` | PITCH.md, DEFENSE.md to the real rubric | C |
| Canva MCP | Update the deck to the shipped features (ask before editing the user's design) | C |
| google-chrome / claude-in-chrome | e2e + screenshots | Every verify |
Not used (nothing to do here): Gmail, Google Calendar, LinkedIn, Figma (not signed in), Claude Docs.

## 8. Judge round
Run the skeptical-judge agent with the brief, the live v2 URL and `git diff loglens-v2..HEAD --stat`.
Score per official criterion (20/20/20/20/20/100) with evidence, plus 5 killer questions.
Log the score trend; top weaknesses become backlog rows; questions + answers go into docs/DEFENSE.md.

## 9. Phase D ship checklist (done by 08:00)
- [ ] Final deploy; eval on live; e2e on live at 360 px + desktop; 0 console errors.
- [ ] Lighthouse mobile on live, before vs after.
- [ ] Offline test: AI off -> labelled rule-based fallback works.
- [ ] Cutover table (v1 vs v2: eval, Lighthouse, errors, AI live). Recommend one URL; the user decides. QR + deck use it.
- [ ] README, DEMO_SCRIPT, PITCH, DEFENSE, TEAM, TECH_STACK match what shipped.
- [ ] Coverage matrix: every row `proven` or listed under "honest limitations".
- [ ] Morning handoff at the top of UPGRADE_LOG in simple Hinglish: demo URL, backup URL, warm-up steps, what changed,
      limitations to admit, who says what.
- [ ] Stop the loop.
