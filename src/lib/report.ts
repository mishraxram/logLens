// Builds a self-contained HTML investigation report (downloaded as a file).
import type { LogEvent } from './parse.ts';
import type { Evidence, AuditEntry } from './evidence.ts';
import { extractChanges, STATUS_TEXT } from './changes.ts';
import { MITRE } from './mitre.ts';
import { buildChains } from './chain.ts';

// Which AI wrote the summary, in plain words (same text on the page and in the report)
export const LLAMA_LABEL = 'AI: open-weight Llama 3.1 8B (Meta, Llama licence)';
export function aiLabel(model = '') {
  return model.includes('llama-3.1-8b') ? `${LLAMA_LABEL} on Cloudflare Workers AI` : `AI: Gemini backup (${model})`;
}

type Ai = { source: string; verdict: string; hidden_patterns?: { events: number[]; text: string }[]; model?: string; masked?: string; summary: string; indicators: { events: number[]; text: string }[]; confidence: string; next_steps: string[] } | null;

// Escape everything that came from the log or the AI
const esc = (s: unknown) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

export function buildReport(opts: {
  evidence: Evidence | null; verify: { match: boolean; current: string } | null;
  events: LogEvent[]; notes: string[]; ai: Ai; audit: AuditEntry[]; chainBrokenAt: number; generatedAt: string;
}) {
  const { evidence, verify, events, notes, ai, audit, chainBrokenAt, generatedAt } = opts;
  const flagged = events.filter((e) => e.flags.length);
  const changes = extractChanges(events);
  const chains = buildChains(events);
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>LogLens investigation report</title>
<style>@media print{h2{break-after:avoid}tr{break-inside:avoid}}body{font-family:system-ui,"Noto Sans Devanagari",sans-serif;max-width:900px;margin:24px auto;padding:0 16px;color:#14161A}
code,td.m{font-family:ui-monospace,monospace;font-size:12px}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ccc;padding:4px;text-align:left;vertical-align:top;font-size:13px}
.bad{color:#C2362B;font-weight:600}.ok{color:#2F7D4F;font-weight:600}.tag{background:#E0A526;padding:2px 6px}.note{font-size:12px;color:#555}</style></head><body>
<h1>LogLens investigation report</h1>
<p>Generated: ${esc(generatedAt)} · Tool: LogLens (SOLAR FLARES, HK26-0014)</p>
${notes.length ? `<h2>Case notes</h2>${notes.map((n) => `<p>${esc(n)}</p>`).join('')}` : ''}
<h2>Evidence</h2>
${evidence ? `<p><span class="tag">EVIDENCE</span> ${esc(evidence.name)} · ${evidence.size} bytes · locked ${esc(evidence.lockedAt)}</p>
<p>Hash function: SHA-256 · Hash value at lock: <code>${esc(evidence.hash)}</code></p>
${evidence.receipt ? `<p>Server receipt #${evidence.receipt.id} · sealed ${esc(evidence.receipt.sealed_at)} (server time, UTC) by ${esc(evidence.receipt.investigator)}<br>Entry hash <code>${esc(evidence.receipt.entry_hash)}</code><br>HMAC-SHA256 signature <code>${esc(evidence.receipt.sig)}</code><br>Check it: GET /api/seal?id=${evidence.receipt.id} on the LogLens server.</p>` : '<p>Server receipt: not available (offline). Local hash only.</p>'}
<p class="note">This report records hash values to help show the evidence did not change after intake. It is not a legal certificate (for example under BSA 2023 s.63) and does not replace one.</p>
<p>Integrity check: ${verify ? (verify.match ? '<span class="ok">MATCH: evidence unchanged</span>' : `<span class="bad">TAMPERED: hash mismatch</span><br>Current SHA-256: <code>${esc(verify.current)}</code>`) : 'not run'}</p>` : '<p>No evidence locked.</p>'}
${chains.length ? `<h2>Attack chain (rules: events linked by shared IP or account)</h2>${chains.slice(0, 3).map((c) => `<p>Actors: ${esc([...c.ips, ...c.users].join(', '))}</p><ol>${c.steps.map((st) => `<li><b>${esc(st.name)}</b> (MITRE tactic ${esc(st.tactic)}) from ${esc(st.from)}: events ${st.events.map((n) => `#${n}`).join(' ')} · ${esc(st.reasons.join(', '))}</li>`).join('')}</ol>`).join('')}` : ''}
<h2>Changes made (${changes.length}, ${changes.filter((c) => c.status === 'unauthorized').length} unauthorized)</h2>
<p><small>"Who" is the account that made the change. An account can be stolen, so read the reasons.</small></p>
<table><tr><th>#</th><th>Time</th><th>Who / IP</th><th>What</th><th>Before → After</th><th>Status and reasons</th></tr>
${changes.map((c) => `<tr><td>${c.n}</td><td class="m">${esc(c.timeText)}</td><td class="m">${esc(c.user)} (${esc(c.role)})<br>${esc(c.ip)}</td><td class="m">${esc(c.action)} ${esc(c.target)}</td><td class="m">${c.before ? `${esc(c.before)} → ${esc(c.after)}` : esc(c.after)}</td><td><div class="${c.status === 'unauthorized' ? 'bad' : c.status === 'normal' ? 'ok' : ''}">${STATUS_TEXT[c.status]}</div>${c.reasons.map((r) => `<div>${esc(r)}</div>`).join('')}</td></tr>`).join('') || '<tr><td colspan="6">No data changes in this log.</td></tr>'}
</table>
<h2>Flagged events (${flagged.length} of ${events.length})</h2>
<table><tr><th>#</th><th>Time</th><th>User / IP</th><th>Action</th><th>Why flagged</th></tr>
${flagged.map((e) => `<tr><td>${e.n}</td><td class="m">${esc(e.timeText)}</td><td class="m">${esc(e.user)}<br>${esc(e.ip)}</td><td class="m">${esc(e.action)} ${esc(e.target)} ${esc(e.detail)}</td><td>${e.flags.map((f) => `<div class="${f.severity === 'high' ? 'bad' : ''}">${esc(f.reason)}${(MITRE[f.code] ?? []).map((t) => ` <span class="tag">${esc(t.id)} ${esc(t.name)}</span>`).join('')}</div>`).join('')}</td></tr>`).join('')}
</table>
<h2>Summary</h2>
${ai ? `<p><em>${ai.source === 'ai' ? `${esc(aiLabel(ai.model))}. AI generated: verify against cited events.${ai.masked ? ` ${esc(ai.masked)}` : ''}` : 'Offline summary from rules (not AI).'}</em></p>
<p>${esc(ai.summary)}</p><p><strong>Verdict: ${esc(ai.verdict)}</strong> · confidence ${esc(ai.confidence)}</p>
<ul>${ai.indicators.map((i) => `<li><code>${i.events.map((n) => '#' + n).join(' ')}</code> ${esc(i.text)}</li>`).join('')}</ul>
${ai.hidden_patterns?.length ? `<p><strong>AI found beyond the rules:</strong></p><ul>${ai.hidden_patterns.map((i) => `<li><code>${i.events.map((n) => '#' + n).join(' ')}</code> ${esc(i.text)}</li>`).join('')}</ul>` : ''}
<p>Next steps:</p><ol>${ai.next_steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>` : '<p>AI summary not run.</p>'}
<h2>Audit trail (hash-chained)</h2>
<p>Chain check: ${chainBrokenAt ? `<span class="bad">BROKEN at entry ${chainBrokenAt}: the audit trail was edited</span>` : `<span class="ok">OK: ${audit.length} entries, each hash links to the one before</span>`}</p>
<table><tr><th>#</th><th>Time</th><th>Action</th><th>Detail</th><th>Entry hash</th></tr>
${audit.map((a, i) => `<tr><td>${i + 1}</td><td class="m">${esc(a.at)}</td><td class="m">${esc(a.action)}</td><td class="m">${esc(a.detail)}</td><td class="m">${esc(a.hash.slice(0, 16))}…</td></tr>`).join('')}
</table>
<h2>Full timeline</h2>
<table>${events.map((e) => `<tr><td>${e.n}</td><td class="m">${esc(e.raw)}</td></tr>`).join('')}</table>
<p><small>This report supports an investigation; it is not a legal certificate. Findings must be checked by a human investigator.</small></p>
</body></html>`;
}
