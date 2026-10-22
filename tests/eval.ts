// Runs docs/TESTSET.md cases through the real parser, rules, hashing and the live AI API.
// Run: node tests/eval.ts [api-url]
import { readFileSync } from 'node:fs';
import { parseLog } from '../src/lib/parse.ts';
import { applyRules } from '../src/lib/rules.ts';
import { sha256 } from '../src/lib/evidence.ts';

const API = process.argv[2] || 'https://loglens-v2.loglens.workers.dev/api/analyze';
const S = 'public/samples/', T = 'tests/cases/';
const GAP_MS = 4000; // pause before each AI call

type Case = {
  id: number; file: string; lang?: 'en' | 'hi';
  must?: string[];      // rule codes that must appear
  mustNot?: string[];   // rule codes that must NOT appear
  noFlags?: boolean; noEvents?: boolean;
  ai?: string[];        // allowed AI verdicts
  hindi?: boolean;      // AI summary must contain Devanagari
};

const cases: Case[] = [
  { id: 1, file: S + 'erp-marks-tamper.csv', must: ['burst-fail', 'off-hours', 'new-ip', 'role-misuse', 'log-clear', 'marks-jump', 'login-after-burst'], ai: ['incident'] },
  { id: 2, file: T + '02-normal-faculty.csv', noFlags: true, ai: ['normal'] },
  { id: 3, file: S + 'ssh-bruteforce.log', must: ['burst-fail', 'root-login', 'login-after-burst', 'new-account', 'admin-group', 'sudo-root-shell'], ai: ['incident'] },
  { id: 4, file: T + '04-bruteforce-fail-only.log', must: ['burst-fail'], mustNot: ['login-after-burst', 'root-login'], ai: ['incident', 'suspicious'] },
  { id: 5, file: T + '05-admin-late-legit.csv', must: ['off-hours'], mustNot: ['marks-jump', 'role-misuse', 'log-clear'], ai: ['normal', 'suspicious', 'unsure'] },
  { id: 6, file: T + '06-impossible-travel.csv', must: ['impossible-travel'], ai: ['incident', 'suspicious'] },
  { id: 7, file: T + '07-empty.txt', noEvents: true },
  { id: 8, file: T + '08-poem.txt', noEvents: true },
  { id: 9, file: S + 'hinglish-case.csv', lang: 'hi', must: ['marks-jump', 'log-clear', 'new-ip', 'shared-ip'], ai: ['incident'], hindi: true },
  { id: 10, file: T + '10-shuffled.csv', must: ['burst-fail', 'role-misuse', 'log-clear', 'marks-jump', 'login-after-burst'] },
  { id: 11, file: T + '11-big.csv', must: ['burst-fail', 'log-clear', 'marks-jump'] },
  { id: 12, file: T + '12-log-delete-only.csv', must: ['log-clear'], mustNot: ['off-hours'], ai: ['incident', 'suspicious'] },
  { id: 15, file: T + '15-web-attack.log', must: ['web-attack', 'scan-burst', 'attack-success'], ai: ['incident', 'suspicious'] },
  { id: 16, file: T + '16-web-normal.log', noFlags: true, ai: ['normal', 'unsure'] },
  { id: 17, file: T + '17-prompt-injection.csv', must: ['role-misuse', 'marks-jump', 'log-clear'], ai: ['incident', 'suspicious'] },
];

// Same "flagged events first, max 200" logic as the browser
function payload(events: ReturnType<typeof parseLog>['events'], notes: string[], lang: string) {
  const picked = [...events].sort((a, b) => Number(b.flags.length > 0) - Number(a.flags.length > 0)).slice(0, 200).sort((a, b) => a.n - b.n);
  return { events: picked.map(({ time, raw, flags, ...e }) => ({ ...e, flags: flags.map((f) => `${f.severity.toUpperCase()}: ${f.reason}`) })), notes, lang };
}

let pass = 0;
const rows: string[] = [];
for (const c of cases) {
  const text = readFileSync(c.file, 'utf8');
  const t0 = Date.now();
  const r = parseLog(text, 2026);
  applyRules(r.events);
  const ms = Date.now() - t0;
  const codes = new Set(r.events.flatMap((e) => e.flags.map((f) => f.code)));
  const problems: string[] = [];
  if (c.noEvents && r.events.length) problems.push(`expected 0 events, got ${r.events.length}`);
  if (c.noFlags && codes.size) problems.push(`expected no flags, got ${[...codes]}`);
  for (const m of c.must ?? []) if (!codes.has(m)) problems.push(`missing flag ${m}`);
  for (const m of c.mustNot ?? []) if (codes.has(m)) problems.push(`unexpected flag ${m}`);
  if (c.id === 10 && r.events.some((e, i) => i && e.time < r.events[i - 1].time)) problems.push('timeline not sorted');
  let got = `${r.events.length} events, ${r.unparsed.length} unparsed, flags: ${[...codes].join(' ') || 'none'} (${ms}ms)`;

  if (c.ai) {
    // Space the AI calls out like real use: back-to-back calls hit the Gemini free per-minute limit (429)
    await new Promise((ok) => setTimeout(ok, GAP_MS));
    try {
      const res = await fetch(API, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload(r.events, r.notes, c.lang ?? 'en')) });
      const d: any = await res.json();
      if (!d.summary) problems.push(`AI failed: ${d.error}`);
      else {
        got += ` · AI ${d.verdict} (${d.confidence})`;
        if (!c.ai.includes(d.verdict)) problems.push(`AI verdict ${d.verdict}, expected ${c.ai.join('/')}`);
        if (c.hindi && !/[ऀ-ॿ]/.test(d.summary)) problems.push('AI summary not in Hindi');
      }
    } catch (e) { problems.push(`AI call error ${(e as Error).message}`); }
  }
  const ok = problems.length === 0;
  if (ok) pass++;
  rows.push(`| ${c.id} | ${got} | ${ok ? 'PASS' : 'FAIL'} | ${problems.join('; ')} |`);
}

// 13 + 14: tamper check on sample 1
const base = readFileSync(S + 'erp-marks-tamper.csv', 'utf8');
const h = await sha256(base);
const t13 = (await sha256(base.replace('42->92', '42->93'))) !== h;
const t14 = (await sha256(readFileSync(S + 'erp-marks-tamper.csv', 'utf8'))) === h;
rows.push(`| 13 | one char changed -> hash differs: ${t13} | ${t13 ? 'PASS' : 'FAIL'} | |`);
rows.push(`| 14 | same file re-read -> hash equal: ${t14} | ${t14 ? 'PASS' : 'FAIL'} | |`);
pass += Number(t13) + Number(t14);

console.log(`RESULT ${pass}/${cases.length + 2}`);
console.log('| # | Got | Result | Why failed |\n|---|---|---|---|');
console.log(rows.join('\n'));
