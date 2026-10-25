# PITCH — LogLens · Hacktoberfest Hack Day 2026, University of Lucknow

**Team:** SOLAR FLARES · **Rule:** exactly 4 members. `docs/TEAM.md` lists 2: **fill [Member 3] and [Member 4] in the deck and here.**
**App:** https://loglens-v2.loglens.workers.dev · **Judging:** innovation, relevance, implementation, **use of open-source /
open-weight AI**, overall quality. Existing project: allowed only with meaningful improvements shown (deck slide 6, section 5).
**Deck (8 slides: 6 to present + 2 backup for questions, speaker notes on every slide):**
https://claude.ai/artifact/SLYE7tTQsHrZ8Hs9QAWtvK (private until shared from its Share menu; export to PPTX/PDF from there).
Older deck (25 Oct morning): https://claude.ai/artifact/HChaFkKvi6pvRpkuAbwSrb.
Every number here comes from a command or a source checked on 25 Oct 2026. Do not round up.

## How we chose this format (research, 25 Oct 2026)
- Hackathon pitch guides agree: the demo takes about half the time, show it working before explaining how, say the hardest
  technical decision out loud, end with one clear line, keep a backup video
  ([Reskilll](https://blogs.reskilll.com/hackathon-demo-presentation-tips-pitch-3-minutes-win-2026/),
  [AngelHack](https://angelhack.com/blog/10-tips-to-help-you-rock-your-next-hackathon-demo/),
  [SlideModel](https://slidemodel.com/hackathon-presentation/)).
- So: 6 slides, one idea each; slides 3-5 are also the fallback if the live demo fails (each shows the same screen).
- Look (v2 of the deck): light and warm, with Claude's brand palette (dark #141413, light #FAF9F5, accent orange
  #D97757, blue #6A9BCC, green #788C5D; from Anthropic's brand-guidelines skill). Only the tamper slide is dark, so
  that moment stands out; the closing slide is orange. Type: Bricolage Grotesque (headings), Instrument Sans (text),
  JetBrains Mono (log lines). LogLens and SOLAR FLARES are the biggest words on the cover and the closing slide.
- Not AI-looking: real screenshots of the app in window frames, a tilted product shot that breaks the grid,
  a bento grid for the problem, "Exhibit 01-06" labels like a case file, no stock images, no dates, no
  "revolutionise" words. Every number has a source in the speaker notes.
- Left out on purpose: market size, user counts, testimonials, architecture on the main slides (it is in backup).

## 1. Three-minute live script (matches the deck notes)
| Time | Slide / screen | Say (short sentences) |
|---|---|---|
| 0:00-0:15 | 1 Cover: the log line | "This is a college ERP log. At 2 AM, a student's DBMS marks went from 42 to 92. The professor says he never logged in. Who did it, and can we trust this log?" |
| 0:15-0:30 | 2 Problem | "In Uttar Pradesh alone, 10,117 cyber crime cases were registered in 2022. Small IT cells handle the first hour. Logs are long, logs can be edited, and the big tools need servers and training." |
| 0:30-0:40 | 3 Solution | "LogLens. Rules find it, open-weight AI explains it, SHA-256 proves it. No install." |
| 0:40-1:15 | **Live**: click **ERP marks tampering** (Start here) | Read the red headline: "From 49.36.112.7: failed-login burst, login after password guessing, marks changed, audit log deleted." Tracker: "Every block is one event. Red is the 2 AM burst." Chain: "Four MITRE stages. Built by rules, not AI." Changes card: "42 to 92, plus 50." |
| 1:15-1:45 | **Live** (slide 4 = same screen) | **Check server receipt** → VALID. **Verify integrity** → MATCH. **Change case** → 42 to 43 → **Verify integrity**: "One digit. TAMPERED. All 64 characters of the fingerprint changed, and it shows the exact character." |
| 1:45-2:15 | **Live** → **Analyze with AI** (slide 5) | "Llama 3.1 8B by Meta, weights are public. An 8B model can over-react, so the rules cap it, and every point cites an event. Names and IPs are masked first. 16 of 17 on our test cases; the miss: a normal log, it said unsure." |
| 2:15-2:45 | 6 Built for Hack Day | "Existing project, so here is what is new." Read 2-3 lines. "The hard part was trust: a small open model, so rules check it; a fingerprint, so the log cannot be quietly edited." |
| 2:45-3:00 | 6 (QR) | "Next: Windows event logs and investigator login. Rules find it. Open-weight AI explains it. SHA-256 proves it. Scan and try your own log. Thank you." Stop. |

## 1b. Sixty-second opening (if only one minute)
- **0-10 s:** slide 1, the real line `...,UPDATE,marks/21CS045/DBMS,42->92` at 02:09. "This happened in a college ERP log." (sample data, say so if asked)
- **10-20 s:** "Uttar Pradesh registered 10,117 cyber crime cases in 2022." Source (notes): NCRB data, PIB annexure
  "State/UT-wise Cases Registered (CR) under Cyber Crimes during 2020-2022", row 26,
  https://static.pib.gov.in/WriteReadData/specificdocs/documents/2025/mar/doc2025318522301.pdf (checked 25 Oct 2026).
- **20-40 s:** live: ERP sample → red story headline → change 42 to 43 → TAMPERED; then "scan the QR and open your own log".
- **40-50 s:** "On our 17 test cases the AI was right 16 times. The miss: a normal log, it said 'unsure', not 'normal'."
- **50-60 s:** "Honest line: the model is small, so the rules cap it. Next: Windows logs and investigator login."

## 2. Slides (6 to present, 2 backup)
1. **Cover / hook:** the log line `42->92` at 02:09, "Who changed it? Can you prove it?", LogLens, team, event.
2. **Problem:** "The IT cell has the log. It does not have the answer." 10,117 (UP, 2022, NCRB via PIB) + 3 pains.
3. **Solution:** rules find · open-weight AI explains · SHA-256 proves, with a screenshot of the case screen.
4. **Proof (the moment to remember):** tamper band screenshot; 1 character → 64 of 64 fingerprint characters; signed receipt.
5. **Open-weight AI, kept honest:** AI panel screenshot; open weights, rules cap it, masking; 16/17 with the miss named.
6. **Built for Hack Day:** what is new (6 lines), QR + URL, team (4 names).
- Backup A: how it is built (browser / Worker / D1 / offline) + 57 ms, 308 events, 0 console errors.
- Backup B: honest limits and next steps.

## 3. Likely judge questions (2-line answers)
1. **Why open-weight, not GPT/Gemini?** The weights are public, so anyone can check or self-host the model; no lock-in. We say "open-weight", not "open-source": the Llama licence is not an OSI licence.
2. **An 8B model, can we trust it?** Not blindly. Rules cap it (no HIGH flag → no "incident"; no flag → at most "unsure"), every point must cite a real event, and a cross-check shows where it disagrees with the rules.
3. **How accurate?** 16/17 on our own small test set (25 Oct). It is not a real-world accuracy number; real Loghub logs have no security labels.
4. **Why not Splunk / ELK / Timesketch (an existing solution)?** They need servers, setup and training. LogLens is a browser tool for the first hour; big cases still go to full tools.
5. **Where does the data come from?** The investigator's own log file. Demo: 3 made-up samples (labelled) and 1 real public log from Loghub (cited in the file).
6. **What goes to the AI? Privacy?** Only parsed event lines (max 200), not the raw file. Account names, IPs, auth.log host names and e-mails are masked by default (USER_1, IP_1, HOST_1, EMAIL_1) and put back in the browser; system accounts like root stay readable (`scripts/check-redact.ts`).
7. **What if the AI is wrong or down?** Wrong: caps, citations, cross-check. Down: Gemini backup after 4 s, then a clearly labelled rules-only summary.
8. **Prompt injection from a log?** Log text is fenced as untrusted data. Test case 17 hides "ignore previous instructions"; the verdict stays incident.
9. **Can someone fake the evidence?** The server signs each receipt (HMAC-SHA256) and chains it in D1; one changed digit shows TAMPERED. Limit: no login yet, anyone can add receipts.
10. **Is the report legal evidence?** No. It records the hash function and value, but it is an investigation aid, not a BSA 2023 s.63 certificate.
11. **How will it scale?** Parsing and rules run on the investigator's device: 20,000 lines in 57 ms in our speed check; the AI sees at most 200 events.
12. **What did AI do versus what you did?** Claude Code wrote most code under our direction; we chose the problem, rules, test cases and checks, and verified each change with build, eval and browser tests. Inside the app, Llama writes the summary only.
13. **Is this an existing project?** Yes, disclosed: v1 at CHAKRAVYUH, v2 at Avinya. Slide 6 and section 5 list what is new for Hack Day.
14. **Business / impact model?** Free tool for college IT cells; cost is the free Cloudflare tier. A paid tier only for heavy AI use (Workers AI: 10,000 free neurons a day).
15. **No internet at the venue?** `npm run start:offline`: samples, rules, chain, SHA-256 verify and reports still work; the AI shows the labelled rules summary.

## 4. Backup plan
- Record the demo screen twice (90 s each, no editing) after a warm-up; keep it on the laptop and a phone.
- Local run: `npm install` → `cp .env.example .dev.vars` → `npm start` → http://localhost:8787.
- No internet: `npm run start:offline` → http://127.0.0.1:4321 (run it once at home first, with internet, after `npm ci`).
- Screenshots: slides 3, 4 and 5 are real screenshots of the app; if the live demo fails, talk over them.
- AI quota gone: "this is our offline mode" → the labelled rules summary.

## 5. What is new for Hack Day (branch `lu-upgrade`, commits in git log)
1. Open-weight Llama 3.1 8B is the primary AI (was Gemini); Gemini only a backup; caps on every Llama answer.
2. Real-log parsing (Loghub): old-style sshd(pam_unix), su, Invalid user, message repeated, Apache error log; a real public SSH log as a sample.
3. Masking before the AI call: account names, IPs, auth.log host names and e-mails.
4. Integrity view: both SHA-256 fingerprints with the changed characters marked, and the changed log line.
5. Verdict as a story from the rules' attack chain, event tracker, plain-word chain cards; rules about 40× faster (20,000 lines in 57 ms).
6. Offline mode (`npm run start:offline`); New Year fix for auth.log; new dark console UI with light mode.

## 6. AI disclosure (same as README)
"Built with Claude Code (code, UI, rules, tests and docs, written under our direction and checked by us). Inside the app, the open-weight Llama 3.1 8B model (Meta) on Cloudflare Workers AI writes the summary; Google Gemini is only a backup. Problem choice, scope, rules design, test cases and the demo are ours."

## 7. Hinglish cheat-sheet
1. Hook: "Marks 42 se 92, raat 2 baje. Professor bole maine nahi kiya. Kisne kiya, aur log pe bharosa kaise?"
2. Number: "UP mein 2022 mein 10,117 cyber crime cases, NCRB ka data."
3. Teen shabd: "Rules dhoondhte hain, open-weight AI samjhata hai, SHA-256 saboot deta hai."
4. Demo: "Start here wala card dabao → laal headline padho → tracker ka laal hissa dikhao → chain."
5. Wow: "Receipt VALID → MATCH → 42 ko 43 → TAMPERED, 64 mein se 64 characters badle."
6. AI: "Analyze dabao → Llama label → har point pe event number → naam pehle mask hote hain."
7. Imaandari: "17 mein se 16 sahi; ek normal log pe 'unsure' bola, 'normal' nahi."
8. Open-weight: "Weights public hain, koi bhi check kar sakta hai. Open-source mat bolna."
9. Purana project: "Existing project hai, slide 6 pe likha hai kya naya hai."
10. Close: "Rules find it. Open-weight AI explains it. SHA-256 proves it. QR scan karo. Thank you." Phir chup.
