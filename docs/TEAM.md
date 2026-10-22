# Team SOLAR FLARES (HK26-0014): who does what

**Solo team: Sagar Mishra** (B.Tech CSE). One person owns every part, so there is no hand-off on stage.

## Roles (all Sagar)
| Role | What it covers | Files to know |
|---|---|---|
| Problem + research | ABCS-02 needs, existing tools, Indian law (BSA s.63, CERT-In), MITRE mapping | docs/PROBLEM.md, docs/RESEARCH-DEEP.md |
| Detection rules | 13 rules, attack chain, change register | src/lib/rules.ts, src/lib/chain.ts, src/lib/changes.ts |
| Evidence integrity | SHA-256, local hash chain, signed server receipts (D1) | src/lib/evidence.ts, functions/api/seal.ts |
| AI | Prompt, Gemini + Workers AI backup, checks on the AI answer, injection guard | src/lib/prompts.ts, functions/api/analyze.ts |
| Backend + security | Worker routes, CSP, rate limit, size limits | worker/index.ts, wrangler.jsonc |
| UI | Main desk, cases dashboard | src/pages/index.astro, src/pages/cases.astro |
| Testing | eval (17 cases), rules / hash / chain / report / seal / browser checks | tests/eval.ts, scripts/*.ts |
| Demo + pitch | 3-minute script, Q&A | docs/DEMO_SCRIPT.md, docs/PITCH.md, docs/DEFENSE.md |

## How the work was split between me and AI tools (say this honestly if asked)
- **Me:** chose the problem and the users, decided scope and features, designed the rules and the test cases,
  checked every result, ran the demo, and can explain each file above.
- **Claude Code (AI coding assistant):** wrote most of the code and docs under my direction; every change was
  checked with the build, the eval and the browser test before it was kept.
- **Gemini / Workers AI:** only inside the app, to write the investigation summary.

## Judge question: "You are one person. How is Team Delegation shown?"
"I am a solo team, so I delegated to tools instead of people: rules for fast triage, AI for explanation,
automated tests for checking. I own every part, so I can answer any question on any part."
