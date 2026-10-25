# LOOP-MASTER.md: LogLens ko hackathon-proof banane ka master loop

Project: LogLens (team SOLAR FLARES). Next event: **Lucknow University hackathon** (details in NEEDS YOU 1).
Written 25 Oct 2026 from a real audit of `main` @ 3f1387f: code read, check scripts run, local build screenshotted,
Loghub logs tested, competitors researched. Everything in section 4 has a command you can re-run.

Goal: no judge, from any angle (problem, domain, solution, team, stack, prototype, UI), finds a weak spot that we
did not find first, fix or honestly explain. Nobody can promise a win. This loop makes sure no mark is lost through a
missing feature, a broken demo, an ugly screen or an unanswered question.

---

## 0. How to run (Claude Code, project folder)
```bash
# one iteration now, then it schedules itself
claude "/loop Run ONE iteration of docs/ai-workflow/LOOP-MASTER.md, then schedule the next."
# or just say inside a session:  loop chalao   |   status   |   stop the loop
```
- One iteration = one unit of work, logged in `docs/MASTER_LOG.md` (template in section 13). `/clear` or a new
  session continues safely because all state lives in that file.
- First iteration ever = Phase P0 (inventory). Do not skip it.

## 1. NEEDS YOU (the loop cannot guess these; it asks once, then works around them)
| # | What | Why | If not given |
|---|---|---|---|
| 1 | Lucknow University hackathon: exact name, dates, problem statement / theme, judging rubric (PDF), round format (online/offline, slot length, stall?) | The rubric decides the backlog order | Use the Avinya rubric shape (Presentation 20, Domain 20, Solution 20, Team 20, Stack 20, Prototype 100) and mark it ASSUMED |
| 2 | The UI reference website link ("iss website ko dekho... bahut sari website hain") | It was not in the message | Skip the UI-reference step; use section 9.3 |
| 3 | `.claude/settings.json` denies `Skill(skill:deep-research)` and `Skill(skill:perplexity-deep-research)` | The old LOOP.md asked for deep-research, so its Phase R silently fell back | Keep the deny (quota) and use `competitor-scout` agent + WebSearch, or remove those two lines |
| 4 | Workers AI free tier (10,000 neurons/day) vs Workers Paid ($5/month) | Demo-day AI reliability | Stay free; never run the full eval on demo morning |
| 5 | Is Krishraj still on the team? Any new members? | Team Delegation marks | Keep docs/TEAM.md as is |

## 2. Rules that win over everything else while this loop runs
1. **No hallucination.** Every claim in code comments, UI, README, slides or the log needs one of: a command + its
   real output, a `file:line`, or a source URL + date read. Otherwise write `UNVERIFIED` and keep it off slides.
2. **Verify before using.** Every library, API, CLI flag or browser feature is checked with context7 docs or by
   running it, before it is built on.
3. **Working evidence over looks.** The prototype is about half the marks and only working evidence counts. A pretty
   screen that breaks the demo path is a regression.
4. **Never break the demo path:** sample -> timeline -> attack chain -> changes -> AI (or labelled offline summary) ->
   receipt VALID -> TAMPERED -> restore -> /cases -> report. `node scripts/e2e.ts` guards it.
5. **No fake data presented as real.** Sample data says "sample". Loghub data says "public research dataset (Loghub)"
   and cites https://github.com/logpai/loghub, as its licence asks.
6. **Safe git:** work on branch `lu-upgrade` (tag `pre-lu-upgrade` first). Push that branch only. Undo with
   `git revert`. Never force-push, never `reset --hard`, never delete files (move to `_trash/`).
7. **Secrets:** never print or commit keys. Secrets only via `npx wrangler secret put`.
8. **Ask only for:** keys/logins, money, anything outside this repo, destructive git, final deploy cutover, and the
   NEEDS YOU table. Everything else: keep moving.

## 3. Ground truth to read at the start of every iteration
`date` · `docs/MASTER_LOG.md` · this file (sections 1-6) · the hackathon brief once it exists in `docs/brief/` ·
`docs/DESIGN.md` · `.claude/rules/ui-quality.md` · `git log --oneline -5`.

---

## 4. Baseline: what is already proven (25 Oct 2026, 00:20 IST)
Re-run the command before trusting a row. Rows marked LOCAL were measured on a local build with web fonts blocked.

### 4.1 Strengths (protect these)
| Strength | Evidence |
|---|---|
| 5 offline check scripts pass | `node scripts/check-{rules,hash,changes,chain,report}.ts` all exit 0 (23 Oct) |
| Live ledger intact | `GET /api/ledger` -> 105 rows, `intact: true` (23 Oct 00:35) |
| SHA-256 matches sha256sum; 1 char -> TAMPERED | `check-hash.ts`: locked 04a9205dff35..., 42->43 TAMPERED |
| No XSS path | `index.astro:152` builds DOM with textContent; `report.ts` escapes all values |
| AI output is checked | `analyze.ts` clean(): event numbers must exist, language check, verdict whitelist, backup cap |
| Prompt-injection guard + test | `prompts.ts` untrusted markers; eval case 17 |
| Real-world SSH log parses fully | Loghub `OpenSSH_2k.log`: 2,000 events, 0 not understood (`scripts/check-loghub.ts`) |

### 4.2 Drawbacks found (seed the backlog with these)
| ID | Area | Drawback | Evidence | Impact | Effort |
|---|---|---|---|---|---|
| D1 | Rules perf | Rules are O(n^2): every event re-filters all earlier events | `rules.ts:40,82,111` (`events.slice(0, i+1).filter`); Loghub OpenSSH x1/x2/x5/x10 = 2k/4k/10k/20k events -> ~50-100/132/452/1,339 ms (one machine, one run each) | H (a judge's 50k-line log freezes the tab) | S: per-IP sliding window (queue) |
| D2 | Parser coverage | 1,480 of 2,000 real OpenSSH lines become generic `SSHD` with no meaning: `Invalid user` (113), `reverse mapping ... POSSIBLE BREAK-IN ATTEMPT` (85), `Received disconnect` (421), `message repeated N times` (2) | `check-loghub.ts` actions; grep counts | H (real logs look "dumb") | S-M |
| D3 | Parser coverage | Older syslog style `sshd(pam_unix)[pid]: authentication failure ... rhost=IP` gives 0 events | Loghub `Linux_2k.log`: 0 events, 2,000 not understood | M | S |
| D4 | Parser coverage | Apache **error** log format not supported (only access logs) | Loghub `Apache_2k.log`: 0 events | M | S |
| D5 | Logic | A DENIED (blocked) action gets `role-misuse` = HIGH and the attack chain calls it **Impact** | ERP sample event #8 `DENIED: no permission` -> flags off-hours, role-misuse; chain shows Initial Access -> Impact -> Credential Access -> Stealth | H (a sharp judge asks "how is a blocked attempt Impact?") | S: denied -> medium "attempt", no Impact stage |
| D6 | UX noise | 11 of 24 flag lines in the ERP sample are the same `off-hours` reason; change cards repeat "Session login #14..." 3 times | `cnt.ts` count; screenshot | M | S: group repeated reasons, show once per session |
| D7 | Mobile UX | After opening the ERP sample the phone page is ~8,950 px tall; input form + evidence come before the verdict | LOCAL 360x780: scrollHeight 8,954; scrollWidth 360 (no side scroll, good) | H | M: sticky verdict bar + tabs (9.3) |
| D8 | Desktop UX | Left column ends at ~1,300 px, then empty while the right column runs to ~4,460 px; hero text takes the first screen | LOCAL 1366x860 screenshot | M | M: 3-zone layout (9.3) |
| D9 | UI | No dark mode | `grep prefers-color-scheme src` -> 0 | M | S |
| D10 | UI | No visual of time or actors: everything is text cards; no events-over-time chart, no IP <-> account graph | screenshots | H ("wow" factor) | M |
| D11 | Brand | Logo is a 26 px plain magnifier, same as favicon | `Base.astro` header SVG, `public/favicon.svg` | M | S: new animated eye mark (in `brand/`) |
| D12 | Privacy | Usernames and IPs go to Gemini / Workers AI unmasked | `analyze.ts` sends `user`, `ip` as-is; no redaction code (`grep redact` -> 0) | M (judge: "data leak to Google?") | M: redact toggle |
| D13 | Big files | Parsing runs on the main thread; no progress for large files | no `Worker(` in `index.astro` | M | M: Web Worker + progress |
| D14 | Evidence | Test data is only self-written; "made-up data" is the first judge attack | TESTSET.md | H | S: Loghub sample + real-data eval (10.2) |
| D15 | Access | No login; anyone can add receipts | README limits | M | M (see 9.1 F12) |
| D16 | Config | Deep-research skill is denied but the old loop depends on it | `.claude/settings.json` deny list | L | S (NEEDS YOU 3) |

---

## 5. Phases
Dates are set from the hackathon brief (NEEDS YOU 1). Until then use relative gates: G1 = 48 h before the event.
| Phase | Work | Exit gate |
|---|---|---|
| P0 Inventory | Section 11.1: list every installed skill, agent, command, MCP server, plugin; check the deny list; write the trigger map into MASTER_LOG | Trigger table filled; conflicts listed |
| P1 Brief | Save the hackathon brief to `docs/brief/`; build the rubric table and coverage matrix (rubric lines + PS lines) | Matrix exists; every row `missing/partial/proven` |
| P2 Research | `competitor-scout`: section 8 list + UI reference site (if given) + "what wins student cyber hackathons" -> `docs/RESEARCH-MASTER.md` | Steal list ranked with sources |
| P3 Audit | `forensic-auditor` + `ui-critic` + `skeptical-judge`, areas of section 7 -> findings merged into the backlog | Backlog ranked by marks impact / effort |
| P4 Blueprint | Write `docs/BLUEPRINT.md`: target features (9.1), architecture (9.2), UI spec (9.3), ADRs for any stack change (section 10) | User says "go" once (only stop point in P4) |
| P5 Build | One slice per iteration, top of backlog first | Every H item `done` or consciously cut |
| P6 Harden | **Feature freeze at G1.** Bugs, a11y, perf, copy, tests, real-data eval, deck, pitch, Q&A | All checks green twice in a row |
| P7 Ship | Final deploy, verification on live, morning handoff, stop | Section 12 checklist all ticked |
Judge round (section 12.1) every 3rd iteration and at the start of P6. If a phase runs late, cut the lowest backlog
rows, never verification.

## 6. One iteration (exact steps)
1. `date`; read section 3; choose the phase from the gate table in MASTER_LOG.
2. Apply any answers the user wrote under NEEDS YOU.
3. Pick the top `todo` row that fits the phase (estimate x 1.5 must end inside the phase).
4. Verify every API / flag / library first (context7 or run it). Write `VERIFIED <how>` in the log row.
5. Do the work with the skill/agent from the trigger map (section 11). Small, end-to-end, visible in the browser.
6. Prove it. Paste real output lines into the log:
   - `npm run check` (build + typecheck + worker bundle + 5 check scripts)
   - `node scripts/check-loghub.ts tests/loghub/*.log` (after slice F1/F2 exists)
   - `node scripts/e2e.ts <local or live url> 360` and `1280`: 0 console errors
   - UI change -> `ui-critic` screenshots at 360 / 390 / 768 / 1366, `scrollWidth == viewport`
   - AI change -> `node tests/eval.ts` (max once per hour on free tier)
   Fail -> fix once -> still failing -> `git revert`, mark `blocked` with the reason.
7. Commit `<area>: <slice>` + push `lu-upgrade`. Deploy to the Worker only when green (deploy needs NEEDS-YOU-free
   credentials already set; if `wrangler whoami` fails, stop and ask).
8. Update MASTER_LOG: iteration row, matrix cells with evidence, backlog status, score trend.
9. Schedule the next iteration: 60-120 s if work is ready; 1200 s if blocked on the user.

## 7. Forensic audit checklist (P3; every area, no gaps)
Each finding: area, drawback, evidence, rubric line, impact H/M/L, effort S/M/L, smallest fix.
| # | Area | What to check |
|---|---|---|
| 1 | Problem fit | Does every PS line map to a working feature? Is the user (college IT cell) real and named? |
| 2 | Parser | Each format on real data (Loghub) + edge cases: year roll-over, time zones, CRLF, BOM, huge lines, gzip, mixed formats in one file |
| 3 | Rules | Precision on real data (how many flags are noise?), thresholds as assumptions, severity logic, D5-type logic errors, O(n) cost |
| 4 | Attack chain | Stage order makes sense to a human; blocked actions; shared office IPs merging people |
| 5 | AI | Latency vs 8 s, provider fallbacks, citation check, prose not fact-checked, injection, redaction, Hindi |
| 6 | Integrity | SHA-256 correctness, receipt formula, chain fork, tail-cut, key handling, what a receipt proves |
| 7 | Backend/API | Validation, limits (413/415/429), error shape, health, CORS, headers/CSP |
| 8 | Database | D1 schema, UNIQUE(prev_hash), migrations, test rows in prod ledger |
| 9 | Security | XSS, CSP, secrets, rate limit, upload limits, dependency audit (`npm audit --omit=dev`) |
| 10 | Privacy/legal | What leaves the browser, DPDP wording, BSA s.63 wording, "not a legal certificate" everywhere |
| 11 | UI desktop | Layout balance, hierarchy, density, empty/loading/error states, first-minute clarity |
| 12 | UI mobile | 360/390 px, thumb reach, sticky actions, page height, tap targets 44 px, text 16 px |
| 13 | Accessibility | Contrast (AA), focus order, labels, `aria-live` for results, reduced motion |
| 14 | Performance | Lighthouse mobile live (P/A/BP/SEO), big-file parse time, main-thread blocking |
| 15 | Tests | Unit checks, eval honesty, real-data eval, e2e, flaky AI handling |
| 16 | Docs/DX | README runs from a clean clone in 3 commands; numbers in docs = numbers in code |
| 17 | Deploy/ops | Worker secrets, D1 binding, quota, offline mode on venue Wi-Fi, v1 backup |
| 18 | Presentation | Deck = shipped features, timing, architecture diagram, demo video backup |
| 19 | Team | Roles, both can explain the 8-step flow, hand-off rule |
| 20 | Stall/expo | 30-s and 2-min pitch, phone demo, QR, printed one-pager |

---

## 8. Competitors and what to take from them (P2 expands this; sources read 25 Oct 2026)
Learn the pattern, never copy code, text or branding.
| Tool | What it is | Best thing it does | Gap for a small college IT cell | Steal for LogLens |
|---|---|---|---|---|
| Elastic Security **Attack Discovery** ([docs](https://elastic.co/docs/current/serverless/security/attack-discovery)) | LLM groups open alerts (100 default, up to 500) into "discoveries" | Each discovery = title + summary + ATT&CK tactics + implicated users/hosts; actions "Investigate in timeline", "Add to case", follow-up chat; admin chooses which fields go to the LLM and which are **anonymized** | Needs an Elastic stack, alerts already ingested, an LLM connector | **F5 Attack story card** (title, actors as clickable chips, tactic strip, "show in timeline") and **F8 redaction before AI** |
| **Timesketch** + Sec-Gemini agent ([talk, BH USA 2025](https://elie.net/talk/autonomous-timeline-analysis-and-threat-hunting-an-ai-agent-for-timesketch)) | Open-source collaborative timeline tool; AI agent reconstructs attack chains, shown in an "AI Panel" | Several analysts in one sketch, comments on events; agent evaluated on 100 real compromised systems | Multi-service server setup, analyst skills | **F9 star + note on any event** (goes into report and ledger) and **F2 real-data evaluation** |
| **Hayabusa** / **Chainsaw** + **Sigma** | Fast CLI timeline + threat hunting on Windows event logs with community Sigma rules | Standard, shareable rule format; severity levels; summaries | Windows EVTX focus, CLI | **F11 rules as data** (YAML/JSON with id, level, MITRE, condition), Sigma-style fields. P2 must verify current Sigma field names before building |
| **Loghub** ([GitHub](https://github.com/logpai/loghub)) | Public research collection of real system logs (19 datasets; OpenSSH 70 MiB, Linux 2.25 MiB, Apache error 4.9 MiB...) | Real, unmodified logs; used by 450+ organisations (per README) | Not a tool; labels are only for some datasets (HDFS, BGL, Thunderbird, OpenStack, Hadoop) and are not security labels | **F1/F2**: real-data sample + eval. Licence: free for research/academic use, cite the repo URL |
| Splunk / ELK / Wazuh / Autopsy | SIEM / endpoint / disk forensics | Scale, real-time | Setup, cost, skills; no plain Hindi summary | Positioning only: LogLens = first-hour browser triage |

Is Loghub useful? **Yes, for 3 things:** (1) a real-world sample button ("Real SSH attack log, public research data"),
which answers the "only made-up data" attack; (2) a real-data eval and perf test (it already found D1-D4); (3) more
parser formats. **Not useful for:** accuracy numbers (no security labels) or Windows security events (the Loghub
"Windows" sample is CBS/CSI servicing logs, checked 25 Oct).

---

## 9. Blueprint (P4 turns this into docs/BLUEPRINT.md; P5 builds it)

### 9.1 Feature backlog (ranked by marks impact / effort)
| ID | Feature | Fixes | Rubric hit | Effort |
|---|---|---|---|---|
| F0 | Fix logic: denied action = "blocked attempt" (medium), not Impact; group repeated reasons | D5, D6 | Prototype, Domain | S |
| F1 | Linear-time rules (per-IP/per-user sliding windows) + parse in a Web Worker with progress | D1, D13 | Prototype (reliability, scale) | S-M |
| F2 | Real-data mode: `tests/loghub/` + `scripts/check-loghub.ts` + 4th sample "Real SSH attack (Loghub, research data)"; README table of real-data results | D14 | Prototype (testing), Domain | S |
| F3 | Parser: `Invalid user`, `POSSIBLE BREAK-IN ATTEMPT`, `pam_unix authentication failure ... rhost=`, `message repeated N times` (expand to N events), Apache error log | D2-D4 | PS1, Prototype | S-M |
| F4 | Mobile result layout: sticky verdict bar + tabs (Story / Changes / Timeline / Evidence); input collapses into a one-line case header | D7 | Prototype (usability) | M |
| F5 | Attack story card on top (title, 2-line summary, actor chips, tactic strip); click any IP/user chip -> timeline filters | D10 | PS2, Prototype | M |
| F6 | Visuals: events-per-minute strip (severity colours) + actor graph (IP <-> account) in plain SVG, no chart library | D10 | PS2/PS3, Prototype | M |
| F7 | New brand: animated eye magnifier (`public/brand/`), dark mode tokens | D9, D11 | Presentation | S |
| F8 | Redact before AI: IPs/users -> `IP_1`, `USER_2` tokens, mapped back in the browser; on by default | D12 | Domain (privacy), Stack | M |
| F9 | Star + note on events -> into report and a `NOTE_ADDED` ledger action | Timesketch idea | PS5, PS6 | S |
| F10 | Case bundle: one-click ZIP (original file, report HTML, receipt JSON, `SHA256SUMS`) + "verify yourself" copy button with the `sha256sum` command | Trust | PS4, PS5 | M |
| F11 | Rules as data (`src/rules/*.json` with id, level, MITRE, condition) + a rules page listing all of them | Hayabusa/Sigma idea | Stack, Domain | M |
| F12 | Investigator access for `/cases` and receipts (option A: Cloudflare Access; option B: simple invite code checked in the Worker). **Verify** current Cloudflare Access free-tier terms before choosing | D15 | PS6, Domain | M |
| F13 | Public-key receipts (Ed25519) so anyone can verify a receipt offline with the published key. **Verify** Ed25519 support in Workers Web Crypto with context7 first; keep HMAC if not supported | Trust | PS4, Stack | M |
| F14 | Ledger head anchoring: publish the head hash daily to a public place (for example a GitHub commit) | Tail-cut limit | PS4 | M |
Do not start: Windows EVTX parsing, a trained ML model, a React rewrite, real-time monitoring. Each is large, risky,
and none can be proven well before the event.

### 9.2 Target architecture (same stack, sharper)
```
Browser (Astro pages + small TS)
  ├─ Web Worker: parse -> rules (linear) -> chain -> changes        (raw file never leaves)
  ├─ main thread: UI, SHA-256 (Web Crypto), redaction map, report, bundle
  └─ fetch → Cloudflare Worker
        ├─ /api/analyze  Gemini x3 race + Workers AI backup, 8 s, citation check (redacted input only)
        ├─ /api/seal, /api/ledger  HMAC (or Ed25519) receipts, hash chain, D1 SQLite
        └─ access gate for /cases + seal (F12)
```

### 9.3 UI spec (the "judges ruk jayein" pass)
Direction stays: a forensic evidence desk (docs/DESIGN.md). Follow `.claude/rules/ui-quality.md` (no purple gradients,
no glass blobs, no neon hacker look, no "AI-powered" sparkles). The wow comes from **real evidence made visible**, not
decoration.
- **Phone (360-430 px):** empty state = logo, one line, 4 sample rows, paste/upload. After a case opens: a sticky
  top **verdict bar** (risk colour, `10 high · 3 unauthorized`, receipt status icon) + a bottom tab bar
  **Story | Changes | Timeline | Evidence** with 44 px targets. Input collapses to "erp-marks-tamper.csv · Change".
  Target page height per tab < 3 screens.
- **Desktop (>= 1200 px):** 3 zones: left = case + evidence tag + progress; centre = attack story card, time strip,
  timeline; right = inspector (selected event: raw line, flags with MITRE, hash of that line, star + note).
  No hero once a case is open.
- **Signature moments:** (1) the evidence tag "seals" with a short stamp when the hash is made; (2) TAMPERED shows the
  changed line as a before/after diff with the red seal; (3) the logo eye blinks while the AI is thinking.
  All motion off under `prefers-reduced-motion`.
- **Density:** one row per event, repeated reasons grouped ("off-hours ×11"), MITRE chips only on hover/tap on phone.
- **Dark mode:** paper/ink tokens swap; the evidence tag stays amber; dark logo variant `public/brand/loglens-mark-dark.svg`.
- **Hindi:** Noto Sans Devanagari loaded; check every label in Hindi mode at 360 px.
- **Logo:** `public/brand/loglens-mark.svg` (blinks every 5 s, iris drifts, reduced-motion safe) in the app bar at 32-40 px
  and on the empty state at 96 px; `public/favicon.svg` (static, done) `public/favicon.svg`.
- If the user gives the UI reference site (NEEDS YOU 2): `competitor-scout` lists 5 patterns, `ui-critic` checks the
  result. Take patterns, never a brand look.

---

## 10. Language, framework and stack decision
**Keep TypeScript + Astro + one Cloudflare Worker + D1 + Web Crypto + Gemini/Workers AI.** (Confidence: HIGH that this
is the right call for this event; MEDIUM on any judge preferring Python.)
| Option | Verdict | Why |
|---|---|---|
| Rewrite in Python/FastAPI/React | No | Throws away a working, tested, Lighthouse-100 app days before the event; the rubric rewards working evidence, not the suggested stack |
| Next.js / React for the UI | No | More JS on phones; nothing in 9.3 needs it; Astro + small TS already handles it |
| Add Web Worker | Yes (F1) | Keeps the UI responsive on big real logs |
| Add a chart/graph library | No | Two small SVG visuals (F6) are lighter and fully controllable |
| Add Python | Only offline | Optional notebook for dataset analysis; never in the demo path |
Any stack change needs an ADR in `docs/DECISIONS.md` (problem, options, choice, proof) before code.

## 11. Auto-trigger map (skills, agents, commands)
### 11.1 P0 inventory (first iteration)
Run and paste into MASTER_LOG: `ls ~/.claude/skills ~/.claude/agents ~/.claude/commands .claude/skills .claude/agents 2>/dev/null`,
`claude mcp list`, the plugin list (`/plugin`), and the deny list from `.claude/settings.json`. Mark each tool
`available / denied / missing`. Never call a denied tool; use the fallback.

### 11.2 Trigger table
| When (user words or situation) | Use | Fallback if missing/denied |
|---|---|---|
| "loop", "status", "next", "upgrade", "best banao" | project skill `master-loop` | read this file and run section 6 |
| Hackathon brief / PS pasted | project skill `ps-decode` (scoring part only) | manual rubric table |
| Competitors, market, "ye website dekho", any URL to learn from | agent `competitor-scout` | WebSearch + WebFetch, same rules |
| "kya kami hai", audit, pros/cons, after a big slice | agent `forensic-auditor`; agent-skills `code-review-and-quality` / `code-reviewer` if installed | forensic-auditor only |
| UI, mobile, design, "judges pagal" | agent `ui-critic`, project skill `polish`, `frontend-design` skill, `.claude/rules/ui-quality.md` | ui-critic only |
| Charts / time strip / actor graph | `dataviz` skill | plain SVG with DESIGN.md tokens |
| Architecture diagram for slides | `artifact-diagramming` skill | Mermaid in docs |
| Security pass | agent-skills `security-and-hardening` / `security-auditor`; Strix skills on the local preview only | `npm audit --omit=dev` + manual CSP/XSS checklist |
| Tests / eval | project skill `eval-set`, agent-skills `test-driven-development` | `node tests/eval.ts`, check scripts |
| Error, build fails twice | project skill `fix-loop`, agent-skills `debugging-and-error-recovery` | revert + log |
| Risky choice (crypto, auth, D1 schema) | agent-skills `doubt-driven-development` + an ADR | ADR only |
| Lighthouse / speed | agent-skills `performance-optimization` / `web-performance-auditor` | `npx lighthouse <url> --preset=perf` |
| API / library details | context7 MCP | official docs via WebFetch |
| Score check | agent `skeptical-judge`, project skill `judge-me` | — |
| Deck / pitch / Q&A | project skills `pitch`, `defend`; Slides artifact or Canva MCP (ask before editing a user design) | docs/PITCH.md |
| Deploy / submit | project skill `ship`, agent-skills `shipping-and-launch` | section 12 checklist |
| Long session / quota | project skill `handoff` | MASTER_LOG is the state |
Names marked "if installed" come from the old LOOP.md; P0 confirms which really exist on this machine.

## 12. Judge round, killer questions, ship
### 12.1 Judge round
`skeptical-judge` with the brief, the live URL and `git diff pre-lu-upgrade..HEAD --stat`. Score per rubric line with
evidence + 5 killer questions. Weaknesses -> backlog. Questions + honest answers -> docs/DEFENSE.md.
Questions it must always try: "Did you test on real logs?" (F2), "Why is a blocked attempt Impact?" (F0),
"What does Google see?" (F8), "Who can add receipts?" (F12), "What if I upload 100 MB?" (F1 + limits),
"What did you build vs the AI tool?" (docs/TEAM.md).

### 12.2 Ship checklist (P7)
- [ ] `npm run check` green; `check-loghub` numbers updated in README; e2e 360 + 1280 on live, 0 console errors
- [ ] Lighthouse mobile live, before vs after, in MASTER_LOG
- [ ] Offline test: AI off -> labelled summary; ledger off -> "local hash only"
- [ ] README, TECH_STACK, DEFENSE, PITCH, TEAM, deck, QR = what shipped (no old numbers: grep for "13 rules", "14/14", "pages.dev" as main URL)
- [ ] Every coverage-matrix row `proven` or listed as an honest limitation
- [ ] Demo video recorded on the final build; v1/v2 backup URLs in DEMO_SCRIPT
- [ ] Morning handoff at the top of MASTER_LOG in simple Hinglish; then stop the loop

## 13. docs/MASTER_LOG.md template (create on first run)
```markdown
# MASTER LOG (state for LOOP-MASTER.md)
Branch lu-upgrade (from main @ <hash>, tag pre-lu-upgrade). Event: <name, date>. Phase: P0.
## NEEDS YOU   (copy section 1, update status)
## Tools (P0)  | tool | type | status | used for |
## Gates       | phase | exit gate | status | evidence |
## Iterations  | # | time | phase | item | result | evidence (command + output line) | commit |
## Backlog     | rank | id | item | rubric line | impact | effort | status |
## Coverage    | requirement | what LogLens shows | evidence | missing/partial/proven |
## Judge trend | round | time | per-criterion scores | total |
```

## 14. Stop conditions
Stop and send one message when: the user says stop; P7 is done; a NEEDS YOU item blocks every remaining row; the same
check fails after 2 fix attempts on 3 different rows (something is wrong at a deeper level: write it up, do not keep
retrying).
