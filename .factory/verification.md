# Independent verification — FAIL

**Candidate:** `57ffb5d225619660ddcfc5413ad8df30b4a03e8f` (`main`)  
**Live URL:** https://legacy-app-rescue.sociobot.in  
**Verified:** 2026-08-28 UTC from a clean checkout

## Release decision

**FAIL — do not accept this deployment yet.** The deployed hashed static assets do not meet the required immutable-cache policy. This is a deployment/header defect, not a source-code mismatch.

| Severity | Evidence | Required correction |
| --- | --- | --- |
| Major | `HEAD /assets/app-CFVl0z2g.js`, `HEAD /assets/index-B-z5jn0S.css`, and `HEAD /assets/field-guide-hero.webp` each returned `Cache-Control: public, must-revalidate, max-age=30` on 2026-08-28. Their file names are content-hashed. | Configure the static host to give hashed assets a long-lived immutable cache policy (for example, `public, max-age=31536000, immutable`), redeploy, and recheck headers. |

The initial bundles are within budget: app JavaScript is 7,249 bytes gzip and CSS is 3,919 bytes gzip. No other release-blocking defect was found.

## Required claims gate

`.factory/claims.json` exists and contains eight claims. From the clean clone, before broader QA, I ran every declared command:

| Claim | Declared test | Result |
| --- | --- | --- |
| `manifest-record` | `npm test -- --grep @claim:manifest-record` | PASS |
| `compatibility-verdict` | `npm test -- --grep @claim:compatibility-verdict` | PASS |
| `demo-sandbox` | `npm test -- --grep @claim:demo-sandbox` | PASS |
| `local-private` | `npm test -- --grep @claim:local-private` | PASS |
| `field-kit` | `npm test -- --grep @claim:field-kit` | PASS |
| `platform-builds` | `npm test -- --grep @claim:platform-builds` | PASS |
| `paid-license` | `npm test -- --grep @claim:paid-license` | PASS |
| `binary-manifest` | `npm test -- --grep @claim:binary-manifest` | PASS |

`npm test` was then run in full: all 6 Rust unit tests and all 14 Playwright tests passed. This re-ran the eight tagged claim tests, four axe smoke tests, the mobile keyboard path, and the not-found route.

## Cold-page and live-site evidence

The cold first screen plainly says what it does: “Record your Android app before it disappears.” It identifies people preserving an old app they own, says it records needs and checks another device, and exposes **Try it with sample data** with “See a finished record. Nothing touches your files.” It passes the first-read and one-click demo requirements.

Fresh Playwright checks of live `/`, `/demo`, `/privacy`, and `/terms` found one `h1` per route; zero console and page errors; and zero axe serious or critical violations. The `/demo` request log contained only `legacy-app-rescue.sociobot.in` resources. Landing additionally called only the documented GitHub releases API. CSP permitted only `self`, GitHub API, and Sociobot API connections; HSTS, `nosniff`, strict referrer policy, and permissions policy were present.

At 390 px wide, `scrollWidth = clientWidth = 390`; keyboard Tab visibly focused the skip link and Enter moved focus to `#main`. With reduced motion the terminal recording rendered complete and the control read “Replay”. Screenshot retained in this environment: `/tmp/legacy-app-rescue-live-mobile.png`.

## Local build, CLI, and release evidence

These passed:

```sh
npm ci
npm test
cargo clippy --all-targets --locked -- -D warnings
cargo build --release --locked
npm run check
npm run build
npm audit --audit-level=high
cargo package --locked --no-verify
```

`npm audit` reported zero vulnerabilities and `npm run build` produced `dist/site/`. The local output hash-identically matched deployed `index.html`, app JS, CSS, and hero WebP.

The published Linux tarball was unpacked into a clean `/tmp/qa-consumer`. Its SHA-256, `8f01f1a71ed01a2a16dae85326943c6bd8c3c2a84c6a4532e4263539eb2e8e77`, matches `SHA256SUMS` and `latest.json`. Its public `--help` and `--json demo` worked. Normal single-APK scan wrote a schema-1.0 `0600` manifest; absent and invalid input exited 1 with recovery text; unlicensed batch scan was refused; and missing `adb` gave an actionable error.

The GitHub v0.1.0 release contains Linux `.tar.gz`, `.deb`, and `.rpm`, Windows ZIP, Intel and Apple-silicon macOS tarballs/packages, `SHA256SUMS`, and valid `latest.json`. The tag is at `9e751f3…`; changes from it to the candidate are handoff/package-manifest documentation only. Exact hash comparison proves the deployed web artifact matches this candidate build.

## Scope notes

This static CLI landing site has no product-owned server endpoint, PWA/service worker, or sign-in flow. The Sociobot license verification is an external documented service; there is no product endpoint or documented request allowance to probe for a 429 policy.
