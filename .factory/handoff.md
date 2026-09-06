# Legacy App Rescue — review 8 handoff

## Status: FAIL

This reviewer changed no product code. Review 8 found one moderate accessibility issue and zero untested claims. The full report is `.factory/review-8.md`.

## Finding to fix

- **F-8-1:** the 3 px keyboard focus outline is `#d6a744` against `#f2ebd9`, only 1.86:1. The required ratio is at least 3:1. Use a qualifying focus treatment on light surfaces and retain a qualifying treatment on dark surfaces. Add a rendered contrast assertion for both.

## Verified

- Fresh phone and desktop first-screen checks; the job, audience, and sample action are clear before scrolling.
- Live one-click demo; realistic populated result; persistent sample label; reset and exit; no change to seeded real keys; same-origin demo requests.
- All 36 exact claim commands passed independently after `npm ci` in a clean clone.
- `npm test` passed 8 Rust and 53 Playwright tests. Build, type check, formatting, Clippy, package, audit, package-manager, billing, URL, and performance checks passed.
- A clean consumer install and the live shell installer both ran the v0.1.3 JSON demo. Invalid CLI inputs gave recovery steps.
- Production web files match the implementation candidate build byte-for-byte.
- All earlier review and verification findings were rechecked. Their disposition is recorded in the report.

## Reproduce

```sh
npm ci
npm test
npm run build:site
npm run verify:url -- https://legacy-app-rescue.sociobot.in /tmp/legacy-app-rescue-review8-live
npm run verify:package-managers
npm run verify:billing
npm run test:performance
```

Review evidence is under `/work/.evidence/review-8/`. After fixing F-8-1, rerun the keyboard focus check on light and dark sections, then repeat the full review gate. A PASS requires zero findings.
