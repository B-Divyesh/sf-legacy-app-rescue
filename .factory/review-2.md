# Adversarial first-read review 2 — FAIL

**Product:** Legacy App Rescue  
**Reviewed:** 2026-08-29 UTC  
**Live URL:** <https://legacy-app-rescue.sociobot.in>

## Verdict

**FAIL.** The cold first-screen and sample-demo gates pass, and all 26 listed claims pass. The live mobile page makes a result visitors can rely on without a corresponding claims entry and observable claim test. It also expects a non-specialist owner of an old app to know several unexpanded technical terms. A PASS requires zero findings.

## First 30 seconds

At fresh 390 × 844 and 1440 × 900 browser contexts, before scrolling, I read this as a desktop tool that makes a record of an old Android app and checks it against another Android device. It is for a person preserving an app they own. The first action is **Try it with sample data**.

This gate passes. The first screen says “Record your Android app before it disappears”, “For people preserving an old app they own, it records the APK and checks whether another Android device matches.”, and “Try it with sample data”. The adjacent explanation says “Open a finished record in separate demo storage.” There was no horizontal overflow or product console error on either landing-page viewport.

## Findings

### Blocking

| ID | Exact quote and location | Why this fails | Concrete fix |
| --- | --- | --- | --- |
| F-2-1 | “No mobile build is available.” — landing **Install** section at 390 px | This device/platform availability claim appears only in the mobile runtime branch. `platform-builds` says only “Runs on macOS, Windows, and Linux” and its test inspects the release matrix. It neither declares nor proves Android/iOS builds are absent. A phone visitor must be able to rely on it. | Add `mobile-build-availability` and a `@claim:mobile-build-availability` mobile-browser test that asserts desktop-only guidance and no mobile asset; or remove the categorical sentence and say “Use the desktop downloads”. |

### Minor

| ID | Exact quote and location | Why a cold visitor is lost | Concrete rewrite |
| --- | --- | --- | --- |
| F-2-2 | “...it records the **APK**...” — landing lede; repeated in README | The core input is named before it is explained. Someone preserving an old Android app may know the app, but not its installation-file term. | “...it records the Android app file (APK) and checks whether another Android device matches.” Use “APK” thereafter. |
| F-2-3 | “Create a preservation **manifest**” — landing heading; repeated in README | “Manifest” is the product’s central output but is not plain language on first use. | “Create a preservation record (manifest)”. Then use “manifest” as the short form. |
| F-2-4 | “Give the **CLI** a file you already own.” — landing step 1; “local CLI” — README | The product requires a command-line tool, but neither first use expands the acronym or says where the command is run. | “Give the desktop command-line tool (CLI) an Android app file you already own.” |
| F-2-5 | “Package names are only the start.” — landing, **See what the manifest records** | This is a contrast slogan. It does not say what the record contains and carries no information a visitor can act on. | “The record includes the package name, file fingerprint, signer evidence, Android version needs, and device match.” |
| F-2-6 | “The record ties each fact to the exact APK **hash**.” — landing preview | “Hash” is unexplained security jargon at the point the visitor is asked to understand the result. | “The record gives the APK a unique file fingerprint, so you can identify the exact file later.” |
| F-2-7 | “The JSON file records hashes, signers, SDK needs, native CPUs, and compatibility reasons.” — landing step 3; similar README list | This stacks six unexplained technical terms. The intended person cannot tell which useful result they receive. | “The record lists the app version, Android version it needs, supported device types, signing evidence, and why the device does or does not match.” Put JSON, SDK, CPU, and certificate detail in expandable technical details. |
| F-2-8 | “Exports data only when Android permits **run-as**.” — landing boundaries | The limitation is important but the command name does not explain what the visitor can expect. | “Exports an app’s data only when Android grants that app’s own data-access permission (`run-as`).” |

No AI or product-capability finding is raised. The brief calls for a local APK inventory and preservation record; an AI feature, syncing, or uploading would not be an obvious or privacy-compatible missing step.

## Demo and sandbox check

The one-click demo passes. From a fresh 390 px context, **Try it with sample data** opened `/?demo=1`. Its first product view already showed **Orchard Notes 1.7.0**, its APK fingerprint, Android version needs, native CPU, signer evidence, and a compatible result. The persistent banner read “Demo — sample data, nothing is saved” and provided **Reset demo** and **Start for real**.

The direct demo made only same-origin requests. It added only `demo:legacy-app-rescue:opened` alongside a pre-seeded `real:sentinel`, leaving the sentinel unchanged. Reset restored the demo key and left the sentinel unchanged. Start for real removed the `demo:` key before returning home. The CLI demo was also run from a new temporary working directory; it created and printed a system-temporary manifest path and reported that nothing was saved to normal records.

## Claims gate

I ran every command in `.factory/claims.json` independently after `npm ci`. All passed:

| Claim ID | Result |
| --- | --- |
| manifest-record | PASS |
| compatibility-verdict | PASS |
| demo-sandbox | PASS |
| local-private | PASS |
| field-kit | PASS |
| platform-builds | PASS |
| paid-license | PASS |
| binary-manifest | PASS |
| installer-verified | PASS |
| browser-license-cache | PASS |
| browser-license-removal | PASS |
| export-refusal-cleanup | PASS |
| safety-boundaries | PASS |
| input-scope | PASS |
| device-serial-hash | PASS |
| compatibility-limit | PASS |
| merchant-and-refund | PASS |
| browser-license-storage | PASS |
| release-metadata-privacy | PASS |
| apk-transfer-boundary | PASS |
| sample-is-noninstallable | PASS |
| unsigned-builds | PASS |
| no-cli-telemetry | PASS |
| license-busy-recovery | PASS |
| winget-submission-manifest | PASS |
| ci-output | PASS |

`npm test` passed: 8 Rust tests and 42 Playwright tests. `npm run build` passed and produced `dist/site/`. The unlisted claim in F-2-1 is the only claims-registry gap found in the live landing experience.

## Copy audit

The tables inventory visible natural-language landing and README copy. Code blocks, hashes, package identifiers, and URLs used solely as code are excluded. Headings and actions are included because the plain-words contract applies to them. No listed prose sentence exceeds 22 words. `F-2-*` marks the jargon or information failures above.

### Landing page

| # | Copy | Words | Result |
| ---: | --- | ---: | --- |
| 1 | A local preservation tool | 4 | Pass |
| 2 | Record your Android app before it disappears | 7 | Pass |
| 3 | For people preserving an old app they own, it records the APK and checks whether another Android device matches. | 19 | F-2-2 |
| 4 | Try it with sample data | 5 | Pass |
| 5 | Open a finished record in separate demo storage. | 8 | Pass |
| 6 | Runs on macOS, Windows, and Linux. | 6 | Claim: platform-builds |
| 7 | APK scans stay on your computer. | 6 | F-2-2; claim: local-private |
| 8 | One APK is free. | 5 | Claim: field-kit |
| 9 | Field Kit costs $19 once. | 5 | Claim: paid-license |
| 10 | See what the manifest records | 5 | F-2-3 |
| 11 | Package names are only the start. | 6 | F-2-5 |
| 12 | The record ties each fact to the exact APK hash. | 10 | F-2-2, F-2-6 |
| 13 | Sample preservation record | 3 | Pass |
| 14 | This recording comes from the bundled sample APK. | 8 | F-2-2; claim: demo-sandbox |
| 15 | Run the same scan with rescue demo. | 7 | Pass |
| 16 | Three steps | 2 | Pass |
| 17 | Create a preservation manifest | 4 | F-2-3 |
| 18 | Point to your APK | 4 | F-2-2 |
| 19 | Give the CLI a file you already own. | 9 | F-2-4 |
| 20 | It reads the archive in place. | 6 | Pass |
| 21 | Connect the target device | 4 | Pass |
| 22 | Add --device to record Android, CPU, and installed user packages. | 10 | F-2-7 |
| 23 | Keep the manifest beside the APK | 6 | F-2-2, F-2-3 |
| 24 | The JSON file records hashes, signers, SDK needs, native CPUs, and compatibility reasons. | 13 | F-2-7 |
| 25 | What the tool does not change | 6 | Pass |
| 26 | Legacy App Rescue does not download, crack, patch, or re-sign APKs. | 11 | Claim: safety-boundaries |
| 27 | It cannot bypass Android data controls. | 6 | Claim: safety-boundaries |
| 28 | Reads only paths you pass. | 5 | Claim: input-scope |
| 29 | Stores the device serial as a short hash. | 8 | F-2-6; claim: device-serial-hash |
| 30 | Labels compatibility as evidence, not a guarantee. | 7 | Claim: compatibility-limit |
| 31 | Exports data only when Android permits run-as. | 7 | F-2-8; claim: export-refusal-cleanup |
| 32 | Install Legacy App Rescue | 4 | Pass |
| 33 | Download the Linux build, or use a package manager. | 9 | Pass |
| 34 | The installer verifies SHA-256 before placing rescue on your PATH. | 10 | Claim: installer-verified |
| 35 | Other install choices | 3 | Pass |
| 36 | Scan more APKs at once | 5 | F-2-2 |
| 37 | The free command scans one APK and checks one device. | 10 | F-2-2; claim: field-kit |
| 38 | Field Kit adds batch scans and permitted app-data export. | 9 | Claim: field-kit |
| 39 | Buy Field Kit for $19 | 5 | Pass |
| 40 | Restore a license | 3 | Pass |
| 41 | Sociobot handles checkout. | 3 | Claim: merchant-and-refund |
| 42 | A refunded license stops Field Kit. | 6 | Claim: merchant-and-refund |
| 43 | Paste a license from your receipt | 6 | Pass |
| 44 | Verify license | 2 | Pass |
| 45 | Remove stored license | 3 | Pass |
| 46 | Stored only in this browser. | 5 | Claim: browser-license-storage |
| 47 | Remove it here at any time. | 6 | Claim: browser-license-removal |
| 48 | Legacy App Rescue records Android app evidence on your computer. | 10 | Claim: manifest-record |
| 49 | Legacy App Rescue is a desktop CLI. | 7 | F-2-1, F-2-4; mobile runtime |
| 50 | Use macOS, Windows, or Linux to install it. | 8 | F-2-1; mobile runtime |
| 51 | No mobile build is available. | 5 | F-2-1; mobile runtime |

### README

| # | Sentence | Words | Result |
| ---: | --- | ---: | --- |
| 1 | Record an Android app before its device disappears. | 8 | Pass |
| 2 | Legacy App Rescue is a local CLI for people preserving APKs they lawfully own. | 14 | F-2-2, F-2-4 |
| 3 | It writes a JSON record of each APK, its signer evidence, SDK needs, native CPUs, and device compatibility. | 18 | F-2-2, F-2-7 |
| 4 | It never downloads or uploads an APK. | 7 | F-2-2; claim: apk-transfer-boundary |
| 5 | The demo creates a fictional APK in a temporary folder. | 9 | F-2-2; claim: demo-sandbox |
| 6 | It scans the APK, matches a sample Android 13 device, and prints the manifest path. | 13 | F-2-2, F-2-3; claim: demo-sandbox |
| 7 | Open the website sandbox at <https://legacy-app-rescue.sociobot.in/?demo=1>. | 7 | Pass |
| 8 | Its browser storage uses the `demo:legacy-app-rescue:` prefix. | 5 | Claim: demo-sandbox |
| 9 | The sample source is in [`examples/sample-apk`](examples/sample-apk). | 9 | Pass |
| 10 | It has a manifest, but no DEX executable. | 7 | F-2-3; claim: sample-is-noninstallable |
| 11 | The script downloads the matching archive, verifies SHA-256, and places `rescue` in `~/.local/bin`. | 14 | Claim: installer-verified |
| 12 | The macOS package is unsigned. | 5 | Claim: unsigned-builds |
| 13 | Right-click the downloaded package, then choose Open. | 7 | Pass |
| 14 | The Windows build is unsigned. | 5 | Claim: unsigned-builds |
| 15 | Release assets include Linux `.deb` and `.rpm` packages, macOS `.pkg` files, a Windows portable ZIP, `SHA256SUMS`, and `latest.json`. | 18 | Pass |
| 16 | The checked v0.1.3 manifest is [`winget/B-Divyesh.LegacyAppRescue.yaml`](winget/B-Divyesh.LegacyAppRescue.yaml). | 9 | F-2-3; claim: winget-submission-manifest |
| 17 | Submit it to `microsoft/winget-pkgs` after checking the release. | 8 | Claim: winget-submission-manifest |
| 18 | It is not a public winget source until Microsoft accepts it. | 11 | Claim: winget-submission-manifest |
| 19 | `--ci` removes decorative output. | 5 | Claim: ci-output |
| 20 | A compatibility verdict covers declared SDK and CPU needs. | 9 | F-2-7; claim: compatibility-verdict |
| 21 | It does not promise that licensing, remote services, or old graphics code will still work. | 15 | Claim: compatibility-limit |
| 22 | The free command scans one APK and checks one device. | 10 | F-2-2; claim: field-kit |
| 23 | Field Kit adds batch scans and app-data export when Android permits `run-as`. | 12 | F-2-8; claim: field-kit |
| 24 | Sociobot is the merchant of record. | 6 | Claim: merchant-and-refund |
| 25 | Android must allow `adb run-as` for that app. | 9 | F-2-8; claim: export-refusal-cleanup |
| 26 | Legacy App Rescue stops on refusal and does not try root. | 11 | Claim: export-refusal-cleanup |
| 27 | Legacy App Rescue does not distribute APKs, remove DRM, crack apps, or re-sign third-party software. | 15 | F-2-2; claim: safety-boundaries |
| 28 | Use it only with files and data you may lawfully access. | 11 | Pass |
| 29 | Plain XML and Android binary XML manifests are supported. | 9 | F-2-3; claim: binary-manifest |
| 30 | The tool still records the whole-file hash when signer parsing is unavailable. | 11 | F-2-6; claim: manifest-record |
| 31 | The site output is exactly `dist/site/`. | 6 | Pass |
| 32 | The release workflow builds platform binaries on GitHub Actions. | 9 | Claim: platform-builds |
| 33 | `npm run verify:billing` is a live release check. | 7 | Pass |
| 34 | It confirms the Sociobot checkout returns a `303` to a hosted Dodo session and that a successful redirect has no `Retry-After` header. | 22 | Pass |
| 35 | It also checks that the verification service enforces its documented rate limit. | 12 | Pass |
| 36 | `npm run verify:package-managers` is a live release check. | 7 | Pass |
| 37 | It checks public Homebrew and Scoop checksums against the current GitHub Release. | 12 | Pass |
| 38 | It also checks the repository manifests. | 6 | F-2-3 |
| 39 | Public claims live in `.factory/claims.json`. | 5 | Pass |
| 40 | The CLI has no telemetry. | 5 | F-2-4; claim: no-cli-telemetry |
| 41 | APK scanning and the bundled demo need no network. | 9 | F-2-2; claim: no-cli-telemetry |
| 42 | License activation uses the Sociobot license service. | 7 | Claim: paid-license |
| 43 | The website verifies a stored license at most once a day. | 11 | Claim: browser-license-cache |
| 44 | If the license service is busy, it asks you to try again shortly. | 13 | Claim: license-busy-recovery |
| 45 | The source is available under the MIT License. | 9 | Pass |
| 46 | See the site privacy page and terms. | 7 | Pass |

### README heading and action audit

| Copy | Result |
| --- | --- |
| Legacy App Rescue | Product name; Pass |
| Try the complete demo | Names the section; Pass |
| Install / Linux and macOS / Windows PowerShell / Homebrew / Scoop / winget manifest | Names install choices; Pass |
| Use the CLI | F-2-4: expand the term on first use as “Use the desktop command-line tool (CLI)”. |
| What the manifest records | F-2-3: “What the preservation record contains”. |
| Field Kit — $19 once | Names the paid section and price; Pass |
| Limits and safety / Build from source / Test individual promises / Privacy and license | Names the sections; Pass |

## Earlier-review verification

I read every available earlier review, polish record, verification record, and handoff. The only earlier adversarial review is `review-1.md`; its assertions were checked against the current live page and source rather than accepted from the polish note.

| Earlier finding IDs | Current verification |
| --- | --- |
| F-1-1 through F-1-18 | Fixed. The claimed safety, input scope, serial hash, compatibility limit, merchant/refund, browser storage, transfer boundary, sample, unsigned-build, no-telemetry, busy recovery, winget, and CI behavior now each have `claims.json` entries and passed their tagged tests above. The ZIP64 and Windows-prompt wording is absent. |
| F-1-19 through F-1-22 | Fixed on the live landing: “Create a preservation manifest”, “What the tool does not change”, “Install Legacy App Rescue”, and “Restore a license” are present. |
| F-1-23 through F-1-24 | Fixed in README. The winget guidance and package-manager verification explanation are split; neither sentence exceeds 22 words. |

None of the F-1 findings is repeated with its original ID. The new F-2 findings are independent of that repair work.

## Structure, privacy, and routing checks

`/`, `/?demo=1`, `/demo`, `/privacy`, and `/terms` returned 200. Each has the expected route title, one `h1`, one `main`, description, canonical, Open Graph image, `lang="en"`, favicon, consistent header/footer, Privacy and Terms links, and no serious or critical Axe result. `robots.txt` and `sitemap.xml` returned 200. The live CSP includes only the required same-origin, GitHub API, and Sociobot API sources. Back navigation restored the landing title and moved focus to its `h1`; navigation to Privacy did the same. All crawled internal links, install scripts, GitHub release page, Sociobot home, and checkout target returned expected successful responses (checkout: 303 to Dodo).

The unknown route returned HTTP 404 with a designed field-guide page and a home action. Chromium reports its expected network diagnostic for an HTTP-404 main document; the application emitted no JavaScript exception. The warm-paper, field-guide, fern, and specimen-label identity is distinct from a generic SaaS template and matches `.factory/design.md`.

## What would make this perfect

1. Either test and register the mobile-build availability statement or remove the categorical claim.
2. Expand the first use of APK, CLI, and manifest, and replace the technical evidence summary with plain Android-version/device-match language plus optional technical details.
3. Replace the empty “Package names are only the start.” line with the useful contents of the preservation record.
