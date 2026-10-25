// Above-the-fold check: open LogLens, click the first sample, print where #verdict and #chainPanel sit (px from top).
// Usage: node scripts/check-fold.ts <url> <width> <height> <out.jpg> [dark]
import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const [url, w, h, out, dark] = process.argv.slice(2);
const width = Number(w), height = Number(h);
const port = 9700 + Math.floor(Math.random() * 90);
const chrome = spawn('google-chrome', ['--headless=new', '--disable-gpu', '--no-sandbox', `--remote-debugging-port=${port}`,
  `--user-data-dir=${mkdtempSync(join(tmpdir(), 'fold-'))}`, `--window-size=${width},${height}`, 'about:blank'], { stdio: 'ignore' });
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
let wsUrl = '';
for (let i = 0; i < 40 && !wsUrl; i++) {
  try { wsUrl = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t: any) => t.type === 'page')?.webSocketDebuggerUrl ?? ''; }
  catch { await sleep(250); }
}
const ws = new WebSocket(wsUrl);
await new Promise((ok) => ws.addEventListener('open', ok));
let id = 0; const wait = new Map<number, (v: any) => void>();
ws.addEventListener('message', (m) => { const d = JSON.parse(String(m.data)); if (d.id && wait.has(d.id)) { wait.get(d.id)!(d.result); wait.delete(d.id); } });
const send = (method: string, params: object = {}) => new Promise<any>((ok) => { const i = ++id; wait.set(i, ok); ws.send(JSON.stringify({ id: i, method, params })); });
const js = async (e: string) => (await send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true })).result?.value;

await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 600 });
if (dark) await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'dark' }] });
await send('Page.navigate', { url });
for (let t = 0; t < 40 && !(await js(`document.readyState === 'complete' && !!document.querySelector('[data-sample]')`)); t++) await sleep(250);
// Label the run as a test (like e2e), so the cases dashboard hides its receipt
await js(`(() => { const i = document.getElementById('investigator'); i.value = 'TEST check-fold'; i.dispatchEvent(new Event('change')); })()`);
await sleep(600); await js(`document.querySelector('[data-sample]').click()`);
for (let t = 0; t < 40 && !(await js(`!document.getElementById('result').closest('.hidden') && document.querySelectorAll('#timeline > *').length > 5`)); t++) await sleep(250);
await sleep(800);
await js(`window.scrollTo(0, 0)`);
const r = await js(`(() => {
  const box = (id) => { const e = document.getElementById(id); if (!e) return null; const b = e.getBoundingClientRect(); return { top: Math.round(b.top + scrollY), bottom: Math.round(b.bottom + scrollY), visible: !e.closest('.hidden') }; };
  return { viewport: innerWidth + 'x' + innerHeight, scrollWidth: document.documentElement.scrollWidth, scrollHeight: document.documentElement.scrollHeight,
    verdict: box('verdict'), chainPanel: box('chainPanel'), caseStrip: box('caseStrip'), locker: box('locker'), result: box('result') };
})()`);
console.log(JSON.stringify(r));
const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 60 });
writeFileSync(out, Buffer.from(shot.data, 'base64'));
ws.close(); chrome.kill();
