# Adversarial first-read review 7 — PASS

**Product:** Legacy App Rescue  
**Reviewed:** 2026-08-29 UTC  
**Live URL:** <https://legacy-app-rescue.sociobot.in>  
**Repository commit:** `2bc3a34e0782db8c38b7dfad208d4c0aecb94ae1`

## Verdict

**PASS.** There are zero blocking or minor findings. The cold landing makes the job, audience, and first action clear on mobile and desktop. The one-click sample is an isolated, populated CLI demonstration. All registered claims have an observable tagged test that passed from a clean clone. The live site has working routes, metadata, focus management, accessible mobile controls, and a product-specific visual system.

## First 30 seconds

Fresh Chromium contexts were used at 390 × 844 with an Android user agent and at 1440 × 900. No storage was pre-seeded and the page was not scrolled before this check.

I understood the product as: a desktop command-line tool that records a lawful old Android app file and checks it against another Android device. It is for people preserving an old app they own. I should click **Try it with sample data**.

The first screen supports all three conclusions with these exact lines:

- “Record your Android app before it disappears”
- “For people preserving an old app they own, it records the Android app file (APK) and checks another device.”
- “Try it with sample data” followed by “Open a finished record in separate demo storage.”

At 390 px the primary action was fully visible at y=471 with a 349 × 49 px target. There was no horizontal overflow or console error. The mobile first screen uses the documented field-guide illustration, paper/ink palette, and ledger rules rather than a generic SaaS layout. The first-screen gate passes.

## Findings

None.

## Copy audit

Word counts use visible whitespace-separated words. Commands, package IDs, hashes, generated terminal records, and URLs are data rather than prose sentences. The landing audit is from the deployed, hydrated Linux view; the mobile-only install guidance is included. No sentence exceeds 22 words. No banned marketing adjective, jargon-only sentence, ambiguous mood heading, inconsistent core term, or non-result-naming action was found.

### Landing page sentences

| Copy | Words | Result |
| --- | ---: | --- |
| A field-guide plate shows a fern sheltering an archive box and device cable. | 13 | Useful image alternative |
| Record your Android app before it disappears | 7 | Clear h1 |
| For people preserving an old app they own, it records the Android app file (APK) and checks another device. | 19 | Clear audience and outcome |
| Open a finished record in separate demo storage. | 8 | `demo-sandbox` |
| Runs on macOS, Windows, and Linux. | 6 | `platform-builds` |
| APK scans stay on your computer. | 6 | `local-private` |
| One APK scan is free. | 5 | `free-tier-limit` |
| Field Kit costs $19 once. | 5 | `paid-license` |
| The record includes its package name, unique file fingerprint, signer evidence, Android version needs, and device match. | 16 | `manifest-record`, `compatibility-verdict` |
| This recording comes from a bundled sample APK. | 9 | `demo-sandbox` |
| Run the same scan with `rescue demo`. | 7 | Clear CLI action |
| Give the desktop command-line tool (CLI) an APK you already own. | 11 | Clear first use |
| It reads the file in place. | 6 | `safety-boundaries` |
| Add `--device` to record the Android version, device types, and installed app list. | 13 | `device-context-record` |
| The record lists app version, needed Android version, device types, signing evidence, and device match reasons. | 16 | `device-context-record` |
| Legacy App Rescue does not download, crack, patch, or re-sign APKs. | 11 | `safety-boundaries` |
| It cannot bypass Android data controls. | 6 | `safety-boundaries` |
| Reads only paths you pass. | 5 | `input-scope` |
| Keeps a shortened fingerprint of the device serial. | 8 | `device-serial-hash` |
| Labels compatibility as evidence, not a guarantee. | 7 | `compatibility-limit` |
| Exports app data only after Android grants the app’s data-access permission (`run-as`). | 12 | `export-refusal-cleanup` |
| Download the Linux build, or use a package manager. | 9 | Concrete install guidance |
| The installer verifies SHA-256 before placing `rescue` on your PATH. | 10 | `installer-verified` |
| The free command scans one APK and checks one device. | 10 | `free-tier-limit` |
| Field Kit adds batch scans and permitted app-data export. | 9 | `field-kit` |
| Sociobot handles checkout. | 3 | `merchant-and-refund` |
| A refunded license stops Field Kit. | 6 | `merchant-and-refund` |
| Stored only in this browser. | 5 | `browser-license-storage` |
| Remove it here at any time. | 6 | `browser-license-removal` |
| Legacy App Rescue records Android app evidence on your computer. | 10 | `manifest-record`, `local-private` |
| Install Legacy App Rescue from a Mac, Windows, or Linux computer. | 11 | `mobile-install-guidance` |
| Open the desktop downloads to choose an installer. | 8 | `mobile-install-guidance` |

### Landing headings, labels, and actions

| Copy | Words | Result |
| --- | ---: | --- |
| Legacy App Rescue | 3 | Wordmark/product name |
| Demo / Install / Privacy | 1 each | Clear navigation |
| Try it with sample data | 5 | Result-naming action |
| See what the preservation record contains | 6 | Concrete section heading |
| Sample preservation record | 3 | Concrete record label |
| Orchard Notes · sample | 3 | Identifies sample data |
| Pause / Replay | 1 each | Accurate playback controls |
| Package / SHA-256 / SDK range / Device match | 1 / 1 / 2 / 2 | Result labels after plain-language introduction |
| Create a preservation record (manifest) | 5 | Concrete section heading |
| Point to your APK / Connect the target device / Keep the record beside the APK | 4 / 4 / 7 | Concrete step headings |
| What the tool does not change | 6 | Concrete boundary heading |
| Install Legacy App Rescue | 4 | Concrete section heading |
| Download for Linux / Open desktop downloads / Copy command | 3 / 3 / 2 | Result-naming actions |
| Other install choices | 3 | Clear disclosure label |
| Scan more APKs at once | 5 | Concrete paid-section heading |
| Buy Field Kit for $19 / Restore a license | 5 / 3 | Result-naming actions |
| Paste a license from your receipt | 6 | Clear field label |
| Verify license / Remove stored license | 2 / 3 | Result-naming actions |
| Privacy / Terms / Built by Param Factory | 1 / 1 / 4 | Clear footer links |

### README sentences

| Copy | Words | Result |
| --- | ---: | --- |
| Record an Android app before its device disappears. | 8 | Clear purpose |
| Legacy App Rescue is a local desktop command-line tool (CLI) for people preserving Android app files (APKs) they lawfully own. | 19 | Clear audience and first-use terms |
| It writes a preservation record with app details, signing evidence, Android version needs, device types, and a device match. | 17 | `device-context-record` |
| It never downloads or uploads an APK. | 7 | `apk-transfer-boundary` |
| The demo creates a fictional Android app file (APK) in a temporary folder. | 13 | `demo-sandbox` |
| It scans the APK, matches a sample Android 13 device, and prints the preservation record path. | 16 | `demo-sandbox` |
| Its browser storage uses the `demo:legacy-app-rescue:` prefix. | 5 | `demo-sandbox` |
| The sample source is in `examples/sample-apk`. | 6 | Useful source location |
| It has a preservation manifest, but no DEX executable. | 9 | `sample-is-noninstallable` |
| The script downloads the matching archive, verifies SHA-256, and places `rescue` in `~/.local/bin`. | 14 | `installer-verified` |
| The macOS package is unsigned. | 5 | `unsigned-builds` |
| Right-click the downloaded package, then choose **Open**. | 7 | Clear macOS instruction |
| The Windows build is unsigned. | 5 | `unsigned-builds` |
| Release assets include Linux `.deb` and `.rpm` packages, macOS `.pkg` files, a Windows portable ZIP, `SHA256SUMS`, and `latest.json`. | 18 | `release-asset-set` |
| The checked v0.1.3 manifest is `winget/B-Divyesh.LegacyAppRescue.yaml`. | 6 | `winget-submission-manifest` |
| Submit it to `microsoft/winget-pkgs` after checking the release. | 8 | Clear next step |
| It is not a public winget source until Microsoft accepts it. | 11 | Clear limitation |
| Scan one APK for free. | 5 | `free-tier-limit` |
| Choose another preservation record (manifest) path. | 7 | `custom-output-path` |
| Connect one authorized Android device and check compatibility. | 8 | `compatibility-verdict` |
| If several devices are attached, select one. | 7 | `device-selection` |
| Print JSON for scripts. | 4 | `json-output` |
| `--ci` removes decorative output. | 5 | `ci-output` |
| A device match checks declared Android-version and device-type needs. | 9 | `compatibility-verdict` |
| It does not promise that licensing, remote services, or old graphics code work. | 13 | `compatibility-limit` |
| The free command scans one APK and checks one device. | 10 | `free-tier-limit` |
| Field Kit adds batch scans and app-data export when Android grants `run-as` permission. | 12 | `field-kit` |
| Sociobot handles checkout. | 3 | `merchant-and-refund` |
| Activate the token from the receipt. | 6 | Clear activation step |
| Then scan a set. | 4 | Clear next step |
| Export data for a package present in the scanned APK set. | 11 | `field-kit` |
| Android must grant that app’s own data-access permission (`adb run-as`). | 9 | `export-refusal-cleanup` |
| Legacy App Rescue stops on refusal and does not try root. | 11 | `export-refusal-cleanup` |
| Legacy App Rescue does not distribute APKs, remove DRM, crack apps, or re-sign third-party software. | 15 | `safety-boundaries` |
| Use it only with files and data you may lawfully access. | 11 | Clear legal boundary |
| Plain XML and Android binary XML manifests are supported. | 9 | `binary-manifest` |
| The tool still records the whole-file fingerprint when signer parsing is unavailable. | 12 | `signer-fallback` |
| Requirements: Rust stable, Node 22 or newer, and npm. | 9 | Clear build prerequisite |
| The site output is exactly `dist/site/`. | 6 | Confirmed by build |
| The release workflow builds platform binaries on GitHub Actions. | 9 | `platform-builds` |
| The factory deploys this product as a static site. | 9 | Repository operation |
| Build the deployment directory with the following commands. | 8 | Clear instruction |
| Deploy `dist/site/` through the factory work-order configuration. | 7 | Clear instruction |
| Do not add DNS, billing, or deployment secrets to this repository. | 11 | Clear safety instruction |
| `npm run verify:billing` is a live release check. | 7 | Clear instruction |
| It confirms the Sociobot checkout returns a `303` to a hosted Dodo session and that a successful redirect has no `Retry-After` header. | 22 | Documented release check |
| It also checks that the verification service enforces its documented rate limit. | 12 | Documented release check |
| `npm run verify:package-managers` is a live release check. | 7 | Clear instruction |
| It checks public Homebrew and Scoop checksums against the current GitHub Release. | 12 | Documented release check |
| It also checks the repository manifests. | 6 | Documented release check |
| Public claims live in `.factory/claims.json`. | 5 | Clear source of proof |
| The desktop command-line tool (CLI) has no telemetry. | 8 | `no-cli-telemetry` |
| APK scanning and the bundled demo need no network. | 9 | `no-cli-telemetry` |
| License activation uses the Sociobot license service. | 7 | `paid-license` |
| The website verifies a stored license at most once a day. | 11 | `browser-license-cache` |
| If the license service is busy, it asks you to try again shortly. | 13 | `license-busy-recovery` |
| The source is available under the MIT License. | 9 | Confirmed by `LICENSE` |
| See the site privacy page and terms. | 7 | Clear links |

README headings and list labels — including **Try it with sample data**, **Use the desktop command-line tool (CLI)**, **What the preservation record contains**, **Field Kit — $19 once**, and **Limits and safety** — name their sections. List labels such as “Whole-file fingerprint (SHA-256) and file size” are output fields rather than slogans. The terminology stays consistent: first use is “Android app file (APK),” then “APK”; first use is “desktop command-line tool (CLI),” then “CLI”; and first use is “preservation record (manifest),” then “record” or “manifest.”

## Demo and sandbox verification

The visible one-click action and direct `/demo` route both opened a completed record immediately. The initial demo screen named **Orchard Notes 1.7.0** and showed a compatible Android 13 device result, package ID, 690-byte APK size, Android requirements, arm64 CPU, signer evidence, SHA-256, and a specific match reason. This is realistic sample data and shows the product in use before any setup.

The fixed banner read “Demo — sample data, nothing is saved.” At the maximum scroll position on a 390 × 844 page, its bounds were y=64–169, and both **Reset demo** and **Start for real** remained visible and operable. With `real:sentinel=keep` and `sb_license:legacy-app-rescue=keep-license` seeded before demo entry:

- Demo entry added only `demo:legacy-app-rescue:opened`.
- Reset restored only that demo key.
- Start for real removed the demo key and retained both real keys.
- Requests during demo mode were same-origin only. The GitHub and Sociobot requests observed after leaving demo belong to the normal landing/license flow, not the demo flow.

The CLI check was run from a new temporary working directory with `cargo run --manifest-path /tmp/legacy-app-rescue-review7-ci/Cargo.toml -- demo`. It created a separate `/tmp/legacy-app-rescue-demo-*` directory containing only `orchard-notes-1.7.apk` and `preservation-manifest.json`; the calling directory remained empty. The record reported the sample device and a compatible result. This confirms the CLI path is also isolated from user files.

## Claims gate

`.factory/claims.json` contains 36 entries. From a clean clone at `/tmp/legacy-app-rescue-review7-ci`, `npm ci` passed. Every exact registered command (`npm test -- --grep @claim:<id>`) was run independently from a fresh installed clone and passed. A full `npm test` then passed with 8 Rust tests and 53 Playwright tests; Playwright recorded `status: "passed"` with no failed tests.

The claim coverage includes all landing and README product promises: manifest evidence, compatibility, demo isolation, local processing, Field Kit behavior, platforms, pricing, installation verification, privacy/storage boundaries, no telemetry, field limits, device selection, JSON/output fields, signer fallback, and release assets. No live landing or README claim-like sentence was found without a matching registry entry and observable tagged test.

`npm run build` passed and produced `dist/site/`. The shipped JavaScript is 22.71 kB (7.95 kB gzip) and CSS is 14.21 kB (3.97 kB gzip).

## Structure, accessibility, and links

`npm run verify:url -- https://legacy-app-rescue.sociobot.in /tmp/legacy-app-rescue-review7/evidence` passed. It verified `/`, `/?demo=1`, `/demo`, `/privacy`, `/terms`, and a served HTTP 404:

- Route titles, language, exactly one h1, one main landmark, descriptions, canonical URLs, Open Graph/Twitter metadata, favicon and Apple touch icon are present.
- The title pattern is clear per route: “Legacy App Rescue — record an Android app,” “Demo — Legacy App Rescue,” “Privacy — Legacy App Rescue,” “Terms — Legacy App Rescue,” and “Page not found — Legacy App Rescue.”
- The 404 is designed in the field-guide system, is served with status 404, and its home action moves focus to the landing h1.
- Deep links, address-bar routes, back/forward route rendering, route announcements, skip link, visible focus, mobile target size, no horizontal overflow, console errors, missing image alternatives, and Axe serious/critical findings all passed.
- The header/footer are consistent and include the required Privacy, Terms, and Param Factory links.

The crawl found no dead site link. Product routes returned 200; the intentional missing route returned 404 with recovery; the release download, Sociobot homepage, and hosted checkout all resolved successfully. Mailto links were explicit.

No missed AI feature is raised. The brief calls for deterministic, private preservation evidence from user-supplied APKs and devices. A model-generated interpretation would not make that record more trustworthy. The useful leverage (batch scans and permitted data export) is implemented and exercised by the Field Kit claim test without embedded provider credentials.

## Earlier findings rechecked

Every earlier review, polish report, verification record, and the previous handoff was read. The following table records a fresh confirmation against the current source, live deployment, and relevant tagged test; none is merely accepted as marked fixed.

| Earlier ID | Current confirmation |
| --- | --- |
| F-1-1 | `safety-boundaries` proves the supplied APK is unchanged; boundary copy remains live. |
| F-1-2 | Refused app-data export cleans up and does not use root; copy remains live. |
| F-1-3 | `input-scope` proves an unpassed sentinel is not scanned. |
| F-1-4 | `device-serial-hash` proves the 16-character SHA-256 prefix. |
| F-1-5 | `compatibility-limit` retains evidence-not-guarantee wording. |
| F-1-6 | `merchant-and-refund` covers Sociobot checkout and revoked-license behavior. |
| F-1-7 | `browser-license-storage` retains named local storage and Sociobot-only verification. |
| F-1-8 | `apk-transfer-boundary` covers no upload/download/change of an APK. |
| F-1-9 | `sample-is-noninstallable` proves the bundled sample has no DEX. |
| F-1-10 | `unsigned-builds` covers the retained macOS and Windows wording. |
| F-1-11 | The unsupported ZIP64 version statement remains absent. |
| F-1-12 | `no-cli-telemetry` proves the CLI demo and scan work without network. |
| F-1-13 | The copy now makes only the tested Sociobot license-service statement. |
| F-1-14 | `license-busy-recovery` proves the retry instruction. |
| F-1-15 | The speculative Windows first-run prediction remains absent. |
| F-1-16 | `winget-submission-manifest` validates current portable-package fields. |
| F-1-17 | The short, neutral winget submission wording remains live. |
| F-1-18 | `ci-output` proves undecorated CI output. |
| F-1-19 | “Create a preservation record (manifest)” remains the concrete heading. |
| F-1-20 | “What the tool does not change” remains the concrete heading. |
| F-1-21 | “Install Legacy App Rescue” remains the concrete heading. |
| F-1-22 | “Restore a license” remains the result-naming action. |
| F-1-23 | Winget guidance remains split below 22 words. |
| F-1-24 | Package-manager guidance remains split below 22 words. |
| F-2-1 | Mobile visitors receive desktop-download guidance without an unusable command. |
| F-2-2 | “Android app file (APK)” is expanded at first use. |
| F-2-3 | “Preservation record (manifest)” is expanded at first use. |
| F-2-4 | “Desktop command-line tool (CLI)” is expanded at first use. |
| F-2-5 | The record-preview copy lists useful contents instead of a slogan. |
| F-2-6 | User-facing identity language is “unique file fingerprint.” |
| F-2-7 | Landing results use Android-version, device-type, and device-match language. |
| F-2-8 | `run-as` is explained as Android’s app data-access permission. |
| F-3-1 | The banner and both demo controls remain visible at actual mobile end-of-scroll. |
| F-3-2 | “A local preservation tool” remains absent. |
| F-3-3 | “PLATE / 017” remains absent. |
| F-4-1 | `free-tier-limit` proves one-APK/one-device free use and batch refusal. |
| F-4-2 | `device-context-record` proves selected-device fields and reasons. |
| F-4-3 | `custom-output-path` proves the requested manifest path. |
| F-4-4 | `device-selection` proves only the selected serial is inspected. |
| F-4-5 | `json-output` proves parseable undecorated output. |
| F-4-6 | `manifest-file-size` and `export-archive-hash` prove both output fields. |
| F-4-7 | `release-asset-set` validates the published installer set. |
| F-4-8 | The static 404 home action now focuses the landing h1. |
| F-4-9 | Decorative duplicate eyebrow labels remain absent. |
| F-4-10 | The HTTP 404 retains canonical, Open Graph, Twitter, and Apple-touch metadata. |
| F-6-1 | `field-kit` uses a recorded valid license and exercises batch scan plus permitted export. |
| F-6-2 | `paid-license` asserts 1900 USD and one-time billing from the recorded checkout fixture. |
| F-6-3 | `signer-fallback` proves malformed signer handling preserves the whole-file fingerprint. |
| F-6-4 | The untested version-0.x entitlement statement remains absent. |
| F-6-5 | The README heading is “Try it with sample data.” |
| F-6-6 | macOS actions say “Download for Apple silicon” and “Download for Intel Mac.” |
| F-6-7 | “APK” is used consistently after its first-use definition. |

## What would make this perfect

Nothing actionable remains from this review. Preserve the current claim-to-test discipline when changing copy, billing, installers, storage, or the demo. Re-run the same cold mobile/desktop, demo, claim, route, and earlier-finding checks before the next release.
