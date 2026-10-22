// Evidence integrity: SHA-256 hashing (browser Web Crypto) + audit trail kept in localStorage.
import type { Receipt } from './ledger.ts';

// Hashes text (log pasted in the box) or raw bytes (any uploaded file: PDF, image...)
export async function sha256(data: string | ArrayBuffer): Promise<string> {
  const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : data;
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

// kind 'text' = the log in the box; kind 'file' = a non-text file, verified by choosing it again
export type Evidence = { name: string; size: number; hash: string; lockedAt: string; kind?: 'text' | 'file'; type?: string; lastModified?: string; receipt?: Receipt };
// Each audit entry stores the hash of the entry before it (a hash chain).
// If anyone edits or deletes an old entry, the hashes after it stop matching.
export type AuditEntry = { at: string; action: string; detail: string; prev: string; hash: string };
const GENESIS = '0'.repeat(64);
const entryHash = (e: Omit<AuditEntry, 'hash'>) => sha256(`${e.prev}|${e.at}|${e.action}|${e.detail}`);

const KEY_EVIDENCE = 'loglens.evidence';
const KEY_AUDIT = 'loglens.audit';
const KEY_ORIGINAL = 'loglens.original'; // sealed copy of the text at lock time, used to show and undo changes

// localStorage can fail (private mode), so every access is wrapped
function read<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) ?? '') as T; } catch { return fallback; }
}
function write(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage unavailable: keep working in memory */ }
}

let memAudit: AuditEntry[] = read<AuditEntry[]>(KEY_AUDIT, []).filter((e) => e.hash); // drop old entries saved before the hash chain existed
let memEvidence: Evidence | null = read(KEY_EVIDENCE, null);

export const now = () => new Date().toLocaleString('en-IN', { hour12: false });

// Entries are added one at a time (queue) so each one links to the real previous hash
let queue: Promise<void> = Promise.resolve();
export function audit(action: string, detail: string): Promise<void> {
  queue = queue.then(async () => {
    const prev = memAudit.length ? memAudit[memAudit.length - 1].hash : GENESIS;
    const entry = { at: now(), action, detail, prev };
    memAudit = [...memAudit, { ...entry, hash: await entryHash(entry) }];
    write(KEY_AUDIT, memAudit);
  });
  return queue;
}
export const getAudit = () => memAudit;

// Re-computes every hash. Returns the first broken entry number (1-based), or 0 if the chain is intact.
export async function verifyAuditChain(): Promise<number> {
  let prev = GENESIS;
  for (let i = 0; i < memAudit.length; i++) {
    const e = memAudit[i];
    if (e.prev !== prev || e.hash !== (await entryHash(e))) return i + 1;
    prev = e.hash;
  }
  return 0;
}

// Demo only: secretly edits entry 1 the way an insider might, without fixing the hashes
export function tamperAuditForDemo() {
  if (!memAudit.length) return;
  memAudit = memAudit.map((e, i) => (i === 0 ? { ...e, detail: e.detail.replace(/\d/, '9') + ' (edited)' } : e));
  write(KEY_AUDIT, memAudit);
}

export async function lockEvidence(name: string, text: string): Promise<Evidence> {
  memEvidence = { name, size: new TextEncoder().encode(text).length, hash: await sha256(text), lockedAt: now(), kind: 'text' };
  write(KEY_ORIGINAL, text.length <= 2_000_000 ? text : null);
  write(KEY_EVIDENCE, memEvidence);
  await audit('EVIDENCE_LOCKED', `${name} · ${memEvidence.size} bytes · SHA-256 ${memEvidence.hash}`);
  return memEvidence;
}

// Any file (PDF, image, zip...): hash the raw bytes and keep its metadata
export async function lockFile(f: File): Promise<Evidence> {
  memEvidence = {
    name: f.name, size: f.size, hash: await sha256(await f.arrayBuffer()), lockedAt: now(), kind: 'file',
    type: f.type || 'unknown', lastModified: new Date(f.lastModified).toLocaleString('en-IN', { hour12: false }),
  };
  write(KEY_EVIDENCE, memEvidence);
  await audit('EVIDENCE_LOCKED', `${f.name} · ${f.size} bytes · ${memEvidence.type} · modified ${memEvidence.lastModified} · SHA-256 ${memEvidence.hash}`);
  return memEvidence;
}
export const getEvidence = () => memEvidence;

// Attach the signed server receipt to the current evidence (null = server unreachable)
export function setReceipt(r: Receipt | null) {
  if (!memEvidence) return;
  memEvidence = { ...memEvidence, receipt: r ?? undefined };
  write(KEY_EVIDENCE, memEvidence);
}

export async function verifyEvidence(data: string | ArrayBuffer) {
  if (!memEvidence) return null;
  const current = await sha256(data);
  const match = current === memEvidence.hash;
  await audit(match ? 'VERIFY_MATCH' : 'VERIFY_TAMPERED', `${memEvidence.name} · now ${current}`);
  return { match, current, original: memEvidence.hash };
}

export function clearCase() {
  memAudit = []; memEvidence = null; write(KEY_ORIGINAL, null);
  write(KEY_AUDIT, memAudit); write(KEY_EVIDENCE, null);
}

// The sealed copy saved when the text evidence was locked (null for files or if storage failed)
export const getOriginal = (): string | null => read<string | null>(KEY_ORIGINAL, null);

// Line-by-line comparison: which lines differ between the sealed copy and the current text
export function changedLines(original: string, current: string) {
  const a = original.split(/\r?\n/), b = current.split(/\r?\n/);
  const out: { line: number; before: string; after: string }[] = [];
  for (let i = 0; i < Math.max(a.length, b.length); i++)
    if (a[i] !== b[i]) out.push({ line: i + 1, before: a[i] ?? '(line missing)', after: b[i] ?? '(line removed)' });
  return out;
}
