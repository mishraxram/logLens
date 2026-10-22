// Prints the attack chains found in each sample and test log, and checks the expected ones.
// Run: node scripts/check-chain.ts
import { readFileSync } from 'node:fs';
import { parseLog } from '../src/lib/parse.ts';
import { applyRules } from '../src/lib/rules.ts';
import { buildChains } from '../src/lib/chain.ts';

// file -> stages the longest chain must contain (empty list = no chain expected)
const expect: [string, string[]][] = [
  ['public/samples/erp-marks-tamper.csv', ['cred', 'access', 'impact', 'stealth']],
  ['public/samples/ssh-bruteforce.log', ['cred', 'access']],
  ['tests/cases/15-web-attack.log', ['recon', 'access']],
  ['tests/cases/02-normal-faculty.csv', []],
  ['tests/cases/16-web-normal.log', []],
];
let fails = 0;
for (const [file, stages] of expect) {
  const r = parseLog(readFileSync(file, 'utf8'));
  const chains = buildChains(applyRules(r.events));
  const top = chains[0];
  console.log(`== ${file}: ${chains.length} chain(s)`);
  for (const c of chains) console.log(`   actors ${[...c.ips, ...c.users].join(', ')}: ` + c.steps.map((s) => `${s.name} (#${s.events.join(',#')})`).join(' -> '));
  const got = new Set(top?.steps.map((s) => s.key) ?? []);
  const ok = stages.length ? stages.every((s) => got.has(s)) : chains.length === 0;
  console.log(`   ${ok ? 'PASS' : 'FAIL'} expected ${stages.length ? stages.join(' + ') : 'no chain'}`);
  if (!ok) fails++;
}
console.log(fails ? `CHAIN FAIL (${fails})` : 'CHAIN PASS');
process.exit(fails ? 1 : 0);
