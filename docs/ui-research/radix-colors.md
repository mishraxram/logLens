# radix-colors

- URL asked: https://www.radix-ui.com/colors
- Final URL: https://www.radix-ui.com/colors
- Opened: 25 Oct 2026, headless Chrome (CDP), document HTTP 200
- Page title: Radix Colors
- Status: **Opened, 1366 screenshot reviewed**
- Screenshots: shots/radix-colors-1366.jpg, shots/radix-colors-1920.jpg

## Observed
Scale table: each colour has 12 steps, grouped as 1-2 Backgrounds, 3-5 Interactive components, 6-8 Borders and separators, 9-10 Solid colors, 11-12 Accessible text. Theme toggle in the nav.

## Assumed (not seen)
Exact hex values: not copied, not needed.

## Idea for LogLens
Define our dark-mode tokens by role (background / border / solid / text) so each status colour has a text-safe step.

## Decision
adapt the method (role-based steps) for dark mode; do not copy their palette.
