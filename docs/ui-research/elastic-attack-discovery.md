# elastic-attack-discovery

- URL asked: https://www.elastic.co/docs/solutions/security/ai/attack-discovery
- Final URL: https://www.elastic.co/docs/solutions/security/ai/attack-discovery
- Opened: 25 Oct 2026, headless Chrome (CDP), document HTTP 200
- Page title: Attack Discovery | Elastic Docs
- Status: **Opened, 1366 screenshot reviewed**
- Screenshots: shots/elastic-attack-discovery-1366.jpg, shots/elastic-attack-discovery-1920.jpg

## Observed
Docs page (light, left nav, right "On this page"). Text: each discovery has (1) title + summary, (2) number of alerts and the MITRE ATT&CK parts they map to, (3) implicated users and hosts and what each did. Docs example image (shots/elastic-attack-discovery-docs-example.png): header row = checkbox, title "BPFDoor Linux backdoor deployment", status pills, then on the right "Attack chain: ○○●●○●○○○○" mini dot strip and "Alerts: 4" red badge, "Take action". Below: one-line summary with host and user chips (icon + name). Tabs "Attack discovery | Alerts". "Attack Chain" section = one horizontal row of all tactics (Reconnaissance -> ... Credential Access), hit tactics in red with a ring, others grey dots. Buttons "View in AI Assistant", "Investigate in Timeline".

## Assumed (not seen)
Interaction of the chips (click -> filter?) not shown.

## Idea for LogLens
1) compact case header with a mini chain dot strip + high-risk badge; 2) chain as one horizontal tactic stepper, hit stages highlighted; 3) entity chips (user/IP with icon) inside the summary.

## Decision
adopt the patterns (P0: 1+2, P1: 3). Own colours (DESIGN.md tokens), own wording, MITRE tactic names are public.
