# RESEARCH-DEEP (LOOP.md section 4)

Written 2026-10-22 22:05 IST, loop iteration 1 (Phase R). All sources accessed 2026-10-22.
The `deep-research` skill was blocked by permission rules, so this was done with 4 web searches plus direct
`curl` checks of attack.mitre.org. Anything not confirmed by a source is marked **UNVERIFIED**.

## 1. Existing tools vs LogLens (Domain Knowledge + Proposed Solution)
| Tool | What it does | Limit for a small college IT / cyber cell | Source |
|---|---|---|---|
| Plaso (log2timeline) + Timesketch | Plaso builds a "super timeline" from many artefacts; Timesketch is a free, open-source web UI that imports Plaso, CSV and JSONL and supports Sigma rules | Server setup (Timesketch runs as a multi-service stack, UNVERIFIED setup time), CLI skills needed, no plain-language summary | [LinuxLinks: Timesketch](https://www.linuxlinks.com/?p=174844) |
| Hayabusa | Rust, multi-threaded Windows event log timeline + threat hunting, Sigma-compatible YML rules | Windows EVTX only; no ERP / auth.log / web logs; CLI | [Hayabusa wiki](https://github.com/Yamato-Security/hayabusa/wiki/About-Hayabusa) |
| Chainsaw | Sigma-based Windows event log hunting | UNVERIFIED (not covered by the search) | - |
| Autopsy, Splunk, ELK/OpenSearch, Velociraptor, Wazuh | Disk forensics / SIEM / endpoint tooling | Pricing, skills and setup time UNVERIFIED in this pass. Do not quote numbers on stage | - |

Honest positioning (no stats): LogLens is **not** a replacement for these. It is a browser-first triage step for
mixed small-org logs (ERP CSV, Linux auth.log, Apache/Nginx) that adds a plain-language AI summary (EN / Hindi),
SHA-256 proof and a downloadable report, with no install. Heavy cases still go to Plaso/Timesketch.

## 2. Indian legal context (what we may and may not claim)
- **BSA 2023 s.63(4)**: the Schedule certificate (Part A by the party / person in charge of the device, Part B by an
  expert) asks for the **hash value and the hash function used**. The Supreme Court upheld s.63(4) in *Pune Bar
  Association v. Union of India*. Commentary: meeting the certificate requirement does not by itself prove
  authenticity or evidentiary weight. Sources: [LiveLaw (SC ruling)](https://www.livelaw.in/amp/top-stories/supreme-court-rejects-challenge-to-s634-bsa-mandating-hash-value-disclosure-for-electronic-evidence-535950),
  [SCC Online](https://www.scconline.com/blog/?p=389747), [LiveLaw (s.63 guide)](https://www.livelaw.in/amp/articles/electronic-evidence-admissibility-section-63-bhartiya-saksha-adhiniyam-2023-261511),
  [LiveLaw (hash value)](https://www.livelaw.in/amp/articles/hash-value-electronic-evidences-535457).
- **CERT-In directions (28 Apr 2022)**: report specified incidents within **6 hours** of noticing; keep logs for a
  rolling **180 days** within India. Effective date differs between sources (27 Jun 2022 per Linklaters; extension to
  25 Sep 2022 for some entities per another source, UNVERIFIED). Sources: [taxguru (text)](https://taxguru.in/corporate-law/cert-in-issues-directions-relating-information-security-practices.html),
  [Linklaters](https://www.linklaters.com/en/insights/blogs/digilinks/2022/may/india-new-and-onerous-cyber-security-framework-and-breach-reporting-obligations).
- **DPDP Act 2023**: not researched in this pass (UNVERIFIED). Safe line: logs contain personal data (usernames, IPs);
  we send only parsed lines to the AI and say so on screen.
- **Claims allowed**: "shows the SHA-256 value and function, the field the s.63 certificate asks for";
  "helps you show the file did not change after intake". **Not allowed**: "legally valid", "court-admissible",
  "s.63 certificate generator", "CERT-In compliant".

## 3. Chain of custody (NIST SP 800-86)
- NIST SP 800-86 (Aug 2006) covers files, OS, network traffic and application data, recommends using several data
  sources together, and takes an IT (not law-enforcement) view; legal counsel should be consulted.
  Sources: [NIST page](https://www.nist.gov/publications/guide-integrating-forensic-techniques-incident-response),
  [PDF](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-86.pdf).
- Hash before and after examination to show no change: described in secondary sources, not quoted from NIST here
  (UNVERIFIED as a NIST quote). ISO/IEC 27037: not researched (UNVERIFIED, do not cite).
- What LogLens can show working by tomorrow: SHA-256 at intake (done), re-verify MATCH/TAMPERED (done), hash-chained
  audit log (done, localStorage), **server-side append-only audit log + signed receipt** (gap: PS6 / F3).

## 4. MITRE ATT&CK IDs per rule (verified by fetching attack.mitre.org page titles, 2026-10-22)
| Rule code | Technique | Verified title |
|---|---|---|
| burst-fail | T1110.001 | Brute Force: Password Guessing |
| login-after-burst | T1110 + T1078 | Brute Force; Valid Accounts |
| root-login | T1078.003 | Valid Accounts: Local Accounts |
| off-hours, new-ip, shared-ip, impossible-travel, role-misuse | T1078 | Valid Accounts (these are indicators of misuse of valid accounts, not proof) |
| log-clear | T1070 | Indicator Removal. Note: T1070.001/.002 are **not** listed on the current T1070 page, so only the parent ID is shown |
| marks-jump | T1565.001 | Data Manipulation: Stored Data Manipulation |
| web-attack, attack-success | T1190 | Exploit Public-Facing Application |
| scan-burst | T1595.002 | Active Scanning: Vulnerability Scanning |

## 5. What wins / loses AI-security hackathons
From docs/RESEARCH.md (sources there): the SANS "Find Evil!" judges scored accuracy, safeguards, audit trails and the
agent's ability to **challenge its own conclusions**. An IJICS paper shows hashing alone is weak if the attacker also
controls the hash or the log, so a **server-side or signed record** matters. Losing patterns: demo depends on venue
Wi-Fi, claims without proof, slides that do not match the build. Our brief says Prototype = 100/200 and only working
evidence counts.

## 6. Tech-stack defence (honest trade-offs)
- Astro static pages + one Cloudflare Worker: no server to run, free tier, global edge. Python/Pandas would be natural
  for heavy analytics and Scikit-learn; we do rules in TypeScript in the browser so hashing never uploads the file.
- Gemini server-side with an 8 s budget and a labelled rule-based fallback: works when AI is slow or offline.
- D1 is SQLite (matches "SQLite or PostgreSQL" in the PS) if we add a server-side case store. Cold start, latency
  and cost numbers: UNVERIFIED, measure before quoting.

## Backlog candidates (for the audit to rank)
| Item | Criterion | PS |
|---|---|---|
| Show verified MITRE ID chip on each flag + in the report | Prototype, Domain Knowledge | PS2, PS5 |
| Correlation: group flags into an "attack chain" (scan -> attack -> success; burst -> login -> marks change) | Prototype | PS2 |
| Investigation dashboard: cases list, status (new / analysing / reviewed), progress, investigator name | Prototype | PS6 |
| Server-side append-only, hash-chained audit log (D1 or KV) + signed receipt `/api/seal` | Prototype, Proposed Solution | PS4, PS6 |
| Report: "Hash function: SHA-256" + hash value block shaped like the s.63 fields, with disclaimer "not a legal certificate" | Domain Knowledge | PS4, PS5 |
| Report: each finding links to evidence line numbers | Prototype | PS5 |
| File metadata panel (name, size, type, lastModified, hash) for any uploaded artefact | Prototype | PS1 |
| AI vs rules cross-check ("AI agrees / disagrees with rules") | Prototype, Innovation | PS2 |
| Prompt-injection guard: log text sent as data, AI told to ignore instructions inside logs | Tech Stack, Prototype | PS2 |
| "Existing tools vs LogLens" slide + DEFENSE answers from sections 1-3 | Domain Knowledge | - |
