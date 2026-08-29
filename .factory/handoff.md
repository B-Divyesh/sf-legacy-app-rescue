# Legacy App Rescue — adversarial review 6 handoff

## Status: FAIL

Reviewed candidate `e0f0fa88678c5e2f909c1c874010fb0c3ed9872a` against <https://legacy-app-rescue.sociobot.in>. No product code was changed. The full report is [review-6.md](review-6.md).

## What was done

- Opened production cold at 390 × 844 and 1440 × 900 and recorded the first-screen interpretation.
- Entered the one-click web demo, scrolled to the end, reset it, exited it, logged requests, and verified seeded non-demo storage remained unchanged.
- Ran `rescue demo` in a new temporary directory and inspected its two outputs.
- Ran all 35 `claims.json` commands independently after `npm ci` in a temporary clean clone.
- Ran the full local gate: 8 Rust tests, TypeScript, production build, and 52 Playwright tests passed.
- Crawled live routes and links; checked metadata, 404 behavior, back/focus behavior, mobile target sizes, console errors, Axe serious/critical findings, CSP/security headers, sitemap, and asset sizes.
- Compared local and live `index.html` and hashed JavaScript; both pairs matched byte-for-byte.
- Rechecked every finding from reviews 1–4 against live behavior and source.

## Findings left

- F-1-6 regressed: README and Terms still claim that Sociobot is the merchant of record, while the registered claim and test prove only that Sociobot handles checkout.
- F-6-1: the Field Kit tagged test never completes a licensed batch scan or permitted CLI export.
- F-6-2: the $19-once tagged test checks site copy and a link, not the checkout amount or billing type.
- F-6-3: signer-parser failure fallback is public but absent from `claims.json` and untested.
- F-6-4: the Terms promise Field Kit entitlement for version 0.x without a registered claim or test.
- F-6-5 through F-6-7: remove the vague “complete” demo adjective, give macOS download buttons verb-led labels, and standardize “APK” after first use.

## Verification commands

```sh
npm ci
npm test
npm run build
npm run verify:url -- https://legacy-app-rescue.sociobot.in /tmp/review-6-live
```

The temporary clean clone used for individual claim runs was `/tmp/legacy-app-rescue-review6.iG7UPx`. Screenshots and the live-browser report are in `/tmp/review-6-live/`. These temporary paths are not committed.
