# DEMO SCRIPT (3 minute, v2) — simple Hinglish

**Presenter:** Krishraj Shukla · **Technical answers:** Sagar Mishra
**App:** https://loglens-v2.loglens.workers.dev · **Dashboard:** https://loglens-v2.loglens.workers.dev/cases
**Backup app (v1, agar v2 na khule):** https://loglens-solarflares.pages.dev
**Slides (Hack Day):** https://claude.ai/artifact/SLYE7tTQsHrZ8Hs9QAWtvK (6 slides + 2 backup, speaker notes; private until you share it)
**Backup ka backup:** recorded demo video (phone + laptop dono mein rakho)

"Bolo" wali lines apne shabdon mein bolo, ratna nahi hai. English lines `docs/PITCH.md` mein hain.
**Hack Day video (< 5 min):** timing aur lines `docs/PITCH.md` section 0 mein hain. Usme "Real SSH server log" (asli Loghub data) aur Llama label bhi dikhana hai.

---

## Stage se 10 minute pehle (warm-up)
1. App kholo. "Investigator name" mein likho: `Krishraj (IT cell)`.
2. **ERP marks tampering** dabao → **Analyze with AI** dabao. Isse AI jaag jata hai.
3. **New case** dabao (sab saaf). Browser zoom 110-125%.
4. Dashboard wala tab alag se khula rakho.
5. Wi-Fi na chale to phone ka hotspot. AI na chale to bhi rules + hash + receipt chalte hain.
6. Subah `node tests/eval.ts` mat chalao (free AI quota bachao). Ek `node scripts/e2e.ts <url> 360` kaafi hai.

---

## Step 1: Problem (0:00 - 0:25) — Krishraj
**Bolo:** "Result week. Student ke DBMS marks raat 2 baje 42 se 92 ho gaye. Professor kehte hain maine login nahi kiya.
IT cell ke paas hazaron log lines hain. Do sawaal: kisne kiya, aur kya hum in logs pe bharosa kar sakte hain?
Splunk ya Timesketch jaise tools ke liye server aur training chahiye. College IT cell ke paas wo nahi hota."

## Step 2: Sample case (0:25 - 0:55)
**Karo:** **ERP marks tampering** dabao.
**Dikhao:** laal "High risk" banner → **Attack chain** box → timeline ki laal lines aur unke **T1110.001** jaise chips.
**Bolo:** "Ek click mein timeline ban gayi. 16 rules ne gadbad pakdi, aur har flag ke saath MITRE ATT&CK ka standard ID hai.
Attack chain dikhata hai ki ek IP aur do accounts (21cs045, prof.verma) ke events jud ke ek kahani banate hain:
naye IP se login → password guessing → marks badle → audit log delete. Ye sab rules hain, AI nahi."

## Step 3: Kisne kya badla (0:55 - 1:10)
**Karo:** **Changes made** box mein ek laal "Unauthorized" card dikhao.
**Bolo:** "Har badlav: kisne, kab, kis IP se, pehle kya, baad mein kya. 5 galat password ke baad naye IP se login, phir marks 42 se 92: account chori hua tha."

## Step 4: AI summary + cross-check (1:10 - 1:45)
**Karo:** **Analyze with AI** dabao (3-8 second). Hindi stage pe mat dikhao (kabhi 8 s se zyada leta hai); koi pooche to bolo "Hindi bhi hai" aur Q&A mein dikhao.
**Dikhao:** verdict, event numbers wale indicators, "AI found beyond the rules", aur **Cross-check: AI vs rules** box.
**Bolo:** "AI ne summary di aur har point ke saath event number diya. Jo point kisi asli event pe nahi tika, wo hum hata dete hain.
Aur hum AI pe aankh band karke bharosa nahi karte: cross-check batata hai ki AI aur rules sahmat hain ya nahi.
Agar AI slow ho to saaf label ke saath rules wala offline summary aata hai."

## Step 5: Saboot ki suraksha (1:45 - 2:25) — the wow
**Karo:**
1. Evidence box mein **SHA-256** aur **Server receipt #...** dikhao → **Check server receipt** → hara "RECEIPT VALID".
2. **Verify integrity** → hara MATCH.
3. Log box mein ek number badlo (42 ko 43) → **Verify integrity** → laal **TAMPERED** + kaun si line badli.
**Bolo:** "Log aate hi uska SHA-256 fingerprint banta hai, aur server ek signed receipt deta hai: server ka time, secret key se HMAC signature,
aur pichhli receipt se chain. Browser ke devtools se bhi ye receipt nakli nahi ban sakti.
Ab main sirf ek number badalta hoon... TAMPERED. Aur ye bhi dikhta hai ki kaun si line badli."

## Step 6: Dashboard (2:25 - 2:45)
**Karo:** dashboard tab kholo. **Re-check now** dabao.
**Bolo:** "Har case, uska status, investigator ka naam, aur poora server audit trail. Har row ka signature aur chain abhi dobara check hua: Ledger intact."

## Step 7: Report + close (2:45 - 3:00)
**Karo:** wapas app → **Save report as PDF** (ya Download report) dikhao.
**Bolo:** "Report mein hash function aur value, server receipt, MITRE IDs, attack chain, AI summary aur har event ki asli line hai.
Ye legal certificate nahi hai, investigation ki madad hai. LogLens: rules dhoondhte hain, AI samjhata hai, hash aur signed receipt saboot bachate hain."

---

## Agar kuch toote
| Kya hua | Kya karo, kya bolo |
|---|---|
| AI 8 s se zyada ya quota khatam | "Ye hamara offline mode hai: rules wala labelled summary, AI ke bina bhi case khulta hai" → aage badho. |
| Receipt "not available" | "Server ledger tak nahi pahunch paye, local SHA-256 phir bhi kaam karta hai" → Verify / TAMPERED dikhao |
| v2 khule hi nahi | v1 backup URL kholo (receipt aur dashboard v1 mein nahi hain, ye bata do) |
| Internet hi nahi | Laptop pe `npm run start:offline` → http://127.0.0.1:4321 kholo. Samples, rules, timeline, chain, SHA-256 Verify / TAMPERED aur report chalte hain; AI = labelled rules summary, receipt "not available", Cases ledger khali. Bolo: "Ye offline mode hai". Wo bhi na chale to recorded video. |

**Offline mode, ek baar pehle se taiyaar karo (venue jaane se pehle, internet ke saath):** `npm ci` chala ke `npm run start:offline` ek baar test karo. Fonts Google se aate hain, offline mein system font dikhega (sirf look badlega, kaam nahi).
