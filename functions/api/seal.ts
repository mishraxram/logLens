// Server-side evidence ledger (v2 Worker only: needs the D1 binding DB and the secret SEAL_SECRET).
//   POST /api/seal        -> adds a signed, hash-chained receipt for an evidence hash. Returns the receipt.
//   GET  /api/seal?id=N   -> re-checks one receipt: signature valid? chain link to the row before intact?
//   GET  /api/ledger      -> last 50 rows, each re-checked, plus whether the whole chain is intact.
// Why: the browser audit trail lives in localStorage, so a user with devtools could rewrite it.
// A receipt here is signed with a key the browser never sees, and rows are only ever added.
// Honest limit: the Cloudflare account owner can still edit D1 directly; the signature check would catch
// an edited row unless the secret also leaked.

type D1 = {
  prepare: (sql: string) => { bind: (...v: unknown[]) => { first: <T>() => Promise<T | null>; all: <T>() => Promise<{ results: T[] }>; run: () => Promise<unknown> }; first: <T>() => Promise<T | null>; all: <T>() => Promise<{ results: T[] }> };
};
export type SealEnv = { DB?: D1; SEAL_SECRET?: string };
type Row = { id: number; sealed_at: string; sha256: string; name: string; size: number; investigator: string; action: string; prev_hash: string; entry_hash: string; sig: string };

const GENESIS = '0'.repeat(64);
const ACTIONS = ['SEALED', 'VERIFIED_MATCH', 'VERIFIED_TAMPERED'];
const hex = (buf: ArrayBuffer) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
const sha256 = async (s: string) => hex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)));

async function hmac(secret: string, msg: string) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return hex(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(msg)));
}
const entryHashOf = (r: Omit<Row, 'id' | 'entry_hash' | 'sig'>) =>
  sha256([r.prev_hash, r.sealed_at, r.sha256, r.name, r.size, r.investigator, r.action].join('|'));

// One row is valid if its entry hash recomputes and its signature matches (constant-time compare not needed:
// the signature is not a password and the attacker gains nothing from timing here)
async function checkRow(r: Row, secret: string) {
  const hashOk = (await entryHashOf(r)) === r.entry_hash;
  const sigOk = (await hmac(secret, r.entry_hash)) === r.sig;
  return hashOk && sigOk;
}

const notReady = (env: SealEnv) => !env.DB || !env.SEAL_SECRET;
const offline = () => Response.json({ error: 'Server ledger not available here (local hash only)' }, { status: 503 });

export async function sealPost(request: Request, env: SealEnv): Promise<Response> {
  if (notReady(env)) return offline();
  let b: any;
  try { b = await request.json(); } catch { return Response.json({ error: 'Bad JSON' }, { status: 400 }); }
  const hash = String(b?.sha256 ?? '').toLowerCase();
  if (!/^[0-9a-f]{64}$/.test(hash)) return Response.json({ error: 'sha256 must be 64 hex characters' }, { status: 400 });
  const action = ACTIONS.includes(b?.action) ? b.action : 'SEALED';
  const row = {
    sealed_at: new Date().toISOString(), sha256: hash, name: String(b?.name ?? 'evidence').slice(0, 200),
    size: Math.max(0, Math.floor(Number(b?.size) || 0)), investigator: String(b?.investigator ?? '').trim().slice(0, 60) || 'not given', action,
    prev_hash: GENESIS,
  };
  const db = env.DB!;
  // Link to the newest row. Two seals at the same instant could pick the same prev; the ledger check then shows it.
  const last = await db.prepare('SELECT entry_hash FROM seals ORDER BY id DESC LIMIT 1').first<{ entry_hash: string }>();
  row.prev_hash = last?.entry_hash ?? GENESIS;
  const entry_hash = await entryHashOf(row);
  const sig = await hmac(env.SEAL_SECRET!, entry_hash);
  const saved = await db.prepare(
    'INSERT INTO seals (sealed_at, sha256, name, size, investigator, action, prev_hash, entry_hash, sig) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id',
  ).bind(row.sealed_at, row.sha256, row.name, row.size, row.investigator, row.action, row.prev_hash, entry_hash, sig).first<{ id: number }>();
  return Response.json({ id: saved?.id, ...row, entry_hash, sig });
}

export async function sealGet(request: Request, env: SealEnv): Promise<Response> {
  if (notReady(env)) return offline();
  const id = Number(new URL(request.url).searchParams.get('id'));
  if (!Number.isInteger(id) || id < 1) return Response.json({ error: 'Give ?id=<receipt number>' }, { status: 400 });
  const row = await env.DB!.prepare('SELECT * FROM seals WHERE id = ?').bind(id).first<Row>();
  if (!row) return Response.json({ error: `No receipt #${id}` }, { status: 404 });
  const before = await env.DB!.prepare('SELECT entry_hash FROM seals WHERE id < ? ORDER BY id DESC LIMIT 1').bind(id).first<{ entry_hash: string }>();
  const linkOk = row.prev_hash === (before?.entry_hash ?? GENESIS);
  return Response.json({ receipt: row, valid: await checkRow(row, env.SEAL_SECRET!), linkOk });
}

export async function ledgerGet(env: SealEnv): Promise<Response> {
  if (notReady(env)) return offline();
  const { results } = await env.DB!.prepare('SELECT * FROM seals ORDER BY id DESC LIMIT 51').all<Row>();
  const rows = results.slice(0, 50);
  // Newest first: each row's prev_hash must equal the entry_hash of the next (older) row
  // (we read 51 rows so the 50th row can still be checked against the one before it)
  const checked = await Promise.all(rows.map(async (r, i) => {
    const older = results[i + 1];
    const linkOk = older ? r.prev_hash === older.entry_hash : r.prev_hash === GENESIS;
    return { ...r, valid: await checkRow(r, env.SEAL_SECRET!), linkOk };
  }));
  return Response.json({ rows: checked, intact: checked.every((r) => r.valid && r.linkOk) });
}
