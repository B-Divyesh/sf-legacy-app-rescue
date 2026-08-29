# Legacy App Rescue — polish round 6 handoff

## Status: PASS

The repair source is committed in `636e161` and `0fa85d3ba9ef6e93594b9dd070fd661683f65b6e`, pushed to `main`, and deployed to <https://legacy-app-rescue.sociobot.in>. Static Web Apps deployment `ec06655a-c78f-4eb8-81e0-d1b0d86866b9` completed successfully on 29 August 2026 UTC.

## What changed

- Removed the unproved merchant-of-record and version-entitlement wording. README and Terms now say only what the product proves: Sociobot handles checkout and a refunded license stops Field Kit.
- Made the Field Kit test an end-to-end released-CLI workflow using a recorded valid verification response, two APKs, a selected fake Android device, and a permitted app-data export.
- Added recorded checkout evidence for 1900 USD one-time billing and a standalone signer-fallback claim with a malformed signing-block fixture.
- Rewrote the remaining copy: “Try it with sample data”, verb-led macOS download labels, and APK terminology after first definition.
- Kept the isolated `?demo=1` / `/demo` sample experience, banner, reset, exit, routes, titles, metadata, legal links, focus handoff, mobile layout, 404 behavior, privacy boundaries, and distinct field-guide visual system intact.
- Updated `.factory/catalog-description.txt` to `Record APK evidence before an old Android device disappears.` (57 characters; verb-first).

## Verification

The clean clone `/tmp/legacy-app-rescue-polish6-final.qh5ZaJ` was cloned from GitHub at `0fa85d3ba9ef6e93594b9dd070fd661683f65b6e` and passed:

```sh
npm ci
npm test                         # 8 Rust tests, TypeScript, production build, 53 Playwright tests
# each of the 36 commands in .factory/claims.json, independently
npm run build
cargo fmt --check
cargo clippy --all-targets --locked -- -D warnings
cargo build --release --locked
cargo package --locked --no-verify --allow-dirty
npm audit --audit-level=high
npm run verify:package-managers
```

`npm run test:performance` passed with Lighthouse performance/accessibility/best-practices/SEO of 100/100/100/100. The four mobile LCP samples were 1659, 1660, 1656, and 1507 ms (median 1657.5 ms), with TBT 0 and CLS 0. Production output is 22.71 kB JavaScript (7.95 kB gzip) and 14.21 kB CSS (3.97 kB gzip).

After deployment, fresh browser contexts passed both:

```sh
npm run verify:live -- https://legacy-app-rescue.sociobot.in /work/.evidence/polish-6
npm run verify:url -- https://legacy-app-rescue.sociobot.in /work/.evidence/polish-6
```

Each checked `/`, `/?demo=1`, `/demo`, `/privacy`, `/terms`, and a real HTTP 404 for status, title, language, one h1, main landmark, alt attributes, mobile overflow and target sizes, console errors, Axe serious/critical findings, demo namespace isolation/reset/exit, and 404-to-home focus. Evidence is retained in `/work/.evidence/polish-6/`, including `live-landing-mobile.png`, `live-demo-mobile.png`, `live-demo-scrolled-mobile.png`, `live-privacy-mobile.png`, `live-404-desktop.png`, and `live-browser.json`.

A final cold production spot check also verified the actual hosted checkout’s 19 USD one-time facts, the Sociobot redirect/rate limit, live macOS labels under a macOS user agent, and the corrected Terms wording. `npm run verify:billing` validates the hosted Dodo redirect and rate-limit contract.

## Run and verify locally

```sh
npm ci
npm test
npm run build:site
cargo run -- demo
npm run verify:live -- http://127.0.0.1:4173 /tmp/legacy-app-rescue-live
```

For a production build preview, use `npm run preview` in a separate terminal before the last command. The CLI remains a Rust single binary, and the static site is emitted to `dist/site`.

## Known gaps and next steps

None. All findings from reviews 1, 2, 3, 4, and 6 are mapped as resolved in [polish-6.md](polish-6.md). The existing v0.1.3 installer release remains the published CLI release; this repair did not change its normal binary behavior or require a new release tag.
