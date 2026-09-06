# Preserve an old Android app — review 8

**Product:** Legacy App Rescue

**Reviewed:** 2026-09-06 UTC

**Live URL:** <https://legacy-app-rescue.sociobot.in>

**Implementation candidate:** `0fa85d3ba9ef6e93594b9dd070fd661683f65b6e`

**Documentation SHA:** `a68e7d3c4e6927b4e41e071f01031076bb21d11a`

**Published CLI tag:** `v0.1.3` at `e6664faf68f28f172f6d3db4dea57c7fd7941e97`

## Verdict: FAIL

There is **one moderate finding**, zero other findings, and zero untested claims. The keyboard focus outline has only 1.86:1 contrast against the paper background. The supplied accessibility contract requires at least 3:1. A PASS requires zero findings of every severity.

The web build from the implementation candidate is byte-identical to production. The published CLI tag predates the candidate, but the later Rust change only adds a test-only verification endpoint when `LEGACY_RESCUE_TEST_MODE=1`; normal production behavior is unchanged.

## First screen

I opened the live page in fresh Chromium contexts at 390 × 844 with an Android user agent and at 1440 × 900. I did not scroll before this check.

- **Job:** record an old Android app file and check it against another Android device.
- **Audience:** a person preserving an old Android app they own.
- **First action:** **Try it with sample data**.

The live heading is “Record your Android app before it disappears.” The next sentence names the audience and result. The sample action and its outcome are visible before scrolling at both sizes. There was no horizontal overflow or console error.

## Finding

### F-8-1 — Moderate — keyboard focus contrast is below the required ratio

Every keyboard focus stop receives a 3 px `#d6a744` outline. On the main paper and header surface, `#f2ebd9`, that outline has a WCAG contrast ratio of **1.86:1**. The attached accessibility contract requires a visible focus ring with at least **3:1** contrast.

Fresh keyboard checks confirmed the same low-contrast outline on the wordmark, Demo, Install, Privacy, and **Try it with sample data**. These controls are operable and the focus outline exists, but its contrast does not meet the stated baseline. Axe does not test this focus-appearance requirement.

**Required correction:** use a focus color that reaches 3:1 against the adjacent light surface. Keep a separate light or gold focus color for controls on dark surfaces. Then add a browser assertion for the rendered focus-indicator contrast on both light and dark sections.

Evidence: `/work/.evidence/review-8/focus.json` and `/work/.evidence/review-8/focus-primary-mobile.png`.

## Sample and data isolation

The landing action opens `/demo` in one click. The first demo screen is already populated with Orchard Notes 1.7.0, package ID, 690-byte APK size, Android API needs, arm64 CPU data, signer evidence, SHA-256, and a compatible result with a reason.

The label **“Demo — sample data, nothing is saved”** stays visible at the end of the mobile record. **Reset demo** and **Start for real** also remain visible and work.

I seeded `real:sentinel` and a license sentinel before opening `/demo` directly. Entry and reset changed only `demo:legacy-app-rescue:opened`. Exit removed that demo key and retained both sentinels. Requests while the demo banner was present stayed on the product origin. No cookie was set. Reduced-motion mode had zero running animations after the page settled.

Evidence: `/work/.evidence/review-8/demo-direct.json`, `live-demo-mobile.png`, and `live-demo-scrolled-mobile.png`.

## Claims

From clean clone `/tmp/legacy-app-rescue-review8-clean`, I ran `npm ci` and then every exact command in `.factory/claims.json` independently. All **36 of 36** passed. Each ID occurs exactly once in the test source. No live landing, legal-page, or README promise was found outside the registry.

| Claim | Result | Claim | Result |
| --- | --- | --- | --- |
| `manifest-record` | PASS | `compatibility-verdict` | PASS |
| `demo-sandbox` | PASS | `local-private` | PASS |
| `field-kit` | PASS | `platform-builds` | PASS |
| `mobile-install-guidance` | PASS | `paid-license` | PASS |
| `binary-manifest` | PASS | `installer-verified` | PASS |
| `browser-license-cache` | PASS | `browser-license-removal` | PASS |
| `export-refusal-cleanup` | PASS | `safety-boundaries` | PASS |
| `input-scope` | PASS | `device-serial-hash` | PASS |
| `compatibility-limit` | PASS | `merchant-and-refund` | PASS |
| `browser-license-storage` | PASS | `release-metadata-privacy` | PASS |
| `apk-transfer-boundary` | PASS | `sample-is-noninstallable` | PASS |
| `unsigned-builds` | PASS | `no-cli-telemetry` | PASS |
| `license-busy-recovery` | PASS | `winget-submission-manifest` | PASS |
| `ci-output` | PASS | `free-tier-limit` | PASS |
| `device-context-record` | PASS | `custom-output-path` | PASS |
| `device-selection` | PASS | `json-output` | PASS |
| `manifest-file-size` | PASS | `signer-fallback` | PASS |
| `export-archive-hash` | PASS | `release-asset-set` | PASS |

Evidence: `/work/.evidence/review-8/claims.log`, ending with `CLAIMS_TOTAL=36 CLAIMS_FAILED=0`.

## Clean checkout and command results

All documented prerequisites were installed before runtime checks. Every documented build and release-check command passed.

```text
npm ci                                      PASS — 24 packages, 0 vulnerabilities
npm test                                    PASS — 8 Rust + 53 Playwright tests
npm run check                               PASS
npm run build:site                          PASS — produced dist/site
cargo fmt --all -- --check                  PASS
cargo clippy --all-targets --locked -- -D warnings
                                            PASS
cargo build --release --locked              PASS
cargo package --locked                      PASS
npm audit --audit-level=high                PASS — 0 vulnerabilities
npm run verify:package-managers             PASS
npm run verify:billing                      PASS
npm run test:performance                    PASS
```

The four mobile performance runs scored 100. LCP was 1,669, 1,657, 1,658, and 1,655 ms; median LCP was 1,657.5 ms. TBT and CLS were zero. The build contains 22,708 bytes of JavaScript, 14,207 bytes of CSS, 34,800 bytes of fonts, and a 50,182-byte mobile hero.

Evidence: `/work/.evidence/review-8/quality-gates.log`.

## Installed CLI and release

I installed the packaged crate into a new consumer root. The installed command reported `rescue 0.1.3`; `--help` documented scan, device, demo, license, JSON, and CI use. `rescue --json demo` produced schema 1.0, the fictional Orchard Notes APK, its SHA-256 and signer, an Android 13 arm64 device, and a compatible result. The caller's empty working directory received no sample files.

A missing APK, a directory, and an empty APK each exited 1 with a reason and a `rescue --help` next step. The full suite also covered missing required input, missing ADB, several attached devices, incompatible SDK/CPU, refused data export, malformed signer data, and invalid licenses.

I then ran the live one-line shell installer into another empty directory. It downloaded the public Linux archive, verified the published SHA-256, installed `rescue 0.1.3`, and completed the JSON demo. A separate checksum check passed. A bogus `LEGACY_RESCUE_LICENSE` did not enable a two-APK scan and produced no output record.

The release exposes Linux tar, DEB, RPM, Windows ZIP, Intel and Apple-silicon macOS tar/PKG files, `SHA256SUMS`, and `latest.json`. Native metadata reports RPM `0:0.1.3-1 x86_64` and DEB `0.1.3-1 amd64`. Homebrew, Scoop, and winget metadata resolve to v0.1.3.

Evidence: `/work/.evidence/review-8/consumer-cli.log`, `consumer-demo.json`, `live-installer.log`, `live-installer-demo.json`, `release-checksum.log`, `latest-summary.json`, `native-packages.log`, and `bogus-license.log`.

## Live routes, accessibility, privacy, and recovery

`npm run verify:url -- https://legacy-app-rescue.sociobot.in /work/.evidence/review-8` passed `/`, `/?demo=1`, `/demo`, `/privacy`, `/terms`, and a real HTTP 404.

- Every normal route returned 200 with its own title, `lang="en"`, one h1, one main landmark, image alternatives, and consistent header/footer links.
- The missing route returned HTTP 404 with a designed page, route metadata, and a home action that focused the landing h1. The 404 status is expected and is not a defect.
- Axe found zero serious or critical issues. Controls are at least 44 × 44 CSS px. The skip link works. Route history updates title, focus, canonical data, and announcements.
- Reduced-motion mode stops recurring motion and renders the complete demo result. There is no flashing or autoplaying media.
- Demo traffic is same-origin. Normal landing traffic adds only the documented GitHub Releases API. License verification uses only the documented Sociobot endpoint. There are no analytics, third-party fonts, or third-party scripts.
- Privacy and Terms are reachable. The privacy page names stored keys, removal actions, network requests, and `privacy@sociobot.in` for requests.
- Every rendered link resolved. Product pages returned 200, the release asset returned 200, Sociobot returned 200, and checkout returned the expected 303 to a hosted Dodo session. The missing page's self-link remains on the deliberate 404.
- The live allowance check returned 200 for requests 1–30 and 429 for request 31 with `Retry-After: 4`. A live browser recovery check displayed “License checks are busy. Try again shortly.”

The site is static and the main product is a local CLI. It has no product-owned backend, tenant store, service worker, update promise, sign-in, or shared database. Backend tenant/restart/health and web offline-update checks do not apply. The CLI's no-network promise passed with unusable proxy endpoints.

The preservation result is deterministic evidence. Adding generated model output would not improve this job, so there is no missed AI feature finding.

Evidence: `/work/.evidence/review-8/live-browser.json`, `manual-live.json`, `links.json`, `headers.log`, `browser-rate-limit.json`, and `live-rate-recovery.json`.

## Deployment identity

Fresh `dist/site` output matched production byte-for-byte for HTML, JavaScript, CSS, both hero assets, both installer scripts, and the real 404 document. Root HTML uses 30-second revalidation. Hashed assets use a one-year immutable cache. CSP and the other required security headers are present.

Evidence: `/work/.evidence/review-8/deployment-identity.log` and `headers.log`.

## Earlier review findings

Every finding in reviews 1, 2, 3, 4, and 6 was checked against the current source, live site, or its named passing test. All remain closed. F-8-1 is new.

| Earlier ID | Current disposition |
| --- | --- |
| F-1-1 | Closed: `safety-boundaries` proves the supplied APK stays unchanged. |
| F-1-2 | Closed: refusal cleanup and no-root behavior pass. |
| F-1-3 | Closed: `input-scope` leaves an unpassed sentinel unread. |
| F-1-4 | Closed: the device serial is stored as a 16-character SHA-256 prefix. |
| F-1-5 | Closed: compatibility remains evidence, not an installation promise. |
| F-1-6 | Closed: copy says only that Sociobot handles checkout; revoked-license behavior passes. |
| F-1-7 | Closed: named browser storage and Sociobot-only verification pass. |
| F-1-8 | Closed: the scan works without HTTP and leaves the APK unchanged. |
| F-1-9 | Closed: the bundled sample contains no DEX file. |
| F-1-10 | Closed: unsigned macOS and Windows wording matches packaging. |
| F-1-11 | Closed: the unsupported ZIP64 version promise remains absent. |
| F-1-12 | Closed: scan and demo pass with unusable HTTP proxies. |
| F-1-13 | Closed: copy names only the tested Sociobot license service. |
| F-1-14 | Closed: the live busy path gives a retry step. |
| F-1-15 | Closed: speculative Windows first-run wording remains absent. |
| F-1-16 | Closed: the winget submission manifest passes current-field checks. |
| F-1-17 | Closed: winget wording remains short and accurate. |
| F-1-18 | Closed: `--ci` retains results without decoration. |
| F-1-19 | Closed: “Create a preservation record (manifest)” remains the heading. |
| F-1-20 | Closed: “What the tool does not change” remains the heading. |
| F-1-21 | Closed: “Install Legacy App Rescue” remains the heading. |
| F-1-22 | Closed: “Restore a license” remains the action. |
| F-1-23 | Closed: winget guidance remains below the sentence limit. |
| F-1-24 | Closed: package-manager guidance remains below the sentence limit. |
| F-2-1 | Closed: mobile visitors get desktop-download guidance and no unusable command. |
| F-2-2 | Closed: “Android app file (APK)” is expanded at first use. |
| F-2-3 | Closed: “preservation record (manifest)” is expanded at first use. |
| F-2-4 | Closed: “desktop command-line tool (CLI)” is expanded at first use. |
| F-2-5 | Closed: preview copy names useful record contents. |
| F-2-6 | Closed: user copy uses “unique file fingerprint.” |
| F-2-7 | Closed: result copy uses Android-version, device-type, and device-match terms. |
| F-2-8 | Closed: `run-as` is explained as Android's app data-access permission. |
| F-3-1 | Closed: the demo label and both controls remain visible at mobile end-of-scroll. |
| F-3-2 | Closed: “A local preservation tool” remains absent. |
| F-3-3 | Closed: “PLATE / 017” remains absent. |
| F-4-1 | Closed: one-APK/one-device free use and unlicensed batch refusal pass. |
| F-4-2 | Closed: selected-device facts and match reasons are recorded. |
| F-4-3 | Closed: `--output` writes only the chosen record path. |
| F-4-4 | Closed: `--serial` inspects only the selected device. |
| F-4-5 | Closed: `--json` emits parseable record output. |
| F-4-6 | Closed: APK size and exported archive hashes are tested. |
| F-4-7 | Closed: the full public release asset set and checksums are current. |
| F-4-8 | Closed: the HTTP-404 home action focuses the landing h1. |
| F-4-9 | Closed: duplicate decorative labels remain absent. |
| F-4-10 | Closed: the HTTP 404 includes canonical, Open Graph, Twitter, and touch metadata. |
| F-6-1 | Closed: the recorded valid-license test completes batch scan and permitted export. |
| F-6-2 | Closed: the recorded checkout fixture asserts 1900 USD and one-time billing. |
| F-6-3 | Closed: malformed signer handling preserves the whole-file fingerprint. |
| F-6-4 | Closed: the untested version-entitlement wording remains absent. |
| F-6-5 | Closed: the README heading is “Try it with sample data.” |
| F-6-6 | Closed: macOS actions name the two download results. |
| F-6-7 | Closed: copy uses APK consistently after first use. |

## Earlier verification findings

All earlier verification records, including their minor notes, were read and rechecked.

| Earlier finding | Current disposition |
| --- | --- |
| Hashed assets used short cache headers | Closed: live hashed assets now send `max-age=31536000, immutable`. |
| Checkout returned 404 | Closed: live checkout returns the expected hosted-payment 303. |
| No verified request allowance | Closed: the declared 30 requests pass; request 31 returns 429 with `Retry-After`. |
| Any environment text unlocked Field Kit | Closed: the public binary rejects `LEGACY_RESCUE_LICENSE=bogus` and writes no batch result. |
| Export archive was mode 0644 | Closed: the passing Rust test asserts owner-only mode 0600 and cleanup. |
| Claims registry was incomplete | Closed: all 36 current claims have one passing tagged observable test; no unlisted promise was found. |
| Targets and terminal text were too small | Closed: all tested targets are at least 44 × 44; terminal text renders at 16 px. |
| Mobile and Apple-silicon installer selection was wrong | Closed: mobile shows desktop guidance and macOS shows both architecture downloads. |
| Browser could not use an exact `Retry-After` value | Superseded: current public copy promises a retry step, not an exact wait. The live UI gives that step when the header is not CORS-readable. Raw response verification still confirms `Retry-After`. |
| Missing routes returned 200 | Closed: a styled missing route returns a deliberate HTTP 404. |
| JSON license status/remove printed prose | Closed: the full suite covers machine-readable successful status and removal. |
| Product copy used unexplained field-guide labels | Closed: the cited labels remain absent and the copy audit has no flags. |
| Homebrew, Scoop, and winget pointed to v0.1.0 | Closed: public and repository metadata resolve to v0.1.3 checksums. |
| The browser had no license-removal action | Closed: the control removes both token and cached verdict and announces completion. |
| v0.1.1 RPM had v0.1.0 metadata | Closed: the public RPM is `0:0.1.3-1 x86_64`. |
| Mobile LCP exceeded 2.5 seconds | Closed: all four fresh runs were 1.66–1.67 seconds. |
| Changelog and manual release default were stale | Closed: changelog includes 0.1.1–0.1.3 and the workflow default is v0.1.3. |
| Project URL verifier was missing | Closed: `scripts/verify-url.sh` exists and passed the live URL. |

## Counts

- Critical findings: 0
- Major findings: 0
- Moderate findings: 1
- Minor findings: 0
- Total findings: 1
- Untested claims: 0
