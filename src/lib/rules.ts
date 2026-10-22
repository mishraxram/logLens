// Rule-based red flags. Fast, explainable, no AI.
// Each rule adds a Flag with a plain-English reason to the events it matches.
import type { LogEvent, Flag } from './parse.ts';

const BURST_COUNT = 5;          // failed logins...
const BURST_WINDOW_MS = 120_000; // ...within 2 minutes
const AFTER_BURST_MS = 15 * 60_000;

function add(e: LogEvent, code: string, reason: string, severity: Flag['severity']) {
  if (!e.flags.some((f) => f.code === code)) e.flags.push({ code, reason, severity });
}

const hhmm = (e: LogEvent) => e.timeText.slice(11, 16);

// Common attack patterns seen in web request URLs, with a plain-English name
const WEB_ATTACKS: [RegExp, string][] = [
  [/union\s+select|'\s*or\s+'?1'?\s*=\s*'?1|'\s*--|;\s*drop\s+table|sleep\(\d+\)/i, 'SQL injection'],
  [/\.\.\/|\.\.\\|\/etc\/passwd|win\.ini/i, 'Path traversal'],
  [/<script|javascript:|onerror\s*=/i, 'Cross-site scripting (XSS)'],
  [/\/\.env|\/\.git\/|wp-config\.php|phpmyadmin/i, 'Secret file probe'],
  [/;\s*(cat|wget|curl|nc)\s|\|\s*(cat|wget|curl)\s|\$\(/i, 'Command injection'],
];

export function applyRules(events: LogEvent[]): LogEvent[] {
  const ipsByUser = new Map<string, Set<string>>();  // IPs each user was seen on
  const usersByIp = new Map<string, Set<string>>();  // users seen on each IP
  const burstIps = new Map<string, number>();         // ip -> time of last burst
  const attackIps = new Set<string>();                // IPs that sent attack-looking web requests

  events.forEach((e, i) => {
    const t = e.time.getTime();
    const h = e.time.getHours();

    // 1. Off-hours activity (23:00 to 06:00)
    if ((h < 6 || h >= 23) && e.action !== 'LOGOUT')
      add(e, 'off-hours', `Activity at ${hhmm(e)}, outside working hours (06:00-23:00)`, 'medium');

    // 2. Burst of failed logins from the same IP
    if (e.action === 'LOGIN_FAIL' && e.ip) {
      const window = events.slice(0, i + 1).filter(
        (p) => p.action === 'LOGIN_FAIL' && p.ip === e.ip && t - p.time.getTime() <= BURST_WINDOW_MS,
      );
      if (window.length >= BURST_COUNT) {
        window.forEach((p) => add(p, 'burst-fail', `${window.length} failed logins in 2 min from ${e.ip} (password guessing)`, 'high'));
        burstIps.set(e.ip, t);
      }
    }

    // 3. Successful login soon after a failed-login burst from the same IP
    if (e.action === 'LOGIN' && burstIps.has(e.ip) && t - burstIps.get(e.ip)! <= AFTER_BURST_MS)
      add(e, 'login-after-burst', `Successful login from ${e.ip} right after a failed-login burst: password likely guessed`, 'high');

    // 4. Login from an IP this user never used before
    const seen = ipsByUser.get(e.user);
    if (e.action === 'LOGIN' && e.ip && seen && seen.size > 0 && !seen.has(e.ip))
      add(e, 'new-ip', `First login by ${e.user} from ${e.ip} (usual: ${[...seen].join(', ')})`, 'medium');

    // 5. Same IP used by a different user before
    const others = usersByIp.get(e.ip);
    if (e.ip && others && !others.has(e.user) && others.size > 0)
      add(e, 'shared-ip', `IP ${e.ip} was used earlier by ${[...others].join(', ')}`, 'medium');

    // 6. Student account trying to change or delete records
    if (e.role === 'student' && /UPDATE|DELETE/.test(e.action))
      add(e, 'role-misuse', `Student account tried ${e.action} on ${e.target}`, 'high');

    // 7. Big marks jump, e.g. 42->92
    const jump = e.detail.match(/(\d+)\s*->\s*(\d+)/);
    if (/^marks/i.test(e.target) && jump && +jump[2] - +jump[1] >= 30)
      add(e, 'marks-jump', `Marks changed ${jump[1]} -> ${jump[2]} (+${+jump[2] - +jump[1]})`, 'high');

    // 8. Logs deleted or cleared (anti-forensics)
    if (/DELETE|CLEAR|TRUNCATE/.test(e.action) && /log/i.test(e.target))
      add(e, 'log-clear', `${e.target} deleted (${e.detail || 'no detail'}): possible evidence destruction`, 'high');

    // 9. Direct root login on the server
    if (e.action === 'LOGIN' && e.user === 'root')
      add(e, 'root-login', `Direct login as root from ${e.ip}`, 'high');

    // 10. Same user logged in from two different IPs within 10 minutes (shared or stolen password)
    if (e.action === 'LOGIN') {
      const prev = events.slice(0, i).reverse().find(
        (p) => p.action === 'LOGIN' && p.user === e.user && p.ip && p.ip !== e.ip && t - p.time.getTime() <= 10 * 60_000,
      );
      if (prev) add(e, 'impossible-travel', `${e.user} logged in from ${prev.ip} and ${e.ip} within ${Math.round((t - prev.time.getTime()) / 60_000)} min: shared or stolen password?`, 'medium');
    }

    // ---- Linux account rules (auth.log sudo / useradd / usermod) ----
    // 14. sudo used to open a root shell (not just one admin command)
    if (e.action === 'SUDO' && /^sudo as root:/.test(e.detail) && /(^|\/)(ba|z|k|da)?sh(\s|$)|(^|\/)su(\s|$)|\s-(i|s)(\s|$)/.test(e.target))
      add(e, 'sudo-root-shell', `${e.user} opened a root shell with sudo (${e.target})`, 'high');
    // 15. A new local account was created
    if (e.action === 'USER_ADD') add(e, 'new-account', `New local account "${e.target}" created: check it was approved`, 'medium');
    // 16. An account was put in an admin group
    if (e.action === 'GROUP_ADD' && /group (sudo|wheel|admin|root)$/.test(e.detail))
      add(e, 'admin-group', `${e.detail}: this account can now act as root`, 'high');

    // ---- Web server (Apache/Nginx) rules ----
    if (e.action.startsWith('HTTP_')) {
      const status = Number(e.detail.match(/status (\d{3})/)?.[1] ?? 0);

      // 11. Attack pattern inside the URL
      const attack = WEB_ATTACKS.find(([re]) => re.test(e.target));
      if (attack) {
        attackIps.add(e.ip);
        add(e, 'web-attack', `${attack[1]} pattern in URL from ${e.ip} (server replied ${status})`, 'high');
      }

      // 12. Many "not found" replies to one IP in a minute = someone scanning for hidden pages
      if (status === 404) {
        const window = events.slice(0, i + 1).filter(
          (p) => p.ip === e.ip && p.action.startsWith('HTTP_') && / 404/.test(p.detail) && t - p.time.getTime() <= 60_000,
        );
        if (window.length >= 10) window.forEach((p) => add(p, 'scan-burst', `${window.length} not-found requests in 1 min from ${e.ip}: page scanning`, 'medium'));
      }

      // 13. The attacking IP later gets a successful reply on an admin/login page
      if (attackIps.has(e.ip) && status >= 200 && status < 400 && /admin|login|wp-/i.test(e.target) && !attack)
        add(e, 'attack-success', `IP ${e.ip} that sent attack requests got a ${status} reply on ${e.target.split('?')[0]}`, 'high');
    }

    // Remember who used what (only after checks, so the current event is compared with the past)
    if (e.user && e.ip && e.action !== 'LOGIN_FAIL') {
      if (!ipsByUser.has(e.user)) ipsByUser.set(e.user, new Set());
      ipsByUser.get(e.user)!.add(e.ip);
    }
    if (e.ip && e.user) {
      if (!usersByIp.has(e.ip)) usersByIp.set(e.ip, new Set());
      usersByIp.get(e.ip)!.add(e.user);
    }
  });
  return events;
}

// One-line verdict from the rules (AI summary comes later, separately)
export function ruleVerdict(events: LogEvent[]) {
  const high = events.filter((e) => e.flags.some((f) => f.severity === 'high')).length;
  const medium = events.filter((e) => e.flags.length && !e.flags.some((f) => f.severity === 'high')).length;
  const level = high > 0 ? 'high' : medium > 0 ? 'medium' : 'none';
  return { high, medium, level };
}
