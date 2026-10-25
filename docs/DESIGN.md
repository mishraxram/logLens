# DESIGN

Direction: a forensic evidence desk. Cool archival grey like an evidence form, graphite ink, evidence-tape amber, a red seal for risk. Calm everywhere except one thing: the evidence tag.
Signature element: the evidence tag (amber card with a punched hole and string) that carries the SHA-256. The timeline is a vertical rail with seal dots (red = high, amber = medium) because events are a real sequence.

| Name | Hex | Meaning |
|---|---|---|
| ink | #1B1F24 | text, primary buttons |
| paper | #E8EBE6 | page background |
| sheet | #FBFBF8 | panels |
| line | #CDD2CB | borders, timeline rail |
| tag | #E3A72F | evidence tag, hashes, medium risk |
| flag | #B42318 | high risk, TAMPERED, chain broken |
| match | #1F7A4D | MATCH, normal |
| muted | #5D6670 | secondary text |

Fonts: IBM Plex Sans Condensed (headline, verdicts), IBM Plex Sans (UI, Devanagari via Noto Sans Devanagari), IBM Plex Mono (log lines, hashes, timestamps only).
Layout: desktop two columns (evidence in on the left, findings out on the right); phone one column, scrolls to the result after a case opens.

## Light and dark (25 Oct): system setting on the first visit, then the app-bar switch (saved in this browser)
Same roles, method from Radix Colors (steps by role: background, panel, border, text). Evidence tag stays amber with dark text.
| Name | Light | Dark | Measured contrast (dark, on sheet #1A1F25) |
|---|---|---|---|
| ink | #1B1F24 | #E6E9E5 | 13.5:1 |
| paper | #E9ECE8 | #111418 | - |
| sheet | #FBFBF8 | #1A1F25 | - |
| line | #CDD2CB | #313840 | - |
| tag | #E3A72F | #E3A72F | 7.8:1 |
| flag | #B42318 | #FF7A6E | 6.5:1 (chips use dark text #111418: 7.3:1; white would be 2.5:1) |
| match | #1F7A4D | #4CC38A | 7.5:1 |
| muted | #5D6670 | #9AA3AB | 6.5:1 |
Logo: light mark on light panels, dark-variant mark on the app bar and on dark panels; still versions under reduced motion.
