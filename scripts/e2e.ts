// Browser end-to-end check of the demo path, using headless Chrome over the DevTools protocol (no extra packages).
// Usage: node scripts/e2e.ts [url] [width]   e.g. node scripts/e2e.ts https://loglens-v2.loglens.workers.dev/ 360
// Steps: sample -> timeline -> AI summary -> verify MATCH -> edit one char -> TAMPERED -> report button.
// Fails (exit 1) on any console error, CSP violation, JS exception or missing step.
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const url = process.argv[2] || 'http://localhost:8799/';
const width = Number(process.argv[3] || 360);
const port = 9300 + Math.floor(Math.random() * 500);
const chrome = spawn('google-chrome', ['--headless=new', '--disable-gpu', '--no-sandbox', `--remote-debugging-port=${port}`,
  `--user-data-dir=${mkdtempSync(join(tmpdir(), 'e2e-'))}`, `--window-size=${width},900`, 'about:blank'], { stdio: 'ignore' });

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const problems: string[] = [];
const steps: string[] = [];

async function main() {
  // Find the page target once Chrome is up
  let wsUrl = '';
  for (let i = 0; i < 40 && !wsUrl; i++) {
    try { wsUrl = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t: any) => t.type === 'page')?.webSocketDebuggerUrl ?? ''; }
    catch { await sleep(250); }
  }
  if (!wsUrl) throw new Error('Chrome did not start');
  const ws = new WebSocket(wsUrl);
  await new Promise((ok) => ws.addEventListener('open', ok));
  let id = 0;
  const waiting = new Map<number, (v: any) => void>();
  ws.addEventListener('message', (m) => {
    const msg = JSON.parse(String(m.data));
    if (msg.id && waiting.has(msg.id)) { waiting.get(msg.id)!(msg.result); waiting.delete(msg.id); }
    if (msg.method === 'Runtime.exceptionThrown') problems.push('JS exception: ' + msg.params.exceptionDetails.exception?.description);
    if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') problems.push('console.error: ' + msg.params.args.map((a: any) => a.value ?? a.description).join(' '));
    if (msg.method === 'Log.entryAdded' && msg.params.entry.level === 'error') problems.push(`${msg.params.entry.source}: ${msg.params.entry.text}`);
  });
  const send = (method: string, params = {}) => new Promise<any>((ok) => { const n = ++id; waiting.set(n, ok); ws.send(JSON.stringify({ id: n, method, params })); });
  const js = async (expr: string) => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result?.value;
  const waitFor = async (expr: string, ms: number) => { for (let t = 0; t < ms; t += 250) { if (await js(expr)) return true; await sleep(250); } return false; };
  const step = (ok: boolean, name: string) => { steps.push(`${ok ? 'PASS' : 'FAIL'} ${name}`); if (!ok) problems.push('step failed: ' + name); };

  await send('Runtime.enable'); await send('Log.enable'); await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 600 });
  await send('Page.navigate', { url });
  step(await waitFor(`document.readyState === 'complete' && !!document.querySelector('[data-sample]')`, 10000), 'page loads with sample buttons');

  // Automated runs are labelled so the cases dashboard can hide them
  await js(`(() => { const i = document.getElementById('investigator'); i.value = 'TEST e2e'; i.dispatchEvent(new Event('change')); })()`);
  await js(`document.querySelector('[data-sample]').click()`);
  step(await waitFor(`document.querySelectorAll('#timeline > *').length > 5`, 5000), 'sample -> timeline rows');
  step(await js(`document.documentElement.scrollWidth <= window.innerWidth`), `no horizontal scroll at ${width}px`);
  step(await js(`!document.getElementById('chainPanel').classList.contains('hidden') && /TA00\\d\\d/.test(document.getElementById('chains').textContent)`), 'attack chain panel with MITRE tactics');
  step(await js(`[...document.querySelectorAll('.mitre-chip')].some((a) => /^T\\d{4}/.test(a.textContent) && a.href.startsWith('https://attack.mitre.org/'))`), 'MITRE ATT&CK chips on flags');

  // Server receipt (v2 only). On a site without the ledger (v1) this shows the offline message instead.
  const hasReceipt = await waitFor(`/Server receipt #\\d+/.test(document.getElementById('receipt').textContent)`, 6000);
  if (hasReceipt) {
    await js(`[...document.querySelectorAll('#receipt button')].find((b) => /Check server receipt/.test(b.textContent)).click()`);
    step(await waitFor(`/RECEIPT VALID/.test(document.getElementById('receipt').textContent)`, 6000), 'server receipt -> RECEIPT VALID');
  } else step(await js(`/not available/.test(document.getElementById('receipt').textContent)`), 'no server ledger: offline receipt message shown');

  await js(`document.getElementById('ai').click()`);
  step(await waitFor(`document.getElementById('aiOut').textContent.trim().length > 40`, 12000), 'AI summary (live or labelled offline) shown');
  if (await js(`/AI: (open-weight|Gemini)/.test(document.getElementById('aiOut').textContent)`)) // live label; offline says "Not AI generated"
    step(await js(`/Cross-check: AI vs rules/.test(document.getElementById('aiOut').textContent)`), 'AI vs rules cross-check shown');
  steps.push('     AI label: ' + (await js(`(document.getElementById('aiOut').textContent.match(/AI: (open-weight|Gemini)[^.]*|offline[^.]*/i) || ['?'])[0]`)));

  await js(`document.getElementById('verify').click()`);
  step(await waitFor(`/MATCH/.test(document.getElementById('verifyOut').textContent)`, 4000), 'verify -> MATCH');
  await js(`(() => { const b = document.getElementById('log'); b.value = b.value.replace(/\\d/, (d) => String((+d + 1) % 10)); })()`);
  await js(`document.getElementById('verify').click()`);
  step(await waitFor(`/TAMPERED/.test(document.getElementById('verifyOut').textContent)`, 4000), 'one char changed -> TAMPERED');
  step(await js(`!!document.getElementById('report') && !document.getElementById('report').disabled`), 'report button ready');

  // PS1: upload a real log file -> its metadata (type, last modified) is shown on the evidence tag
  await send('DOM.enable');
  const { root } = await send('DOM.getDocument');
  const { nodeId } = await send('DOM.querySelector', { nodeId: root.nodeId, selector: '#file' });
  await js(`document.getElementById('newCase').click()`);
  await send('DOM.setFileInputFiles', { nodeId, files: [join(process.cwd(), 'tests/cases/15-web-attack.log')] });
  step(await waitFor(`/15-web-attack\\.log/.test(document.getElementById('evName').textContent) && /file last modified/.test(document.getElementById('evName').textContent)`, 5000), 'file upload -> metadata on evidence tag');

  // PS6 dashboard page: cases from the server ledger, chain re-checked
  await send('Page.navigate', { url: new URL('/cases', url).href });
  step(await waitFor(`/Ledger intact|not reachable/.test(document.getElementById('chainState')?.textContent ?? '')`, 8000), 'cases dashboard loads');
  steps.push('     dashboard: ' + (await js(`document.getElementById('chainState').textContent + ' | ' + document.getElementById('counts').textContent`)));
  step(await js(`document.documentElement.scrollWidth <= window.innerWidth`), `dashboard: no horizontal scroll at ${width}px`);

  ws.close();
}

main().catch((e) => problems.push('runner: ' + e.message)).finally(() => {
  chrome.kill();
  console.log(steps.join('\n'));
  console.log(problems.length ? `E2E FAIL (${problems.length})\n- ` + problems.join('\n- ') : `E2E PASS: 0 console errors at ${width}px`);
  process.exit(problems.length ? 1 : 0);
});
