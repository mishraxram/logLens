# PITCH — LogLens · Hacktoberfest Hack Day 2026, University of Lucknow

**Team:** SOLAR FLARES · **Rule:** exactly 4 members. `docs/TEAM.md` lists 2 today: **add the other 2 names before the PPT.**
**App:** https://loglens-v2.loglens.workers.dev · **Judging:** innovation, relevance, implementation, **use of open-source /
open-weight AI**, overall quality. Older Avinya pitch: git history before the 25 Oct 2026 cleanup (commit 636c098).
**Before recording the video:** the live site must run the new version (branch `lu-upgrade` is not deployed yet).
Every number here comes from a command run on 25 Oct 2026 (docs/TESTSET.md, docs/UI_UPGRADE_REPORT.md, README). Do not round up.

## 0. Demo video (< 5 min) — the submission
| Time | Show | Say (short sentences) |
|---|---|---|
| 0:00-0:30 Problem | ERP sample row "marks 42 -> 92 at 02:09" | "Result week. A student's marks went from 42 to 92 at 2 AM. The professor says he never logged in. The IT cell has thousands of log lines. Who did it? And can we trust the logs?" |
| 0:30-1:10 Solution + open-weight AI | empty state 01-04 steps, footer AI line | "LogLens works in the browser. Rules flag events. An open-weight model, Llama 3.1 8B by Meta, explains them. SHA-256 and a signed receipt protect the evidence. Open-weight means the model weights are public. Anyone can check it or run it themselves." |
| 1:10-2:40 Live demo | click **ERP marks tampering** -> verdict card + 4-dot MITRE strip -> attack chain 1-2-3-4 -> filter **High** -> **Changes made** red card | "One click. 9 high-risk events. The chain: login from a new IP, password guessing, marks changed, audit log deleted. Each step has a MITRE ATT&CK ID. These are rules, not AI." |
| 2:40-3:10 Real data | click **Real SSH server log** | "This one is not made up. It is a real server log from Loghub, a public research dataset. 300 lines, 308 events, 62 high-risk, a brute-force chain." |
| 3:10-3:50 AI + guard | **Analyze with AI** -> label "AI: open-weight Llama 3.1 8B" -> cross-check box | "Llama writes the story and must cite event numbers. A small model can over-react, so the rules watch it: no high-risk flag, no 'incident'. Our test set: 16 of 17 right. The one miss: a normal log where it said 'unsure' instead of 'normal'." |
| 3:50-4:20 Integrity | **Check server receipt** = VALID -> change 42 to 43 -> **Verify integrity** = TAMPERED | "The log got a fingerprint and a signed server receipt. I change one digit... TAMPERED, and it shows the line." |
| 4:20-4:45 Limits + next | phone view (tab bar), dark mode | "Works on phones and in dark mode. Limits: 4 log formats, no login yet. Next: Windows logs, investigator login." |
| 4:45-4:55 Link | QR in footer | "Try it with your own log: loglens-v2.loglens.workers.dev" |

## 1. Three-minute live script (stage, if shortlisted for 30 Oct)
- **0:00-0:15 Hook:** "Marks went from 42 to 92 at 2 AM. The professor says: not me. Who did it, and can we trust the logs?"
- **0:15-0:35 Solution:** "LogLens: rules find, open-weight AI explains, SHA-256 proves. In a browser, no install."
- **0:35-2:05 Demo** (clicks from docs/DEMO_SCRIPT.md, steps 2-5): ERP sample -> verdict + chain -> Changes -> Analyze with AI -> receipt VALID -> one digit -> TAMPERED.
- **2:05-2:30 Tech + AI:** "Astro and TypeScript in the browser, one Cloudflare Worker, D1 SQLite ledger. AI: Llama 3.1 8B, open weights, on Cloudflare Workers AI. Gemini only as a backup."
- **2:30-2:50 Impact + next:** "For a college IT cell's first hour of an incident. Next: mask names before AI, Windows event logs, login for investigators."
- **2:50-3:00 Close:** "Rules find it. Open AI explains it. SHA-256 proves it. Scan and try your own log."

## 1b. Sixty-second opening
- **0-10 s:** the ERP log on screen, line `UPDATE marks/21CS045/DBMS 42->92` at 02:09. "This happened in a college ERP log."
- **10-20 s:** "Uttar Pradesh registered **10,117** cyber crime cases in 2022." Source (notes, not spoken): NCRB data in the PIB annexure "State/UT-wise Cases Registered under Cyber Crimes during 2020-2022", https://static.pib.gov.in/WriteReadData/specificdocs/documents/2025/mar/doc2025318522301.pdf (read 25 Oct 2026).
- **20-40 s:** live demo (ERP sample -> chain), then "scan the QR and open your own log".
- **40-50 s:** "On our own 17 test cases the AI was right 16 times. The miss: a normal log, it said 'unsure', not 'normal'."
- **50-60 s:** "Honest line: the model is small, so rules cap it. Next: masking names before AI."

## 2. Slides (max 6, one idea each)
1. **Problem:** the 2 AM marks case + who uses it (college IT / cyber cell). UP 10,117 cyber crime cases in 2022 (source in the notes).
2. **Solution in 3 words:** Rules find · Open-weight AI explains · SHA-256 proves. The 01-04 flow.
3. **Open-weight AI (judging line):** Llama 3.1 8B (Meta, Llama licence) on Workers AI; why open-weight; the rule guard (caps) and citation check; eval 16/17 with the miss named.
4. **Live demo:** big QR + URL; screenshot of the laptop view (verdict + chain above the fold) and the phone view.
5. **What is new since our last event (existing project, disclosed):** see the list in section 5. Real Loghub logs: Linux 0 -> 849 events, Apache error 0 -> 2,000 parsed.
6. **Tech + limits + team (4 names):** architecture line, honest limits, who did what, AI disclosure line.

## 3. Likely judge questions (2-line answers)
1. **Why open-weight, not GPT/Gemini?** The weights are public, so anyone can check or self-host the model; no lock-in. We say "open-weight", not "open-source": the Llama licence is not an OSI licence.
2. **An 8B model, can we trust it?** Not blindly. Rules cap it (no HIGH flag -> no "incident"; no flag -> at most "unsure"), every point must cite a real event, and a cross-check shows where it disagrees with the rules.
3. **How accurate?** 16/17 on our own small test set (25 Oct). It is not a real-world accuracy number; real Loghub logs have no security labels.
4. **Why not Splunk / ELK / Timesketch?** They need servers, setup and training. LogLens is a browser tool for the first hour; big cases still go to full tools.
5. **Where does the data come from?** The investigator's own log file. Demo: 3 made-up samples (labelled) and 1 real public log from Loghub (cited).
6. **What goes to the AI? Privacy?** Only parsed event lines (max 200), not the raw file. Account names and IPs are masked by default (USER_1 / IP_1) before the AI call and put back in the browser; system accounts like root stay readable (`scripts/check-redact.ts`).
7. **What if the AI is wrong or down?** Wrong: caps, citations, cross-check. Down: Gemini backup, then a clearly labelled rules-only summary after 8 s.
8. **Prompt injection from a log?** Log text is fenced as untrusted data. Test case 17 hides "ignore previous instructions"; the verdict stays incident.
9. **Can someone fake the evidence?** The server signs each receipt (HMAC-SHA256) and chains it in D1; one changed digit shows TAMPERED. Limit: no login yet, anyone can add receipts.
10. **Is the report legal evidence?** No. It records hash function and value, but it is an investigation aid, not a BSA s.63 certificate.
11. **How will it scale?** Parsing runs in the browser (4,999-event case in about 30 ms here); the AI sees at most 200 events. Very large logs need a Web Worker (on our list).
12. **What did AI tools do vs you?** Claude Code wrote most code under our direction; we chose the problem, rules, test cases and checks, and verified each change with build, eval and browser tests.
13. **Is this an existing project?** Yes, disclosed: v1 at CHAKRAVYUH, v2 at Avinya. Section 5 lists what is new for Hack Day, with commits.
14. **Business / impact model?** Free tool for college IT cells; cost is the free Cloudflare tier. A paid tier would only be needed for heavy AI use (Workers AI: 10,000 free neurons a day).
15. **Why this stack, not Python/React?** No server to run, fast on cheap phones, one language end to end. Trade-off: no trained ML model, because we have no labelled college dataset to train one honestly.

## 4. Backup plan
- Record the demo screen twice (90 s each, no editing) after a warm-up; keep it on the laptop and a phone.
- Local run: `npm install` -> `cp .env.example .dev.vars` -> `npm start` -> http://localhost:8787.
- Screenshots: `docs/screenshots/app-*.jpg` (laptop, phone, dark).
- AI quota gone: say "this is our offline mode" and show the labelled rules summary.

## 5. What is new for Hack Day (25 Oct, branch `lu-upgrade`, commits in docs/MASTER_LOG.md)
1. Open-weight Llama 3.1 8B is the primary AI (was Gemini); Gemini only a backup; caps on every Llama answer.
2. Real-log parsing (Loghub): old-style sshd(pam_unix), su, Invalid user, POSSIBLE BREAK-IN, disconnects, message repeated, Apache error log.
3. A real public SSH log as a sample (cited), next to the made-up ones.
4. Logic fix: a blocked (DENIED) attempt is medium and not an "Impact" stage.
5. UI: verdict and attack chain fit a 1366x768 laptop screen; phone layout with a tab bar; filter chips; dark mode; blinking-eye logo.

## 6. AI disclosure (same as README)
"Built with Claude Code (code, UI, rules, tests and docs, written under our direction and checked by us). Inside the app, the open-weight Llama 3.1 8B model (Meta) on Cloudflare Workers AI writes the summary; Google Gemini is only a backup. Problem choice, scope, rules design, test cases and the demo are ours."

## 7. Hinglish cheat-sheet
1. Hook: "Marks 42 se 92, raat 2 baje, professor bole maine nahi kiya."
2. Teen shabd: "Rules dhoondhte hain, open AI samjhata hai, SHA-256 saboot deta hai."
3. Open-weight: "Model ke weights public hain, koi bhi check kar sakta hai. Open-source nahi bolna, licence alag hai."
4. Demo: "ERP sample dabao → verdict → 4 dots → chain 1-2-3-4 → High filter."
5. Real data: "Real SSH log dabao: ye asli public log hai, Loghub se."
6. AI: "Analyze dabao → Llama label → har point pe event number → cross-check."
7. Guard: "Chhota model hai, isliye rules uski nigrani karte hain."
8. Saboot: "Receipt VALID → ek digit badlo → TAMPERED."
9. Imaandari: "17 me se 16 sahi; ek normal log pe 'unsure' bola, 'normal' nahi."
10. Close: "Apna log khud try karo, QR scan karo."
