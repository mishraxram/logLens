# SOLAR FLARES

**Team:** SOLAR FLARES | **Registration ID:** HK26-0014 | **Event:** अvinya '26 Hackathon 4.0, BIET Lucknow (problem ABCS-02). v1 was first built at CHAKRAVYUH 1.0; v2 is the upgrade for अvinya '26 (see `git log pre-upgrade-v1..avinya-final`).

> **Problem Statement ABCS-02: AI-Assisted Digital Forensics** (Domain 3: AI-Based Cybersecurity)
> An AI-assisted platform that analyzes digital artifacts, correlates events, reconstructs incident timelines and maintains evidence integrity with SHA-256 hashing and an audit trail. [Full statement](docs/PROBLEM.md)

**Live (v2):** https://loglens-v2.loglens.workers.dev · **Backup (v1):** https://loglens-solarflares.pages.dev

## Problem
After an incident (example: college ERP marks changed at 2 AM), an investigator has thousands of log lines. They must find who did what and when, and prove the logs were not edited afterwards.

## Solution: LogLens
1. **Timeline + red flags.** Paste or upload an ERP audit CSV, a Linux `auth.log` or an Apache/Nginx access log. Events are sorted by time and 13 explainable rules flag them: failed-login bursts, login right after a burst, new IP, shared IP, impossible travel, off-hours activity, student role changing records, big marks jumps, deleted logs, direct root login, attack patterns in URLs (SQL injection, path traversal, XSS, secret-file probes, command injection), page-scanning bursts, and an attacking IP later getting into an admin page.
2. **AI investigation summary (Gemini).** Gives a verdict (incident / suspicious / normal / unsure), a confidence level, indicators that cite event numbers, "AI found beyond the rules" patterns, and next steps. Works in English and Hindi.
3. **Change register.** Every update, delete or admin form post: who (account), when, from which IP, before → after, and a status (Unauthorized / Suspicious / Blocked attempt / Looks normal) with reasons.
4. **Evidence locker.** SHA-256 hash of the log, or of any file (PDF, image...) as raw bytes with its metadata. Verify shows MATCH or TAMPERED. The audit trail is hash-chained: if any entry is edited, the chain shows where it broke. Download the investigation report as HTML or save it as PDF. If the evidence was changed, the app shows which lines changed (before vs after) from a sealed copy kept at lock time, and can restore the original.

**Failure path:** if Gemini is slow (over 8 s) or down, the app shows an offline summary built from the rules, clearly labelled "Not AI generated". If evidence is thin, it says "Not enough evidence" and what to collect next. Lines it cannot read are counted and shown, never dropped.

## How to run (3 commands)
```bash
npm install
cp .env.example .dev.vars        # then put your GEMINI_API_KEY in .dev.vars
npm run build && npx wrangler pages dev dist
```
Open http://localhost:8788. Without a key, everything works except the AI summary, which falls back to the offline rules summary.

## Tests
- `node tests/eval.ts`: runs 16 cases from [docs/TESTSET.md](docs/TESTSET.md) through the real parser, rules, hashing and the live AI API.
- Latest result: 16/16, 16/16, 15/16 on 16 cases (the one fail: Hindi answer took over 8 s, offline summary shown). Before fixes on the first 14 cases: 11/14, 13/14, 11/14. It is a small set we wrote ourselves, so it shows the demo path is stable. It does not prove accuracy on all real-world logs.
- `node scripts/check-rules.ts` prints the flags for the 3 sample logs. `node scripts/check-hash.ts` shows a 1-character edit changing the SHA-256.

## AI usage and data
- **In the product:** Google Gemini (flash-lite models, with backups if one is busy) is called from a Cloudflare Pages Function (`functions/api/analyze.ts`). The key stays on the server. The prompt is in `src/lib/prompts.ts`.
- **What is sent:** only the parsed event lines (max 200, flagged ones first) and the case notes. Raw uploaded files and hashes stay in the browser. The audit trail and evidence record are kept in the browser's localStorage.
- **Checks on AI output:** indicators that cite event numbers not in the log are removed. If Hindi is asked and the reply is not in Hindi, the next model is tried.
- **Building it:** Built with Claude Code (code, UI, rules and test cases, written under our direction and reviewed by us) and Google Gemini API (analysis inside the app). Problem choice, story, scope, demo design and testing decisions are ours.

## Limits (honest)
- Supports 3 log formats (ERP audit CSV, Linux auth.log, Apache/Nginx access log). Other formats show "Not a supported log".
- The audit trail lives in one browser. The hash chain shows edits, but someone who deletes the whole trail can start fresh. A server copy of the hashes is the next step.
- The report supports an investigation. It is not a legal certificate.
- All logs in the app's "Try sample" buttons and in `tests/cases/` are made-up sample data.

## Tech
Astro + Tailwind, TypeScript, Cloudflare Pages + Pages Functions, Google Gemini API, Web Crypto (SHA-256), `qrcode` (QR code made at build time).

## Team
SOLAR FLARES (HK26-0014): solo team, **Sagar Mishra** (B.Tech CSE). Roles and the human vs AI-tool split: [docs/TEAM.md](docs/TEAM.md).
