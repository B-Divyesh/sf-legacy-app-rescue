# Legacy App Rescue — polish 4 handoff

## Status: PASS

Repair commit: `f5f23ea4791b85d527534d9b22878fd42ccae2e1` (pushed to `main`).

Production deployment: Static Web Apps production app `sf-legacy-app-rescue`, confirmed at <https://legacy-app-rescue.sociobot.in>. The deployment command returned <https://blue-plant-09d076810.7.azurestaticapps.net>.

## What changed

- Added eight tested public claims for the free-tier limit, selected-device record fields, custom output, device selection, JSON output, APK byte size, exported archive hash, and release asset set.
- Added real fake-ADB and temporary-directory integration coverage for the new CLI behavior; the export test verifies the actual archive SHA-256.
- Rewrote the first-screen free-tier wording and removed the four remaining duplicate eyebrow labels while preserving the botanical field-guide layout, palette, typography, and motion.
- Completed the separately served HTTP 404 with canonical, Open Graph, Twitter, and Apple-touch metadata. Its home action now hands focus to the landing h1 after a real navigation.
- Added `scripts/verify-url.sh` / `npm run verify:url`, extending the live verifier with language, alt-text, 404 metadata, and static-404 focus checks.
- Updated the copy audit and verb-first 54-character catalog description.

## Verification

- Final fresh clone: `/tmp/legacy-app-rescue-polish4-final.vMRn2z` at `1e52d850917c5b15d1acb76549f6e4e0106f13e3`; `npm ci`, all 35 exact claim commands, `npm test`, and `npm run build` passed. Evidence: `/work/.evidence/polish-4-final-clean-clone.log`.
- Full browser suite: 8 Rust tests and 52 Playwright tests passed, covering routes, keyboard paths, mobile layout, demo isolation, privacy request boundaries, and Axe serious/critical findings.
- Quality gates passed: formatting, Clippy with warnings denied, release build, Cargo package, npm audit, Lighthouse mobile performance (100 across four runs; median LCP 1658.5 ms), billing verification, and package-manager verification.
- Cold production check passed after deployment: `npm run verify:url -- https://legacy-app-rescue.sociobot.in /work/.evidence/polish-4`.
  Screenshots and route report: `/work/.evidence/polish-4/live-landing-mobile.png`, `live-demo-mobile.png`, `live-demo-scrolled-mobile.png`, `live-privacy-mobile.png`, `live-404-desktop.png`, and `live-browser.json`.

## Run and deploy

```sh
npm ci
npm test
npm run build
```

Deploy the generated `dist/site/` through the Static Web Apps work-order configuration. The artifact remains a Rust CLI with a static landing/docs site; no infrastructure, DNS, billing, or secrets are stored in this repository.

## Known gaps

None. All findings in `.factory/review-1.md` through `.factory/review-4.md` are mapped and resolved in `.factory/polish-4.md`.
