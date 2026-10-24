# hayabusa

- URL asked: https://github.com/Yamato-Security/hayabusa
- Final URL: https://github.com/Yamato-Security/hayabusa
- Opened: 25 Oct 2026, headless Chrome (CDP), document HTTP 200
- Page title: GitHub - Yamato-Security/hayabusa: Hayabusa (隼) is a sigma-based threat hunting and fast forensics timeline generator for Windows event logs. · GitHub
- Status: **Opened, only title/headings/text read (screenshot saved, not reviewed)**
- Screenshots: shots/hayabusa-1366.jpg, shots/hayabusa-1920.jpg

## Observed
GitHub repo page opened (screenshot = repo header only). README (raw, read via curl): "Windows event log fast forensics timeline generator", one CSV/JSON/JSONL timeline. Output docs: default columns Timestamp, Computer, Channel, EventID, Level, RecordID, RuleTitle, Details.

## Assumed (not seen)
Severity colouring of terminal output: not confirmed from what was read (UNVERIFIED).

## Idea for LogLens
Timeline columns order: time, source, level, rule title, details = one scan-able line per event.

## Decision
adapt (column order idea for the timeline row).
