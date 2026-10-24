// Masking check: no real account name or IP from the ERP and SSH samples is left in the text that would go to the AI,
// system accounts (root, admin) stay readable, and unmask(mask(x)) gives back the original.
// Run: node scripts/check-redact.ts
import { readFileSync } from 'node:fs';
import { parseLog } from '../src/lib/parse.ts';
import { applyRules } from '../src/lib/rules.ts';
import { makeMasker } from '../src/lib/redact.ts';

let fail = 0;
const ok = (cond: boolean, name: string) => { console.log(`${cond ? 'PASS' : 'FAIL'} ${name}`); if (!cond) fail++; };

for (const f of ['public/samples/erp-marks-tamper.csv', 'public/samples/ssh-bruteforce.log']) {
  const { events } = parseLog(readFileSync(f, 'utf8'), 2026);
  applyRules(events);
  const m = makeMasker(events);
  // Same fields the page sends to /api/analyze
  const text = events.map((e) => [e.user, e.ip, e.target, e.detail, ...e.flags.map((x) => x.reason)].join(' ')).join('\n');
  const masked = m.mask(text);
  const leaks = [...new Set(events.flatMap((e) => [e.user, e.ip]))]
    .filter((v) => v && !['root', 'admin'].includes(v) && masked.includes(v));
  console.log(`== ${f}: ${m.users} accounts, ${m.ips} IPs masked`);
  ok(leaks.length === 0, `no real name or IP left${leaks.length ? ': ' + leaks.join(', ') : ''}`);
  ok(m.unmask(masked) === text, 'unmask(mask(text)) === text');
}
const s = makeMasker([{ user: 'root', ip: '10.0.4.2' }, { user: 'prof.verma', ip: '10.0.4.21' }]);
ok(s.mask('root from 10.0.4.21 and 10.0.4.2') === 'root from IP_2 and IP_1', 'root kept; longer IP not half-replaced');
ok(s.mask('prof.vermax') === 'prof.vermax' && s.mask('by prof.verma.') === 'by USER_1.', 'whole account names only (a full stop after a name is fine)');
console.log(fail ? `REDACT FAIL (${fail})` : 'REDACT PASS');
process.exit(fail ? 1 : 0);
