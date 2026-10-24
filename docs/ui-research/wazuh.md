# wazuh

- URL asked: https://wazuh.com/
- Final URL: https://wazuh.com/
- Opened: 25 Oct 2026, headless Chrome (CDP), document HTTP 200
- Page title: Wazuh - Open Source XDR. Open Source SIEM.
- Status: **Opened, 1366 screenshot reviewed**
- Screenshots: shots/wazuh-1366.jpg, shots/wazuh-1920.jpg

## Observed
Light page, yellow CTA. Product preview dashboard: top row of 4 numbers (Total 174649, Level 12 or above alerts 7 in red, Authentication failure 33587 in red, Authentication success 55 in blue), "Alerts level evolution" area chart, "MITRE ATT&CK" panel with technique legend, "Security alerts" table with Technique(s), Tactic(s), Level, Rule ID columns.

## Assumed (not seen)
-

## Idea for LogLens
Numbers row with the dangerous number in the danger colour (we already have KPI cards); table column "Tactic" next to each finding.

## Decision
adapt lightly: our KPI row already does this; make the KPI row part of the compact header so it costs less height.
