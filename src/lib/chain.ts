// Attack chain (PS2: relationships between events). Pure rules, no AI.
// 1. Link events that share an actor: the same IP or the same user account. An IP that logs in as a user
//    and that user's later actions end up in one group (union-find over IPs and users).
// 2. Put each flagged event in a MITRE ATT&CK tactic stage (tactic IDs checked on attack.mitre.org, 22 Oct 2026).
// 3. A group that reaches 2 or more stages, in time order, is shown as one attack chain.
import type { LogEvent } from './parse.ts';

export type Stage = { key: string; tactic: string; name: string };
export const STAGES: Stage[] = [
  { key: 'recon', tactic: 'TA0043', name: 'Reconnaissance' },
  { key: 'cred', tactic: 'TA0006', name: 'Credential Access' },
  { key: 'access', tactic: 'TA0001', name: 'Initial Access' },
  { key: 'impact', tactic: 'TA0040', name: 'Impact' },
  { key: 'stealth', tactic: 'TA0005', name: 'Stealth' },
];
// Which stage each rule code points to. off-hours is context only, so it is not a stage.
const STAGE_OF: Record<string, string> = {
  'scan-burst': 'recon',
  'burst-fail': 'cred',
  'web-attack': 'access', 'attack-success': 'access', 'login-after-burst': 'access', 'root-login': 'access',
  'new-ip': 'access', 'shared-ip': 'access', 'impossible-travel': 'access',
  'role-misuse': 'impact', 'marks-jump': 'impact',
  'log-clear': 'stealth',
};

export type ChainStep = Stage & { events: number[]; reasons: string[]; from: string };
export type Chain = { ips: string[]; users: string[]; steps: ChainStep[] };

export function buildChains(events: LogEvent[]): Chain[] {
  // Union-find over actor keys like "ip:1.2.3.4" and "user:21cs045"
  const parent = new Map<string, string>();
  const find = (k: string): string => {
    if (!parent.has(k)) parent.set(k, k);
    const p = parent.get(k)!;
    if (p === k) return k;
    const root = find(p);
    parent.set(k, root);
    return root;
  };
  const join = (a: string, b: string) => parent.set(find(a), find(b));
  const keysOf = (e: LogEvent) => [e.ip && `ip:${e.ip}`, e.user && `user:${e.user}`].filter(Boolean) as string[];

  // Only flagged events link actors, so normal traffic from a shared office IP does not merge everyone
  const flagged = events.filter((e) => e.flags.some((f) => STAGE_OF[f.code]));
  for (const e of flagged) {
    const ks = keysOf(e);
    ks.forEach((k) => find(k));
    if (ks.length === 2) join(ks[0], ks[1]);
  }

  const groups = new Map<string, LogEvent[]>();
  for (const e of flagged) {
    const root = find(keysOf(e)[0] ?? `event:${e.n}`);
    groups.set(root, [...(groups.get(root) ?? []), e]);
  }

  const chains: Chain[] = [];
  for (const list of groups.values()) {
    list.sort((a, b) => a.time.getTime() - b.time.getTime());
    const steps = new Map<string, ChainStep>();
    for (const e of list) for (const f of e.flags) {
      const key = STAGE_OF[f.code];
      if (!key) continue;
      const st = steps.get(key) ?? { ...STAGES.find((s) => s.key === key)!, events: [], reasons: [], from: e.timeText };
      if (!st.events.includes(e.n)) st.events.push(e.n);
      if (!st.reasons.includes(f.code)) st.reasons.push(f.code);
      steps.set(key, st);
    }
    if (steps.size < 2) continue;
    chains.push({
      ips: [...new Set(list.map((e) => e.ip).filter(Boolean))],
      users: [...new Set(list.map((e) => e.user).filter(Boolean))],
      // Steps in the order they first happened (not the fixed tactic order: real attacks skip and repeat)
      steps: [...steps.values()].sort((a, b) => Math.min(...a.events) - Math.min(...b.events)),
    });
  }
  // Longest chain first
  return chains.sort((a, b) => b.steps.length - a.steps.length);
}
