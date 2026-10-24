# UI-INSPIRATION-PACK.md — LogLens (Claude Code ke liye)

Ye file repo ke root mein `docs/UI-INSPIRATION-PACK.md` naam se rakho. Claude Code ko bolo: "docs/UI-INSPIRATION-PACK.md padho aur uske hisaab se chalo."
Reporting language: Hinglish. Sab claims ke saath saboot (screenshot / file:line / command output).

---

## 0. Zaroori rules (pehle padho)

1. **Inspire karo, copy mat karo.** Layout ke patterns, spacing, hierarchy, interaction ideas lo. Kisi site ka logo, brand name, text, illustration, icon set, exact colour palette ya poora layout clone mat karo. LogLens ki apni pehchaan rahegi (blinking-eye logo, "Rules dhoondhte hain, AI samjhata hai").
2. **Har site ko pehle sach mein dekho.** Browser tool se kholo (built-in browser ya Claude in Chrome). Agar site khuli nahi ya login maangti hai, to uska note "Unverified: khul nahi payi" likho. **Apni yaad se kisi UI ka description mat likho.**
3. **Observed vs Assumed alag likho.** Har site ke liye `docs/ui-research/<site>.md` banao: Observed (screenshot ke saath), Assumed (jo dikha nahi), Idea for LogLens, Decision (adopt / adapt / reject, reason).
4. **Existing constraints toot-ne nahi chahiye:**
   - CSP `script-src 'self'`, `font-src 'self'` — koi external font/CDN/script nahi (fonts `@fontsource` se self-hosted).
   - Offline run (`npm run start:offline`) chalna chahiye.
   - Koi naya framework nahi (Astro 5 + Tailwind 4 + TS strict rahega). Koi React/Next rewrite nahi.
   - 18 rules, receipts, chain ka output **same** rehna chahiye (equivalence + regressions pass).
   - `npm run check` + e2e (360 aur ab 1366, 1920 bhi) 0 console errors.
5. **Time-box.** Hack Day ka deadline aaj (25 Oct) hai. Code freeze rakho: sirf P0 items submission se pehle; baaki Hack Day (30 Oct) se pehle ya baad ke liye. Deploy se pehle mujhse poochho.
6. **Accessibility floor:** text contrast >= 4.5:1 (light + dark), tap target >= 24 px (buttons 44 px), `prefers-reduced-motion` respect, keyboard focus visible.

---

## 1. Websites jo dekhni hain (links)

Mera note: ye list maine sandbox se khol ke verify nahi ki (mera network blocked hai). Isliye "kya dekhna hai" sirf dhyaan dilane ke liye hai, observation nahi. Asli observation Claude Code karega.

### A. Direct competitors / same domain (log, security, forensics)
| Site | Link | Kya dekhna hai (check karo, assume mat karo) |
|---|---|---|
| Stalkr | https://www.stalkr.ai/ | Categorized feed (bug/complaint/idea), saved views, priority alerts, dashboard. Sirf listing pages se pata hai; UI khud dekho. |
| Timesketch | https://timesketch.org/ | Forensic timeline UI, events star/tag/notes, search bar. |
| Elastic Security: Attack Discovery | https://www.elastic.co/security-labs and https://www.elastic.co/docs (Attack Discovery docs) | "Attack story" card: title, summary, MITRE tags, implicated users/hosts. |
| Sentry | https://sentry.io/welcome/ | Issue page hierarchy: summary upar, details neeche, breadcrumbs timeline. |
| Axiom | https://axiom.co/ | Log explorer ka dense-but-clean table, query bar. |
| Better Stack | https://betterstack.com/log-management | Live tail, filter chips, clean dark UI. |
| Grafana Loki | https://grafana.com/oss/loki/ | Log panel + label filters. |
| Wazuh | https://wazuh.com/ | Security dashboard cards, MITRE view. |
| Hayabusa / Chainsaw (docs/repo) | https://github.com/Yamato-Security/hayabusa | Rule-based timeline output, severity colouring. |
| Sigma rules | https://github.com/SigmaHQ/sigma | Rules as data (sirf idea, UI nahi). |
| Loghub | https://github.com/logpai/loghub | Real log data (already adopted; cite repo URL). |

### B. Premium product UI (hierarchy, spacing, typography, dark mode)
| Site | Link | Kya dekhna hai |
|---|---|---|
| Linear | https://linear.app/ | Calm dark UI, tight type scale, keyboard-first feel, subtle motion. |
| Vercel | https://vercel.com/ | Hero clarity, monochrome + one accent, code/terminal blocks. |
| Stripe | https://stripe.com/ | Trust signals, section rhythm, how they explain a complex product. |
| Resend | https://resend.com/ | Developer-tool polish, minimal hero, clear one CTA. |
| Raycast | https://www.raycast.com/ | Keyboard shortcuts display, command-bar idea. |
| Supabase | https://supabase.com/ | Docs-like clarity, dark theme tokens. |
| PostHog | https://posthog.com/ | Dashboard density without clutter, playful but professional. |
| Cloudflare Dashboard / Zero Trust marketing | https://www.cloudflare.com/zero-trust/ | Security product storytelling (judges ki jaan-pehchaan wali company). |
| Datadog / Elastic dashboards (public screenshots/demo) | https://www.datadoghq.com/ | Severity colours, status pills, tabular density. |

### C. Design systems / references (rules ke liye, copy ke liye nahi)
| Resource | Link | Use |
|---|---|---|
| Radix Colors | https://www.radix-ui.com/colors | Light/dark colour scales jo contrast ke liye bane hain. |
| Refactoring UI (tips) | https://www.refactoringui.com/ | Hierarchy, spacing, shadows ke practical rules. |
| shadcn/ui | https://ui.shadcn.com/ | Card, table, badge, tabs ke proportions (sirf dekhne ke liye; React hata ke Astro/Tailwind mein khud banao). |
| Material 3 adaptive layouts | https://m3.material.io/foundations/layout/applying-layout/window-size-classes | Phone / laptop / desktop breakpoints ka logic. |
| WCAG 2.2 quick reference | https://www.w3.org/WAI/WCAG22/quickref/ | Contrast, target size, focus. |
| Mobbin | https://mobbin.com/ | Real app screens ka reference (login maang sakta hai; na khule to Unverified likho). |
| Awwwards | https://www.awwwards.com/ | Sirf motion/hero ideas; over-design se bacho. |
| Hacktoberfest | https://hacktoberfest.com/ | Event ka official portal (registration ke liye). |

---

## 2. Screen targets (laptop + desktop)

Pehle sirf phone 360 test hota tha. Ab ye sab pass hone chahiye (light + dark):

| Device | Viewport | Kyun |
|---|---|---|
| Phone | 360x800, 390x844 | Judges QR scan karenge |
| Small laptop | **1366x768** | India mein sabse common laptop screen; seminar hall ke projector par bhi aksar yehi |
| Laptop | 1440x900, 1536x864 | Demo laptop |
| Desktop | 1920x1080 | Projector / monitor |
| Large | 2560x1440 | Sirf check ki text bahut chhoti ya line bahut lambi na ho |

Rules:
- Content ki max width (jaise 1200–1280 px) rakho, 1920 par sab kuch khichna nahi chahiye.
- Line length 60–80 characters.
- **1366x768 par verdict + attack chain "above the fold" mein dikhna chahiye** (scroll kiye bina). Ye demo ka sabse bada test hai.
- Projector ke liye: base text >= 16 px, important numbers bade.
- Har width par `scrollWidth == innerWidth` (no sideways scroll).

---

## 3. Loop (Claude Code isse chalaye)

```
PHASE 1  Research  (max 60 min)
  har site kholo -> screenshot 1366 + 1920 -> docs/ui-research/<site>.md (Observed/Assumed/Idea/Decision)
  khul nahi payi -> "Unverified" likho, aage badho

PHASE 2  Shortlist (max 10 min)
  sab Ideas se max 6 patterns chuno. Har pattern ke liye:
  problem (LogLens mein kya kharab hai) -> pattern -> effort -> risk -> demo mein dikhega ya nahi
  P0 = submission se pehle, P1 = Hack Day se pehle, P2 = baad mein

PHASE 3  Implement (ek pattern, ek commit)
  baseline screenshot (1366 + 360, light + dark)
  -> change
  -> npm run check
  -> e2e 360, 1366, 1920 (0 console errors)
  -> after screenshot
  -> kharab hua to git revert, aage badho

PHASE 4  Audit
  Lighthouse mobile + desktop (local), contrast check, keyboard tab-through, reduced-motion
  docs/UI_UPGRADE_REPORT.md: before/after, jo test hua, jo NAHI hua (real phone, iOS Safari, screen reader)
```

Stop condition: P0 patterns done + checks green. Ek ghante se zyada ek hi pattern par atka ho to chhod do aur likho.

### Ideas jinhe pehle test karna (hypothesis, adopt tabhi jab site dekh ke sahi lage)
| # | Idea | Source pattern | LogLens mein kahan | Priority |
|---|---|---|---|---|
| 1 | Verdict hero card: ek line verdict + 3 numbers (high / events / chain stages) + receipt status | Stripe/Sentry summary-first | Result ka top | P0 |
| 2 | Attack chain ko horizontal stepper (laptop) / vertical (phone) | Elastic attack story | Chain section | P0 |
| 3 | Findings par filter chips (stage / severity), ek click mein | Stalkr categorised feed, Sentry | Findings list | P1 |
| 4 | Laptop par 2-column desk: left evidence/timeline, right verdict/AI sticky | Linear, Timesketch | Desk layout | P0 |
| 5 | Keyboard shortcuts (j/k findings, / search) + `?` overlay | Raycast, Linear | Cases/desk | P2 |
| 6 | Entity chips (IP / user) jo timeline filter karein | Elastic | Timeline | P1 |
| 7 | Events-per-minute strip (plain SVG) | Axiom/Better Stack | Timeline upar | P2 |
| 8 | Status pills ke liye ek hi colour+icon system (sirf colour par nirbhar nahi) | Datadog, Radix | Poora UI | P0 |

---

## 4. Lucknow University Hackathon — real details (event posters se, 25 Oct 2026)

**Event:** Hacktoberfest Hack Day 2026 — Dept. of CSE, Faculty of Engineering & Technology, University of Lucknow.

| Cheez | Detail |
|---|---|
| Challenge | Open-source ya **open-weight AI** se build karo (AI app, open-weight LLM, agent skill, ya open-source model harness). Apna idea theek hai, bas open-source/open-weight AI uska **important part** ho. |
| Team | **Exactly 4 members.** Ek insaan, ek team. Koi bhi saal/branch. |
| Registration | Har member **khud individually** official Hacktoberfest portal par register kare, AUR Team Lead Google Form **ek baar** bhare (https://forms.gle/Pk8S8eVhukNy6qgA6). |
| Submission | PPT + demo video (**5 min se kam**) + charon members ka registration proof. |
| Demo video mein | Problem, solution, open-source/open-weight AI ka use, key features, working prototype/workflow, accessible link. |
| AI tools | Development mein allowed. Team ko project **samajhna** hoga. **Google Form AI se mat bharo** (rule hai). |
| Existing project | Allowed, agar original kaam ho aur **meaningful improvements dikhein**. |
| Judging | Innovation, relevance, implementation, **open-source/open-weight AI ka use**, overall quality. |
| Dates | Registration + PPT: **25 Oct 2026 (aaj)** · Selected teams: 27 Oct · Offline Hack Day: **30 Oct, 9 AM–5 PM**, Seminar Hall 225(N), New Building, FoET, University of Lucknow. |
| Selection | Registration = selection nahi. Sirf shortlisted teams offline bulaye jaayenge. |
| Milega | Refreshments, participation certificates, prizes (1st Rs 6,000 / 2nd Rs 4,000 / 3rd Rs 2,000 + gift cards, AI credits). Travel/stay nahi. |
| Contact | Akash Kumar Yadav 9682792617 · Akash Singh 8090188017 · hacktoberfoet@gmail.com (FAQ image mein spelling "hactoberfoet" dikhi, mail bhejne se pehle poster dobara check karo) · Faculty: Dr. Ravi Krishan Pandey, Er. Maruti Maurya |

### LogLens par iska matlab (honest)
1. **Open-weight AI central hona chahiye.** LogLens ab Llama 3.1 8B (Workers AI) ko primary bana raha hai. UI mein dikhao: "AI: open-weight Llama 3.1 8B (Meta, Llama licence)". Gemini ko optional/backup likho, ya hata do. "Open-weight" likho, "fully open-source" nahi (licence alag cheez hai).
2. **8B model over-call karta hai** (eval cases 5 aur 16 mein dikha). Rule-guard uska verdict cap karta hai. Ye weakness nahi, engineering hai: demo mein kaho "chhota open model, isliye rules uski nigrani karte hain."
3. **Existing project disclose karo:** v1 (Chakravyuh 1.0) -> v2 (Avinya) -> ab. "Meaningful improvement" ka saboot: FORENSIC_AUDIT.md (13 defects fixed), 100k events 1.2 s (pehle 40k = 55 s), real Loghub logs par test, open-weight AI central.
4. **Judges ke likely sawal:** open-weight model kyun, 8B kitna bharosemand, data kahan jaata hai (abhi unmasked, redaction R4 next), offline chalega kya (haan, `start:offline`).
5. **Demo video (<5 min) structure:** 0:00 problem (30 s) · solution + open-weight AI (40 s) · live demo ERP tampering -> chain -> changes (90 s) · real SSH log (30 s) · AI + cross-check + guard (40 s) · receipt VALID -> edit -> TAMPERED (30 s) · limits + next (20 s) · link.
6. **Aaj ka order:** 4 members + registration -> open-weight switch ke eval results -> PPT update -> video -> form (khud likho, AI se nahi).

---

## 5. Claude Code ko ye prompt paste karo

```
Tum LogLens ke UI upgrade loop mein ho. docs/UI-INSPIRATION-PACK.md poora padho aur uska 0 (rules) mano.
Kaam: PHASE 1 se 4 chalao. Sites ko browser se asli mein kholo; jo na khule use "Unverified" likho. Kisi site ka design copy nahi karna, sirf pattern lena hai. Laptop 1366x768 par verdict + chain bina scroll ke dikhna chahiye. Har change ke baad npm run check + e2e (360, 1366, 1920). Deploy mat karo, mujhse poochho. Reporting Hinglish mein, saboot ke saath. Jo test nahi hua, saaf likho.
Pehle sirf PHASE 1 ka summary dikhao (kaun si site khuli, kaun si nahi, top 6 patterns). Meri "go" ke baad hi implement shuru karo.
```
