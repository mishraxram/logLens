# LogLens feature inventory (27 Oct 2026)

Status words as in the master guide. Source of truth: data in the guide build; evidence column points at repo files.

## F1 Log parser (4 formats)
- **Status:** IMPLEMENTED AND VERIFIED
- **What it does:** Log ki har line ko ek 'event' banata hai: time, user, role, IP, action, target, detail, raw line. Time ke hisaab se sort karta hai. Jo line samajh nahi aati wo 'not understood' list mein jaati hai, phenkte nahi.
- **Flow:** Paste / upload text -> parse.ts -> sorted events + notes (# lines) + unparsed
- **Evidence:** src/lib/parse.ts; scripts/check-parse.ts, check-rules.ts (PASS); Loghub counts in docs/MASTER_LOG.md (OpenSSH 2000 events, 0 not understood)
- **Limitation:** Sirf 4 formats: ERP CSV, Linux auth.log (sshd/sudo/useradd/usermod/su), Apache/Nginx access log, Apache error log. Windows event log nahi. auth.log mein year nahi hota, isliye year ka andaza hai (New Year roll-over fix hai).
- **Demo:** Sample button dabao; ya poem paste karke dikhao ki '0 events, N not understood' aata hai (eval case 8).

## F2 Rule engine (16 rules)
- **Status:** IMPLEMENTED AND VERIFIED
- **What it does:** 16 explainable rules har event pe flag lagate hain (high ya medium) plain-English reason ke saath. Jaise: 2 min mein 5 galat password (burst-fail), burst ke baad login (login-after-burst), student ka UPDATE/DELETE (role-misuse), marks mein +30 ka jump (marks-jump), log delete (log-clear), web URL mein SQL injection (web-attack).
- **Flow:** events -> rules.ts applyRules() -> har event pe flags[] -> ruleVerdict (high / medium / none)
- **Evidence:** src/lib/rules.ts (159 lines); scripts/check-rules.ts; check-perf.ts: 20,000 lines parse + rules 92 ms (aaj run)
- **Limitation:** Thresholds fixed hain (5 fail / 2 min, 06:00-23:00 working hours, +30 marks). 'impossible-travel' asli GeoIP nahi: sirf same user ka 10 min mein do alag IP se login. Rules ek expert ka andaza hain, labelled dataset se train nahi hue.
- **Demo:** ERP sample kholo, timeline ki laal lines + flag reasons dikhao.

## F3 MITRE ATT&CK mapping
- **Status:** IMPLEMENTED BUT NOT FULLY VERIFIED
- **What it does:** Har rule ke saath ek MITRE technique ID (jaise T1110.001) aur link attack.mitre.org ka. Flag 'indicator' hai, proof nahi.
- **Flow:** rule code -> mitre.ts table -> chip on timeline + report
- **Evidence:** src/lib/mitre.ts (code comment: IDs attack.mitre.org pe 22 Oct 2026 ko check kiye). Maine aaj IDs dobara web pe check nahi kiye
- **Limitation:** Mapping hamari analyst-style hai; MITRE ne rules approve nahi kiye.
- **Demo:** Timeline ki laal line ka T1110.001 chip dabao.

## F4 Attack chain
- **Status:** IMPLEMENTED AND VERIFIED
- **What it does:** Jo flagged events ek hi IP ya account share karte hain unhe union-find se ek group mein jodta hai, phir MITRE tactic stages (Recon, Credential Access, Initial Access, Persistence, Privilege Escalation, Impact, Stealth) mein time order mein rakhta hai. 2+ stages = ek chain. Ye pure rules hain, AI nahi (UI pe label hai).
- **Flow:** flagged events -> chain.ts buildChains() -> Chain[] (ips, users, steps)
- **Evidence:** src/lib/chain.ts; scripts/check-chain.ts: 'CHAIN PASS' (5 cases aaj run)
- **Limitation:** Sirf IP/user se jodta hai; alag IP aur alag account wala attacker ek chain mein nahi aayega. Blocked (DENIED) attempt ko Impact stage nahi maanta.
- **Demo:** ERP sample: Credential Access > Initial Access > Impact > Stealth.

## F5 Change register
- **Status:** IMPLEMENTED AND VERIFIED
- **What it does:** Har badlav (UPDATE/DELETE/INSERT/CLEAR/USER_ADD/GROUP_ADD, ya web form POST) ki list: kisne, kab, kis IP se, pehle -> baad, status (Unauthorized / Suspicious / Blocked attempt / Looks normal).
- **Flow:** events + flags -> changes.ts extractChanges() -> Change[]
- **Evidence:** src/lib/changes.ts; scripts/check-changes.ts (aaj run, koi FAIL nahi)
- **Limitation:** 'Unauthorized' ka matlab hai us login ya us badlav pe high-risk flag; ye legal faisla nahi hai. Session ka login 'same user + same IP' se match hota hai.
- **Demo:** Card dikhao: marks 42 -> 92, Unauthorized.

## F6 AI investigation summary (Llama 3.1 8B primary)
- **Status:** IMPLEMENTED BUT NOT FULLY VERIFIED
- **What it does:** Open-weight Llama 3.1 8B (Meta, Cloudflare Workers AI) investigation summary likhta hai: verdict, confidence, 2-4 line story, max 5 indicators (event numbers ke saath), 'hidden patterns', next steps. English ya Hindi. Gemini sirf backup hai.
- **Flow:** <=200 events (flagged pehle) masked -> /api/analyze -> Llama (+ Gemini 4 s ke baad agar Llama jawab na de) -> clean() checks -> JSON
- **Evidence:** functions/api/analyze.ts, src/lib/prompts.ts; docs/TESTSET.md: eval 16/17 (25 Oct, Llama only). Aaj maine live AI call/eval poora dobara nahi chalaya (free quota)
- **Limitation:** 8B model chhota hai, normal log pe over-react karta hai (isliye caps). 8 s budget; free tier 10,000 neurons/din. Hindi kabhi 8 s se zyada leti hai.
- **Demo:** Analyze with AI dabao; label 'open-weight Llama 3.1 8B' dikhao.

## F7 AI guard rails
- **Status:** IMPLEMENTED AND VERIFIED
- **What it does:** (a) Har indicator ko asli event number cite karna padta hai, warna hata diya jaata hai. (b) HIGH flag na ho to 'incident' nahi, max 'suspicious'; koi flag na ho to max 'unsure'. (c) Hindi maanga par Devanagari nahi to reject. (d) Log text 'untrusted data' marker ke andar; marker hata diya jaata hai.
- **Flow:** AI reply -> clean() + workersAi() caps -> result.adjusted note UI pe
- **Evidence:** functions/api/analyze.ts clean() lines ~22-40, caps ~83-96; src/lib/prompts.ts untrusted(); tests/cases/17-prompt-injection.csv
- **Limitation:** Guard rails galat kahani nahi rok sakte, sirf galat event number aur over-call rokte hain.
- **Demo:** Eval case 17 (prompt injection) ya cross-check box.

## F8 Offline rules summary + cross-check
- **Status:** IMPLEMENTED BUT NOT FULLY VERIFIED
- **What it does:** AI slow (>8 s) ya down ho to labelled rules-only summary. 'Cross-check: AI vs rules' box dikhata hai ki dono sahmat hain ya nahi, AI ne kaun se high-risk events miss kiye.
- **Flow:** AI response ya error -> crosscheck.ts / offline summary
- **Evidence:** src/lib/crosscheck.ts; V2_AUDIT 25 Oct: 'AI failure fallback PASS' (request block karke). Aaj dobara nahi chalaya
- **Limitation:** Offline summary template hai, 'AI' nahi.
- **Demo:** Network band karke Analyze dabao.

## F9 Privacy masking before AI
- **Status:** IMPLEMENTED AND VERIFIED
- **What it does:** AI ko jaane se pehle account names, IPs, auth.log host names aur e-mails USER_1, IP_1, HOST_1, EMAIL_1 ban jaate hain; browser jawab mein asli values wapas daalta hai. root/admin jaise system accounts readable rehte hain (naam khud signal hai).
- **Flow:** events -> redact.ts makeMasker() -> mask() / unmask()
- **Evidence:** src/lib/redact.ts; scripts/check-redact.ts 'REDACT PASS' (8 checks aaj run)
- **Limitation:** Log ke free-text detail mein koi aur naam/number ho to mask nahi hota. Masking on/off ka option hai; off hone par sab as-is jaata hai.
- **Demo:** Network tab mein /api/analyze request body dikhao: USER_1, IP_1.

## F10 SHA-256 evidence seal + verify
- **Status:** IMPLEMENTED AND VERIFIED
- **What it does:** Evidence lock karte hi SHA-256 (browser Web Crypto) banta hai. Baad mein Verify: MATCH ya TAMPERED, dono hash ke badle characters mark, badli line dikhti hai, aur 'Restore original' sealed copy wapas daal deta hai. Koi bhi file (PDF, image) bytes + metadata se hash hoti hai.
- **Flow:** text/file -> evidence.ts sha256() -> lockEvidence() -> verifyEvidence() -> changedLines()
- **Evidence:** src/lib/evidence.ts; scripts/check-hash.ts aaj: 'same MATCH', '42->92 changed to 42->93 TAMPERED'
- **Limitation:** Hash sirf itna batata hai ki file badli ya nahi; kisne badli ye nahi. Restore sirf usi browser mein jahan seal hua (localStorage, max 2 MB text).
- **Demo:** 42 ko 43 karo -> Verify integrity -> TAMPERED.

## F11 Local hash-chained audit trail
- **Status:** IMPLEMENTED AND VERIFIED
- **What it does:** Har action (lock, verify, analyze...) ek entry banti hai jisme pichli entry ka hash hota hai. Beech ki entry badlo to aage ki chain 'BROKEN' dikhati hai.
- **Flow:** audit() -> localStorage 'loglens.audit' -> verifyAuditChain()
- **Evidence:** src/lib/evidence.ts audit(), verifyAuditChain(), tamperAuditForDemo(); STATE.md: e2e OK -> BROKEN at entry 1 (15 Oct). Aaj e2e nahi chalaya
- **Limitation:** localStorage hai: devtools wala user poori chain dobara likh sakta hai. Isiliye server receipts hain.
- **Demo:** Tamper test button dabao.

## F12 Signed server receipts + ledger (D1)
- **Status:** IMPLEMENTED BUT NOT FULLY VERIFIED
- **What it does:** Lock hone par browser hash /api/seal ko bhejta hai. Server time + HMAC-SHA256 signature (secret key browser ke paas nahi) + pichhli receipt se hash chain, Cloudflare D1 table 'receipts' mein. /api/seal?id=N receipt dobara verify karta hai; /api/ledger har row check karta hai.
- **Flow:** POST /api/seal {sha256,name,size,investigator,action} -> D1 INSERT (prev_hash UNIQUE, 5 retries) -> receipt
- **Evidence:** functions/api/seal.ts, schema/audit.sql, worker/index.ts. Aaj live GET /api/ledger: 200 rows, intact=True. Naya receipt banana aaj nahi chalaya (production ledger mein likhna hota)
- **Limitation:** Login nahi: koi bhi receipt add kar sakta hai. Cloudflare account owner D1 edit kar sakta hai; sabse nayi rows delete hon to bachi chain valid dikhegi. Receipt sirf 'ye hash is time par is server ne dekha' prove karti hai.
- **Demo:** Check server receipt -> RECEIPT VALID.

## F13 Cases dashboard (/cases)
- **Status:** IMPLEMENTED AND VERIFIED
- **What it does:** Server ledger ke 200 newest rows (pehle 50 dikhte hain, baaki 'show all'), har row ka signature + chain status, 'Ledger intact' banner.
- **Flow:** GET /api/ledger -> cases.astro
- **Evidence:** src/pages/cases.astro; aaj live /api/ledger 200 OK, intact=True
- **Limitation:** Public hai (login nahi): investigator names aur demo/TEST entries dikhte hain (V2_AUDIT V-15). Aaj ki ledger mein 200 rows, kayi TEST.
- **Demo:** Dashboard tab -> Re-check now.

## F14 Report (HTML / PDF)
- **Status:** IMPLEMENTED AND VERIFIED
- **What it does:** Report mein hash function + value, integrity result, 'not a legal certificate' note, MITRE flags, attack chain, findings (event numbers ke saath), poori timeline raw lines ke saath. Har text escape hota hai (XSS se bachav).
- **Flow:** report.ts -> download HTML ya print window (Save as PDF)
- **Evidence:** src/lib/report.ts; scripts/check-report.ts 'REPORT PASS' (8 checks aaj run)
- **Limitation:** Report ek investigation aid hai, BSA 2023 s.63 ka certificate nahi.
- **Demo:** Save report as PDF.

## F15 Hindi / Hinglish support
- **Status:** IMPLEMENTED BUT NOT FULLY VERIFIED
- **What it does:** Investigator notes Hinglish mein ho sakte hain; toggle se AI summary Hindi mein. Server Devanagari check karke retry/reject karta hai.
- **Flow:** lang=hi -> prompt mein Hindi instruction -> clean() Devanagari check
- **Evidence:** analyze.ts line ~24; eval case 9 (Hinglish sample); TESTSET: ek baar AI English mein bol gaya (fix hua), Hindi kabhi >8 s
- **Limitation:** Stage pe Hindi live mat dikhao (8 s ka risk, DEMO_SCRIPT).
- **Demo:** Q&A mein dikhao.

## F16 Security layer (Worker)
- **Status:** IMPLEMENTED AND VERIFIED
- **What it does:** Har response pe CSP + nosniff + X-Frame-Options DENY + HSTS + Referrer-Policy + Permissions-Policy. /api/analyze aur /api/seal pe rate limit (20/min/IP local + Cloudflare binding), 413 body bahut bada, 415 non-JSON; 500 pe stack trace nahi.
- **Flow:** worker/index.ts withSecurityHeaders(), allowed(), handleAnalyze(), handleSeal()
- **Evidence:** worker/index.ts; scripts/check-csp.ts 'CSP PASS' aaj; aaj live headers curl se dikhe (CSP, HSTS, X-Frame-Options, nosniff)
- **Limitation:** Rate limit 'best effort' hai (Cloudflare docs: eventually consistent). CSP mein Google Fonts allowed hai.
- **Demo:** curl -I live URL.

## F17 Offline mode
- **Status:** IMPLEMENTED BUT NOT FULLY VERIFIED
- **What it does:** npm run start:offline: build + static preview. Samples, rules, timeline, chain, SHA-256 verify, report chalte hain; AI = labelled rules summary; receipt 'not available'.
- **Flow:** astro build && astro preview 127.0.0.1:4321
- **Evidence:** package.json script; V2_AUDIT 25 Oct VERIFIED (simulated offline). Aaj nahi chalaya
- **Limitation:** Fonts Google se aate hain, offline mein system font. Pehle ek baar internet ke saath npm ci karna hoga.
- **Demo:** Venue Wi-Fi fail ho to.

## F18 Investigator access gate / login
- **Status:** PLANNED / NOT IMPLEMENTED
- **What it does:** Abhi nahi hai. Dashboard shared demo ledger hai.
- **Flow:** -
- **Evidence:** V2_AUDIT V-15; docs/DEFENSE.md section 5
- **Limitation:** Sabse bada gap authorised-investigator access ka.
- **Demo:** Honestly disclose karo.

## F19 Windows event log / firewall log / learned anomaly model / YARA
- **Status:** PLANNED / NOT IMPLEMENTED
- **What it does:** Implement nahi hai. Backlog / next steps.
- **Flow:** -
- **Evidence:** docs/BACKLOG.md, TECH_STACK.md 'Versus the suggested stack'
- **Limitation:** Hamare paas labelled college-log dataset nahi, isliye ML model honestly train nahi kar sakte.
- **Demo:** Roadmap slide.

