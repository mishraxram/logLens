// Turns raw log text into a sorted list of events.
// Supports 4 formats: ERP audit CSV, Linux auth.log (sshd, sudo, useradd, usermod, su lines, old and new syslog style),
// Apache/Nginx access log, Apache error log.

export type Flag = { code: string; reason: string; severity: 'high' | 'medium' };

export type LogEvent = {
  n: number;          // event number after sorting (1, 2, 3...)
  time: Date;
  timeText: string;   // "2026-10-14 02:07:15"
  user: string;
  role: string;
  ip: string;
  action: string;     // LOGIN, LOGIN_FAIL, UPDATE, DELETE, LOGOUT...
  target: string;
  detail: string;
  raw: string;        // original line, kept as evidence
  flags: Flag[];
};

export type ParseResult = {
  events: LogEvent[];
  notes: string[];     // lines starting with # (case notes, sample labels)
  unparsed: string[];  // lines we did not understand (never silently dropped)
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const pad = (x: number) => String(x).padStart(2, '0');

export function formatTime(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

// ERP CSV: time,user,role,ip,action,target,detail
function parseErpLine(line: string): Omit<LogEvent, 'n' | 'flags' | 'timeText'> | null {
  const parts = line.split(',');
  if (parts.length < 6) return null;
  const m = parts[0].trim().match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2}):(\d{2})$/);
  if (!m) return null;
  const time = new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]);
  return {
    time,
    user: parts[1].trim(),
    role: parts[2].trim().toLowerCase(),
    ip: parts[3].trim(),
    action: parts[4].trim().toUpperCase(),
    target: parts[5].trim(),
    detail: parts.slice(6).join(',').trim(), // detail may contain commas
    raw: line,
  };
}

// auth.log: "Oct 14 03:41:02 host sshd[2310]: Failed password for root from 1.2.3.4 port 51122 ssh2"
// Also sudo, useradd and usermod lines from the same file (standard Linux formats):
//   "Oct 14 03:46:30 host sudo:  alice : TTY=pts/1 ; PWD=/home/alice ; USER=root ; COMMAND=/bin/bash"
//   "Oct 14 03:44:10 host useradd[2401]: new user: name=sysbackup, UID=1002, GID=1002, home=/home/sysbackup, shell=/bin/bash"
//   "Oct 14 03:44:12 host usermod[2410]: add 'sysbackup' to group 'sudo'"
// Older syslog style seen in real logs (Loghub Linux_2k): "sshd(pam_unix)[19939]: authentication failure; ... rhost=218.188.2.4"
function parseAuthLine(line: string, year: number): Omit<LogEvent, 'n' | 'flags' | 'timeText'> | null {
  const m = line.match(/^([A-Z][a-z]{2})\s+(\d{1,2}) (\d{2}):(\d{2}):(\d{2}) (\S+) (sshd|sudo|useradd|usermod|su)(\(pam_unix\))?(?:\[\d+\])?: (.*)$/);
  if (!m || !MONTHS.includes(m[1])) return null;
  const time = new Date(year, MONTHS.indexOf(m[1]), +m[2], +m[3], +m[4], +m[5]);
  const msg = m[9].trim();
  const base = { time, role: '', ip: '', target: m[6], detail: msg, raw: line };
  const roleOf = (u: string) => (u === 'root' ? 'root' : 'user');
  let x;
  // Old style "sshd(pam_unix)": in these logs it is the only line per failed login, so it counts as LOGIN_FAIL
  if (m[8] && m[7] === 'sshd' && (x = msg.match(/^authentication failure;.*rhost=(\S+)(?:\s+user=(\S+))?/)))
    return { ...base, user: x[2] ?? '', role: x[2] ? roleOf(x[2]) : 'unknown', ip: x[1], action: 'LOGIN_FAIL' };
  if (m[7] === 'su') {
    if ((x = msg.match(/session (opened|closed) for user (\S+)/))) return { ...base, user: x[2], role: roleOf(x[2]), action: x[1] === 'opened' ? 'SU_OPEN' : 'SU_CLOSE' };
    return null;
  }
  if (m[7] === 'sudo') {
    // user : ... USER=<runs as> ; COMMAND=<command>
    if ((x = msg.match(/^(\S+) : .*USER=(\S+) ; COMMAND=(.*)$/)))
      return { ...base, user: x[1], role: 'user', target: x[3].trim(), detail: `sudo as ${x[2]}: ${x[3].trim()}`, action: 'SUDO' };
    return null;
  }
  // useradd / usermod need root, so the acting account is root; the target is the account changed
  if (m[7] === 'useradd') {
    if ((x = msg.match(/new user: name=([^,\s]+)/))) return { ...base, user: 'root', role: 'root', target: x[1], action: 'USER_ADD' };
    return null;
  }
  if (m[7] === 'usermod') {
    if ((x = msg.match(/add '([^']+)' to group '([^']+)'/))) return { ...base, user: 'root', role: 'root', target: x[1], detail: `added ${x[1]} to group ${x[2]}`, action: 'GROUP_ADD' };
    return null;
  }
  if ((x = msg.match(/^Failed password for (invalid user )?(\S+) from (\S+)/)))
    return { ...base, user: x[2], role: x[2] === 'root' ? 'root' : x[1] ? 'unknown' : 'user', ip: x[3], action: 'LOGIN_FAIL' };
  if ((x = msg.match(/^Accepted (\S+) for (\S+) from (\S+)/)))
    return { ...base, user: x[2], role: x[2] === 'root' ? 'root' : 'user', ip: x[3], action: 'LOGIN' };
  if ((x = msg.match(/session (opened|closed) for user (\S+)/)))
    return { ...base, user: x[2], role: x[2] === 'root' ? 'root' : 'user', action: x[1] === 'opened' ? 'SESSION_OPEN' : 'LOGOUT' };
  // More sshd lines from real logs (Loghub OpenSSH_2k), so they are not just "SSHD"
  if ((x = msg.match(/^Invalid user (\S*) from (\S+)/)))
    return { ...base, user: x[1], role: 'unknown', ip: x[2], action: 'INVALID_USER' };
  if ((x = msg.match(/^reverse mapping checking getaddrinfo for \S+ \[(\S+)\] failed - POSSIBLE BREAK-IN ATTEMPT/)))
    return { ...base, user: '', ip: x[1], action: 'DNS_MISMATCH' };
  if ((x = msg.match(/^(?:error: )?(?:Received disconnect from|Connection closed by) (\d[\d.:a-f]*)/i)))
    return { ...base, user: '', ip: x[1], action: 'DISCONNECT' };
  if ((x = msg.match(/^Did not receive identification string from (\S+)/)))
    return { ...base, user: '', ip: x[1], action: 'NO_IDENT' };
  // New style "pam_unix(sshd:auth)" comes with a "Failed password" line for the same try: context only, not counted twice
  if ((x = msg.match(/^pam_unix\(sshd:auth\): authentication failure;.*rhost=(\S+)/)))
    return { ...base, user: '', ip: x[1], action: 'PAM_AUTH_FAIL' };
  return { ...base, user: '', action: 'SSHD' };
}

// Apache error log: "[Sun Dec 04 04:47:44 2005] [error] [client 1.2.3.4] File does not exist: /var/www/html/x"
function parseApacheErrorLine(line: string): Omit<LogEvent, 'n' | 'flags' | 'timeText'> | null {
  const m = line.match(/^\[[A-Z][a-z]{2} ([A-Z][a-z]{2}) (\d{1,2}) (\d{2}):(\d{2}):(\d{2})(?:\.\d+)? (\d{4})\] \[([a-z:]+)\] (.*)$/);
  if (!m || !MONTHS.includes(m[1])) return null;
  const time = new Date(+m[6], MONTHS.indexOf(m[1]), +m[2], +m[3], +m[4], +m[5]);
  const client = m[8].match(/\[client (\S+?)(?::\d+)?\]/);
  const level = m[7].split(':').pop()!.toUpperCase();
  return { time, user: '', role: 'web', ip: client?.[1] ?? '', action: `HTTPD_${level}`, target: 'apache', detail: m[8].slice(0, 300), raw: line };
}

// Apache / Nginx access log (common + combined format):
// 49.36.1.7 - - [14/Oct/2026:02:07:15 +0530] "GET /admin/login.php?id=1' OR 1=1-- HTTP/1.1" 200 512 "-" "sqlmap"
function parseAccessLine(line: string): Omit<LogEvent, 'n' | 'flags' | 'timeText'> | null {
  const m = line.match(/^(\S+) \S+ (\S+) \[(\d{2})\/([A-Z][a-z]{2})\/(\d{4}):(\d{2}):(\d{2}):(\d{2})[^\]]*\] "(\S+) (\S+)[^"]*" (\d{3}) \S+(?: "[^"]*" "([^"]*)")?/);
  if (!m || !MONTHS.includes(m[4])) return null;
  const time = new Date(+m[5], MONTHS.indexOf(m[4]), +m[3], +m[6], +m[7], +m[8]); // time as written in the log
  let path = m[10];
  try { path = decodeURIComponent(path.replace(/\+/g, ' ')); } catch { /* keep the raw path if it is badly encoded */ }
  return {
    time, user: m[2] === '-' ? '' : m[2], role: 'web', ip: m[1], action: `HTTP_${m[9].toUpperCase()}`,
    target: path.slice(0, 200), detail: `status ${m[11]}${m[12] ? ` · ${m[12].slice(0, 60)}` : ''}`, raw: line,
  };
}

export function parseLog(text: string, year = new Date().getFullYear()): ParseResult {
  const notes: string[] = [];
  const unparsed: string[] = [];
  const rows: Omit<LogEvent, 'n' | 'flags' | 'timeText'>[] = [];
  // auth.log lines carry no year. Logs are written in order, so when the month jumps back by more than
  // half a year (Dec -> Jan) the log has crossed New Year: later lines belong to the next year.
  let authYear = year, lastMonth = -1;
  const auth = (line: string) => {
    const ev = parseAuthLine(line, authYear);
    if (!ev) return null;
    if (lastMonth - ev.time.getMonth() > 6) {
      authYear++;
      ev.time.setFullYear(authYear);
      notes.push(`auth.log has no year: lines from ${MONTHS[ev.time.getMonth()]} on were placed in ${authYear} (log crossed New Year)`);
    }
    lastMonth = ev.time.getMonth();
    return ev;
  };

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;
    if (line.startsWith('#')) { notes.push(line.replace(/^#\s*/, '')); continue; }
    if (/^time,user,role/i.test(line)) continue; // CSV header
    // syslog "message repeated N times: [ ... ]" = the same line N times (capped at 50)
    const rep = line.match(/^(.*?: )message repeated (\d+) times: \[\s*(.*?)\s*\]$/);
    if (rep) {
      const inner = auth(rep[1] + rep[3]);
      if (inner) { for (let i = 0; i < Math.min(+rep[2], 50); i++) rows.push({ ...inner, raw: line }); continue; }
    }
    const ev = parseErpLine(line) ?? auth(line) ?? parseAccessLine(line) ?? parseApacheErrorLine(line);
    if (ev) rows.push(ev); else unparsed.push(line);
  }

  // Sort by time so the timeline is in order even if the log was shuffled
  rows.sort((a, b) => a.time.getTime() - b.time.getTime());
  const events = rows.map((r, i) => ({ ...r, n: i + 1, timeText: formatTime(r.time), flags: [] as Flag[] }));
  return { events, notes, unparsed };
}
