# DEFENSE — apna project samjho (simple Hinglish)

Is file ko judging se pehle 2 baar padho. Jawab ratne nahi hain, matlab samajhna hai.

---

## 1. Project kaise bana hai (6 points mein)
1. **Do pages:** `/` (forensics desk) aur `/cases` (dashboard). Dono browser mein chalte hain.
2. **Browser khud kaam karta hai:** log padhta hai, 13 rules chalata hai (har ek ke saath MITRE ID), attack chain banata hai, aur SHA-256 banata hai. Asli file computer se bahar nahi jaati.
3. **Ek Cloudflare Worker** (`worker/index.ts`) pages bhi deta hai aur API bhi. Har response pe security headers (CSP) lagata hai, rate limit aur size limit rakhta hai.
4. **AI ke liye** browser sirf events ki lines `/api/analyze` ko bhejta hai. Server 3 Gemini models ek saath chalata hai; Gemini 2.5 s mein na aaye to Cloudflare Workers AI backup. 8 s mein kuch na aaye to rules wala offline summary.
5. **Signed receipt:** lock hote hi browser hash `/api/seal` ko bhejta hai. Server time + secret key se HMAC signature + pichhli receipt se chain, sab D1 (SQLite) mein. Browser ke paas key nahi hai, isliye receipt nakli nahi ban sakti.
6. **Report (HTML/PDF)** browser banata hai: hash, receipt, MITRE, attack chain, AI summary, audit trail, poori timeline.

---

## 2. Kaunsi file kya karti hai
| File | Kaam |
|---|---|
| `src/lib/parse.ts` | Log ki har line ko event banata hai (time, user, role, IP, action, target, detail). 3 format padhta hai: ERP CSV, Linux auth.log, Apache/Nginx log. Time ke hisaab se sort karta hai. Jo line samajh na aaye, use "not understood" mein rakhta hai, phenkta nahi. |
| `src/lib/rules.ts` | 13 rules jo laal/amber flag lagate hain, reason ke saath (galat password ki burst, naya IP, marks jump, log delete, SQL injection...). |
| `src/lib/changes.ts` | "Changes made" list: har update/delete ka kaun, kab, IP, pehle → baad, aur status (Unauthorized / Suspicious / Blocked / Normal). |
| `src/lib/evidence.ts` | SHA-256 banata hai, evidence lock karta hai, sealed copy rakhta hai, verify karta hai, badli lines dhoondhta hai, aur hash-chained audit trail rakhta hai. |
| `src/lib/mitre.ts` | Har rule ka verified MITRE ATT&CK technique ID (attack.mitre.org pe check kiye). |
| `src/lib/chain.ts` | Attack chain: jo flagged events ek IP ya account share karte hain unhe jodta hai (union-find), aur MITRE tactic stages mein rakhta hai. |
| `src/lib/crosscheck.ts` | AI vs rules: dono sahmat hain ya nahi, AI ne kaun se high-risk events miss kiye, kaun se sirf AI ne bataye. |
| `src/lib/prompts.ts` | AI ko jaane wala prompt. Log text ko "untrusted data" mark karta hai (prompt injection se bachav). |
| `functions/api/analyze.ts` | Server: input check, Gemini x3 race + Workers AI backup (8 s limit), galat event number wale points hatana, galat bhasha reject, backup model ka "incident" bina HIGH flag ke "suspicious". |
| `functions/api/seal.ts` | Signed receipts: HMAC-SHA256, hash chain, D1 table `receipts` (prev_hash UNIQUE, taaki do receipts ek saath aayein to chain na toote). `/api/ledger` har row dobara check karta hai. |
| `src/lib/ledger.ts` | Browser se receipt maangna aur check karna; investigator ka naam. |
| `worker/index.ts` | Routes, CSP + security headers, rate limit, 413/415. |
| `src/lib/report.ts` | Report banata hai. Har text escape hota hai. |
| `src/pages/index.astro`, `src/pages/cases.astro` | Dono pages aur buttons ka code. |
| `tests/eval.ts`, `scripts/*.ts` | 17 eval cases; rules, hash, chain, report, seal aur browser (e2e) checks. `npm run check` sab ek saath. |
| `public/samples/*` | 3 made-up sample logs, "Try sample" buttons ke liye. |

---

## 3. Demo ke time andar kya hota hai (8 steps, dono ko aana chahiye)
1. **Sample dabaya** → SHA-256 bana → sealed copy rakhi → `/api/seal` se signed receipt aayi → audit trail mein entries.
2. **Timeline bani** → `parse.ts` 19 events → `rules.ts` flags + MITRE chips → `chain.ts` attack chain → `changes.ts` "Changes made".
3. **"Analyze with AI"** → 200 tak events server ko → Gemini x3 + (2.5 s baad) Workers AI → jawab check → verdict, indicators, "beyond the rules", next steps → browser mein cross-check box.
4. **"Check server receipt"** → `/api/seal?id=` → server signature dobara banata hai aur chain link check karta hai → RECEIPT VALID.
5. **Ek digit badla, "Verify"** → naya hash alag → TAMPERED → badli line dikhi → server pe bhi VERIFIED_TAMPERED entry.
6. **"Restore original"** → sealed copy wapas → MATCH.
7. **Dashboard** → `/api/ledger` → har row ka signature + chain check → "Ledger intact", cases ki list.
8. **"Save report as PDF"** → `report.ts` → print window → PDF.

---

## 4. Judges ke sabse tough sawaal (aur simple jawab)

**1. Rules pehle aur AI baad mein kyun?**
Rules tez hain, free hain, aur har flag ka reason batate hain. AI slow hai aur galat bhi ho sakta hai. Isliye rules sabut dhoondhte hain, AI unhe jod ke kahani batata hai.

**2. Galat password wala (burst) rule kaise kaam karta hai?**
Ek hi IP se 2 minute mein 5 ya zyada galat password aaye, to sab pe flag lagta hai. Uske 15 minute ke andar usi IP se sahi login ho, to us login pe "password guess ho gaya" wala flag lagta hai.

**3. AI apni taraf se event na bana de, ye kaise rokte ho?**
Prompt mein likha hai ki har point ke saath event number do. Phir server check karta hai: jo point aisa event number bataye jo log mein hai hi nahi, use hata deta hai.

**4. Hash chain kya hai?**
Audit trail ki har entry mein pichli entry ka hash hota hai, jaise zanjeer ki kadiyan. Beech ki ek entry badlo to aage ki saari kadiyan toot jaati hain, aur app batata hai kahan se toota.

**5. SHA-256 browser mein kyun, server pe kyun nahi?**
Taaki asli file computer se bahar na jaye. Browser ka Web Crypto standard hai, aur hamara hash `sha256sum` command ke hash se exact match karta hai, to koi bhi khud check kar sakta hai.

**6. Sirf 200 events AI ko kyun?**
Prompt chhota rahe, jawab jaldi aaye aur kharcha kam ho. Flagged events pehle bhejte hain, to zaroori wale kabhi nahi chhoot-te.

**7. Gemini ke itne models kyun?**
Build ke time kuch models busy the ya 5-9 second le rahe the. Isliye fast "flash-lite" models ek ke baad ek try karte hain, sab 8 second ke andar.

**8. API key kahan hai?**
Sirf Cloudflare ke secret mein aur local `.dev.vars` file mein, jo GitHub pe nahi jaati. Browser ko key kabhi nahi dikhti.

**9. Koi kharab (malicious) log daale to report safe hai?**
Haan. Report mein har text escape hota hai, aur page `textContent` use karta hai, `innerHTML` nahi. Isliye log mein chhupa code chal nahi sakta.

**10. Verdict aur confidence mein farak?**
Verdict = kya hua (incident / suspicious / normal / unsure). Confidence = AI ko apne verdict pe kitna yakeen hai. Testing mein dikha ki normal log pe "high" confusing lag raha tha, isliye dono alag kiye.

**11. "Unauthorized" kaise decide karte ho?**
Badlav pe high-risk flag ho, ya jis login se woh badlav hua (same user + same IP) uspe high-risk flag ho. Jaise login 5 galat password ke baad hua. Sirf medium flag ho to "Suspicious". Log mein "DENIED" likha ho to "Blocked attempt".

**12. Kya bata sakte ho kis insaan ne kiya?**
Hum account aur IP batate hain. Insaan ka naam nahi bolte, kyunki account chori ho sakta hai. Reasons batate hain ki account hijack kyun lag raha hai. Asli insaan tak pahunchne ke liye IT team us IP ko network logs se match karegi.

**13. Restore kaise hota hai?**
Lock karte waqt hum ek sealed copy browser mein rakhte hain. Baad mein hash alag aaye to line-by-line compare karke badli lines dikhate hain, aur ek click mein original wapas daal dete hain. Limit: ye usi browser mein chalta hai jahan lock kiya tha. Database ke asli data ke liye system ka backup chahiye.

---

## 5. Kamzoriyan (honest jawab)
Judge kamzori pooche to chhupao mat. Seedha bolo "ye limitation hai, aage hum ye karenge":

1. **Sirf 3 log format.** "Aage Windows event logs aur firewall logs. Naya format = ek parse function."
2. **Login nahi hai.** "Dashboard ek shared demo ledger hai. Asli use mein authorised investigators ke liye access gate lagega."
3. **Ledger ki aakhri rows.** "Har row ka signature aur link check hota hai, par Cloudflare account ka owner sabse nayi rows delete kar de to bachi hui chain theek dikhegi. Isliye dashboard 'ledger head' hash dikhata hai: use case notes mein likh lo. Aage ye head bahar publish karenge."
4. **Receipt kya prove karti hai.** "Sirf itna ki ye hash is server pe is time pe record hua. File kisne banayi, ye nahi."
5. **Rules ke numbers fixed** (2 min mein 5 galat password, 06-23 working hours). "Aage organisation apne hisaab se set karegi."
6. **Test set chhota, khud banaya.** "17 cases stability dikhate hain, real-world accuracy nahi."
7. **Free AI quotas.** "Gemini aur Workers AI free tier pe hain. Dono slow hon to labelled offline summary."

---

## 6. AI tools ka sach (koi pooche to seedha bolo)
"Code Sagar ne Claude Code (AI coding assistant) ke saath likha: Claude ne zyada code likha, Sagar ne problem, scope, rules ka design aur test cases decide kiye, aur har change ko build, eval aur browser test se check kiya. App ke andar summary Gemini aur Cloudflare Workers AI likhte hain. Krishraj presentation aur demo karte hain."

---

## 7. `node tests/eval.ts` kya hai?
Ye hamara **automatic test** hai. Isse chalane pe 17 sample logs ek-ek karke hamare asli code aur live AI pe chalte hain, aur har ek ka result PASS ya FAIL aata hai. Aakhir mein score dikhta hai, jaise `RESULT 17/17`.

**Kaise chalayein:** project folder mein terminal kholo aur likho:
```
node tests/eval.ts
```
2-3 minute lagte hain (har AI call ke beech 4 second ka gap). Subah demo se pehle mat chalao: free AI quota bachao.

**Judge ko kya bolna:** "Humne apna tool khud test kiya. Ye command 17 cases chalata hai, aur har case pe pehle se likha hai ki sahi jawab kya hona chahiye. Score `docs/TESTSET.md` mein likha hai, fails ke saath."
