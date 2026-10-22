// Change register: every event that CHANGED data or accounts (update, delete, admin form post, new account),
// with who, when, from where, before -> after, and whether it looks authorized.
import type { LogEvent } from './parse.ts';

export type Change = {
  n: number; timeText: string; user: string; role: string; ip: string;
  action: string; target: string; before: string; after: string;
  status: 'unauthorized' | 'suspicious' | 'blocked' | 'normal';
  reasons: string[];
};

// USER_ADD / GROUP_ADD (Linux useradd / usermod) are account changes, so they belong in the register too
const CHANGE_ACTIONS = /^(UPDATE|DELETE|INSERT|CLEAR|TRUNCATE|DROP|USER_ADD|GROUP_ADD)$/;

function isChange(e: LogEvent) {
  if (CHANGE_ACTIONS.test(e.action)) return true;
  // Web: a form post that the server accepted on an admin/update page
  const status = Number(e.detail.match(/status (\d{3})/)?.[1] ?? 0);
  return /^HTTP_(POST|PUT|DELETE|PATCH)$/.test(e.action) && status >= 200 && status < 400 && /admin|update|edit|delete/i.test(e.target);
}

export function extractChanges(events: LogEvent[]): Change[] {
  return events.filter(isChange).map((e) => {
    // The login that started this session: same user + same IP, most recent before this change
    const login = [...events].reverse().find((p) => p.n < e.n && p.action === 'LOGIN' && p.user === e.user && p.ip === e.ip);
    const own = e.flags.map((f) => f.reason);
    const fromLogin = (login?.flags ?? []).map((f) => `Session login #${login!.n}: ${f.reason}`);
    const high = e.flags.some((f) => f.severity === 'high') || (login?.flags ?? []).some((f) => f.severity === 'high');
    const any = own.length > 0 || fromLogin.length > 0;
    const m = e.detail.match(/(\S+)\s*->\s*(\S+)/);
    const denied = /DENIED|no permission/i.test(e.detail);
    return {
      n: e.n, timeText: e.timeText, user: e.user || '(unknown)', role: e.role, ip: e.ip,
      action: e.action, target: e.target,
      before: m ? m[1] : '',
      after: m ? m[2] : e.action.startsWith('HTTP_') ? `server replied ${e.detail.match(/status (\d{3})/)?.[1] ?? '?'}` : e.detail,
      status: denied ? 'blocked' : high ? 'unauthorized' : any ? 'suspicious' : 'normal',
      reasons: [...own, ...fromLogin],
    } as Change;
  });
}

export const STATUS_TEXT: Record<Change['status'], string> = {
  unauthorized: 'Unauthorized',
  suspicious: 'Suspicious',
  blocked: 'Blocked attempt',
  normal: 'Looks normal',
};
