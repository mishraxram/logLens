# LogLens · team SOLAR FLARES

**Team:** SOLAR FLARES | **Registration ID:** HK26-0014 | **Event:** अvinya '26 Hackathon 4.0, BIET Lucknow (problem ABCS-02).
v1 was first built at CHAKRAVYUH 1.0; v2 is the upgrade for अvinya '26 (diff: `git log pre-upgrade-v1..avinya-final`).

> **Problem Statement ABCS-02: AI-Assisted Digital Forensics** (Domain 3: AI-Based Cybersecurity)
> An AI-assisted platform that analyzes digital artifacts, correlates events, reconstructs incident timelines and maintains evidence integrity with SHA-256 hashing and auditable records. [Full statement](docs/PROBLEM.md)

**Live (v2):** https://loglens-v2.loglens.workers.dev · **Cases dashboard:** https://loglens-v2.loglens.workers.dev/cases · **Backup (v1):** https://loglens-solarflares.pages.dev

## Problem
After an incident (example: college ERP marks changed at 2 AM), a college IT or cyber-cell investigator has thousands of log lines. They must find who did what and when, and show that the logs were not edited afterwards.

## Solution: LogLens (what each PS point maps to)
| PS | What LogLens does |
|---|---|
| PS1 evidence analysis | Parses ERP audit CSV, Linux `auth.log` (sshd, sudo, useradd, usermod), Apache/Nginx access logs. Any other file (PDF, image) is hashed as raw bytes; name, size, type and last-modified time are kept |
| PS2 pattern discovery | 16 explainable rules, each with a verified MITRE ATT&CK technique ID. **Attack chain**: flagged events linked by shared IP or account, in MITRE tactic stages. AI summary (open-weight Llama 3.1 8B on Workers AI, Gemini backup) with indicators that must cite real event numbers, plus "AI found beyond the rules" and an **AI vs rules cross-check** |
| PS3 timeline | Every event sorted by time, flagged rows marked, change register (who changed what, before → after) |
| PS4 integrity | SHA-256 in the browser (Web Crypto), MATCH / TAMPERED, changed-lines diff and restore. **Signed server receipt**: HMAC-SHA256, hash-chained, stored in Cloudflare D1 (SQLite) |
| PS5 reports | HTML / PDF report: hash function + value, server receipt, findings with event numbers, MITRE IDs, attack chain, AI summary, audit trail, full raw timeline |
| PS6 dashboard | `/cases`: every sealed evidence item, status, investigator, server audit trail with each row re-checked. Case progress strip and investigator name on the main page |

**Failure path:** if AI is slow (over 8 s) or down, the app shows an offline summary built from the rules, clearly labelled. If evidence is thin, it says "Not enough evidence" and what to collect next. Lines it cannot read are counted and shown, never dropped. If the server ledger is unreachable, the local hash still works and the app says so.

## How to run (3 commands, from a clean clone)
```bash
npm install
cp .env.example .dev.vars        # put SEAL_SECRET (and optional GEMINI_API_KEY for the backup AI) in .dev.vars
npm start                        # build + local D1 table + local Worker
```
Open http://localhost:8787. Without keys everything works except the AI summary (offline rules summary instead) and server receipts (local hash only).

## Tests (run them yourself)
- `npm run check`: build, strict typecheck, Worker bundle, and 5 check scripts (rules, hash, change register, attack chain, report content).
- `node tests/eval.ts [api-url]`: 17 cases from [docs/TESTSET.md](docs/TESTSET.md) through the real parser, rules, hashing and the live AI API (default: v2), 4 s apart.
  Results on 22 Oct night: 13 live runs from 13/17 to 17/17 (all listed in docs/TESTSET.md). After the fixes at 22:52, every failure was the AI taking over 8 s or a rate limit (offline summary shown), not a wrong rule. Case 17 is a prompt-injection log: the AI must not obey text inside the log.
  It is a small set we wrote ourselves: it shows the demo path is stable, not accuracy on all real-world logs.
- `node scripts/e2e.ts <url> 360`: headless Chrome walks the demo path (sample → timeline → MITRE + attack chain → server receipt → AI → cross-check → MATCH → TAMPERED → file upload → dashboard) and fails on any console error.
- `node scripts/check-seal.ts <url>`: server receipts, bad input, and 6 parallel receipts keep one unbroken chain.
- Lighthouse mobile on the live site (22 Oct): `/` 100/100/100/100, `/cases` 96-99/100/100/100 (several runs).

## AI usage and data
- **AI: open-weight Llama 3.1 8B (Meta, Llama licence).** Primary model is `@cf/meta/llama-3.1-8b-instruct-fast`, run on Cloudflare Workers AI in JSON mode. Google Gemini flash-lite models are an optional backup: they start only if Llama fails or has no answer after 4 s, and are off when no `GEMINI_API_KEY` is set. Llama 3.1 is open-weight under the Llama 3.1 Community Licence (not an OSI open-source licence). Called only from the server (`functions/api/analyze.ts`); keys never reach the browser. Prompt in `src/lib/prompts.ts`.
- **What is sent to the AI:** only parsed event lines (max 200, flagged first) and case notes. Raw files stay in the browser.
- **Checks on AI output:** indicators citing events that do not exist are removed; wrong language is rejected; Llama 8B may not say "incident" without a high-risk rule flag (shown as "suspicious" with a note); log text is marked as untrusted data so instructions hidden in a log are not followed.
- **Server ledger:** stores evidence hash, file name, size, investigator name and server time. It is a shared demo ledger with no login.
- **Building it:** built with Claude Code (code, UI, rules, tests and docs, written under our direction and checked by us). Problem choice, scope, rules design, test cases and the demo are ours. See [docs/TEAM.md](docs/TEAM.md).

## Limits (honest)
- 3 log formats only. Other formats show "Not a supported log".
- No login: the dashboard is a shared demo ledger. A real deployment needs an access gate for authorised investigators.
- The server receipt proves the hash was recorded at that server time by this server. The Cloudflare account owner could still change the database; the signature check would show it unless the secret also leaked.
- AI depends on free tiers (Workers AI 10,000 neurons/day, Gemini backup). When both are slow the offline summary is shown.
- Llama 3.1 8B is a small model: Hindi answers and verdicts are weaker than big models. Answers are checked (cited events, language, incident cap).
- The report supports an investigation. It is not a legal certificate (for example under BSA 2023 s.63).
- All sample and test logs are made-up sample data.

## Tech
Astro 5 + Tailwind 4 + TypeScript (pages) · one Cloudflare Worker (static assets + API, CSP and security headers, rate limit) · Cloudflare D1 (SQLite) evidence ledger · Cloudflare Workers AI with open-weight Llama 3.1 8B (Meta) + Google Gemini API as backup · Web Crypto (SHA-256, HMAC-SHA256) · `qrcode` (QR made at build time). Why each was chosen: [docs/TECH_STACK.md](docs/TECH_STACK.md).

## Team
SOLAR FLARES (HK26-0014): **Sagar Mishra** (builder, B.Tech CSE) and **Krishraj Shukla** ([@krishrajshukla-eng](https://github.com/krishrajshukla-eng), presenter). Roles, stage hand-off and the human vs AI-tool split: [docs/TEAM.md](docs/TEAM.md).
