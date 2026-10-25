// Downloads the three 2k Loghub samples used by scripts/check-loghub.ts into tests/loghub/ (not committed: *.log is git-ignored).
// Loghub: https://github.com/logpai/loghub (real system logs, free for research and academic use; cite the repo URL).
// Run: npm run loghub   (fetch + check)
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';

const FILES = ['OpenSSH/OpenSSH_2k.log', 'Linux/Linux_2k.log', 'Apache/Apache_2k.log'];
mkdirSync('tests/loghub', { recursive: true });
for (const f of FILES) {
  const out = `tests/loghub/${f.split('/')[1]}`;
  if (existsSync(out)) { console.log(`have ${out}`); continue; }
  const res = await fetch(`https://raw.githubusercontent.com/logpai/loghub/master/${f}`);
  if (!res.ok) { console.error(`failed ${f}: HTTP ${res.status}`); process.exit(1); }
  writeFileSync(out, await res.text());
  console.log(`got  ${out}`);
}
