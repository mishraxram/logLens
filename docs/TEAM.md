# Team SOLAR FLARES (HK26-0014): who does what

**Sagar Mishra** (B.Tech CSE): builder, owns every technical part.
**Krishraj Shukla** ([@krishrajshukla-eng](https://github.com/krishrajshukla-eng)): presenter, gives the talk and the live demo.

## On stage (hand-off order)
1. Krishraj: problem, users, why existing tools do not fit (Presentation, Domain Knowledge).
2. Krishraj: live demo on https://loglens-v2.loglens.workers.dev following docs/DEMO_SCRIPT.md.
3. Sagar: how it works (architecture, rules, AI checks, signed receipts) and every technical question.
4. Both: limitations and what comes next. Rule: Krishraj takes product questions, Sagar takes code questions;
   if unsure, hand over instead of guessing.
Both must be able to explain the 8-step flow in docs/DEFENSE.md and say the honest limits.

## Technical roles (Sagar)
| Role | What it covers | Files to know |
|---|---|---|
| Problem + research | ABCS-02 needs, existing tools, Indian law (BSA s.63, CERT-In), MITRE mapping | docs/PROBLEM.md, docs/RESEARCH-DEEP.md (in git history, before the 25 Oct 2026 cleanup) |
| Detection rules | 16 rules, attack chain, change register | src/lib/rules.ts, src/lib/chain.ts, src/lib/changes.ts |
| Evidence integrity | SHA-256, local hash chain, signed server receipts (D1) | src/lib/evidence.ts, functions/api/seal.ts |
| AI | Prompt, open-weight Llama 3.1 8B (Workers AI) primary + Gemini backup, checks and verdict caps on the AI answer, injection guard | src/lib/prompts.ts, functions/api/analyze.ts |
| Backend + security | Worker routes, CSP, rate limit, size limits | worker/index.ts, wrangler.jsonc |
| UI | Main desk, cases dashboard | src/pages/index.astro, src/pages/cases.astro |
| Testing | eval (17 cases), rules / hash / chain / report / seal / browser checks | tests/eval.ts, scripts/*.ts |
| Demo + pitch | 3-minute script, Q&A (with Krishraj, the presenter) | docs/DEMO_SCRIPT.md, docs/PITCH.md, docs/DEFENSE.md |

## How the work was split between me and AI tools (say this honestly if asked)
- **Me:** chose the problem and the users, decided scope and features, designed the rules and the test cases,
  checked every result, ran the demo, and can explain each file above.
- **Claude Code (AI coding assistant):** wrote most of the code and docs under my direction; every change was
  checked with the build, the eval and the browser test before it was kept.
- **Llama 3.1 8B (open-weight, Workers AI) and Gemini (backup):** only inside the app, to write the investigation summary.

## Judge question: "Who did what?"
"Sagar built it and answers the technical side; Krishraj presents and owns the story and the demo. On the
build side, Sagar delegated to tools: rules for fast triage, AI for explanation, automated tests for checking."

