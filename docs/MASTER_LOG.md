# MASTER LOG (state for LOOP-MASTER.md)
Branch `lu-upgrade` (from `avinya-final` @ 9f6c16a, tag `pre-lu-upgrade`). Not from `main` @ 3f1387f as LOOP-MASTER says:
`main` lacks the case-file UI redesign (29c5bc0) and the Llama-primary AI switch (c892f66), both done on 25 Oct.
Event: Lucknow Hacktoberfest Hack Day / "Lucknow University hackathon" (ASSUMED same event; name, date, rubric UNVERIFIED, see NEEDS YOU 1). Known rule from the user (25 Oct): open-source / open-weight AI must be an important part.
Phase: **P1 Brief** (P0 done 25 Oct 01:22).

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
| P1 Brief | rubric + coverage matrix | blocked on NEEDS YOU 1 (work around with ASSUMED rubric) | |
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
| 1 | 01:22 | P0 | inventory + conflicts | done | `claude mcp list`, settings deny list, `ls .claude/*` (table above) | (this commit) |

## Backlog (seed from LOOP-MASTER 4.2 + 9.1; re-ranked in P3)
| rank | id | item | rubric line | impact | effort | status |
|---|---|---|---|---|---|---|
| 1 | F0 | denied action = blocked attempt (medium), not Impact; group repeated reasons (D5, D6) | Prototype, Domain | H | S | todo |
| 2 | F2 | real-data mode: Loghub sample button + README real-data table (D14) | Prototype, Domain | H | S | todo (data in tests/loghub) |
| 3 | F3 | parser: Invalid user, POSSIBLE BREAK-IN, pam_unix rhost, message repeated, Apache error log (D2-D4) | PS1, Prototype | H | S-M | todo |
| 4 | F1 | linear-time rules + Web Worker parse with progress (D1, D13) | Prototype | H | S-M | todo |
| 5 | F8 | redact users/IPs before AI (D12) | Domain, Stack | M | M | todo |
| 6 | F4 | mobile: sticky verdict bar + tabs (D7) | Prototype | H | M | todo |
| 7 | F5 | attack story card + actor chips filter (D10) | PS2, Prototype | H | M | todo |
| 8 | F6 | events-per-minute strip + actor graph, plain SVG (D10) | PS2/PS3 | H | M | todo |
| 9 | F7 | new brand mark (brand/) + dark mode (D9, D11) | Presentation | M | S | todo |
| 10 | F9 | star + note on events -> report + ledger | PS5, PS6 | M | S | todo |
| 11 | F10 | case bundle ZIP + "verify yourself" sha256sum | PS4, PS5 | M | M | todo |
| 12 | F11 | rules as data + rules page | Stack, Domain | M | M | todo |
| 13 | F12 | investigator access gate | PS6 | M | M | todo |
| 14 | F13 | Ed25519 receipts (verify Workers support first) | PS4, Stack | M | M | todo |
| 15 | F14 | ledger head anchoring | PS4 | M | M | todo |

## Coverage
| requirement | what LogLens shows | evidence | missing/partial/proven |
|---|---|---|---|
| Open-source / open-weight AI is important (user, 25 Oct) | Llama 3.1 8B (Meta, Llama licence) primary on Workers AI, labelled in UI/report/README | preview eval 16/17, probes all `@cf/meta/llama-3.1-8b-instruct-fast` (docs/TESTSET.md) | partial: preview only, not production (NEEDS YOU 6) |
| (rest after the brief arrives, NEEDS YOU 1) | | | |

## Judge trend
| round | time | per-criterion scores | total |
|---|---|---|---|
