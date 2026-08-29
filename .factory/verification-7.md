# Independent verification 7 — PASS

**Candidate:** `e0c033680c317d1e2ca73f73c1280de183eb43ec` (`main`)
**Release:** `v0.1.2`
**Live URL:** <https://legacy-app-rescue.sociobot.in>
**Verified:** 2026-08-29 UTC from the supplied clean checkout
**Work order:** `legacy-app-rescue-verify-7`

## Release decision

**PASS — accept this candidate.** No release-blocking defect was found. The deployed static site is the byte-identical production build of this candidate; the shipped CLI and public Linux installer complete the preservation demo; and the prior native-package and mobile-LCP corrections hold under fresh checks.

## Mandatory claims and first-read gate

`.factory/claims.json` exists and contains twelve entries. I installed clean dependencies with `npm ci` and ran every listed exact command independently. The combined clean `npm test` then reran the same tagged tests and reported **26 Playwright tests passed** (including all twelve claims) and **8 Rust tests passed**.

| Claim ID | Result |
| --- | --- |
| `manifest-record` | PASS |
| `compatibility-verdict` | PASS |
| `demo-sandbox` | PASS |
| `local-private` | PASS |
| `field-kit` | PASS |
| `platform-builds` | PASS |
| `paid-license` | PASS |
| `binary-manifest` | PASS |
| `installer-verified` | PASS |
| `browser-license-cache` | PASS |
| `browser-license-removal` | PASS |
| `export-refusal-cleanup` | PASS |

Cold first read, desktop and 390 px mobile: the visible headline says **“Record your Android app before it disappears.”** The next sentence names people preserving an old app they own. The first-screen primary action is **“Try it with sample data”**, with the adjacent outcome “See a finished record. Nothing touches your files.” It answers what it does, who it is for, and what to click in plain words.

I clicked that action in a fresh live browser. It navigated to `/demo`, loaded the realistic Orchard Notes 1.7.0 record, and showed the persistent **“Demo — sample data, nothing is saved”** banner with Reset demo and Start for real. A direct fresh `/demo` visit stored only `demo:legacy-app-rescue:opened`; Reset retained the sample state and Start for real removed the demo namespace. The release-metadata cache seen after first visiting home is static download metadata, not demo or user preservation data.

## Clean checkout and CLI verification

The following all passed from this checkout:

```text
npm ci                                      PASS — 0 vulnerabilities
npm test                                    PASS — 8 Rust + 26 Playwright tests
npm run check                               PASS
npm run build                               PASS — dist/site
cargo fmt --all -- --check                  PASS
cargo clippy --all-targets --locked -- -D warnings
                                             PASS
cargo build --release --locked              PASS
cargo package --locked --no-verify --allow-dirty
                                             PASS — 0.1.2 crate
npm audit --audit-level=high                PASS — 0 vulnerabilities
npm run test:performance                    PASS — see below
npm run verify:billing                      PASS
npm run verify:package-managers             PASS
```

A clean consumer unpacked `target/package/legacy-app-rescue-0.1.2.crate`, installed it with `cargo install --path ... --root ... --locked`, and ran its public surface. It reported `rescue 0.1.2`; `rescue --json demo` produced schema `1.0`, the fictional `in.sociobot.orchardnotes` APK, a SHA-256, signer evidence, Android 13 arm64 device data, and a `compatible` verdict. Representative recovery paths behaved safely: a missing APK and a directory each exit 1 with a concrete corrective message; missing required APK input exits 2 with Clap usage. The tagged tests also cover binary XML parsing, fake authorized-device compatibility, invalid paid-token batch refusal, and app-data refusal cleanup without root.

The public `v0.1.2` Linux archive passed its published `SHA256SUMS` entry. The live `/install.sh` installed it into an empty temporary directory only after checksum verification; the installed binary reported `rescue 0.1.2` and completed `--json demo`. The public `.deb` metadata is `0.1.2-1`. `npm run verify:package-managers` confirmed the Homebrew, Scoop, and winget manifests resolve to this repaired release. The verifier container lacks the `rpm` utility, so RPM header inspection was not repeated locally; the repository's release workflow and native-package regression test do cover the fixed v0.1.2 RPM upgrade path.

## Live site, privacy, accessibility, and performance

Fresh Chromium checks at 1440×900 and 390×844 found `/`, `/demo`, `/privacy`, and `/terms` return 200, have correct route titles, one `h1`, one `main`, no horizontal overflow, and no console or page errors. The designed missing route returns 404 with a route-appropriate title, one heading, and a way home; its browser 404 resource message is expected for that deliberately missing navigation.

Live axe scans found **zero serious or critical findings** on `/`, `/demo`, `/privacy`, `/terms`, and the 404 page. Keyboard testing put focus on the visible Skip to main content link and Enter moved it to `#main`; the clean Playwright mobile test confirms all links, buttons, inputs, and summaries are at least 44×44 CSS px. Local accessibility coverage also passes all four main routes. The stylesheet has a reduced-motion override that collapses animation and transition durations to `.01ms` and disables the loader animation.

Request logging confirms a direct fresh `/demo` makes requests only to `https://legacy-app-rescue.sociobot.in`. The landing page additionally contacts only the documented GitHub Releases API to select downloads; it makes no analytics or third-party font/script request. The local privacy claim test runs `rescue demo` with unusable HTTP(S) proxies and passes, confirming the demo scan needs no network.

Production responses send HSTS, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, a restrictive permissions policy, and CSP limited to self plus GitHub Releases and Sociobot APIs. HTML is cached for 30 seconds; hashed assets return `Cache-Control: public, max-age=31536000, immutable`. The build is 22,140 B JavaScript (7,920 B gzip) and 14,389 B CSS (3,981 B gzip), under the static budget. Four fresh throttled-mobile Lighthouse runs against the local production build were all 100 performance with LCP **1662, 1678, 1656, and 1675 ms** (median **1668.5 ms**), TBT 0–28 ms, and CLS 0.

## Deployment identity and billing allowance

After a fresh production build, these candidate/live SHA-256 values matched exactly:

| Resource | SHA-256 |
| --- | --- |
| `/` (`dist/site/index.html`) | `883bbcda4921c0069acc4038b9710724c55b145cefb5eeb1c57d30bf250a542f` |
| `assets/app-mqz560It.js` | `4a59317de8c23f69fa8f7c043ab79a5a5ab50e61d6db3827d805ede88f115633` |
| `assets/index-D_riv8nn.css` | `837619895685ae3f42a817d6cd5c8a57cd52a53d50724c1bec23bdfdc8622f5a` |
| `assets/field-guide-hero.webp` | `f7fe143805f2d7dfd6b6c9645f5100131e5070ba124a192584f2f41e6b2cbe25` |
| `assets/field-guide-hero-800.webp` | `619f49ee467c7b825df94a7385065fb036e86a9de904be60fa9b7b1054587b49` |

`npm run verify:billing` independently observed the live checkout return the required hosted Dodo 303 with no `Retry-After`. The documented allowance is enforced: **30** invalid license verification requests were accepted from this client; request **31** returned **429** with `Retry-After: 4`.

This is a static local-first CLI plus landing site: it has no product-owned backend persistence or health endpoint, no service worker/PWA offline-update claim, and no sign-in, so backend-concurrency, PWA-update, and Entra-authority checks do not apply. The brief does not imply a useful generative-AI step beyond the existing local workflow.

## Findings by severity

None.
