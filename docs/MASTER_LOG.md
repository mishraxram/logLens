# MASTER LOG (state for LOOP-MASTER.md)
Branch `lu-upgrade` (from `avinya-final` @ 9f6c16a, tag `pre-lu-upgrade`). Not from `main` @ 3f1387f as LOOP-MASTER says:
`main` lacks the case-file UI redesign (29c5bc0) and the Llama-primary AI switch (c892f66), both done on 25 Oct.
Event: Lucknow Hacktoberfest Hack Day / "Lucknow University hackathon" (ASSUMED same event; name, date, rubric UNVERIFIED, see NEEDS YOU 1). Known rule from the user (25 Oct): open-source / open-weight AI must be an important part.
Phase: **P3 Audit** (P0, P1 assumed, P2 UI research done; 2 UI slices built early on user request 25 Oct 01:41).

## NEEDS YOU
| # | What | Status |
|---|---|---|
| 1 | Lucknow hackathon: exact name, dates, PS/theme, rubric PDF, round format. Put it in `docs/brief/lucknow/` | OPEN. `docs/brief/` has only Avinya files. Until then: Avinya rubric shape, marked ASSUMED |
| 2 | UI reference website link | OPEN. Skipped; using LOOP-MASTER 9.3 |
| 3 | `deep-research` + `perplexity-deep-research` denied in `.claude/settings.json` | Kept denied (quota). Fallback: `competitor-scout` agent + WebSearch |
| 4 | Workers AI free (10,000 neurons/day) vs Paid ($5/month). Now more important: Llama is the PRIMARY AI | OPEN. Stay free; eval max once per hour; never full eval on demo morning |
| 5 | Krishraj still on team? New members? | OPEN. docs/TEAM.md kept as is |
| 6 | Promote Worker version 33bbb466 (Llama primary) from preview alias `llama` to production? | OPEN (asked 25 Oct 01:16) |
| 7 | Eval case 2: accept "unsure" for the normal faculty log, or keep it a fail? | OPEN |

## Tools (P0, checked 25 Oct 01:20)
| tool | type | status | used for |
|---|---|---|---|
| master-loop, ps-decode, eval-set, judge-me, polish, pitch, defend, fix-loop, handoff, ship, build-slice | project skill | available | trigger map 11.2 |
| competitor-scout, forensic-auditor, ui-critic, skeptical-judge | project agent | available | P2, P3, judge rounds |
| agent-skills (code-review-and-quality, security-and-hardening, doubt-driven-development, test-driven-development, debugging-and-error-recovery, performance-optimization, shipping-and-launch) + agents code-reviewer, security-auditor, test-engineer, web-performance-auditor | plugin | available | audit, security, perf, ship |
| Strix skills (web-app-penetration-testing etc.) | user skill | available | security pass on local preview only |
| dataviz, artifact-diagramming | skill | available | F6 visuals, architecture diagram |
| frontend-design | skill | **missing** | fallback: polish + ui-critic + ui-quality.md |
| deep-research, perplexity-deep-research, chrome-browser, built-in-browser, computer-use, docs, docx | skill | **denied** | fallback: WebSearch/WebFetch; headless Chrome via `scripts/e2e.ts` |
| context7 | MCP | connected | verify APIs |
| Canva, Google Drive, Claude Docs | MCP | connected | deck (ask before editing a user design) |
| Figma, LinkedIn | MCP | needs auth | not used |
| chrome-devtools MCP | MCP | missing | fallback: `scripts/e2e.ts` (headless Chrome over CDP) |
| hooks | settings | none active | `.claude/settings.hooks.example.json` kept as example only (not merged) |

Conflicts found:
- LOOP-MASTER 9.2 / 10 still say "Gemini x3 race + Workers AI backup". Since c892f66 the PRIMARY is open-weight Llama 3.1 8B on Workers AI, Gemini is backup. 9.2 must be read that way.
- CLAUDE.md says "after every change run node tests/eval.ts"; LOOP-MASTER says max once per hour (free tier). Followed: eval only after AI changes, max once per hour; offline check scripts after every change.
- `.claude/settings.json` pins model `sonnet`.

## Gates
| phase | exit gate | status | evidence |
|---|---|---|---|
| P0 Inventory | trigger table filled, conflicts listed | done 01:22 | this file |
| P1 Brief | rubric + coverage matrix | done ASSUMED 01:26 (redo with Lucknow brief) | Coverage section |
| P2 Research | steal list with sources | todo | |
| P3 Audit | ranked backlog | todo | |
| P4 Blueprint | user says "go" | todo | |
| P5 Build | H items done or cut | todo | |
| P6 Harden | checks green twice | todo | |
| P7 Ship | 12.2 checklist | todo | |

## Iterations
| # | time | phase | item | result | evidence (command + output line) | commit |
|---|---|---|---|---|---|---|
| 0 | 01:20 | setup | install pack, branch, Loghub baseline | done | `check-loghub.ts`: OpenSSH 2000 events, 0 not understood, actions SSHD 1480 / LOGIN_FAIL 517, flags burst-fail 490, shared-ip 72; Linux 0 events / 2000 not understood; Apache (error log) 0 events / 2000 not understood | 5556d15 |
| 1 | 01:22 | P0 | inventory + conflicts | done | `claude mcp list`, settings deny list, `ls .claude/*` (table above) | 85c9602 |
| 2 | 01:26 | P1 | ASSUMED rubric + coverage matrix | done | 13 rows, 2 proven / 11 partial; new gap: AI story stale in TECH_STACK/PITCH/DEFENSE (`grep -n Gemini docs/TECH_STACK.md` line 13, 32) | 87e0248 |
| 3 | 01:40 | P2 | UI research: 29 pack sites + indiepage + 39 Marc Lou sites + Stalkr full page (docs/ui-research/) | done | 27/29 opened (wcag22 403, m3 404 redirect); googe.com timed out | 900a8e7, 07402a9 |
| 4 | 01:46 | P5 | UI slice 1: compact case summary + mini MITRE strip + chain stepper + status icons + 01-04 empty steps | done | check-fold 1366x768 chain 458-712 (was 651-964); npm run check 0; e2e 360/1366/1920 PASS | e1bfc71 |
| 5 | 01:55 | P5 | UI slice 2: blinking-eye logo (F7 part) | done | blink test 17 frames, reduced motion 1 frame; e2e 360/1366/1920 PASS | 9d3d445 |

## Backlog (seed from LOOP-MASTER 4.2 + 9.1; re-ranked in P3)
| rank | id | item | rubric line | impact | effort | status |
|---|---|---|---|---|---|---|
| 0 | F15 | AI story = open-weight Llama primary in TECH_STACK, PITCH, DEFENSE, DEMO_SCRIPT, TEAM (stale Gemini-primary text) | Tech Stack, Presentation, open-weight rule | H | S | todo |
| 1 | F0 | denied action = blocked attempt (medium), not Impact; group repeated reasons (D5, D6) | Prototype, Domain | H | S | todo |
| 2 | F2 | real-data mode: Loghub sample button + README real-data table (D14) | Prototype, Domain | H | S | todo (data in tests/loghub) |
| 3 | F3 | parser: Invalid user, POSSIBLE BREAK-IN, pam_unix rhost, message repeated, Apache error log (D2-D4) | PS1, Prototype | H | S-M | todo |
| 4 | F1 | linear-time rules + Web Worker parse with progress (D1, D13) | Prototype | H | S-M | todo |
| 5 | F8 | redact users/IPs before AI (D12) | Domain, Stack | M | M | todo |
| 6 | F4 | mobile: sticky verdict bar + tabs (D7); 360 page still 8,702 px | Prototype | H | M | todo (next) |
| 7 | F5 | attack story card + actor chips filter (D10) | PS2, Prototype | H | M | todo |
| 8 | F6 | events-per-minute strip + actor graph, plain SVG (D10) | PS2/PS3 | H | M | todo |
| 9 | F7 | new brand mark (brand/) + dark mode (D9, D11) | Presentation | M | S | logo done 9d3d445; dark mode todo |
| 10 | F9 | star + note on events -> report + ledger | PS5, PS6 | M | S | todo |
| 11 | F10 | case bundle ZIP + "verify yourself" sha256sum | PS4, PS5 | M | M | todo |
| 12 | F11 | rules as data + rules page | Stack, Domain | M | M | todo |
| 13 | F12 | investigator access gate | PS6 | M | M | todo |
| 14 | F13 | Ed25519 receipts (verify Workers support first) | PS4, Stack | M | M | todo |
| 15 | F14 | ledger head anchoring | PS4 | M | M | todo |

## Rubric (ASSUMED until NEEDS YOU 1: Avinya shape, docs/brief/AVINYA_BRIEF.md:16-24)
Presentation 20 · Domain Knowledge 20 · Proposed Solution 20 · Team Delegation 20 · Tech Stack 20 · **Prototype 100** (credit only for working evidence).
Extra line for the Lucknow event (from the user, 25 Oct): open-source / open-weight AI must be an important part.
PS lines ASSUMED = ABCS-02 PS1-PS6 (AVINYA_BRIEF.md:29-36) until the Lucknow PS arrives.

## Coverage (P1, 25 Oct 01:26; evidence = runs from this session unless dated)
| requirement | what LogLens shows | evidence | missing/partial/proven |
|---|---|---|---|
| Open-weight AI is important (user) | Llama 3.1 8B (Meta, Llama licence) primary on Workers AI, labelled in UI/report/README | preview eval 16/17 01:14, probes cases 1/2/3 all `@cf/meta/llama-3.1-8b-instruct-fast` (docs/TESTSET.md) | partial: preview only, not production (NEEDS YOU 6) |
| PS1 evidence analysis (logs, metadata, artifacts) | ERP CSV, auth.log, web access log parsed; any file hashed with metadata | `check-rules.ts` exit 0; e2e "file upload -> metadata on evidence tag" PASS; Loghub OpenSSH 2000/0 not understood | partial: real Linux syslog + Apache error log 0 events (D2-D4) |
| PS2 AI pattern discovery | 16 rules + MITRE, attack chain, AI indicators citing event #s, hidden patterns, AI vs rules cross-check | `check-chain.ts` CHAIN PASS; e2e "AI vs rules cross-check shown" PASS 360+1280 | partial: blocked attempt shown as Impact (D5); 8B over-calls normal logs (eval case 2) |
| PS3 timeline | sorted timeline, flagged rows, change register | e2e timeline step PASS; `check-changes.ts` exit 0 | partial: no time visual (D10), noisy repeated reasons (D6) |
| PS4 SHA-256 integrity | Web Crypto SHA-256, MATCH/TAMPERED, diff + restore, HMAC hash-chained receipt in D1 | `check-hash.ts` exit 0; e2e MATCH -> TAMPERED, RECEIPT VALID PASS on preview | proven |
| PS5 automated report | HTML/PDF report with findings, timestamps, cited events, MITRE, chain | `check-report.ts` REPORT PASS (8 checks) | proven |
| PS6 dashboard + audit trail | /cases ledger, hash-chained audit trail | e2e "cases dashboard loads", "Ledger intact" PASS | partial: no access gate for "authorised investigators" (D15) |
| Prototype: works consistently | e2e demo path, 0 console errors | e2e PASS 360 + 1280 on preview 01:14 | partial: production still old version |
| Prototype: testing | 5 offline checks, eval 17 cases, e2e | `npm run check` exit 0; eval 16/17 | partial: self-written data only (D14), Loghub not in eval yet |
| Prototype: reliability at scale | 4,999-event case parses | eval case 11 PASS (30-37 ms) | partial: rules O(n^2) (D1), main-thread parse (D13) |
| Domain: privacy | only parsed lines sent, said in UI | index.astro privacy note | partial: no redaction (D12) |
| Tech Stack: why each tool | docs/TECH_STACK.md | file exists | partial: still says Gemini primary (stale since c892f66) |
| Presentation / Team | docs/PITCH.md, DEFENSE.md, TEAM.md | files exist | partial: AI story stale (Gemini) in PITCH/DEFENSE/TECH_STACK; NEEDS YOU 5 |

## Judge trend
| round | time | per-criterion scores | total |
|---|---|---|---|
