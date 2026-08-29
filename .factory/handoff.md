# Legacy App Rescue — review 3 handoff

## Status: FAIL

This review made no product-code changes. It added `.factory/review-3.md` and recorded the verification result here.

## What was verified

- Fresh 390 px Android-UA and desktop Chromium checks of the live landing, demo, privacy, terms, and a missing route.
- A one-click demo loaded its finished Orchard Notes sample; demo storage did not alter a seeded real-storage sentinel; Reset reseeded and Start for real cleared `demo:` keys.
- All 27 exact claim commands in `.factory/claims.json` passed from a fresh clone after `npm ci`.
- Full `npm test` then passed: 8 Rust tests and 42 Playwright tests; its build produced `dist/site/`.
- The CLI `demo` command was run from a temporary working directory.
- Live request logs, headers, metadata, route titles, 404, sitemap/robots, and all discovered links were checked.

## Known gaps / next step

**Blocking:** On `/demo` at 390 px, scrolling to the bottom moves the required “Demo — sample data, nothing is saved” banner and its Reset demo / Start for real controls above the viewport. Make that banner sticky or fixed and add a scroll-visible assertion to `@claim:demo-sandbox`.

**Minor:** Remove the decorative, non-informative landing labels “A local preservation tool” and “PLATE / 017”.

After repair, rerun every listed claim command and the full cold/live review. Details and exact evidence are in `.factory/review-3.md`.
