// Builds the /api/analyze request body for a log file (for testing). Run: node scripts/ai-payload.ts <file> [en|hi]
import { readFileSync } from 'node:fs';
import { parseLog } from '../src/lib/parse.ts';
import { applyRules } from '../src/lib/rules.ts';
const r = parseLog(readFileSync(process.argv[2], 'utf8'), 2026);
applyRules(r.events);
const events = r.events.map(({ time, raw, flags, ...e }) => ({ ...e, flags: flags.map((f) => `${f.severity.toUpperCase()}: ${f.reason}`) }));
console.log(JSON.stringify({ events, notes: r.notes, lang: process.argv[3] || 'en' }));
