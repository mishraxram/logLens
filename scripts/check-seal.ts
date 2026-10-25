// Checks the server evidence ledger: seal -> receipt valid -> ledger intact.
// Usage: node scripts/check-seal.ts [base-url]   (default: local wrangler dev on port 8813)
// The "edited row is caught" test is run separately on the LOCAL database only, see docs/UPGRADE_LOG.md in the git history before the 25 Oct 2026 cleanup (commit 636c098).
export {}; // makes this file a module, so top-level await is allowed
const base = (process.argv[2] || 'http://localhost:8813').replace(/\/$/, '');
let fails = 0;
const ok = (cond: boolean, name: string) => { console.log(`${cond ? 'PASS' : 'FAIL'} ${name}`); if (!cond) fails++; };

const post = (body: unknown) => fetch(`${base}/api/seal`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });

const hash = 'ab'.repeat(32);
const res = await post({ sha256: hash, name: 'check-seal sample.txt', size: 123, investigator: 'TEST check-seal' });
const r: any = await res.json();
ok(res.status === 200 && Number.isInteger(r.id) && /^[0-9a-f]{64}$/.test(r.sig), `seal returns signed receipt #${r.id}`);
ok(r.sealed_at && !Number.isNaN(Date.parse(r.sealed_at)), 'receipt has server time');

const g: any = await (await fetch(`${base}/api/seal?id=${r.id}`)).json();
ok(g.valid === true && g.linkOk === true && g.receipt?.sha256 === hash, 'receipt re-check: signature valid, chain link intact');

const bad = await post({ sha256: 'not-a-hash' });
ok(bad.status === 400, 'bad hash refused (400)');
const wrongType = await fetch(`${base}/api/seal`, { method: 'POST', headers: { 'content-type': 'text/plain' }, body: 'x' });
ok(wrongType.status === 415, 'non-JSON refused (415)');
ok((await fetch(`${base}/api/seal?id=999999999`)).status === 404, 'unknown receipt -> 404');

// Race test: 6 receipts at the same moment must still form one straight chain (UNIQUE prev_hash + retry)
const burst = await Promise.all(Array.from({ length: 6 }, (_, i) => post({ sha256: hash, name: 'check-seal burst', size: i, investigator: 'TEST check-seal', action: 'VERIFIED_MATCH' })));
ok(burst.every((b) => b.status === 200), 'burst of 6 parallel receipts all saved');

const l: any = await (await fetch(`${base}/api/ledger`)).json();
ok(l.intact === true, 'ledger chain intact after the burst (no fork)');
ok(Array.isArray(l.rows) && l.rows.some((x: any) => x.id === r.id), 'ledger lists the new receipt');
console.log(`ledger intact: ${l.intact} (${l.rows?.length} rows checked)`);

console.log(fails ? `SEAL FAIL (${fails})` : 'SEAL PASS');
process.exit(fails ? 1 : 0);
