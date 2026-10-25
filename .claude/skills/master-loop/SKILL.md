---
name: master-loop
description: "Use when the user says loop, loop chalao, master loop, analyze karo, full forensic, upgrade karo, best banao, status, next iteration, or asks to improve LogLens for a hackathon. Runs ONE iteration of LOOP-MASTER.md and schedules the next."
argument-hint: "[optional: status | phase name | a specific backlog item]"
---
Input: $ARGUMENTS

1. Read `docs/ai-workflow/LOOP-MASTER.md` sections 0-3 and the top of `docs/MASTER_LOG.md` (create it from LOOP-MASTER section 13 if missing).
2. If the input is `status`: print the phase, the gate table, the top 5 backlog rows, open NEEDS YOU items and time left. Stop.
3. Otherwise run exactly ONE iteration as described in LOOP-MASTER section 6 (phase -> pick one item -> verify APIs -> build or research -> prove with real command output -> commit -> log).
4. Use the trigger map in LOOP-MASTER section 11 to choose skills and agents. Never call a tool that is denied in `.claude/settings.json`; use the fallback named in the map.
5. Never write a claim without evidence. Unchecked = `UNVERIFIED` or `not checked`.
6. End by scheduling the next iteration (60-120 s if work is ready, 1200 s if blocked on the user).
