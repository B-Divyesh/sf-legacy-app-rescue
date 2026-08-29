# Adversarial first-read review 1 — FAIL

**Product:** Legacy App Rescue  
**Reviewed:** 2026-08-29 UTC  
**Live URL:** <https://legacy-app-rescue.sociobot.in>  
**Verdict:** **FAIL** — the product is clear and tryable, but it makes unlisted, untested visitor-facing promises. The supplied claims contract makes each such promise a blocking finding.

## First 30 seconds

At 390 × 844 and 1440 × 900, before scrolling, I understood the product as: a desktop command-line tool that records technical evidence about an old Android app and compares it with another Android device. It is for someone preserving an app they own. The first click is **Try it with sample data**.

The first screen provides all three answers. It says: “Record your Android app before it disappears”; “For people preserving an old app they own, this tool records its needs and checks another device”; and “Try it with sample data.” This gate passes on both viewports; there was no horizontal overflow or browser console error.

## Findings

### Blocking — claims registry is incomplete

The `claims.json` entries cover the advertised record, compatibility, demo, local scanning, Field Kit, platform, licence, binary-manifest, installer, cache, removal, and refusal-cleanup promises. They do **not** cover the following explicit promises. A sentence cannot remain as a visitor-facing claim without an observable tagged test.

| ID | Exact quote and location | Why this fails the claims contract | Concrete fix |
| --- | --- | --- | --- |
| F-1-1 | “Legacy App Rescue does not download, crack, patch, or re-sign APKs.” — landing, **Preserve evidence without changing the app** | This is a safety promise on which a preservation user can rely; no claim entry tests it. | Add a `safety-boundaries` claim and an integration test proving the CLI never writes/changes the supplied APK and has no download path, or remove the promise. |
| F-1-2 | “It cannot bypass Android data controls.” — landing, **Preserve evidence without changing the app** | A concrete limitation needs a test, especially next to the paid export. | Add the same `safety-boundaries` claim with a fake refused ADB device and assert that no root/bypass command is called, or remove this sentence. |
| F-1-3 | “Reads only paths you pass.” — landing, boundaries list | This is a scope/privacy claim, not covered by the current outgoing-request test. | Add `input-scope` with a temporary directory containing an unpassed sentinel file; assert no access to it, or say only what the existing test proves. |
| F-1-4 | “Stores the device serial as a short hash.” — landing, boundaries list | This makes a specific privacy guarantee; neither the exact output nor length is a declared claim. | Add `device-serial-hash` and assert the record contains a non-reversible 16-character hash rather than the source serial. |
| F-1-5 | “Labels compatibility as evidence, not a guarantee.” — landing, boundaries list | This is a meaningful interpretation limitation but has no tested public claim. | Add `compatibility-limit` and assert the emitted verdict/README uses evidence language, or replace it with the already tested compatibility claim. |
| F-1-6 | “Sociobot is the merchant of record. A refund turns off the license.” — landing, Field Kit fine print | Merchant and refund behaviour are purchase terms, not covered by `paid-license`. | Add separate `merchant-and-refund` coverage against an approved billing fixture, or remove the refund sentence and link to the hosted checkout terms. |
| F-1-7 | “The token stays in this browser.” — landing, licence status | This is a browser-storage/privacy promise. `browser-license-removal` proves deletion but not this storage boundary. | Add `browser-license-storage` that records requests and asserts the token is only in the named localStorage key and is sent only to Sociobot, or rewrite to name the tested behaviour. |
| F-1-8 | “It never downloads or uploads an APK.” — README, introduction | This is stronger than the declared “APK scans stay on your computer” wording and lacks a dedicated end-to-end assertion. | Add `apk-transfer-boundary` with request logging and a scan under blocked HTTP(S) proxies, or remove “downloads or”. |
| F-1-9 | “It contains no installable app code.” — README, sample source | The bundled sample is a factual safety claim with no asserted fixture check. | Add `sample-is-noninstallable` that checks the sample has no classes/DEX and cannot be installed, or remove the claim. |
| F-1-10 | “The macOS package is unsigned.” / “The Windows build is unsigned.” — README, install instructions | Packaging/security status is a user decision and neither statement is in the registry. | Add `unsigned-builds` by inspecting the release artifacts in CI, or replace these with a link to release verification details that is itself tested. |
| F-1-11 | “ZIP64 APK Signing Blocks are not read in version 0.1.” — README, limits | This is an implementation-limit promise without a fixture or claim. | Add `zip64-signing-limit` with a ZIP64 signing-block fixture, or remove the version-specific statement. |
| F-1-12 | “The CLI has no telemetry.” — README, Privacy and license | A privacy claim needs request/process evidence; it has no claim entry. | Add `no-cli-telemetry` that runs scan, demo, and license-free commands behind unreachable HTTP(S) proxies and records no network attempt, or remove it. |
| F-1-13 | “License activation contacts only `api.sociobot.in`.” — README, Privacy and license | This names a data destination and needs a request-log test of the activation flow. | Add `license-destination` with an intercepted activation request and assert its sole origin, or remove it. |
| F-1-14 | “If the license service is busy, it asks you to try again shortly.” — README, Privacy and license | This describes an error-recovery result, but no listed claim tests the live UI outcome. | Add `license-busy-recovery` using a recorded 429 fixture and assert the visible next step, or remove it. |
| F-1-15 | “Windows may ask you to confirm the first run.” — README, install instructions | This is a release-security/install expectation not covered by the unsigned-package statement or a claim test. | Include it in `unsigned-builds` with a platform-appropriate release-artifact verification, or remove the prediction. |
| F-1-16 | “The `winget/` manifest is ready for owner submission after release checksums are filled.” — README, install instructions | This is a public packaging-readiness claim with no `claims.json` entry. | Add `winget-submission-manifest` that validates the manifest against the current release and required submission fields, or remove it. |
| F-1-17 | “It is ready to submit to `microsoft/winget-pkgs`; it is not presented as an installed winget source until that upstream submission is accepted.” — README, winget manifest | Both submission state claims are unlisted; the length problem is separately F-1-23. | Add `winget-submission-status` with repository manifest validation and an explicit non-public-source assertion, or reduce this to a neutral link. |
| F-1-18 | “`--ci` removes decorative output.” — README, CLI usage | This is a documented CLI outcome but has no named claim or observable test. | Add `ci-output` that compares normal and `--ci` output, or remove the sentence. |

### Minor — copy clarity

| ID | Exact quote and location | Why a cold reader loses information | Concrete rewrite |
| --- | --- | --- |
| F-1-19 | “Make a record you can check later” — landing h2 | This does not name the section when read in a heading list. | “Create a preservation manifest” |
| F-1-20 | “Preserve evidence without changing the app” — landing h2 | This is an abstract slogan rather than a section name. | “What the tool does not change” |
| F-1-21 | “Add one small command” — landing h2 | “Small” supplies no useful install information. | “Install Legacy App Rescue” |
| F-1-22 | “Have a license?” — landing link | This is a question, not a result-naming action. | “Restore a license” |
| F-1-23 | “It is ready to submit to `microsoft/winget-pkgs`; it is not presented as an installed winget source until that upstream submission is accepted.” — README, winget manifest | 23 words exceeds the 22-word cap and combines two ideas. | “Submit this manifest to `microsoft/winget-pkgs` after release checksums are filled. It is not an installed winget source until Microsoft accepts it.” |
| F-1-24 | “It compares the public Homebrew formula and documented Scoop manifest with the current GitHub Release's `SHA256SUMS`, then checks the repository Homebrew, Scoop, and winget manifests.” — README, package-manager verifier | 26 words exceeds the cap and makes a verification command harder to scan. | “It checks public Homebrew and Scoop checksums against the current GitHub Release. It also checks repository Homebrew, Scoop, and winget manifests.” |

No finding is raised for AI leverage: the brief is a local APK inventory and preservation tool, and no generative step is an obvious safe part of that job.

## Demo and sandbox verification

The one-click demo gate passes. From a fresh 390 px context, **Try it with sample data** navigated to `/demo`. Its first product screen already showed **Orchard Notes 1.7.0**, a compatibility result, APK hash, SDK, CPU, and signer evidence. The persistent banner read **“Demo — sample data, nothing is saved”** and exposed **Reset demo** and **Start for real**.

`/demo` added only `demo:legacy-app-rescue:opened` to the demo namespace. Reset restored that sample key; Start for real removed all `demo:` keys. The direct `/demo` request log contained only `https://legacy-app-rescue.sociobot.in`. Landing additionally contacted the documented GitHub Releases API. The local `rescue demo` path is also covered by the declared privacy test with unusable HTTP(S) proxies.

## Claims gate

After `npm ci`, I ran every command listed in `.factory/claims.json` independently:

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

`npm test` then passed: 8 Rust tests and 26 Playwright tests. `npm run verify:billing` passed against production: checkout returned a hosted Dodo `303`; 30 invalid verification requests were allowed and request 31 returned `429` with `Retry-After: 4`. `npm run build` passed and produced `dist/site/`.

## Copy audit

The following is the sentence/active-copy inventory. Commands, hashes, version labels, and standalone navigation labels are included where they are visible; code samples are omitted because they are not prose sentences. `>22` marks the hard-cap failures above. “Jargon” is noted where an unexplained specialist term appears; it is not separately counted when a finding above already supplies the rewrite.

### Landing page

| # | Copy | Words | Note |
| ---: | --- | ---: | --- |
| 1 | A local preservation tool | 4 | — |
| 2 | Record your Android app before it disappears | 7 | — |
| 3 | For people preserving an old app they own, this tool records its needs and checks another device. | 17 | — |
| 4 | Try it with sample data | 5 | — |
| 5 | See a finished record. | 4 | — |
| 6 | Nothing touches your files. | 4 | claim: demo-sandbox |
| 7 | Runs on macOS, Windows, and Linux. | 6 | claim: platform-builds |
| 8 | APK scans stay on your computer. | 6 | claim: local-private |
| 9 | One APK is free. | 5 | claim: field-kit |
| 10 | Field Kit costs $19 once. | 5 | claim: paid-license |
| 11 | See what the manifest records | 5 | jargon: manifest |
| 12 | Package names are only the start. | 6 | — |
| 13 | The record ties each fact to the exact APK hash. | 10 | jargon: hash |
| 14 | This recording comes from the bundled sample APK. | 8 | claim: demo-sandbox |
| 15 | Run the same scan with rescue demo. | 7 | — |
| 16 | Make a record you can check later | 7 | F-1-19 |
| 17 | Give the CLI a file you already own. | 9 | jargon: CLI |
| 18 | It reads the archive in place. | 6 | — |
| 19 | Add --device to record Android, CPU, and installed user packages. | 10 | jargon: CPU |
| 20 | The JSON file records hashes, signers, SDK needs, native CPUs, and compatibility reasons. | 13 | jargon: JSON, SDK, CPUs |
| 21 | Preserve evidence without changing the app | 6 | F-1-20 |
| 22 | Legacy App Rescue does not download, crack, patch, or re-sign APKs. | 10 | F-1-1 |
| 23 | It cannot bypass Android data controls. | 6 | F-1-2 |
| 24 | Reads only paths you pass. | 5 | F-1-3 |
| 25 | Stores the device serial as a short hash. | 8 | F-1-4 |
| 26 | Labels compatibility as evidence, not a guarantee. | 7 | F-1-5 |
| 27 | Exports data only when Android permits run-as. | 7 | jargon: run-as; claim: export-refusal-cleanup |
| 28 | Add one small command | 4 | F-1-21 |
| 29 | Download the Linux build, or use a package manager. | 9 | — |
| 30 | Release checksums are verified before installation. | 6 | claim: installer-verified |
| 31 | Other install choices | 3 | — |
| 32 | Scan more APKs at once | 5 | — |
| 33 | The free command scans one APK and checks one device. | 10 | claim: field-kit |
| 34 | Field Kit adds batch scans and permitted app-data export. | 9 | claim: field-kit |
| 35 | Buy Field Kit for $19 | 5 | — |
| 36 | Have a license? | 3 | F-1-22 |
| 37 | Sociobot is the merchant of record. | 6 | F-1-6 |
| 38 | A refund turns off the license. | 6 | F-1-6 |
| 39 | Paste a license from your receipt | 6 | — |
| 40 | Verify license | 2 | — |
| 41 | Remove stored license | 3 | — |
| 42 | The token stays in this browser. | 6 | F-1-7 |
| 43 | Remove stored license deletes it and its check status. | 9 | claim: browser-license-removal |
| 44 | Legacy App Rescue records Android app evidence on your computer. | 10 | claim: manifest-record |

### README

| # | Sentence | Words | Note |
| ---: | --- | ---: | --- |
| 1 | Record an Android app before its device disappears. | 8 | — |
| 2 | Legacy App Rescue is a local CLI for people preserving APKs they lawfully own. | 14 | jargon: CLI/APK |
| 3 | It writes a JSON record of each APK, its signer evidence, SDK needs, native CPUs, and device compatibility. | 18 | claim: manifest-record; jargon |
| 4 | It never downloads or uploads an APK. | 7 | F-1-8 |
| 5 | The demo creates a fictional APK in a temporary folder. | 14 | claim: demo-sandbox |
| 6 | It scans the APK, matches a sample Android 13 device, and prints the manifest path. | 15 | claim: demo-sandbox |
| 7 | The website sandbox is at <https://legacy-app-rescue.sociobot.in/demo>. | 8 | — |
| 8 | Its browser storage uses the `demo:legacy-app-rescue:` prefix. | 8 | claim: demo-sandbox |
| 9 | The sample source is in [`examples/sample-apk`](examples/sample-apk). | 9 | — |
| 10 | It contains no installable app code. | 6 | F-1-9 |
| 11 | The script downloads the matching archive, verifies SHA-256, and places `rescue` in `~/.local/bin`. | 14 | claim: installer-verified |
| 12 | The macOS package is unsigned. | 5 | F-1-10 |
| 13 | Right-click the downloaded package, then choose Open. | 7 | — |
| 14 | The Windows build is unsigned. | 5 | F-1-10 |
| 15 | Windows may ask you to confirm the first run. | 9 | F-1-15 |
| 16 | Release assets include Linux `.deb` and `.rpm` packages, macOS `.pkg` files, a Windows portable ZIP, `SHA256SUMS`, and `latest.json`. | 18 | claim: platform-builds |
| 17 | The `winget/` manifest is ready for owner submission after release checksums are filled. | 13 | F-1-16 |
| 18 | The checked v0.1.2 manifest is [`winget/B-Divyesh.LegacyAppRescue.yaml`](winget/B-Divyesh.LegacyAppRescue.yaml). | 9 | — |
| 19 | It is ready to submit to `microsoft/winget-pkgs`; it is not presented as an installed winget source until that upstream submission is accepted. | 23 | F-1-17; F-1-23 |
| 20 | `--ci` removes decorative output. | 5 | F-1-18 |
| 21 | A compatibility verdict covers declared SDK and CPU needs. | 12 | claim: compatibility-verdict |
| 22 | It does not promise that licensing, remote services, or old graphics code will still work. | 15 | F-1-5 |
| 23 | The free command scans one APK and checks one device. | 10 | claim: field-kit |
| 24 | Field Kit adds batch scans and app-data export when Android permits `run-as`. | 12 | claim: field-kit |
| 25 | Sociobot is the merchant of record. | 6 | F-1-6 |
| 26 | Android must allow `adb run-as` for that app. | 9 | claim: export-refusal-cleanup |
| 27 | Legacy App Rescue stops on refusal and does not try root. | 11 | claim: export-refusal-cleanup |
| 28 | Legacy App Rescue does not distribute APKs, remove DRM, crack apps, or re-sign third-party software. | 15 | F-1-1 |
| 29 | Use it only with files and data you may lawfully access. | 11 | terms instruction |
| 30 | Plain XML and Android binary XML manifests are supported. | 9 | claim: binary-manifest |
| 31 | ZIP64 APK Signing Blocks are not read in version 0.1. | 10 | F-1-11 |
| 32 | The tool still records the whole-file hash when signer parsing is unavailable. | 12 | claim: manifest-record |
| 33 | The site output is exactly `dist/site/`. | 7 | — |
| 34 | The release workflow builds platform binaries on GitHub Actions. | 9 | claim: platform-builds |
| 35 | `npm run verify:billing` is a live release check. | 9 | — |
| 36 | It confirms the Sociobot checkout returns a `303` to a hosted Dodo session and that a successful redirect has no `Retry-After` header. | 22 | tooling fact |
| 37 | It also checks that the verification service enforces its documented rate limit. | 12 | tooling fact |
| 38 | `npm run verify:package-managers` is a live release check. | 9 | — |
| 39 | It compares the public Homebrew formula and documented Scoop manifest with the current GitHub Release's `SHA256SUMS`, then checks the repository Homebrew, Scoop, and winget manifests. | 26 | F-1-24 |
| 40 | Public claims live in [`.factory/claims.json`](.factory/claims.json). | 8 | — |
| 41 | The CLI has no telemetry. | 5 | F-1-12 |
| 42 | APK scanning and the bundled demo need no network. | 9 | claim: local-private |
| 43 | License activation contacts only `api.sociobot.in`. | 5 | F-1-13 |
| 44 | The website verifies a stored license at most once a day. | 11 | claim: browser-license-cache |
| 45 | If the license service is busy, it asks you to try again shortly. | 13 | F-1-14 |
| 46 | The source is available under the MIT License. | 9 | — |
| 47 | See the site privacy page and terms. | 7 | — |

## Structure, routing, and presentation checks

`/`, `/demo`, `/privacy`, and `/terms` returned 200 with their expected route titles, one `h1`, one `main`, no console/page errors, and no 390 px overflow. The missing route returned HTTP 404 with title **Page not found — Legacy App Rescue** and a home link. Direct route visits worked. The header/footer were consistent; Privacy and Terms were present. The live page supplied description, canonical, Open Graph/Twitter fields, SVG favicon, apple touch icon, `lang`, `robots.txt`, and `sitemap.xml`.

The skip link, keyboard navigation, route title/focus code, reduced-motion handling, and same-origin demo requests are present. The botanical field-guide system is distinct from a generic SaaS template and matches `.factory/design.md`; the original-art provenance is recorded there. The live crawler reached internal pages successfully; the release asset gave its expected GitHub redirect, checkout gave its expected 303, and `sociobot.in` returned 200.

## Earlier-review regression check

No earlier `review-*` or `polish-*` files exist. I read `verification.md`, `verification-2.md` through `verification-7.md`, and the prior handoff. Those reports did not assign finding IDs, so their descriptive identifiers are used below.

| Earlier finding | Current confirmation |
| --- | --- |
| Hashed static assets had short caching | Current config and live assets use `public, max-age=31536000, immutable`. |
| Checkout returned 404 | Live checkout returned hosted Dodo 303. |
| Licence verification lacked a documented/enforced limit | Live billing verification observed 30 allowed requests then 429 with `Retry-After: 4`. |
| Arbitrary paid token unlocked Field Kit | Current `@claim:field-kit` rejects `not-a-real-license`; Rust unit test confirms invalid verdicts cannot unlock. |
| Private app-data archive was readable / refusal left files | `@claim:field-kit` and `@claim:export-refusal-cleanup` pass; Rust test confirms private cleanup. |
| Mobile targets, mobile OS selection, retry UI, soft 404, JSON licence output, and metaphor copy | Current 26-test suite covers these repairs; live mobile routes had no overflow and missing route was 404. |
| Package-manager paths and browser licence removal | `verify:package-managers` and `@claim:browser-license-removal` pass. |
| RPM release identity, version/changelog drift, mobile LCP | Current regression tests assert package version policy; current source is v0.1.2 with changelog/workflow updates. Performance evidence is recorded in verification-7; this review did not rerun Lighthouse. |

None of those historical findings is re-opened. The current F-1-* findings are new claims/copy-contract findings found by re-running the full checklist.

## What would make this perfect

Either delete every promise in F-1-1 through F-1-18 that is not essential, or add one precise `claims.json` entry and one isolated observable test for each retained promise. Then apply the six short copy rewrites in F-1-19 through F-1-24, rerun the full independent claims loop, and re-review the rendered landing page and README. At that point the clear first read, realistic demo, local-first behaviour, and distinctive visual identity would support a PASS.
