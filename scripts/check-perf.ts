// Speed budget for the rules: 20,000 ERP lines (about 1.4 MB, under the 2 MB upload limit) must parse + run all rules
// in under 1 second on the CI machine. Before the sliding-window fix the rules alone took about 2.3 s here.
import { parseLog } from '../src/lib/parse.ts';
import { applyRules } from '../src/lib/rules.ts';

const pad = (x: number) => String(x).padStart(2, '0');
const text = Array.from({ length: 20_000 }, (_, i) =>
  `2026-10-14 01:${pad(Math.floor(i / 60) % 60)}:${pad(i % 60)},u${i % 50},student,10.0.${i % 7}.${i % 200},LOGIN_FAIL,erp,wrong password`).join('\n');
const t0 = performance.now();
const { events } = parseLog(text);
applyRules(events);
const ms = Math.round(performance.now() - t0);
const ok = ms < 1000 && events.length === 20_000;
console.log(`PERF ${ok ? 'PASS' : 'FAIL'}: 20,000 lines parsed + rules in ${ms} ms (budget 1000 ms)`);
if (!ok) process.exit(1);
