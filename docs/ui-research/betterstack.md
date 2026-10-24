# betterstack

- URL asked: https://betterstack.com/log-management
- Final URL: https://betterstack.com/log-management
- Opened: 25 Oct 2026, headless Chrome (CDP), document HTTP 200
- Page title: OpenTelemetry-native log management by Better Stack
- Status: **Opened, 1366 screenshot reviewed**
- Screenshots: shots/betterstack-1366.jpg, shots/betterstack-1920.jpg

## Observed
Dark marketing hero. Product preview: left nav, search bar "Search for logs & traces", "Last 3 hours", a bar chart of events over time above the table, table columns Time/Source/Level/Message, level shown as dot + "INFO". Right detail panel for one row with tabs "Overview | Explain with AI | Comments" and JSON view.

## Assumed (not seen)
Live tail and filter chips: not visible.

## Idea for LogLens
1) events-over-time bars above the timeline; 2) click a row -> right detail panel (raw line, flags, MITRE, AI) instead of expanding inline.

## Decision
adapt: (1) P2 plain SVG strip; (2) P1 inspector on >= 1366 px.
