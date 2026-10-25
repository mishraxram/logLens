// Parser regression checks. Run: node scripts/check-parse.ts
import { parseLog } from '../src/lib/parse.ts';

let bad = 0;
const check = (name: string, ok: boolean, got: unknown) => { console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${ok ? '' : ` (got ${JSON.stringify(got)})`}`); if (!ok) bad++; };

// auth.log has no year: a log that crosses New Year must keep Dec 31 before Jan 1
const ny = parseLog([
  'Dec 31 23:59:58 web sshd[1]: Failed password for root from 203.0.113.9 port 1 ssh2',
  'Jan  1 00:00:03 web sshd[1]: Failed password for root from 203.0.113.9 port 1 ssh2',
].join('\n'), 2026);
check('New Year roll-over keeps order', ny.events.map((e) => e.timeText).join(' | ') === '2026-12-31 23:59:58 | 2027-01-01 00:00:03', ny.events.map((e) => e.timeText));
check('New Year roll-over is noted', ny.notes.some((n) => /crossed New Year/.test(n)), ny.notes);

// Same-year logs are untouched, even when lines are a little out of order
const same = parseLog([
  'Oct 14 03:41:06 web sshd[1]: Failed password for root from 203.0.113.9 port 1 ssh2',
  'Oct 14 03:41:02 web sshd[1]: Failed password for root from 203.0.113.9 port 1 ssh2',
  'Sep 30 10:00:00 web sshd[1]: Failed password for root from 203.0.113.9 port 1 ssh2',
].join('\n'), 2026);
check('same-year log stays in 2026', same.events.every((e) => e.timeText.startsWith('2026-')) && same.notes.length === 0, same.events.map((e) => e.timeText));

if (bad) process.exit(1);
console.log('PARSE PASS');
