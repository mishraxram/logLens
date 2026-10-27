# Research source register (opened 27 Oct 2026 unless stated)

## S1 State/UT-wise Cases Registered (CR) under Cyber Crimes during 2020-2022 (annexure; source line: 'Crime in India' published by NCRB)
- Publisher / date: PIB (Govt. of India); PDF in PIB docs 2025/mar; opened 27 Oct 2026
- Link: https://static.pib.gov.in/WriteReadData/specificdocs/documents/2025/mar/doc2025318522301.pdf
- Supports: Uttar Pradesh row 26: 11,097 (2020), 8,829 (2021), 10,117 (2022) cyber crime cases registered.
- Limit: Registered cases, sirf UP, 2020-22; ye nahi batata ki kitne cases mein log forensics ki zaroorat padi.

## S2 Pune Bar Assn. v. Union of India, 2026 SCC OnLine SC 1297 (SCC Online blog summary)
- Publisher / date: SCC Online; Decided 22 May 2026; blog 8 Jul 2026; opened 27 Oct 2026
- Link: https://www.scconline.com/blog/post/2026/07/08/sc-upholds-admissibility-of-electronic-evidence-under-section-63-4-bsa/
- Supports: Supreme Court ne BSA s.63(4) valid rakha: Part A mein electronic record ka hash value ('electronic fingerprint') disclose karna, Part B mein expert ka certificate.
- Limit: Secondary source (blog summary), judgment text maine nahi padha. SHA-256 ka naam us summary mein nahi hai. Part B kaun sign kar sakta hai, ye court ne open chhoda.

## S3 CERT-In Directions under sub-section (6) of section 70B of the IT Act, 2000 (28 Apr 2022)
- Publisher / date: CERT-In (MeitY); PDF dated 27 Apr 2022 metadata; text read 27 Oct 2026
- Link: https://www.cert-in.org.in/PDF/CERT-In_Directions_70B_28.04.2022.pdf
- Supports: Service providers, intermediaries, data centres, body corporate aur Government organisations ko ICT systems ke logs 180 din rolling maintain karne hain (India ke andar); incidents 6 ghante mein report karne hain.
- Limit: Ye college IT cells par seedha lagta hai ya nahi, maine verify nahi kiya (UNVERIFIED). Hum 'logs ki ahmiyat' ka context dete hain, 'college ko mandatory hai' nahi bolte.

## S4 Timesketch: collaborative forensic timeline analysis
- Publisher / date: timesketch.org (code: github.com/google/timesketch); opened 27 Oct 2026
- Link: https://timesketch.org/
- Supports: Open-source tool for collaborative forensic timeline analysis; deployment alag Admin Guide mein.
- Limit: Page par licence ya requirements nahi likhe. 'Server chahiye' wala claim hum Timesketch ke liye page se prove nahi kar sakte, isliye 'heavier, analyst-oriented' bolte hain.

## S5 Velociraptor documentation
- Publisher / date: docs.velociraptor.app; opened 27 Oct 2026
- Link: https://docs.velociraptor.app/
- Supports: Hunting + forensic analysis (VQL, artifacts), server quickstart 'in minutes', prebuilt Windows/Linux/macOS binaries.
- Limit: Setup kitna aasaan hai ye maine measure nahi kiya; unka quickstart khud 'minutes' bolta hai.

## S6 Autopsy digital forensics platform
- Publisher / date: autopsy.com (Sleuth Kit Labs); opened 27 Oct 2026
- Link: https://www.autopsy.com/
- Supports: Free, open source, hard-drive (disk) investigation platform.
- Limit: Disk images par focus; hum log files par. Platforms page par nahi likhe.

## S7 Cloudflare Workers AI pricing
- Publisher / date: Cloudflare; opened 27 Oct 2026
- Link: https://developers.cloudflare.com/workers-ai/platform/pricing/
- Supports: Free 10,000 Neurons/din (00:00 UTC reset); paid $0.011 per 1,000 Neurons. llama-3.1-8b-instruct-fp8-fast: $0.045/M input, $0.384/M output tokens (4,119 / 34,868 Neurons per M).
- Limit: Hamara model id '@cf/meta/llama-3.1-8b-instruct-fast' page par exact is naam se listed nahi mila; closest 'fp8-fast' hai. Cost estimate isi mapping par hai (ESTIMATE).

## S8 Meta's Llama 2 license is not open source
- Publisher / date: Open Source Initiative; opened 27 Oct 2026
- Link: https://opensource.org/blog/metas-llama-2-license-is-not-open-source
- Supports: OSI: Meta ka Llama licence Open Source nahi (commercial-use limits, acceptable-use field restrictions).
- Limit: Article Llama 2 ke baare mein hai; Llama 3.1 par wahi lagta hai ye INFERRED hai. Isliye hum 'open-weight' bolte hain, 'open-source' nahi.

## S9 MITRE ATT&CK techniques (e.g. T1110.001)
- Publisher / date: MITRE; IDs checked 22 Oct 2026 by team (code comment in src/lib/mitre.ts)
- Link: https://attack.mitre.org/
- Supports: Technique IDs / tactic IDs jo rules aur chain use karte hain.
- Limit: Aaj maine dobara web par check nahi kiya.

## S10 Loghub: real system log datasets (OpenSSH, Linux, Apache samples)
- Publisher / date: Loghub (logpai); used in repo; counts from docs/MASTER_LOG.md (25 Oct 2026)
- Link: https://github.com/logpai/loghub
- Supports: Real public SSH log sample (public/samples/loghub-openssh-real.log).
- Limit: Loghub logs par security labels nahi hain, isliye accuracy measure nahi hoti (V2_AUDIT V-16). Link maine aaj open nahi kiya.

