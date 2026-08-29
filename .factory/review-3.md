# Adversarial first-read review 3 — FAIL

**Product:** Legacy App Rescue  
**Reviewed:** 2026-08-29 UTC  
**Live URL:** <https://legacy-app-rescue.sociobot.in>

## Verdict

**FAIL.** The first-read, trial, claims, privacy, and route checks mostly pass. The demo’s required safety controls are not persistent: scrolling the sample record hides its banner, including **Reset demo** and **Start for real**. A demo may not leave its isolation controls behind the visitor.

## First 30 seconds

At cold 390 × 844 and 1440 × 900 viewports, before scrolling, I understood this as a desktop tool that records an Android app file so its requirements can be checked against another Android device. It is for someone preserving an old app they own. The first action is **Try it with sample data**.

This gate passes. The first screen says “Record your Android app before it disappears”; “For people preserving an old app they own, it records the Android app file (APK) and checks another device.”; and “Try it with sample data.” The adjacent outcome is “Open a finished record in separate demo storage.” Both viewports had no horizontal overflow and no product console error.

## Findings

### Blocking

| ID | Exact quote and location | Evidence and impact | Concrete fix |
| --- | --- | --- | --- |
| F-3-1 | “Demo — sample data, nothing is saved”, with **Reset demo** and **Start for real** — `/demo` header | At 390 × 844, `/demo` is 2,531 px high. The banner begins at y=64; after scrolling to the record’s end, its bounding box is y=-67. The banner and both controls are no longer visible. This contradicts the required persistent demo banner and makes the sandbox state and exit/reset action unavailable while inspecting the result. | Make the demo banner sticky or fixed below the header, with a mobile-safe offset and stacking order. Add a `@claim:demo-sandbox` browser assertion that scrolls `/demo` to its end and confirms the banner, Reset demo, and Start for real remain visible and operable. |

### Minor

| ID | Exact quote and location | Why it fails the copy rule | Concrete fix |
| --- | --- | --- |
| F-3-2 | “A local preservation tool” — landing eyebrow | This label could appear unchanged on many products and tells a first-time visitor nothing beyond the headline. It is decorative brand/mood copy rather than a usable fact. | Delete it. The headline and lede already state the job and audience. |
| F-3-3 | “PLATE / 017” — landing hero art label | This decorative, unexplained label carries no product information. It is an invented field-guide flourish rather than useful copy. | Remove it, or replace it with a useful visual label such as “Sample Android app preservation record.” |

## Demo and sandbox

The one-click entry passes apart from F-3-1. From a fresh mobile context, **Try it with sample data** opened `/?demo=1`; the first result already showed **Orchard Notes 1.7.0**, a compatible result, Android version needs, device type, signer evidence, and a file fingerprint. The banner text, Reset demo, and Start for real were initially present.

With a seeded `real:sentinel`, demo entry added only `demo:legacy-app-rescue:opened` to the demo namespace and left the sentinel unchanged. Reset reseeded the demo key. Start for real removed every `demo:` key and retained the real sentinel. A direct fresh `/demo` request log contained only same-origin requests. The CLI demo was invoked from a temporary working directory; it reports the generated preservation-record path under the system temporary directory and does not create a normal record in the working directory.

## Claims

I created a fresh local clone, ran `npm ci`, and ran every test command in `.factory/claims.json` independently. All passed. A subsequent full `npm test` passed: 8 Rust tests and 42 Playwright tests. The registry contains exactly one `@claim:<id>` test for each entry.

| Claim IDs | Result |
| --- | --- |
| `manifest-record`, `compatibility-verdict`, `demo-sandbox`, `local-private`, `field-kit`, `platform-builds`, `mobile-install-guidance`, `paid-license`, `binary-manifest` | PASS |
| `installer-verified`, `browser-license-cache`, `browser-license-removal`, `export-refusal-cleanup`, `safety-boundaries`, `input-scope`, `device-serial-hash`, `compatibility-limit`, `merchant-and-refund` | PASS |
| `browser-license-storage`, `release-metadata-privacy`, `apk-transfer-boundary`, `sample-is-noninstallable`, `unsigned-builds`, `no-cli-telemetry`, `license-busy-recovery`, `winget-submission-manifest`, `ci-output` | PASS |

Live claim-like landing, privacy, terms, and README statements map to those entries; no additional unlisted public claim was found. F-3-1 is a demo-behaviour defect despite the existing storage-isolation test passing.

## Copy audit

Code samples, package IDs, hashes, URLs used as code, and generated terminal rows are excluded. Counts use visible prose; headings and actions are included. No listed sentence exceeds 22 words. F-3-2 and F-3-3 are the only copy findings.

### Landing

| Copy | Words | Result |
| --- | ---: | --- |
| A local preservation tool | 4 | F-3-2 |
| Record your Android app before it disappears | 7 | Pass |
| For people preserving an old app they own, it records the Android app file (APK) and checks another device. | 19 | Pass |
| Try it with sample data | 5 | Pass |
| Open a finished record in separate demo storage. | 8 | Pass |
| Runs on macOS, Windows, and Linux. | 6 | `platform-builds` |
| APK scans stay on your computer. | 6 | `local-private` |
| One APK is free. Field Kit costs $19 once. | 9 | `field-kit`, `paid-license` |
| PLATE / 017 | 2 | F-3-3 |
| See what the preservation record contains | 6 | Pass |
| The record includes its package name, unique file fingerprint, signer evidence, Android version needs, and device match. | 16 | Pass |
| This recording comes from a bundled sample Android app file (APK). | 12 | `demo-sandbox` |
| Run the same scan with rescue demo. | 7 | Pass |
| Create a preservation record (manifest) | 5 | Pass |
| Point to your Android app file | 6 | Pass |
| Give the desktop command-line tool (CLI) an Android app file you already own. | 13 | Pass |
| It reads the file in place. | 6 | Pass |
| Connect the target device | 4 | Pass |
| Add `--device` to record the Android version, device types, and installed app list. | 13 | Pass |
| Keep the record beside the app file | 7 | Pass |
| The record lists app version, needed Android version, device types, signing evidence, and device match reasons. | 16 | Pass |
| What the tool does not change | 6 | Pass |
| Legacy App Rescue does not download, crack, patch, or re-sign APKs. | 11 | `safety-boundaries` |
| It cannot bypass Android data controls. | 6 | `safety-boundaries` |
| Reads only paths you pass. | 5 | `input-scope` |
| Keeps a shortened fingerprint of the device serial. | 8 | `device-serial-hash` |
| Labels compatibility as evidence, not a guarantee. | 7 | `compatibility-limit` |
| Exports app data only after Android grants the app's data-access permission (`run-as`). | 12 | `export-refusal-cleanup` |
| Install Legacy App Rescue | 4 | Pass |
| Install Legacy App Rescue from a Mac, Windows, or Linux computer. | 11 | `mobile-install-guidance` |
| Open the desktop downloads to choose an installer. | 8 | `mobile-install-guidance` |
| Other install choices | 3 | Pass |
| Scan more app files at once | 6 | Pass |
| The free command scans one app file and checks one device. | 11 | `field-kit` |
| Field Kit adds batch scans and permitted app-data export. | 9 | `field-kit` |
| Buy Field Kit for $19 | 5 | Pass |
| Restore a license | 3 | Pass |
| Sociobot handles checkout. A refunded license stops Field Kit. | 9 | `merchant-and-refund` |
| Paste a license from your receipt | 6 | Pass |
| Verify license | 2 | Pass |
| Remove stored license | 3 | Pass |
| Stored only in this browser. Remove it here at any time. | 11 | `browser-license-storage`, `browser-license-removal` |
| Legacy App Rescue records Android app evidence on your computer. | 10 | `manifest-record` |

### README

| Sentence | Words | Result |
| --- | ---: | --- |
| Record an Android app before its device disappears. | 8 | Pass |
| Legacy App Rescue is a local desktop command-line tool (CLI) for people preserving Android app files (APKs) they lawfully own. | 19 | Pass |
| It writes a preservation record with app details, signing evidence, Android version needs, device types, and a device match. | 17 | `manifest-record` |
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
| Release assets include Linux `.deb` and `.rpm` packages, macOS `.pkg` files, a Windows portable ZIP, `SHA256SUMS`, and `latest.json`. | 18 | Pass |
| The checked v0.1.3 manifest is `winget/B-Divyesh.LegacyAppRescue.yaml`. | 6 | `winget-submission-manifest` |
| Submit it to `microsoft/winget-pkgs` after checking the release. | 8 | `winget-submission-manifest` |
| It is not a public winget source until Microsoft accepts it. | 11 | `winget-submission-manifest` |
| Scan one Android app file (APK) for free. | 9 | Pass |
| Choose another preservation record (manifest) path. | 7 | Pass |
| Connect one authorized Android device and check compatibility. | 8 | Pass |
| If several devices are attached, select one. | 7 | Pass |
| Print JSON for scripts. | 4 | Pass |
| `--ci` removes decorative output. | 5 | `ci-output` |
| A device match checks declared Android-version and device-type needs. | 9 | `compatibility-verdict` |
| It does not promise that licensing, remote services, or old graphics code work. | 13 | `compatibility-limit` |
| The free command scans one app file and checks one device. | 11 | `field-kit` |
| Field Kit adds batch scans and app-data export when Android grants `run-as` permission. | 12 | `field-kit` |
| Sociobot is the merchant of record. | 6 | `merchant-and-refund` |
| Android must grant that app's own data-access permission (`adb run-as`). | 9 | `export-refusal-cleanup` |
| Legacy App Rescue stops on refusal and does not try root. | 11 | `export-refusal-cleanup` |
| Legacy App Rescue does not distribute APKs, remove DRM, crack apps, or re-sign third-party software. | 15 | `safety-boundaries` |
| Use it only with files and data you may lawfully access. | 11 | Pass |
| Plain XML and Android binary XML manifests are supported. | 9 | `binary-manifest` |
| The tool still records the whole-file fingerprint when signer parsing is unavailable. | 11 | `manifest-record` |
| The site output is exactly `dist/site/`. | 6 | Pass |
| The release workflow builds platform binaries on GitHub Actions. | 9 | `platform-builds` |
| `npm run verify:billing` is a live release check. | 7 | Pass |
| It confirms the Sociobot checkout returns a `303` to a hosted Dodo session and that a successful redirect has no `Retry-After` header. | 22 | Pass |
| It also checks that the verification service enforces its documented rate limit. | 12 | Pass |
| `npm run verify:package-managers` is a live release check. | 7 | Pass |
| It checks public Homebrew and Scoop checksums against the current GitHub Release. | 12 | Pass |
| It also checks the repository manifests. | 6 | Pass |
| Public claims live in `.factory/claims.json`. | 5 | Pass |
| The desktop command-line tool (CLI) has no telemetry. | 8 | `no-cli-telemetry` |
| App-file scanning and the bundled demo need no network. | 9 | `no-cli-telemetry` |
| License activation uses the Sociobot license service. | 7 | `paid-license` |
| The website verifies a stored license at most once a day. | 11 | `browser-license-cache` |
| If the license service is busy, it asks you to try again shortly. | 13 | `license-busy-recovery` |
| The source is available under the MIT License. | 9 | Pass |
| See the site privacy page and terms. | 7 | Pass |

## Earlier-review verification

I read `review-1.md`, `review-2.md`, both polish records, every verification record, and the handoff. Each earlier finding was checked against the current live page and current source/tests.

| Earlier ID | Current result |
| --- | --- |
| F-1-1 | Fixed: tested no-alteration boundary remains live. |
| F-1-2 | Fixed: tested Android-control/refusal boundary remains live. |
| F-1-3 | Fixed: tested passed-path-only language remains live. |
| F-1-4 | Fixed: tested shortened device fingerprint language remains live. |
| F-1-5 | Fixed: evidence-not-guarantee language remains live. |
| F-1-6 | Fixed: Sociobot checkout/refund language is tested. |
| F-1-7 | Fixed: browser storage boundary is tested. |
| F-1-8 | Fixed: APK transfer boundary is tested. |
| F-1-9 | Fixed: non-executable sample claim is tested. |
| F-1-10 | Fixed: unsigned-build wording is tested. |
| F-1-11 | Fixed: unsupported ZIP64 wording remains absent. |
| F-1-12 | Fixed: no-telemetry claim is tested. |
| F-1-13 | Fixed: tested Sociobot license-service wording remains. |
| F-1-14 | Fixed: busy-service recovery is tested. |
| F-1-15 | Fixed: speculative Windows prompt remains absent. |
| F-1-16 | Fixed: winget manifest claim is tested. |
| F-1-17 | Fixed: winget submission wording remains split and tested. |
| F-1-18 | Fixed: `--ci` result is tested. |
| F-1-19 | Fixed: the output heading now names the preservation record. |
| F-1-20 | Fixed: the boundaries heading is concrete. |
| F-1-21 | Fixed: install heading is concrete. |
| F-1-22 | Fixed: license action is result-naming. |
| F-1-23 | Fixed: winget copy remains below the cap. |
| F-1-24 | Fixed: package-manager explanation remains split. |
| F-2-1 | Fixed: mobile visitors receive a desktop-download action, covered by a claim. |
| F-2-2 | Fixed: Android app file (APK) is expanded at first use. |
| F-2-3 | Fixed: preservation record (manifest) is expanded at first use. |
| F-2-4 | Fixed: desktop command-line tool (CLI) is expanded at first use. |
| F-2-5 | Fixed: preview copy names record contents. |
| F-2-6 | Fixed: user-facing file/device fingerprint wording remains. |
| F-2-7 | Fixed: landing result summary uses Android-version/device-match language. |
| F-2-8 | Fixed: `run-as` is explained as app data-access permission. |

F-3-1 is a new regression/omission: the earlier reviews checked the banner on entry but not after scrolling. It is not marked fixed by either polish record.

## Structure, privacy, and navigation

`/`, `/demo`, `/privacy`, and `/terms` return 200. Each has a route-specific title, one `h1`, one `main`, description, canonical URL, Open Graph metadata, favicon, consistent header/footer, Privacy and Terms links, and no console error. A missing route returns HTTP 404 with the designed page and an action home. `robots.txt` and `sitemap.xml` return 200. Crawled links resolved as expected: same-origin routes returned 200/404 as appropriate, GitHub download returned 302, Sociobot checkout returned 303 to hosted Dodo, and Sociobot home returned 200.

The live CSP permits only self, GitHub Releases API, and Sociobot API connections. Fresh landing request logs used same-origin assets plus the documented GitHub API; a direct fresh demo used only same-origin assets. The botanical field-guide system remains distinct from a generic SaaS template and matches `.factory/design.md`. No additional AI, import/export, or sync capability is implied by the brief: an AI step or sync would dilute this deliberately local preservation workflow.

## What would make this perfect

1. Keep the demo banner and its Reset/Start-for-real controls visible and operable at every scroll position, with a scroll regression test.
2. Remove the two decorative landing labels identified in F-3-2 and F-3-3.
3. Re-run this entire checklist from a fresh clone and cold browser after the banner repair.
