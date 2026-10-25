# LogLens Master Pack: kaise use karein (5 minute)

## Pack mein kya hai
| File | Kaam |
|---|---|
| `LOOP-MASTER.md` | Master loop: Claude Code ise iteration-by-iteration chalata hai (research → audit → blueprint → build → harden → ship) |
| `.claude/skills/master-loop/SKILL.md` | "loop chalao", "status", "analyze karo" bolte hi auto-trigger |
| `.claude/agents/forensic-auditor.md` | Read-only audit, har kami ke saath saboot (file:line / command output) |
| `.claude/agents/competitor-scout.md` | Competitors + UI reference sites ki research, source ke saath |
| `.claude/agents/ui-critic.md` | 360 / 390 / 768 / 1366 px screenshots leke UI judge karta hai |
| `.claude/settings.hooks.example.json` | Optional: har edit ke baad fast checks (pehle `/hooks` se schema check karo) |
| `scripts/check-loghub.ts` | Real Loghub logs pe LogLens ke parser + rules chalata hai |
| `brand/loglens-mark.svg`, `loglens-mark-dark.svg`, `favicon.svg` | Naya logo: magnifier ke andar blink karti aankh (reduced-motion safe) |

## Setup (VS Code terminal, LogLens folder mein)
```bash
git checkout main && git pull
git tag pre-lu-upgrade && git checkout -b lu-upgrade
# pack ki files repo root mein copy karo (same folder structure), phir:
mkdir -p tests/loghub && for f in OpenSSH/OpenSSH_2k.log Linux/Linux_2k.log Apache/Apache_2k.log; do curl -sSfL "https://raw.githubusercontent.com/logpai/loghub/master/$f" -o "tests/loghub/$(basename $f)"; done
node scripts/check-loghub.ts tests/loghub/*.log      # baseline numbers dekho
claude "/loop Run ONE iteration of docs/ai-workflow/LOOP-MASTER.md, then schedule the next."
```

## Pehle ye 3 kaam (loop inke bina guess karega)
1. Lucknow University hackathon ka brief / rubric PDF `docs/brief/` mein daalo.
2. Jo UI reference website dikhani thi, uska link do (message mein link nahi tha).
3. `.claude/settings.json` mein deep-research deny hai: rehne do (quota) ya hatao. Loop dono case sambhal leta hai.
