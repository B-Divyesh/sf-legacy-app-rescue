# Adversarial first-read review 4 — FAIL

**Product:** Legacy App Rescue  
**Reviewed:** 2026-08-29 UTC  
**Live URL:** <https://legacy-app-rescue.sociobot.in>  
**Base reviewed:** `6aa415b83f77772c24d6082d58a05f130caaf799`

## Verdict

**FAIL.** The landing screen is clear, the sample is immediately useful, demo isolation works, and all 27 declared claims pass. However, the landing and README make several capability and pricing promises that have no matching `claims.json` entry or tagged observable test. The separately served 404 also loses required focus management on its way home and omits canonical/Open Graph metadata. A passing review requires zero findings.

## First 30 seconds

I opened the live site in fresh Chromium contexts at 390 × 844 (Android user agent) and 1440 × 900, without prior storage or a warm page.

Before scrolling, I understood it as: a desktop command-line tool that records an old Android app file and checks whether another Android device matches its requirements. It is for someone preserving an old app they own. I should click **Try it with sample data**.

This first-screen gate passes on both viewports. The exact copy is: “Record your Android app before it disappears”; “For people preserving an old app they own, it records the Android app file (APK) and checks another device.”; and “Try it with sample data”. The nearby result text says “Open a finished record in separate demo storage.” There was no horizontal overflow or application console error.

## Findings

### Blocking

| ID | Exact quote and location | Why this fails | Concrete fix |
| --- | --- | --- | --- |
| F-4-1 | “One APK is free.” — landing first-screen facts; “Scan one Android app file (APK) for free.” and “The free command scans one app file and checks one device.” — README / Field Kit | This is a price and free-tier limit a visitor can rely on. `field-kit` promises batch scans and permitted export, but neither its claim text nor its test establishes the one-file/one-device free allowance. | Add `free-tier-limit` to `claims.json` and one `@claim:free-tier-limit` clean-temp-dir test: an unlicensed single-file/single-device scan succeeds; a second file or second device is refused with the documented upgrade result. Or remove the numerical free-tier promises. |
| F-4-2 | “Add `--device` to record the Android version, device types, and installed app list.” — landing, step 2; “The record lists app version, needed Android version, device types, signing evidence, and device match reasons.” — landing, step 3 | `manifest-record` covers APK hashes, package details, signers, SDK needs, and native CPUs. `compatibility-verdict` covers checking needs. Neither declared claim promises that these chosen-device facts are recorded in the preservation record. | Add `device-context-record` with a fake ADB device and assert the emitted JSON contains the selected device Android version, device types, installed-app list, and match reasons. Or reduce the copy to the tested APK and compatibility facts. |
| F-4-3 | “Choose another preservation record (manifest) path:” — README, CLI use | The documented `--output` result is a user-facing CLI capability with no claim entry or observable tagged test. | Add `custom-output-path` and a tagged temporary-directory test that invokes `--output`, asserts the record is written at that exact path, and asserts the default path is not used. |
| F-4-4 | “If several devices are attached, select one:” — README, CLI use | The `--serial` selection behavior is a distinct device-safety promise. No listed claim tests two attached devices and selection of the requested serial. | Add `device-selection` with a fake ADB listing two devices; assert only the selected device is inspected and its fingerprint is recorded. |
| F-4-5 | “Print JSON for scripts:” — README, CLI use | This promises a machine-readable `--json` interface. `ci-output` only checks removal of decorative output; it does not assert valid JSON. | Add `json-output` and assert `rescue --json scan …` produces parseable JSON with the documented record fields and no terminal decoration. |
| F-4-6 | “Whole-file fingerprint (SHA-256) and file size” and “Exported data archive hashes” — README, **What the preservation record contains** | `manifest-record` covers the whole-file hash, but not file size. `field-kit` covers permitted export, but not an archive hash. These are specific evidence fields a preservation user may rely on. | Add separate `manifest-file-size` and `export-archive-hash` claims with fixtures that assert each emitted value, or delete the unsupported bullets. |
| F-4-7 | “Release assets include Linux `.deb` and `.rpm` packages, macOS `.pkg` files, a Windows portable ZIP, `SHA256SUMS`, and `latest.json`.” — README, Install | `platform-builds` only claims that macOS, Windows, and Linux are supported. Its declared test does not promise this public release-asset set or validate it against a release fixture. | Add `release-asset-set` with a recorded/latest release fixture that asserts the named asset formats and checksum manifest, or replace this sentence with a link to the release page. |
| F-4-8 | Direct 404 → “Return to the home page” — live `/review-four-not-found` | After activating this link, the landing page loaded with `document.activeElement === document.body`, not its new `<h1>`. The regular SPA routes correctly focus the new heading, but the separately served 404 bypasses that behavior. This fails the required focus-on-route-change path for a real route. | Make the 404 return link hand off to the app’s focus routine, or add a small 404 script that sets a handoff flag consumed by the landing page to focus its `<h1>`. Add a browser test beginning at an HTTP 404, activating the home action, and asserting the landing `<h1>` has focus. |

### Minor

| ID | Exact quote and location | Why this fails | Concrete fix |
| --- | --- | --- | --- |
| F-4-9 | “The product”, “Three steps”, “Clear boundaries”, and “Install” — landing eyebrow labels | These labels are decorative duplicates of the concrete headings below them. “The product” and “Clear boundaries” do not name a useful section out of context; the others merely repeat the heading. The plain-words rule requires every visible line to carry usable information. | Delete all four labels, or replace only “Three steps” with the useful section name “How it works”. Keep the existing concrete `h2` headings. |
| F-4-10 | Live `/review-four-not-found` document | The actual HTTP-404 page has a title, description, favicon, `lang`, and one `h1`, but no canonical link, Open Graph title/description/image/URL, Twitter title/description/card, or Apple touch icon. Every route, including 404, needs the standard metadata surface. | Add canonical, OG, Twitter-card, and Apple-touch metadata to `site/public/404.html`; add an HTTP-404 metadata assertion to the route test. |

## Demo and sandbox verification

The required one-click demo passes. From a fresh 390 px context, **Try it with sample data** opens `/demo` and immediately shows an in-use record for **Orchard Notes 1.7.0**: a compatible device result, APK fingerprint, Android requirements, CPU, signer evidence, and a realistic terminal recording.

The persistent banner says **“Demo — sample data, nothing is saved”**. Both **Reset demo** and **Start for real** remained visible and operable after scrolling to the end of the mobile record. With a preseeded `real:sentinel`, demo entry added only `demo:legacy-app-rescue:opened`; reset restored that demo key; Start for real removed the `demo:` key and retained `real:sentinel`.

A direct fresh `/demo` load requested only same-origin resources. The GitHub Releases API was requested only after leaving demo for the landing download section. `cargo run --manifest-path /work/repo/Cargo.toml -- demo` was also started from a new temporary working directory; it created its preservation manifest below the system temporary directory and left the working directory empty.

## Claims gate

I made a clean local clone at `/tmp/legacy-app-rescue-review4.ciPHHi`, ran `npm ci`, then ran every exact `test` command in `.factory/claims.json` independently. All 27 passed. A subsequent `npm test` passed: 8 Rust tests and 43 Playwright tests. The production build produced `dist/site/` with 22.83 kB JS (7.98 kB gzip) and 14.21 kB CSS (3.97 kB gzip).

| Claim IDs | Result |
| --- | --- |
| `manifest-record`, `compatibility-verdict`, `demo-sandbox`, `local-private`, `field-kit`, `platform-builds`, `mobile-install-guidance`, `paid-license`, `binary-manifest` | PASS |
| `installer-verified`, `browser-license-cache`, `browser-license-removal`, `export-refusal-cleanup`, `safety-boundaries`, `input-scope`, `device-serial-hash`, `compatibility-limit`, `merchant-and-refund` | PASS |
| `browser-license-storage`, `release-metadata-privacy`, `apk-transfer-boundary`, `sample-is-noninstallable`, `unsigned-builds`, `no-cli-telemetry`, `license-busy-recovery`, `winget-submission-manifest`, `ci-output` | PASS |

F-4-1 through F-4-7 are the unlisted-claim findings found by re-reading the live landing and README against those exact claim descriptions. They are not test failures; they are missing claim registrations and observable tests.

## Copy audit

Counts below use visible natural-language copy. Literal shell commands, hashes, package IDs, URLs used only as code, terminal rows, and version strings are excluded. No prose sentence exceeds 22 words. `F-4-*` marks the findings above; a claim ID means the sentence maps to a declared claim.

### Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| Record your Android app before it disappears | 7 | Pass |
| For people preserving an old app they own, it records the Android app file (APK) and checks another device. | 19 | Pass |
| Try it with sample data | 5 | Pass |
| Open a finished record in separate demo storage. | 8 | `demo-sandbox` |
| Runs on macOS, Windows, and Linux. | 6 | `platform-builds` |
| APK scans stay on your computer. | 6 | `local-private` |
| One APK is free. | 4 | F-4-1 |
| Field Kit costs $19 once. | 5 | `paid-license` |
| The product | 2 | F-4-9 |
| See what the preservation record contains | 6 | Pass |
| The record includes its package name, unique file fingerprint, signer evidence, Android version needs, and device match. | 16 | `manifest-record`, `compatibility-verdict` |
| Sample preservation record | 3 | Pass |
| This recording comes from a bundled sample Android app file (APK). | 12 | `demo-sandbox` |
| Run the same scan with rescue demo. | 7 | Pass |
| Three steps | 2 | F-4-9 |
| Create a preservation record (manifest) | 5 | Pass |
| Point to your Android app file | 6 | Pass |
| Give the desktop command-line tool (CLI) an Android app file you already own. | 13 | Pass |
| It reads the file in place. | 6 | `safety-boundaries` |
| Connect the target device | 4 | Pass |
| Add `--device` to record the Android version, device types, and installed app list. | 13 | F-4-2 |
| Keep the record beside the app file | 7 | Pass |
| The record lists app version, needed Android version, device types, signing evidence, and device match reasons. | 16 | F-4-2 |
| Clear boundaries | 2 | F-4-9 |
| What the tool does not change | 6 | Pass |
| Legacy App Rescue does not download, crack, patch, or re-sign APKs. | 11 | `safety-boundaries` |
| It cannot bypass Android data controls. | 6 | `safety-boundaries` |
| Reads only paths you pass. | 5 | `input-scope` |
| Keeps a shortened fingerprint of the device serial. | 8 | `device-serial-hash` |
| Labels compatibility as evidence, not a guarantee. | 7 | `compatibility-limit` |
| Exports app data only after Android grants the app's data-access permission (`run-as`). | 12 | `export-refusal-cleanup` |
| Install | 1 | F-4-9 |
| Install Legacy App Rescue | 4 | Pass |
| Download the Linux build, or use a package manager. | 9 | `platform-builds` |
| The installer verifies SHA-256 before placing rescue on your PATH. | 10 | `installer-verified` |
| Other install choices | 3 | Pass |
| For more than one app | 5 | Pass |
| Scan more app files at once | 6 | Pass |
| The free command scans one app file and checks one device. | 11 | F-4-1 |
| Field Kit adds batch scans and permitted app-data export. | 9 | `field-kit` |
| Buy Field Kit for $19 | 5 | Pass |
| Restore a license | 3 | Pass |
| Sociobot handles checkout. | 3 | `merchant-and-refund` |
| A refunded license stops Field Kit. | 6 | `merchant-and-refund` |
| Paste a license from your receipt | 6 | Pass |
| Verify license | 2 | Pass |
| Remove stored license | 3 | Pass |
| Stored only in this browser. | 5 | `browser-license-storage` |
| Remove it here at any time. | 6 | `browser-license-removal` |
| Legacy App Rescue records Android app evidence on your computer. | 10 | `manifest-record` |

The Android-mobile branch additionally says “Install Legacy App Rescue from a Mac, Windows, or Linux computer.” (11, `mobile-install-guidance`) and “Open the desktop downloads to choose an installer.” (8, `mobile-install-guidance`).

### README

| Sentence | Words | Result |
| --- | ---: | --- |
| Record an Android app before its device disappears. | 8 | Pass |
| Legacy App Rescue is a local desktop command-line tool (CLI) for people preserving Android app files (APKs) they lawfully own. | 19 | Pass |
| It writes a preservation record with app details, signing evidence, Android version needs, device types, and a device match. | 17 | F-4-2 |
| It never downloads or uploads an APK. | 7 | `apk-transfer-boundary` |
| The demo creates a fictional Android app file (APK) in a temporary folder. | 13 | `demo-sandbox` |
| It scans the app file, matches a sample Android 13 device, and prints the preservation record path. | 17 | `demo-sandbox` |
| Open the website sandbox at `?demo=1`. | 7 | Pass |
| Its browser storage uses the `demo:legacy-app-rescue:` prefix. | 5 | `demo-sandbox` |
| The sample source is in `examples/sample-apk`. | 6 | Pass |
| It has a preservation manifest, but no DEX executable. | 9 | `sample-is-noninstallable` |
| The script downloads the matching archive, verifies SHA-256, and places `rescue` in `~/.local/bin`. | 14 | `installer-verified` |
| The macOS package is unsigned. | 5 | `unsigned-builds` |
| Right-click the downloaded package, then choose Open. | 7 | Pass |
| The Windows build is unsigned. | 5 | `unsigned-builds` |
| Release assets include Linux `.deb` and `.rpm` packages, macOS `.pkg` files, a Windows portable ZIP, `SHA256SUMS`, and `latest.json`. | 18 | F-4-7 |
| The checked v0.1.3 manifest is `winget/B-Divyesh.LegacyAppRescue.yaml`. | 6 | `winget-submission-manifest` |
| Submit it to `microsoft/winget-pkgs` after checking the release. | 8 | `winget-submission-manifest` |
| It is not a public winget source until Microsoft accepts it. | 11 | `winget-submission-manifest` |
| Scan one Android app file (APK) for free. | 9 | F-4-1 |
| Choose another preservation record (manifest) path. | 7 | F-4-3 |
| Connect one authorized Android device and check compatibility. | 8 | `compatibility-verdict` |
| If several devices are attached, select one. | 7 | F-4-4 |
| Print JSON for scripts. | 4 | F-4-5 |
| `--ci` removes decorative output. | 5 | `ci-output` |
| A device match checks declared Android-version and device-type needs. | 9 | `compatibility-verdict` |
| It does not promise that licensing, remote services, or old graphics code work. | 13 | `compatibility-limit` |
| The free command scans one app file and checks one device. | 11 | F-4-1 |
| Field Kit adds batch scans and app-data export when Android grants `run-as` permission. | 12 | `field-kit` |
| Sociobot is the merchant of record. | 6 | `merchant-and-refund` |
| Android must grant that app's own data-access permission (`adb run-as`). | 9 | `export-refusal-cleanup` |
| Legacy App Rescue stops on refusal and does not try root. | 11 | `export-refusal-cleanup` |
| Legacy App Rescue does not distribute APKs, remove DRM, crack apps, or re-sign third-party software. | 15 | `safety-boundaries` |
| Use it only with files and data you may lawfully access. | 11 | Pass |
| Plain XML and Android binary XML manifests are supported. | 9 | `binary-manifest` |
| The tool still records the whole-file fingerprint when signer parsing is unavailable. | 11 | `manifest-record` |
| The site output is exactly `dist/site/`. | 6 | Build instruction; verified by build |
| The release workflow builds platform binaries on GitHub Actions. | 9 | `platform-builds` |
| `npm run verify:billing` is a live release check. | 7 | Build instruction |
| It confirms the Sociobot checkout returns a `303` to a hosted Dodo session and that a successful redirect has no `Retry-After` header. | 22 | Release-check instruction |
| It also checks that the verification service enforces its documented rate limit. | 12 | Release-check instruction |
| `npm run verify:package-managers` is a live release check. | 7 | Build instruction |
| It checks public Homebrew and Scoop checksums against the current GitHub Release. | 12 | Release-check instruction |
| It also checks the repository manifests. | 6 | Release-check instruction |
| Public claims live in `.factory/claims.json`. | 5 | Pass |
| The desktop command-line tool (CLI) has no telemetry. | 8 | `no-cli-telemetry` |
| App-file scanning and the bundled demo need no network. | 9 | `no-cli-telemetry` |
| License activation uses the Sociobot license service. | 7 | `paid-license` |
| The website verifies a stored license at most once a day. | 11 | `browser-license-cache` |
| If the license service is busy, it asks you to try again shortly. | 13 | `license-busy-recovery` |
| The source is available under the MIT License. | 9 | Pass |
| See the site privacy page and terms. | 7 | Pass |

README heading/action check: **Try the complete demo**, **Install**, **Use the desktop command-line tool (CLI)**, **What the preservation record contains**, **Field Kit — $19 once**, **Limits and safety**, **Build from source**, **Test individual promises**, and **Privacy and license** all name their sections. The listed buttons are result-naming verbs except terminal **Pause**, which accurately names its playback state.

## Earlier-review verification

I read every earlier review, polish report, verification report, and the prior handoff. The following are rechecked against the current source, live site, and tests rather than accepted from the repair notes.

| Earlier finding IDs | Current result |
| --- | --- |
| F-1-1, F-1-2 | Fixed: no alteration and no Android-control bypass remain in copy and `safety-boundaries` / refusal tests. |
| F-1-3 | Fixed: passed-path-only scanning is covered by `input-scope`. |
| F-1-4 | Fixed: shortened device fingerprint is covered by `device-serial-hash`. |
| F-1-5 | Fixed: evidence-not-guarantee wording is covered by `compatibility-limit`. |
| F-1-6 | Fixed: checkout and revoked-license behavior are covered by `merchant-and-refund`. |
| F-1-7 | Fixed: named browser storage and Sociobot-only verification are covered by `browser-license-storage`. |
| F-1-8 | Fixed: no-transfer/no-change scanning is covered by `apk-transfer-boundary`. |
| F-1-9 | Fixed: the no-DEX sample is covered by `sample-is-noninstallable`. |
| F-1-10 | Fixed: unsigned macOS and Windows wording is covered by `unsigned-builds`. |
| F-1-11, F-1-15 | Fixed: the ZIP64 and speculative Windows-first-run statements remain absent. |
| F-1-12 | Fixed: no CLI telemetry/network is covered by `no-cli-telemetry`. |
| F-1-13 | Fixed: the tested Sociobot license-service wording remains. |
| F-1-14 | Fixed: busy-service retry guidance is covered by `license-busy-recovery`. |
| F-1-16, F-1-17 | Fixed: winget submission fields and wording are covered by `winget-submission-manifest`. |
| F-1-18 | Fixed: `--ci` output is covered by `ci-output`. |
| F-1-19, F-1-20, F-1-21, F-1-22 | Fixed: the concrete preservation-record, boundaries, install, and restore-license headings/actions remain. |
| F-1-23, F-1-24 | Fixed: the winget and package-manager explanations remain split below 22 words. |
| F-2-1 | Fixed: mobile gets a desktop-download action; `mobile-install-guidance` passes. |
| F-2-2, F-2-3, F-2-4 | Fixed: Android app file (APK), preservation record (manifest), and desktop command-line tool (CLI) are expanded on first use. |
| F-2-5, F-2-6, F-2-7, F-2-8 | Fixed: the record summary is useful, fingerprint wording is plain, device-match language is plain, and `run-as` is explained. |
| F-3-1 | Fixed: at a real mobile bottom scroll, banner, Reset demo, and Start for real stayed visible and operable. |
| F-3-2, F-3-3 | Fixed: “A local preservation tool” and “PLATE / 017” are absent. |

None of those earlier IDs is repeated. F-4-1 through F-4-10 are new checks of presently visible copy and the static 404 return path.

## Structure, privacy, and routing

`/`, `/?demo=1`, `/demo`, `/privacy`, and `/terms` returned 200. `/review-four-not-found` returned an actual 404 with a designed, usable page. All normal routes have one `<h1>`, one `<main>`, `lang="en"`, a route-specific plain title and description, canonical URL, Open Graph image, favicon, consistent header/footer, Privacy/Terms links, and no application console error. Navigation from landing to Privacy and browser Back correctly changed title and focused the new `h1`.

`robots.txt`, `sitemap.xml`, favicon, and Apple touch icon returned 200. Crawled normal internal links returned 200; checkout returned its expected 303; explicit mail links were not fetched. The direct 404 is the exception recorded in F-4-8 and F-4-10.

The response CSP allows only self plus the GitHub Releases and Sociobot API connections needed by the product, with `frame-ancestors` correctly sent as a response header. Fresh demo request logging confirmed same-origin-only traffic. The fern, paper ledger, specimen labels, and field-guide art are a distinct product identity, not a generic SaaS template, and match `.factory/design.md`.

No missed-AI, import, export, or sync finding is raised. The brief calls for a local preservation record; unsolicited AI or synchronization would widen the privacy boundary. The paid export path already covers the obvious permitted Android-data capability.

## What would make this perfect

1. Put every currently advertised free-tier, device-record, CLI-output/selection, manifest-field, and release-asset promise under an exact claims entry with a sandbox test.
2. Make the HTTP-404 return-home route focus the landing heading and give the static 404 the same metadata completeness as the application routes.
3. Remove the four duplicate eyebrow labels so every landing line carries information.
