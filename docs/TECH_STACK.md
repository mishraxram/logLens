# Tech stack: what, why, how it connects, trade-offs

## How the parts connect
```
 Browser (phone or laptop)                         Cloudflare Worker "loglens-v2" (one deploy)
 ┌──────────────────────────────────┐   HTTPS    ┌───────────────────────────────────────────────┐
 │ Astro pages: / and /cases         │──────────▶│ worker/index.ts                                │
 │ parse.ts   -> events (3 formats)  │           │  - serves the built pages (static assets)      │
 │ rules.ts   -> 13 flags + MITRE    │           │  - CSP + security headers on every response    │
 │ chain.ts   -> attack chain        │           │  - rate limit, 413 / 415 checks                │
 │ evidence.ts-> SHA-256 (Web Crypto)│           │                                                │
 │            local hash-chained log │ /api/analyze│ functions/api/analyze.ts                     │
 │ report.ts  -> HTML / PDF report   │──────────▶│  Gemini flash-lite x3 (raced) ──▶ Google API    │
 │ crosscheck.ts -> AI vs rules      │           │  Workers AI llama-3.1-8b (backup after 2.5 s)   │
 │                                   │           │  checks: real event numbers, language, verdict │
 │                                   │ /api/seal │ functions/api/seal.ts                          │
 │ ledger.ts  -> signed receipt      │──────────▶│  HMAC-SHA256 (secret) + hash chain ──▶ D1 SQLite│
 └──────────────────────────────────┘ /api/ledger└───────────────────────────────────────────────┘
```
Raw files never leave the browser. Only parsed event lines go to the AI; only the hash, name, size, investigator
and server time go to the ledger.

## Each tool and why
| Tool | Used for | Why this one |
|---|---|---|
| Astro 5 (static pages) + small TypeScript | UI: the desk and the cases dashboard | Ships plain HTML + one small script per page: fast on cheap phones (Lighthouse mobile 100 on `/`) |
| Tailwind 4 | Styling | No UI library weight; design tokens in one CSS file |
| TypeScript (strict) | All logic | Same language in browser and server; `npm run typecheck` catches mistakes before deploy |
| Web Crypto `crypto.subtle` | SHA-256 of evidence, HMAC-SHA256 receipts | Built into every browser and the Worker; no crypto library to trust or update |
| Cloudflare Worker | Pages + API in one deploy | No server to maintain, HTTPS by default, free tier, runs close to the user |
| Cloudflare D1 (SQLite) | Server evidence ledger | The PS suggests SQLite/PostgreSQL; D1 is SQLite with no server to run. UNIQUE(prev_hash) keeps the hash chain linear |
| Google Gemini flash-lite | Investigation summary (EN / Hindi) | Free tier, JSON output mode, good Hindi |
| Cloudflare Workers AI (llama-3.1-8b-instruct-fast) | Backup AI when Gemini is slow | Runs inside Cloudflare, no extra key; JSON mode supported (Workers AI docs) |
| Rules in TypeScript | 16 detections | Explainable, instant, work offline; the AI is checked against them |

## Versus the suggested stack (Python, Pandas, Scikit-learn, NLP, YARA, SQLite/PostgreSQL, FastAPI, React)
| Suggested | We use | Trade-off (honest) |
|---|---|---|
| FastAPI server | One Cloudflare Worker | + nothing to host, free, HTTPS. − Worker limits (CPU time, no long jobs); heavy batch analysis would need a real server |
| React | Astro + small TypeScript | + less JavaScript, faster on phones. − less suited to a very large interactive app |
| Pandas / Scikit-learn | Rules in TypeScript + LLM summary | + explainable, works in the browser, no training data needed. − no learned anomaly model; we have no labelled college log dataset to train one honestly |
| SQLite / PostgreSQL | D1 (SQLite) | Same SQL model; − one region-primary database, fine at college scale |
| YARA | Not used | YARA is for file/malware patterns; our input is logs. Possible next step for uploaded files |
| NLP | LLM (Gemini / Llama) | Handles Hinglish notes and Hindi output without our own NLP pipeline |

## Scale and limits
- Browser parses up to 2 MB logs (case 11: 4,999 events parsed and flagged in about 14 ms locally).
- AI sees at most 200 events per request (flagged first); 8 s budget, then the labelled offline summary.
- Free tiers: Gemini per-minute limits (429 seen when 17 calls fired back to back), Workers AI 10,000 neurons/day.
- Latency and cost numbers above are what we measured on 22 Oct; they are not guarantees.
