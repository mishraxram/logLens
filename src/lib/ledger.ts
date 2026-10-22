// Browser side of the server evidence ledger (functions/api/seal.ts).
// If the server is unreachable (offline, v1 Pages site) every call returns null and the app keeps the local hash only.
export type Receipt = {
  id: number; sealed_at: string; sha256: string; name: string; size: number;
  investigator: string; action: string; prev_hash: string; entry_hash: string; sig: string;
};
export type ReceiptCheck = { receipt: Receipt; valid: boolean; linkOk: boolean };

const TIMEOUT_MS = 5000;

export async function sealOnServer(body: { sha256: string; name: string; size: number; investigator: string; action: string }): Promise<Receipt | null> {
  try {
    const res = await fetch('/api/seal', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body), signal: AbortSignal.timeout(TIMEOUT_MS) });
    return res.ok ? ((await res.json()) as Receipt) : null;
  } catch { return null; }
}

export async function checkReceipt(id: number): Promise<ReceiptCheck | null> {
  try {
    const res = await fetch(`/api/seal?id=${id}`, { signal: AbortSignal.timeout(TIMEOUT_MS) });
    return res.ok ? ((await res.json()) as ReceiptCheck) : null;
  } catch { return null; }
}

// Investigator name (PS6: who did what). Kept in this browser only.
const KEY = 'loglens.investigator';
export function getInvestigator(): string {
  try { return localStorage.getItem(KEY) ?? ''; } catch { return ''; }
}
export function setInvestigator(name: string) {
  try { localStorage.setItem(KEY, name.trim().slice(0, 60)); } catch { /* storage unavailable */ }
}
