# Contributing

Thanks for helping. LogLens is a small project, so the rules are short.

## Setup
```bash
npm install
cp .env.example .dev.vars     # SEAL_SECRET (any long random string); GEMINI_API_KEY only for the backup AI
npm start                     # build + local D1 + wrangler dev on http://localhost:8787
```
Node 23.6 or newer (scripts are TypeScript run directly by Node).

## Before you open a pull request
1. `npm run check` passes (build, typecheck, worker bundle, rules / hash / changes / chain / report / redact checks).
2. `npm run loghub` still parses the three real Loghub files (numbers are in the README).
3. For UI changes: `node scripts/e2e.ts http://localhost:8787/ 360` and `1366` pass with 0 console errors, and
   `node scripts/check-fold.ts http://localhost:8787/ 1366 768 out.jpg` still shows the attack chain above 768 px.
4. For AI changes: `node tests/eval.ts http://localhost:8787/api/analyze` (uses the free Workers AI quota; run it once,
   not in a loop) and write the result in `docs/TESTSET.md`, failures included.

## Rules of the house
- Rules must stay explainable: every flag has a plain-English reason, a severity and, where one fits, a MITRE ATT&CK ID.
- No fake data presented as real. Made-up samples say "sample"; real data says where it came from.
- No secrets in git. Secrets live in `.dev.vars` (local) or `wrangler secret put` (live).
- Keep it light: no new framework or UI library without a short note in `docs/DECISIONS.md`.
