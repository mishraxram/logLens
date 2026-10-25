# LogLens

[![CI](https://github.com/mishraxram/logLens/actions/workflows/ci.yml/badge.svg)](https://github.com/mishraxram/logLens/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

**Find who changed what. Prove the log was not touched.**
LogLens turns a raw server or ERP log into a timeline with explainable red flags and a MITRE ATT&CK attack chain,
asks an **open-weight AI (Llama 3.1 8B by Meta)** to explain it, and seals the evidence with SHA-256 and a signed
server receipt. It runs in the browser: no install for the investigator.

**Live:** https://loglens-v2.loglens.workers.dev · **Cases dashboard:** [/cases](https://loglens-v2.loglens.workers.dev/cases)
· Team SOLAR FLARES · built for college IT and cyber-cell investigators.

Try it in the browser: open the live link, pick **ERP marks tampering**, and the verdict and attack chain show on the
first laptop screen (1366x768). Works on phones (360 px) and has a light / dark switch in the app bar.

## The problem
After an incident (example: a student's ERP marks changed from 42 to 92 at 2 AM), a college IT or cyber-cell
investigator has thousands of log lines. They must find who did what and when, and show that the logs were not edited
afterwards. Full tools (Splunk, ELK, Timesketch) need servers, setup and training a small IT cell does not have.

## What it does
| Step | What LogLens does |
|---|---|
| **Open** | ERP audit CSV, Linux `auth.log` (sshd, sudo, useradd, usermod, su; old and new syslog style), Apache/Nginx access log, Apache error log. Any other file (PDF, image) is hashed as raw bytes with its metadata. Lines it cannot read are counted and shown, never dropped |
| **Rules flag** | 16 explainable rules, each with a plain reason, a severity and a verified MITRE ATT&CK technique ID. **Attack chain:** flagged events linked by shared IP or account, in MITRE tactic order. **Change register:** who changed what, before → after |
| **Open-weight AI explains** | Llama 3.1 8B on Cloudflare Workers AI writes the story (English or Hindi). Every point must cite real event numbers; rules cap the verdict; a cross-check shows where AI and rules disagree. Account names and IPs are **masked before sending** and restored in the browser |
| **Seal and verify** | SHA-256 in the browser, signed server receipt (HMAC-SHA256, hash-chained in Cloudflare D1), MATCH / TAMPERED with the changed line, HTML/PDF report, `/cases` dashboard with every ledger row re-checked |

If the AI is slow (over 8 s) or down, a clearly labelled rules-only summary appears. If the server ledger is
unreachable, the local hash still works and the page says so.

## Quick start
```bash
npm install
cp .env.example .dev.vars     # set SEAL_SECRET (openssl rand -hex 32); GEMINI_API_KEY is an optional backup
npm start                     # build + local D1 table + local Worker on http://localhost:8787
```
Node 23.6 or newer. Workers AI always runs on Cloudflare, even in local dev, so the AI summary needs
`npx wrangler login`; without it the page shows the offline rules summary. Deploy: `npx wrangler deploy`.

## How it fits together
```
Browser (Astro + TypeScript)                         Cloudflare Worker (worker/index.ts)
  parse.ts -> rules.ts -> chain.ts -> changes.ts       /api/analyze  Llama 3.1 8B (Workers AI), Gemini backup,
  evidence.ts: SHA-256 (Web Crypto), local audit log                 8 s budget, citation check, verdict caps
  redact.ts: USER_1 / IP_1 masking before the AI      /api/seal, /api/ledger  HMAC-SHA256 receipts, hash chain -> D1
  report.ts: HTML / PDF report                         CSP + security headers, rate limit, size limits
```
Why each tool, and the trade-offs against the suggested Python / FastAPI / React stack: [docs/TECH_STACK.md](docs/TECH_STACK.md).

## Tests (run them yourself)
| Command | What it checks | Last result (25 Oct 2026) |
|---|---|---|
| `npm run check` | build, strict typecheck, Worker bundle, rules / hash / change register / attack chain / report / masking checks | pass (also in CI on every push) |
| `npm run loghub` | real Loghub logs parse (table below) | pass |
| `node scripts/e2e.ts <url> 360` (and 1366, 1920) | headless Chrome walks the whole demo path, phone tab bar, timeline filters; fails on any console error | pass at 360, 1366, 1920 on the live site |
| `node scripts/check-fold.ts <url> 1366 768 out.jpg` | verdict and attack chain above the fold | chain at 458-712 px (fold 768) |
| `node tests/eval.ts <url>/api/analyze` | 17 self-written cases through parser, rules, hashing and the live AI | **16/17**; the miss: a normal log where the AI said "unsure", not "normal" ([docs/TESTSET.md](docs/TESTSET.md)) |
| `node scripts/check-seal.ts <url>` | receipts, bad input, 6 parallel receipts keep one chain | not re-run on 25 Oct (last run 22 Oct) |
The eval set is small and written by us: it shows the demo path is stable, not accuracy on all real-world logs.
Lighthouse on the live site (25 Oct): `/` mobile 97 / 100 / 100 / 100 (performance / accessibility / best practices / SEO, 2 runs), desktop 94 / 100 / 100 / 100; `/cases` mobile 85 / 100 / 100 / 100 (the demo ledger has grown to 200 rows).
UI details and what was not tested: [docs/UI_UPGRADE_REPORT.md](docs/UI_UPGRADE_REPORT.md).

## Tested on real logs (Loghub)
Source: https://github.com/logpai/loghub, a public research collection of real system logs (free for research and
academic use; cited as its licence asks). The "Real SSH server log" sample in the app is the first 300 lines of
OpenSSH_2k.log. Run `npm run loghub`.
| File (2,000 lines each) | Events | Not understood | Flags |
|---|---|---|---|
| OpenSSH_2k.log | 2,008 (2 "message repeated" lines expanded) | 0 | burst-fail 502, shared-ip 73 |
| Linux_2k.log | 849 (sshd + su lines) | 1,151 (other services: logrotate, ftpd, klogind...) | burst-fail 464, off-hours 387 |
| Apache_2k.log (error log) | 2,000 | 0 | none (server notices, no person acted) |
These logs have no security labels, so this shows that real files parse and what the rules flag, not accuracy.

## AI and data
- **Model:** open-weight Llama 3.1 8B (Meta, Llama 3.1 Community Licence: open-weight, not an OSI open-source licence),
  `@cf/meta/llama-3.1-8b-instruct-fast` on Cloudflare Workers AI, JSON mode. Google Gemini flash-lite is an optional
  backup: it starts only if Llama fails or has no answer after 4 s, and is off without `GEMINI_API_KEY`.
- **What is sent:** only parsed event lines (max 200, flagged first) and case notes, with account names, IPs, auth.log host names and
  e-mail addresses masked as USER_1 / IP_1 / HOST_1 / EMAIL_1 by default (system accounts like root stay readable). Raw files stay in the browser.
- **Checks on the answer:** points citing events that do not exist are removed; wrong language is rejected; without a
  high-risk rule flag Llama may not say "incident", without any flag at most "unsure"; log text is fenced as untrusted
  data (prompt-injection test: eval case 17).
- **Browser storage:** a copy of the locked log text (up to 2 MB), its SHA-256 and the local audit trail are saved in
  this browser's localStorage so a case survives a reload. **New case** clears them; anyone using the same browser
  profile can read them, so use a private window on a shared computer.
- **Server ledger:** stores evidence hash, file name, size, investigator name and server time.
- **How it was built:** with Claude Code (code, UI, rules, tests and docs, written under our direction and checked by us).
  Problem choice, scope, rules design, test cases and the demo are ours. See [docs/TEAM.md](docs/TEAM.md).

## Limits (honest)
- 4 log formats; no Windows event logs yet.
- No login: `/cases` is a shared demo ledger. A real deployment needs an access gate for authorised investigators.
- A receipt proves our server recorded that hash at that time. The Cloudflare account owner could delete the newest rows.
- AI runs on free tiers (Workers AI 10,000 neurons a day). Llama 8B is a small model: Hindi and verdicts are weaker than
  big models, which is why the rules cap it.
- The report supports an investigation; it is not a legal certificate (for example under BSA 2023 s.63).
- Three sample cases and the eval logs are made-up sample data; the "Real SSH server log" sample and `tests/loghub/` are real.

## Project history
v1 was built at CHAKRAVYUH 1.0 and v2 at अvinya '26 (BIET Lucknow, problem ABCS-02). The Hacktoberfest Hack Day 2026
(University of Lucknow) release adds the open-weight AI switch, real-log parsing, masking before AI and the laptop /
phone / dark UI; the list with commits is in [docs/MASTER_LOG.md](docs/MASTER_LOG.md). Older event docs (Avinya pitch, upgrade logs, UI research notes) are in the
git history before the 25 Oct 2026 cleanup (commit 636c098). The AI-assisted workflow loop is `docs/ai-workflow/LOOP-MASTER.md`.

## Team
SOLAR FLARES: **Sagar Mishra** (builder, B.Tech CSE) and **Krishraj Shukla**
([@krishrajshukla-eng](https://github.com/krishrajshukla-eng), presenter). Roles and the human vs AI-tool split:
[docs/TEAM.md](docs/TEAM.md). Contributions welcome: [CONTRIBUTING.md](CONTRIBUTING.md) · security: [SECURITY.md](SECURITY.md).

## License
[MIT](LICENSE). The bundled Loghub sample stays under Loghub's own terms (research and academic use, cite the repo).
