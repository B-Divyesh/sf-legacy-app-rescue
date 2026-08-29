# Adversarial first-read review 6 — FAIL

**Product:** Legacy App Rescue  
**Reviewed:** 29 August 2026 UTC  
**Candidate:** `e0f0fa88678c5e2f909c1c874010fb0c3ed9872a`  
**Live URL:** <https://legacy-app-rescue.sociobot.in>  
**Verdict:** **FAIL** — the product is clear, usable, and visually distinct, but four public promises lack an adequate claim test, one earlier merchant claim has regressed, and three copy issues remain. PASS requires zero findings.

## First 30 seconds

I opened production in fresh Chromium contexts at 390 × 844 with an Android mobile user agent, touch enabled, and no prior storage, then at 1440 × 900 desktop.

- **What it does:** records evidence from an Android app file and checks it against another Android device.
- **For whom:** people preserving an old Android app they own.
- **What to click first:** **Try it with sample data**.

All three answers are present before scrolling on both viewports. The exact first-screen copy is “Record your Android app before it disappears”; “For people preserving an old app they own, it records the Android app file (APK) and checks another device”; and “Try it with sample data.” This gate passes.

## Findings

### Blocking

#### F-1-6 — the earlier merchant-of-record claim has regressed

- **Exact quote/location:** “Sociobot is the merchant of record.” — `README.md`, Field Kit; the live `/terms` route repeats “Sociobot is the merchant of record.”
- **Why this fails:** review 1 required this legal/payment claim to be tested or removed. The landing was softened to “Sociobot handles checkout,” but README and Terms retained the stronger claim. `merchant-and-refund` now claims only that Sociobot handles checkout and a revoked license does not activate Field Kit. Its test checks the checkout URL and a mocked revoked response; it does not establish the merchant-of-record identity. A branded Sociobot/Dodo checkout page is not proof of the legal merchant.
- **Concrete fix:** use “Sociobot handles checkout.” in README and Terms, matching the tested claim. If merchant-of-record status must remain, add that exact statement to `claims.json` and test authoritative billing metadata that identifies the merchant.

#### F-6-1 — the Field Kit claim test never proves the paid workflow works

- **Exact quote/location:** “Field Kit adds batch scans and permitted app-data export.” — live landing; “Field Kit adds batch scans and app-data export when Android grants `run-as` permission.” — `README.md`; `claims.json` entry `field-kit`.
- **Why this fails:** `@claim:field-kit` proves that an arbitrary token is rejected, then runs the internal `app_data_export_is_private_and_cleans_up_on_refusal` unit test. It never supplies a valid recorded license response, never completes a two-APK CLI scan, and never completes an allowed `rescue scan ... --export-data ...` command. The visitor-facing paid capability is therefore not asserted end to end.
- **Concrete fix:** make the license verification endpoint injectable in tests, serve a recorded valid Sociobot response, run the released CLI against two sample APKs and a fake authorized ADB device, then assert success, two manifest entries, an export archive, and its recorded hash. Keep the existing invalid-token and refusal cases.

#### F-6-2 — the $19 one-time price test checks the page’s own label, not the price charged

- **Exact quote/location:** “Field Kit costs $19 once.” — live first screen; “Field Kit — $19 once” — `README.md`; `claims.json` entry `paid-license`.
- **Why this fails:** `@claim:paid-license` asserts that a link named “Buy Field Kit for $19” points to the checkout endpoint. That is circular: it proves the site displays its own claim, not that checkout charges USD 19 once. A manual live check during this review did show “$19.00” and “One-time unlock,” but the required tagged sandbox test does not assert those observable billing facts.
- **Concrete fix:** add a recorded checkout/product fixture from the Sociobot billing API and assert amount `1900`, currency `USD`, and one-time billing in `@claim:paid-license`. Keep a separate live release check for the hosted redirect.

#### F-6-3 — signer-failure fallback is an unlisted, untested product claim

- **Exact quote/location:** “The tool still records the whole-file fingerprint when signer parsing is unavailable.” — `README.md`, Limits and safety.
- **Why this fails:** neither `manifest-record` nor `manifest-file-size` names this fallback. Their tests scan valid sample APKs; the manifest test expects one signer. No test supplies malformed or unsupported signer data and confirms that scanning still succeeds with the whole-file fingerprint.
- **Concrete fix:** add a `signer-fallback` claim and a malformed/unsupported signing-block fixture. Assert a successful scan, an empty or explicitly unavailable signer result, and the correct whole-file SHA-256. Otherwise remove the sentence.

#### F-6-4 — the paid entitlement duration is an unlisted claim

- **Exact quote/location:** “It adds batch scans and permitted app-data export for version 0.x.” — live `/terms`, Field Kit purchase.
- **Why this fails:** `claims.json` contains no version-entitlement promise. Existing Field Kit tests do not establish that one purchase remains valid for all `0.x` releases. This is purchase-scope information a buyer may rely on.
- **Concrete fix:** register a `field-kit-version-entitlement` claim backed by billing/license fixtures across at least two `0.x` versions, or delete “for version 0.x” until the entitlement is enforced and tested.

### Minor

#### F-6-5 — “complete” overstates the demo

- **Exact quote/location:** “Try the complete demo” — `README.md` heading.
- **Why this fails:** “complete” is an unmeasured marketing adjective. The sample demonstrates one scan and device match, but not the paid batch or successful app-data-export paths.
- **Concrete rewrite:** “Try it with sample data”.

#### F-6-6 — macOS download buttons do not name their result

- **Exact quote/location:** “Apple silicon” and “Intel Mac” — button-styled download links in the live macOS install branch.
- **Why this fails:** these labels name architectures, not actions or results. A button must say what activating it does.
- **Concrete rewrite:** “Download for Apple silicon” and “Download for Intel Mac”.

#### F-6-7 — the core input has inconsistent spelling

- **Exact quote/location:** “Android app file (APK),” “One app-file scan is free,” “app file,” and “App-file scanning” — landing and `README.md`.
- **Why this fails:** the same concept alternates between “app file,” “app-file,” and “APK” after the first-use definition. This creates an avoidable terminology inconsistency.
- **Concrete rewrite:** introduce “Android app file (APK)” once, then use “APK” consistently: “One APK scan is free” and “APK scanning and the bundled demo need no network.”

No missed-AI finding is raised. The brief calls for deterministic local inspection of user-supplied APKs and devices; adding model output would not improve the preservation evidence. The missed leverage is already represented by F-6-1: the promised batch/export workflow needs an end-to-end test, not another feature.

## Demo and sandbox

The visible **Try it with sample data** action opens `/demo` in one click. The first demo screen already contains the realistic fictional “Orchard Notes 1.7.0” record, package ID, APK size, SDK requirements, CPU, signer evidence, SHA-256, and compatibility reason.

The sticky banner reads “Demo — sample data, nothing is saved” and keeps **Reset demo** and **Start for real** visible at the bottom of the 2,531 px mobile page. Reset reloads the sample. Start for real returns to `/` and removes the demo namespace.

I seeded `real:sentinel=keep` and `sb_license:legacy-app-rescue=keep-license` before entering the demo. Entry and Reset added or replaced only `demo:legacy-app-rescue:opened`; exit removed only the `demo:` key. Both seeded values remained unchanged. The demo request log contained only the product origin.

I also ran the real CLI demo in a new `/tmp/legacy-rescue-demo6.*` directory. It created only `orchard-notes-1.7.apk` and the requested `preservation.json`, reported a compatible sample device, and printed the output path.

## Claims audit

All 35 exact commands from `.factory/claims.json` were run independently after `npm ci` in clean clone `/tmp/legacy-app-rescue-review6.iG7UPx`. Every command exited successfully:

| Claim | Result | Claim | Result |
| --- | --- | --- | --- |
| `manifest-record` | PASS | `compatibility-verdict` | PASS |
| `demo-sandbox` | PASS | `local-private` | PASS |
| `field-kit` | PASS command; inadequate assertion (F-6-1) | `platform-builds` | PASS |
| `mobile-install-guidance` | PASS | `paid-license` | PASS command; inadequate price assertion (F-6-2) |
| `binary-manifest` | PASS | `installer-verified` | PASS |
| `browser-license-cache` | PASS | `browser-license-removal` | PASS |
| `export-refusal-cleanup` | PASS | `safety-boundaries` | PASS |
| `input-scope` | PASS | `device-serial-hash` | PASS |
| `compatibility-limit` | PASS | `merchant-and-refund` | PASS command; narrower than retained copy (F-1-6) |
| `browser-license-storage` | PASS | `release-metadata-privacy` | PASS |
| `apk-transfer-boundary` | PASS | `sample-is-noninstallable` | PASS |
| `unsigned-builds` | PASS | `no-cli-telemetry` | PASS |
| `license-busy-recovery` | PASS | `winget-submission-manifest` | PASS |
| `ci-output` | PASS | `free-tier-limit` | PASS |
| `device-context-record` | PASS | `custom-output-path` | PASS |
| `device-selection` | PASS | `json-output` | PASS |
| `manifest-file-size` | PASS | `export-archive-hash` | PASS |
| `release-asset-set` | PASS |  |  |

The full local gate also passed: 8 Rust tests, TypeScript checking, the production build, and all 52 Playwright tests. The built app is 22.80 kB JavaScript (7.99 kB gzip) and 14.21 kB CSS (3.97 kB gzip). Passing commands do not close F-1-6 or F-6-1 through F-6-4 because the claims contract requires the tagged test to assert the full published outcome.

## Copy audit

Word counts use visible whitespace-separated words; a code token, number, hyphenated term, or URL counts as one word. Commands, package IDs, hashes, and terminal data rows are interface data rather than sentences and are audited under labels/actions. No prose sentence exceeds 22 words and no banned marketing word appears. Flags are linked to findings above.

### Landing page sentences

| # | Sentence | Words | Result |
| ---: | --- | ---: | --- |
| 1 | A field-guide plate shows a fern sheltering an archive box and device cable. | 13 | Useful image alternative |
| 2 | Record your Android app before it disappears | 7 | Clear h1 |
| 3 | For people preserving an old app they own, it records the Android app file (APK) and checks another device. | 19 | Clear audience and result |
| 4 | Open a finished record in separate demo storage. | 8 | Listed demo claim |
| 5 | Runs on macOS, Windows, and Linux. | 6 | Listed platform claim |
| 6 | APK scans stay on your computer. | 6 | Listed privacy claim |
| 7 | One app-file scan is free. | 5 | F-6-7 terminology |
| 8 | Field Kit costs $19 once. | 5 | F-6-2 test gap |
| 9 | The record includes its package name, unique file fingerprint, signer evidence, Android version needs, and device match. | 16 | Listed manifest/device claims |
| 10 | This recording comes from a bundled sample Android app file (APK). | 12 | Listed demo claim |
| 11 | Run the same scan with `rescue demo`. | 7 | Tested demo path |
| 12 | Give the desktop command-line tool (CLI) an Android app file you already own. | 13 | Clear first use |
| 13 | It reads the file in place. | 6 | Listed safety claim |
| 14 | Add `--device` to record the Android version, device types, and installed app list. | 13 | Listed device-record claim |
| 15 | The record lists app version, needed Android version, device types, signing evidence, and device match reasons. | 16 | Listed device-record claim |
| 16 | Legacy App Rescue does not download, crack, patch, or re-sign APKs. | 11 | Listed safety claim |
| 17 | It cannot bypass Android data controls. | 6 | Listed safety claim |
| 18 | Reads only paths you pass. | 5 | Listed input-scope claim |
| 19 | Keeps a shortened fingerprint of the device serial. | 8 | Listed serial claim |
| 20 | Labels compatibility as evidence, not a guarantee. | 7 | Listed limit claim |
| 21 | Exports app data only after Android grants the app's data-access permission (`run-as`). | 12 | Listed refusal claim |
| 22 | Download the Linux build, or use a package manager. | 9 | Clear install guidance |
| 23 | The installer verifies SHA-256 before placing `rescue` on your PATH. | 10 | Listed installer claim |
| 24 | The free command scans one app file and checks one device. | 11 | Listed free-tier claim |
| 25 | Field Kit adds batch scans and permitted app-data export. | 9 | F-6-1 test gap |
| 26 | Sociobot handles checkout. | 3 | Listed checkout claim |
| 27 | A refunded license stops Field Kit. | 6 | Listed revoked-license claim |
| 28 | Stored only in this browser. | 5 | Listed storage claim |
| 29 | Remove it here at any time. | 6 | Listed removal claim |
| 30 | Legacy App Rescue records Android app evidence on your computer. | 10 | Listed manifest/privacy claims |

### Landing headings, labels, and actions

| Copy | Words | Result |
| --- | ---: | --- |
| Legacy App Rescue | 3 | Product name |
| Demo / Install / Privacy | 1 each | Clear navigation |
| Try it with sample data | 5 | Result-naming action |
| See what the preservation record contains | 6 | Clear section heading |
| Sample preservation record | 3 | Clear label |
| Orchard Notes · sample | 3 | Clear sample label |
| Pause / Replay | 1 each | Result-naming controls |
| Package / SHA-256 / SDK range / Device match | 1 / 1 / 2 / 2 | Appropriate result labels after the plain-language introduction |
| Create a preservation record (manifest) | 5 | Clear section heading |
| Point to your Android app file | 6 | Clear step heading |
| Connect the target device | 4 | Clear step heading |
| Keep the record beside the app file | 7 | Clear step heading |
| What the tool does not change | 6 | Clear boundary heading |
| Install Legacy App Rescue | 4 | Clear section heading |
| Download for Linux / Open desktop downloads / Copy command | 3 / 3 / 2 | Result-naming actions |
| Apple silicon / Intel Mac | 2 / 2 | F-6-6 |
| Other install choices | 3 | Clear disclosure label |
| For more than one app | 5 | Useful tier qualifier |
| Scan more app files at once | 6 | Clear paid-section heading |
| Buy Field Kit for $19 / Restore a license | 5 / 3 | Result-naming actions |
| Paste a license from your receipt | 6 | Clear field label |
| Verify license / Remove stored license | 2 / 3 | Result-naming actions |
| Privacy / Terms / Built by Param Factory | 1 / 1 / 4 | Clear footer links |

### README sentences and instructional fragments

| # | Copy | Words | Result |
| ---: | --- | ---: | --- |
| 1 | Record an Android app before its device disappears. | 8 | Pass |
| 2 | Legacy App Rescue is a local desktop command-line tool (CLI) for people preserving Android app files (APKs) they lawfully own. | 20 | Pass |
| 3 | It writes a preservation record with app details, signing evidence, Android version needs, device types, and a device match. | 19 | Listed claims |
| 4 | It never downloads or uploads an APK. | 7 | Listed transfer claim |
| 5 | Live site: [URL]. | 3 | Pass |
| 6 | The demo creates a fictional Android app file (APK) in a temporary folder. | 13 | Listed demo claim |
| 7 | It scans the app file, matches a sample Android 13 device, and prints the preservation record path. | 17 | Listed demo claim |
| 8 | Open the website sandbox at [URL]. | 6 | Clear instruction |
| 9 | Its browser storage uses the `demo:legacy-app-rescue:` prefix. | 7 | Listed demo claim |
| 10 | The sample source is in `examples/sample-apk`. | 6 | Pass |
| 11 | It has a preservation manifest, but no DEX executable. | 9 | Listed sample claim |
| 12 | The script downloads the matching archive, verifies SHA-256, and places `rescue` in `~/.local/bin`. | 13 | Listed installer claim |
| 13 | The macOS package is unsigned. | 5 | Listed unsigned-build claim |
| 14 | Right-click the downloaded package, then choose Open. | 7 | Clear instruction |
| 15 | The Windows build is unsigned. | 5 | Listed unsigned-build claim |
| 16 | Release assets include Linux `.deb` and `.rpm` packages, macOS `.pkg` files, a Windows portable ZIP, `SHA256SUMS`, and `latest.json`. | 18 | Listed release claim |
| 17 | The checked v0.1.3 manifest is `winget/B-Divyesh.LegacyAppRescue.yaml`. | 6 | Listed winget claim |
| 18 | Submit it to `microsoft/winget-pkgs` after checking the release. | 8 | Clear instruction |
| 19 | It is not a public winget source until Microsoft accepts it. | 11 | Clear limitation |
| 20 | Scan one Android app file (APK) for free. | 9 | Listed free-tier claim |
| 21 | Choose another preservation record (manifest) path. | 6 | Listed output claim |
| 22 | Connect one authorized Android device and check compatibility. | 8 | Listed compatibility claim |
| 23 | If several devices are attached, select one. | 7 | Listed selection claim |
| 24 | Print JSON for scripts. | 4 | Listed JSON claim |
| 25 | `--ci` removes decorative output. | 4 | Listed CI claim |
| 26 | Whole-file fingerprint (SHA-256) and file size | 6 | Listed record-field claim |
| 27 | Package name and version | 4 | Listed manifest claim |
| 28 | Minimum, target, and maximum Android API levels | 7 | Listed manifest claim |
| 29 | Supported device-type folders | 3 | Listed manifest claim |
| 30 | Signing certificate fingerprints when present | 5 | Listed manifest claim |
| 31 | A shortened fingerprint of the device serial | 7 | Listed serial claim |
| 32 | Device model, Android version, device types, and installed app names | 9 | Listed device-record claim |
| 33 | Device match results with reasons | 5 | Listed device-record claim |
| 34 | Exported data archive hashes | 4 | Listed export-hash claim |
| 35 | A device match checks declared Android-version and device-type needs. | 9 | Listed compatibility claim |
| 36 | It does not promise that licensing, remote services, or old graphics code work. | 13 | Listed compatibility limit |
| 37 | The free command scans one app file and checks one device. | 11 | Listed free-tier claim |
| 38 | Field Kit adds batch scans and app-data export when Android grants `run-as` permission. | 13 | F-6-1 test gap |
| 39 | Buy at [checkout URL]. | 3 | Clear action |
| 40 | Sociobot is the merchant of record. | 6 | F-1-6 |
| 41 | Activate the token from the receipt. | 6 | Clear instruction |
| 42 | Then scan a set. | 4 | Clear instruction |
| 43 | Export data for a package present in the scanned APK set. | 11 | F-6-1 test gap |
| 44 | Android must grant that app's own data-access permission (`adb run-as`). | 9 | Listed refusal claim |
| 45 | Legacy App Rescue stops on refusal and does not try root. | 11 | Listed refusal claim |
| 46 | Legacy App Rescue does not distribute APKs, remove DRM, crack apps, or re-sign third-party software. | 15 | Listed safety claim |
| 47 | Use it only with files and data you may lawfully access. | 11 | Clear limitation |
| 48 | Plain XML and Android binary XML manifests are supported. | 9 | Listed binary-manifest claim |
| 49 | The tool still records the whole-file fingerprint when signer parsing is unavailable. | 12 | F-6-3 |
| 50 | Requirements: Rust stable, Node 22 or newer, and npm. | 9 | Pass |
| 51 | The site output is exactly `dist/site/`. | 6 | Confirmed by build |
| 52 | The release workflow builds platform binaries on GitHub Actions. | 9 | Listed platform claim |
| 53 | The factory deploys this product as a static site. | 9 | Repository operation |
| 54 | Build the deployment directory with the following commands. | 8 | Clear instruction |
| 55 | Deploy `dist/site/` through the factory work-order configuration. | 7 | Clear instruction |
| 56 | Do not add DNS, billing, or deployment secrets to this repository. | 11 | Clear safety instruction |
| 57 | `npm run verify:billing` is a live release check. | 8 | Pass |
| 58 | It confirms the Sociobot checkout returns a `303` to a hosted Dodo session and that a successful redirect has no `Retry-After` header. | 22 | At cap; verified by named command |
| 59 | It also checks that the verification service enforces its documented rate limit. | 12 | Verified by named command |
| 60 | `npm run verify:package-managers` is a live release check. | 8 | Pass |
| 61 | It checks public Homebrew and Scoop checksums against the current GitHub Release. | 12 | Verified by named command |
| 62 | It also checks the repository manifests. | 6 | Verified by named command |
| 63 | Public claims live in `.factory/claims.json`. | 6 | Pass |
| 64 | For example. | 2 | Introductory fragment; clear in context |
| 65 | The desktop command-line tool (CLI) has no telemetry. | 8 | Listed telemetry claim |
| 66 | App-file scanning and the bundled demo need no network. | 9 | F-6-7 terminology; listed telemetry claim |
| 67 | License activation uses the Sociobot license service. | 7 | Listed license claim |
| 68 | The website verifies a stored license at most once a day. | 11 | Listed cache claim |
| 69 | If the license service is busy, it asks you to try again shortly. | 13 | Listed recovery claim |
| 70 | The source is available under the MIT License. | 8 | Confirmed by `LICENSE` |
| 71 | See the site privacy page and terms. | 7 | Clear links |

README headings are descriptive except **Try the complete demo** (F-6-5). The remaining headings — Install, Linux and macOS, Windows PowerShell, Homebrew, Scoop, winget manifest, Use the desktop command-line tool (CLI), What the preservation record contains, Field Kit — $19 once, Limits and safety, Build from source, Deploy the static site, Test individual promises, and Privacy and license — identify their sections without metaphor.

The audited prose averages below 14 words. F-6-5 is the only marketing-adjective flag; F-6-7 is the terminology flag; F-6-6 is the only non-result-naming button flag.

## Earlier findings rechecked on live and in code

Every earlier finding was checked against the matching live branch and source/test implementation. “Fixed” below means the exact copy or behavior was observed, not merely marked complete in a polish report.

| Earlier ID | Round-6 result and evidence |
| --- | --- |
| F-1-1 | Fixed — no-alteration copy remains; byte comparison passes in `@claim:safety-boundaries`. |
| F-1-2 | Fixed — no-bypass copy remains; refused fake ADB leaves no archive and uses no root. |
| F-1-3 | Fixed — passed-path-only copy and sentinel-file test pass. |
| F-1-4 | Fixed — live shortened-fingerprint wording and exact 16-character hash test pass. |
| F-1-5 | Fixed — live evidence-not-guarantee copy and record/Terms assertions pass. |
| F-1-6 | **Regressed — reopened above.** The stronger merchant-of-record sentence remains in README and Terms without matching proof. |
| F-1-7 | Fixed — named browser storage, URL stripping, cookie absence, and Sociobot-only token request pass. |
| F-1-8 | Fixed — blocked-proxy scan succeeds and leaves APK bytes unchanged. |
| F-1-9 | Fixed — the built sample ZIP contains no DEX entry. |
| F-1-10 | Fixed — release workflow and downloaded Windows/macOS artifacts are checked as unsigned. |
| F-1-11 | Fixed — the unsupported ZIP64 promise remains absent. |
| F-1-12 | Fixed — demo and scan succeed with unusable HTTP proxies. |
| F-1-13 | Fixed — activation copy names the Sociobot service and token requests are constrained to its origin. |
| F-1-14 | Fixed — mocked 429 exposes a specific retry step. |
| F-1-15 | Fixed — speculative Windows first-run prediction remains absent. |
| F-1-16 | Fixed — current winget fields and checksum are validated. |
| F-1-17 | Fixed — guidance is short and does not claim the manifest is already published. |
| F-1-18 | Fixed — `--ci` removes decoration while preserving results. |
| F-1-19 | Fixed — heading remains “Create a preservation record (manifest)”. |
| F-1-20 | Fixed — heading remains “What the tool does not change”. |
| F-1-21 | Fixed — heading remains “Install Legacy App Rescue”. |
| F-1-22 | Fixed — action remains “Restore a license”. |
| F-1-23 | Fixed — winget explanation is split and stays below 22 words. |
| F-1-24 | Fixed — package-manager verifier explanation is split and stays below 22 words. |
| F-2-1 | Fixed — Android/iOS visitors see a desktop-download action and no unusable installer command. |
| F-2-2 | Fixed — “Android app file (APK)” appears before APK shorthand. F-6-7 is a separate consistency issue. |
| F-2-3 | Fixed — “preservation record (manifest)” appears before manifest shorthand. |
| F-2-4 | Fixed — “desktop command-line tool (CLI)” appears before CLI shorthand. |
| F-2-5 | Fixed — preview copy names the actual record contents. |
| F-2-6 | Fixed — primary prose uses “file fingerprint”; raw SHA-256 remains only in technical result labels. |
| F-2-7 | Fixed — the result explanation uses Android-version, device-type, and match language. |
| F-2-8 | Fixed — `run-as` is explained as the app’s own Android data-access permission. |
| F-3-1 | Fixed — banner and both controls remain visible and operable after scrolling to the mobile page end. |
| F-3-2 | Fixed — “A local preservation tool” remains absent. |
| F-3-3 | Fixed — “PLATE / 017” remains absent. |
| F-4-1 | Fixed — one-file/one-device free behavior and unlicensed batch refusal pass. |
| F-4-2 | Fixed — selected device version, types, installed apps, and reasons are asserted in the record. |
| F-4-3 | Fixed — `--output` writes only to the requested path. |
| F-4-4 | Fixed — two-device ambiguity is refused and `--serial` inspects only the selected device. |
| F-4-5 | Fixed — `--json` produces parseable undecorated JSON. |
| F-4-6 | Fixed — file size and permitted export archive hash are asserted. |
| F-4-7 | Fixed — the v0.1.3 release fixture and workflow contain every advertised asset. |
| F-4-8 | Fixed — activating the real HTTP-404 home action focuses the landing h1. |
| F-4-9 | Fixed — the four duplicate landing eyebrow labels remain absent. |
| F-4-10 | Fixed — the real 404 has canonical, Open Graph, Twitter, favicon, and Apple-touch metadata. |

## Structure, routing, accessibility, and presentation

- `/`, `/?demo=1`, `/demo`, `/privacy`, and `/terms` return 200. A missing route returns a designed HTTP 404.
- Titles follow the required pattern: “Legacy App Rescue — record an Android app,” “Demo — Legacy App Rescue,” “Privacy — Legacy App Rescue,” “Terms — Legacy App Rescue,” and “Page not found — Legacy App Rescue.”
- Each route has `lang="en"`, one h1, one main landmark, ordered headings, description, canonical, Open Graph/Twitter metadata, favicon, and Apple-touch icon. `robots.txt` and `sitemap.xml` return 200 and list all real routes.
- Direct deep links load. SPA back/forward tests pass. Route changes focus the h1 and update the polite announcer. The separate 404 return action also focuses the landing h1.
- The crawled actionable links returned 200 or expected redirects: checkout 303 to hosted Dodo, release asset 302 to GitHub storage, and internal pages 200. `mailto:` links were excluded. The 404 page’s own fragment link retains the expected 404 document.
- No console/page errors occurred on product routes. Axe reported no serious or critical violations. At 390 px there is no horizontal overflow and all interactive targets are at least 44 px. Focus rings and reduced-motion rules are present.
- Security headers include CSP, `frame-ancestors 'none'`, HSTS, `nosniff`, referrer policy, and permissions policy. The demo request log was same-origin only.
- `npm run build` produces `dist/site/`. Local and live `index.html` and the hashed JavaScript asset have identical SHA-256 values.
- The botanical field-guide layout, paper/moss/oxide palette, specimen labels, original fern artwork, serif/hyperlegible type pairing, and stamped results match `.factory/design.md`. It is not a centered generic SaaS hero or three-card template.

## What would make this perfect

Close every finding above: replace or prove the merchant statement, test a successful paid batch/export flow, assert the actual one-time checkout price, register the signer-failure and version-entitlement promises, remove “complete,” make both macOS download actions result-naming, and standardize “APK” after first use. Then rerun all claim commands and this entire cold live review from a fresh clone and browser context. Nothing else is required by this review.
