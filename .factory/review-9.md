# Record an Android app before it disappears — review 9

**Verdict: PASS**

- **Finding count:** 0
- **Untested public claims:** 0
- **Implementation candidate:** `ae763326f4e2d0f000a57bade0462951e386b89f`
- **Documentation head:** `deb3f50a985e07b769dabdd35054b23fa1878d6b`
- **Review base:** `5704ead3ab9eebc1c90f908c0d84c1dff18f8dae`
- **Live URL:** <https://legacy-app-rescue.sociobot.in>
- **Reviewed:** 2026-09-06 UTC

The changes after `ae76332` through the assigned base are reports and handoff documentation. A fresh build byte-matched the live HTML, JavaScript, CSS, hero and social art, installer scripts, and designed 404 document. The live product is the implementation candidate.

## Job, audience, and first action

I opened the live page in fresh desktop (1440 × 900) and phone (iPhone 13, 390 CSS px wide) browser contexts. I did not scroll before this check.

- **Job:** “Record your Android app before it disappears.”
- **Audience:** people preserving an old app they own.
- **First action:** **Try it with sample data**. The adjacent text says it opens a finished record in separate demo storage.

All three were visible before scrolling at both sizes. The action measured 218 × 48.8 CSS px on desktop and 348 × 48.8 CSS px on phone. Neither viewport overflowed horizontally. Visual evidence is in `/work/.evidence/review-9/desktop-before-scroll.png` and `phone-before-scroll.png`.

## Sample and isolation

The one-click action opened the populated Orchard Notes 1.7.0 record. It showed the package ID, 690-byte fixture size, API 21–28 requirements, arm64 CPU, signer evidence, full SHA-256 fingerprint, a compatible verdict, and the reason for that verdict.

The label **Demo — sample data, nothing is saved** stayed visible at the end of the phone and desktop records. **Reset demo** and **Start for real** also stayed visible and worked. A seeded `real:review-9-sentinel=unchanged` value remained unchanged after entry, reset, and exit. Reset restored only the demo key; exit removed that key. Direct demo requests stayed on the product origin. Evidence is in `/work/.evidence/review-9/fresh-sessions.json`, `live-browser.json`, and the phone/desktop sample screenshots.

## Public claims

From a new local clone at the assigned review base, I ran `npm ci` and then every exact `test` command in `.factory/claims.json` independently. All 36 passed. Each claim ID has exactly one tagged test, and the aggregate registry check passed.

| Claims | Result |
| --- | --- |
| `manifest-record`, `compatibility-verdict`, `demo-sandbox`, `local-private`, `field-kit`, `platform-builds` | PASS |
| `mobile-install-guidance`, `paid-license`, `binary-manifest`, `installer-verified`, `browser-license-cache`, `browser-license-removal` | PASS |
| `export-refusal-cleanup`, `safety-boundaries`, `input-scope`, `device-serial-hash`, `compatibility-limit`, `merchant-and-refund` | PASS |
| `browser-license-storage`, `release-metadata-privacy`, `apk-transfer-boundary`, `sample-is-noninstallable`, `unsigned-builds`, `no-cli-telemetry` | PASS |
| `license-busy-recovery`, `winget-submission-manifest`, `ci-output`, `free-tier-limit`, `device-context-record`, `custom-output-path` | PASS |
| `device-selection`, `json-output`, `manifest-file-size`, `signer-fallback`, `export-archive-hash`, `release-asset-set` | PASS |

The live landing, demo, privacy, terms, 404, platform-specific install states, and README were compared with the registry and copy audit. Every retained outcome, privacy, price, platform, installer, safety, or limit statement maps to a passing claim. No unlisted or untested public claim was found. The full exact-command log ends `CLAIMS_TOTAL=36 CLAIMS_FAILED=0` in `/work/.evidence/review-9/claims.log`.

## Normal, invalid, boundary, and recovery paths

- Normal scan and demo paths emitted complete, parseable preservation records.
- Missing APK arguments exited 2 with usage. A missing path, directory, empty APK, and missing ADB each exited 1 with the cause and a next step.
- `--serial` without `--device` exited 2 and named the missing option.
- The free one-APK/one-device path succeeded; an unlicensed batch was refused without writing a record.
- Two attached-device fixtures required selection and inspected only the chosen serial.
- A malformed signer block retained the whole-file fingerprint. Android `run-as` refusal removed partial output and did not use root.
- A recorded valid license completed a two-APK batch and permitted data export; invalid and revoked licenses did not activate Field Kit.
- Browser 429 fixtures showed a retry step. The live allowance again permitted 30 verification requests, then request 31 returned 429 with `Retry-After: 4`.

The installed-command evidence is `/work/.evidence/review-9/installed-cli-invalid.log`; detailed fixture paths are covered by the passing claim and aggregate logs.

## Installed product and release

I unpacked the freshly created `legacy-app-rescue-0.1.3.crate` and installed it with `cargo install --path … --root <empty-prefix> --locked`. The installed artifact reported `rescue 0.1.3`, provided useful help, and completed `rescue --json demo`. It emitted schema 1.0, the Orchard Notes package, a 64-character SHA-256 fingerprint, Android 13 device evidence, and a compatible reason. The caller's empty working directory remained empty.

I also ran the live shell installer into another empty prefix. It downloaded the public Linux archive, verified its published SHA-256, installed `rescue 0.1.3`, and completed the same JSON demo. Homebrew, Scoop, winget, DEB/RPM/release-set checks passed. Evidence is in `/work/.evidence/review-9/consumer-install.log`, `consumer-demo.json`, `live-installer.log`, and `live-installer-demo.json`.

## Live site, accessibility, privacy, and structure

`npm run verify:url -- https://legacy-app-rescue.sociobot.in /work/.evidence/review-9` passed `/`, `/?demo=1`, `/demo`, `/privacy`, `/terms`, and a deliberate HTTP 404.

- Normal routes returned 200 with their own title, `lang="en"`, one `h1`, one `main`, complete image alternatives, no serious or critical Axe result, no console/page error, no phone overflow, and no target below 44 px.
- The designed missing page returned HTTP 404, its expected title and social metadata, and a home action that focused the landing heading. This expected status is not a defect.
- Keyboard use reached the skip link, main landmark, sample action, terminal control, demo reset/exit, navigation, license controls, and 404 recovery without a trap.
- Focus outlines are 3 px solid. Fresh live measurements were 10.44:1 against paper and 17.29:1 against the terminal.
- With reduced motion, the complete recording appeared, its control read **Replay**, and zero animations remained running.
- The direct demo made only same-origin requests. Landing additionally used only the documented GitHub Releases API. License tests restrict tokens to the named browser storage keys and the Sociobot verification origin. No analytics, cookies, third-party fonts, or third-party scripts were found.
- Privacy names stored data, removal actions, network requests, and `privacy@sociobot.in`. Terms states lawful-use, compatibility, payment, and warranty boundaries.
- All rendered HTTP links resolved: product routes returned 200, checkout returned the expected 303, the release asset returned its expected 302, and Sociobot returned 200. Mail links were explicit.
- Root and hashed assets send the required security and cache headers. Hashed JavaScript is immutable for one year.

There is no web offline or update promise and no service worker. The CLI no-network claim passed with unusable HTTP proxies. This is a static site plus local CLI, with no product backend, tenant store, health route, or restart-persistence state. Backend tenant and SQLite checks do not apply. The required public billing allowance was tested instead.

## Quality and performance

| Command | Result |
| --- | --- |
| `npm ci` | PASS — 24 packages, 0 vulnerabilities |
| all 36 exact claim commands | PASS |
| `npm test` | PASS — 8 Rust and 54 Playwright tests |
| `npm run build:site` | PASS — produced `dist/site/` |
| `cargo fmt --all -- --check` | PASS |
| `cargo clippy --all-targets --locked -- -D warnings` | PASS |
| `cargo build --release --locked` | PASS |
| `cargo package --locked` | PASS — 0.1.3 crate |
| `npm audit --audit-level=high` | PASS — 0 vulnerabilities |
| `npm run verify:package-managers` | PASS |
| `npm run verify:billing` | PASS — Dodo 303; request 31 returned 429 with `Retry-After` |
| `npm run test:performance` | PASS — four scores of 100; LCP 1656–1672 ms; TBT 0; CLS 0 |

Initial JavaScript is 7.95 kB gzip, CSS is 4.02 kB gzip, and self-hosted fonts total 34.8 kB. Evidence is in `/work/.evidence/review-9/quality-gates.log` and `performance.log`.

## Earlier review findings

Every earlier review and verification report, including minor notes, was read. The following dispositions were proved again rather than copied from an earlier report.

| Earlier IDs | Current proof and disposition |
| --- | --- |
| F-1-1–F-1-5 | Closed by `safety-boundaries`, `export-refusal-cleanup`, `input-scope`, `device-serial-hash`, and `compatibility-limit`. |
| F-1-6–F-1-10 | Closed by checkout/revocation, browser-storage, transfer-boundary, noninstallable-sample, and unsigned-build claims. Merchant copy remains the tested “Sociobot handles checkout.” |
| F-1-11–F-1-18 | Closed: unsupported ZIP64 wording and speculative Windows wording remain absent; no-telemetry, busy recovery, winget, and CI-output tests pass. |
| F-1-19–F-1-24 | Closed: current headings/actions name their result, winget/package text is split, and the copy audit has no over-22-word or banned-word flag. |
| F-2-1–F-2-8 | Closed by the phone install state and current first-use wording for APK, record/manifest, CLI, fingerprint, device evidence, and `run-as`. |
| F-3-1–F-3-3 | Closed: label/reset/exit remain visible at the actual phone record end; both decorative labels remain absent. |
| F-4-1–F-4-7 | Closed by the free limit, device context, output path, device selection, JSON, size/archive hash, and release-set claims. |
| F-4-8–F-4-10 | Closed by the fresh HTTP-404 focus handoff, metadata check, and absence of duplicate decorative labels. |
| F-6-1–F-6-4 | Closed by the recorded valid-license batch/export, 1900 USD one-time checkout fixture, signer fallback, and removal of the untested 0.x entitlement wording. |
| F-6-5–F-6-7 | Closed: README uses “Try it with sample data,” macOS links name the download result, and APK terminology is consistent. |
| F-8-1 | Closed by fresh keyboard measurements of 10.44:1 and 17.29:1 plus the passing rendered-style regression. |

Earlier verification-only defects also remain closed: immutable asset caching, checkout registration, 30-request allowance and 429 response, arbitrary-environment license bypass, private export permissions and cleanup, mobile target and terminal size, installer architecture selection, browser license removal, JSON license status/removal, package-manager versions, RPM metadata, stale changelog/workflow default, mobile LCP, designed 404 behavior, and the once-missing URL checker were all covered by the commands and live evidence above.

## Result

**PASS. There are zero findings of every severity and zero untested public claims.**
