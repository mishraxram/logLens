// Runs the real LogLens parser + rules on public Loghub sample logs (research data, not ours).
// Loghub: https://github.com/logpai/loghub (licence: free for research/academic use; cite the repo URL).
// Get the 2k samples first (each ~2,000 lines):
//   mkdir -p tests/loghub && for f in OpenSSH/OpenSSH_2k.log Linux/Linux_2k.log Apache/Apache_2k.log; do
//     curl -sSfL "https://raw.githubusercontent.com/logpai/loghub/master/$f" -o "tests/loghub/$(basename $f)"; done
// Run: node scripts/check-loghub.ts tests/loghub/*.log
import { readFileSync } from 'node:fs';
import { parseLog } from '../src/lib/parse.ts';
import { applyRules } from '../src/lib/rules.ts';
import { buildChains } from '../src/lib/chain.ts';

for (const f of process.argv.slice(2)) {
  const t0 = performance.now();
  const r = parseLog(readFileSync(f, 'utf8'), 2026);
  applyRules(r.events);
  const ms = (performance.now() - t0).toFixed(1);
  const flags: Record<string, number> = {};
  const actions: Record<string, number> = {};
  for (const e of r.events) {
    actions[e.action] = (actions[e.action] ?? 0) + 1;
    for (const fl of e.flags) flags[fl.code] = (flags[fl.code] ?? 0) + 1;
  }
  console.log(`== ${f}: ${r.events.length} events, ${r.unparsed.length} not understood, ${ms} ms`);
  console.log('   actions', JSON.stringify(actions));
  console.log('   flags  ', JSON.stringify(flags));
  console.log('   chains ', buildChains(r.events).length);
  if (r.unparsed.length) console.log('   first not-understood line:', r.unparsed[0].slice(0, 160));
}
