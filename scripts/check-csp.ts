// CSP check: every inline script in the built pages must be allowed by a hash in the worker CSP.
// Catches the case where src/lib/theme-inline.ts (or the font onload handler) changes but worker/index.ts does not.
// Run after `npm run build`: node scripts/check-csp.ts
import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';

const worker = readFileSync('worker/index.ts', 'utf8');
const hash = (s: string) => `'sha256-${createHash('sha256').update(s).digest('base64')}'`;
let fail = 0;
for (const page of ['dist/index.html', 'dist/cases/index.html', 'dist/404.html']) {
  let html = '';
  try { html = readFileSync(page, 'utf8'); } catch { continue; }
  const inline = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]).filter((t) => t.trim());
  const handlers = [...html.matchAll(/\son\w+="([^"]+)"/g)].map((m) => m[1]);
  for (const t of [...inline, ...handlers]) {
    const ok = worker.includes(hash(t));
    console.log(`${ok ? 'PASS' : 'FAIL'} ${page}: ${t.slice(0, 50)}… ${hash(t)}`);
    if (!ok) fail++;
  }
}
console.log(fail ? `CSP FAIL (${fail} inline script(s) not allowed by the worker CSP)` : 'CSP PASS');
process.exit(fail ? 1 : 0);
