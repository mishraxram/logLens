// Builds the investigation report for the ERP sample (no browser) and checks the PS5 parts are in it.
// Run: node scripts/check-report.ts
import { readFileSync } from 'node:fs';
import { parseLog } from '../src/lib/parse.ts';
import { applyRules } from '../src/lib/rules.ts';
import { sha256 } from '../src/lib/evidence.ts';
import { buildReport } from '../src/lib/report.ts';

const text = readFileSync('public/samples/erp-marks-tamper.csv', 'utf8');
const r = parseLog(text);
const events = applyRules(r.events);
const hash = await sha256(text);
const html = buildReport({
  evidence: { name: 'erp-marks-tamper.csv', size: text.length, hash, lockedAt: 'test', kind: 'text' },
  verify: { match: true, current: hash }, events, notes: r.notes, ai: null, audit: [], chainBrokenAt: 0, generatedAt: 'test',
});
const must: [string, RegExp][] = [
  ['hash function + value', new RegExp(`Hash function: SHA-256 · Hash value at lock: <code>${hash}`)],
  ['integrity result', /MATCH: evidence unchanged/],
  ['not-a-legal-certificate note', /not a legal certificate/],
  ['MITRE technique on a flag', /T1110\.001 Brute Force: Password Guessing/],
  ['attack chain with tactic ids', /Attack chain.*TA0006.*TA0005/s],
  ['finding cites event numbers', /events #\d+/],
  ['full timeline with raw lines', /<h2>Full timeline<\/h2>[\s\S]*prof\.verma/],
  ['no raw < from log text (escaped)', /^(?![\s\S]*<script)/],
];
let fails = 0;
for (const [name, re] of must) { const ok = re.test(html); console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`); if (!ok) fails++; }
console.log(fails ? `REPORT FAIL (${fails})` : 'REPORT PASS');
process.exit(fails ? 1 : 0);
