# अvinya '26 brief (source of truth for the upgrade loop)

Source PDFs in this folder: `Judging Criteria.pdf`, `Avinya26_Oct23_Itinerary.pdf`, `DOMAIN 3_ AI-BASED CYBERSECURITY.pdf`.
Team SOLAR FLARES · HK26-0014 · Problem statement **ABCS-02: AI-Assisted Digital Forensics**.

## Timing (23 Oct 2026, BIET Lucknow)
| Time | What |
|---|---|
| 10:00-12:50 | Team presentations (Seminar Hall), other teams keep building in parallel |
| 12:50-14:00 | Recess |
| 14:00-14:30 | Shift to Auditorium |
| 14:30-15:00 | Expert visit at tables (Stall Expo) |
| 15:00-15:30 | **Judges visit & ranking (Stall Expo)**: the prototype must run here |
| 15:30-16:30 | Results |

## Judging criteria (total 200)
| Criterion | Marks | What judges look for |
|---|---|---|
| Presentation | 20 | Clear problem + objective, logical order, on time, slides/demos support the talk, confident answers |
| Domain Knowledge | 20 | Background, target users, real need; key concepts, existing approaches + their limits; justify assumptions; practical constraints and risks |
| Proposed Solution | 20 | Directly solves the PS, feasible, workflow explained, what makes it different, impact, users, limitations |
| Team Delegation | 20 | Clear roles, every member understands the whole project, consistent story, handle questions together |
| Tech Stack | 20 | Tools named correctly, **why** each was chosen, fits needs/scale/constraints, how components connect, trade-offs |
| **Prototype** | **100** | Core features demo and relate to the PS; works consistently; technical effort, integration, meaningful functionality; can explain design, components, limitations; testing, usability, reliability, completion. **Credit only for working evidence, not appearance or claims.** |

## ABCS-02 problem statement (verbatim requirements)
Challenge: an AI-assisted digital forensics platform that helps investigators analyze digital artifacts, correlate security events, identify suspicious patterns and reconstruct incident timelines; generates evidence summaries, highlights findings, and maintains evidence integrity through secure handling, cryptographic hashing and auditable investigation records.

| ID | Expected feature |
|---|---|
| PS1 | Digital evidence analysis: system logs, file metadata, authorized digital artifacts |
| PS2 | AI-based pattern discovery: relationships between events, suspicious activities, attack indicators |
| PS3 | Incident timeline reconstruction (chronological) |
| PS4 | Evidence integrity verification with SHA-256 |
| PS5 | Automated investigation reports: findings, timestamps, references to supporting evidence |
| PS6 | Investigation dashboard: authorized investigators review evidence, track analysis progress, audit trail |

Suggested tech: Python, Pandas, Scikit-learn, NLP, YARA, SQLite or PostgreSQL, SHA-256, FastAPI, React.js.
(Suggested, not required. Our stack differs, so the Tech Stack answer must explain why.)

Impact: faster investigations, better evidence organization, more reliable incident analysis, stronger accountability.
