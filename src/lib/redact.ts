// Masking before AI: account names, IP addresses, auth.log host names and e-mail addresses become USER_1, IP_1,
// HOST_1, EMAIL_1 ... in the text sent to the AI, and the browser puts the real values back into the AI's answer.
// With masking on, these values are not sent to the AI (system accounts such as root are, on purpose);
// with masking off, everything is sent as-is.
// Well-known system accounts stay readable, because the name itself is the signal (a root login is risky).

const KEEP = new Set(['root', 'admin', 'administrator', 'guest', 'nobody', '-', '']);
const KEEP_HOST = new Set(['localhost', '-', '']);
const EMAIL = /[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g;
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export type Masker = { mask: (s: string) => string; unmask: (s: string) => string; users: number; ips: number; hosts: number; emails: number };

export function makeMasker(values: { user?: string; ip?: string; host?: string; target?: string; detail?: string }[]): Masker {
  const map = new Map<string, string>(); // real value -> token
  let u = 0, i = 0, h = 0, e = 0;
  for (const v of values) {
    if (v.user && !KEEP.has(v.user.toLowerCase()) && !map.has(v.user)) map.set(v.user, `USER_${++u}`);
    if (v.ip && !map.has(v.ip)) map.set(v.ip, `IP_${++i}`);
    if (v.host && !KEEP_HOST.has(v.host.toLowerCase()) && !map.has(v.host)) map.set(v.host, `HOST_${++h}`);
    for (const mail of `${v.target ?? ''} ${v.detail ?? ''}`.match(EMAIL) ?? []) if (!map.has(mail)) map.set(mail, `EMAIL_${++e}`);
  }
  const back = new Map([...map].map(([real, token]) => [token, real]));
  // Longest values first, so "10.0.4.21" is not half-replaced by "10.0.4.2"; whole words / whole addresses only
  const real = [...map.keys()].sort((a, b) => b.length - a.length);
  const find = real.length ? new RegExp(real.map((r) => `(?<![\\w.])${esc(r)}(?![\\w])`).join('|'), 'g') : null;
  return {
    mask: (s) => (find ? s.replace(find, (m) => map.get(m) ?? m) : s),
    unmask: (s) => s.replace(/\b(?:USER|IP|HOST|EMAIL)_\d+\b/g, (t) => back.get(t) ?? t),
    users: u,
    ips: i,
    hosts: h,
    emails: e,
  };
}
