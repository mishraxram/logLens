// MITRE ATT&CK technique for each rule code. Every ID was checked on attack.mitre.org on 22 Oct 2026
// (page titles in docs/RESEARCH-DEEP.md section 4, git history before the 25 Oct 2026 cleanup (commit 636c098)). A flag is an indicator of the technique, not proof.
export type Technique = { id: string; name: string };

export const MITRE: Record<string, Technique[]> = {
  'burst-fail': [{ id: 'T1110.001', name: 'Brute Force: Password Guessing' }],
  'login-after-burst': [{ id: 'T1110', name: 'Brute Force' }, { id: 'T1078', name: 'Valid Accounts' }],
  'root-login': [{ id: 'T1078.003', name: 'Valid Accounts: Local Accounts' }],
  'off-hours': [{ id: 'T1078', name: 'Valid Accounts' }],
  'new-ip': [{ id: 'T1078', name: 'Valid Accounts' }],
  'shared-ip': [{ id: 'T1078', name: 'Valid Accounts' }],
  'impossible-travel': [{ id: 'T1078', name: 'Valid Accounts' }],
  'role-misuse': [{ id: 'T1078', name: 'Valid Accounts' }],
  'log-clear': [{ id: 'T1070', name: 'Indicator Removal' }],
  'marks-jump': [{ id: 'T1565.001', name: 'Data Manipulation: Stored Data Manipulation' }],
  'web-attack': [{ id: 'T1190', name: 'Exploit Public-Facing Application' }],
  'attack-success': [{ id: 'T1190', name: 'Exploit Public-Facing Application' }],
  'scan-burst': [{ id: 'T1595.002', name: 'Active Scanning: Vulnerability Scanning' }],
  'sudo-root-shell': [{ id: 'T1548.003', name: 'Abuse Elevation Control Mechanism: Sudo and Sudo Caching' }],
  'new-account': [{ id: 'T1136.001', name: 'Create Account: Local Account' }],
  'admin-group': [{ id: 'T1098', name: 'Account Manipulation' }],
};

// attack.mitre.org uses a slash for sub-techniques: T1110.001 -> /techniques/T1110/001/
export const mitreUrl = (id: string) => `https://attack.mitre.org/techniques/${id.replace('.', '/')}/`;
