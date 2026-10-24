# stalkr

- URL asked: https://www.stalkr.ai/
- Final URL: https://www.stalkr.ai/
- Opened: 25 Oct 2026, headless Chrome (CDP), document HTTP 200
- Page title: Stalkr — Social listening for startups
- Status: **Opened, 1366 screenshot reviewed**
- Screenshots: shots/stalkr-1366.jpg, shots/stalkr-1920.jpg

## Observed
Social-listening product (title: "Social listening for startups"), not a log/security tool. Left: big headline + one search input + one dark CTA. Right: a "RECENT MENTIONS" card, rows with avatar, handle, date, text with the brand word highlighted, small counts, one "Praise" tag pill on a row.

## Assumed (not seen)
The categorised feed / saved views / priority alerts from the pack note: not visible on the landing page, not checked (needs sign-in).

## Idea for LogLens
Highlighting the matched word inside a row (like the brand word) = highlight the field that triggered a rule inside the raw log line.

## Decision
adapt (only the in-row highlight). Reject the layout: marketing hero.
