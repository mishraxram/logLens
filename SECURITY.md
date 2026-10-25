# Security

## Reporting a problem
Please do not open a public issue for a security problem. Open a private report with GitHub's
"Report a vulnerability" button (Security tab), or contact the maintainer listed on the GitHub profile.
Include the URL or file, what you did, and what happened. We will reply as soon as we can; this is a student project,
so there is no formal response time.

## What LogLens does to stay safe (and its limits)
- Raw log files stay in the browser. Only parsed event lines (max 200) go to the AI, with account names and IPs masked
  by default (`src/lib/redact.ts`, checked by `scripts/check-redact.ts`).
- Log text is fenced as untrusted data in the prompt (prompt-injection guard, eval case 17).
- All page text is set with `textContent`; the report escapes every value. CSP and security headers on every response
  (`worker/index.ts`). Rate limit and size limits on the API.
- Server receipts are HMAC-SHA256 signed and hash-chained in D1.
- Limits: there is no login yet, so anyone can add receipts to the demo ledger; the Cloudflare account owner could
  delete the newest ledger rows. See README "Limits".
