# Polish round 6 — acceptance record

**Status:** PASS. This round repaired the release-candidate gaps reported in `review-6.md`, re-exercised every earlier review finding, and deployed source commit `0fa85d3ba9ef6e93594b9dd070fd661683f65b6e` to <https://legacy-app-rescue.sociobot.in> (Static Web Apps deployment `ec06655a-c78f-4eb8-81e0-d1b0d86866b9`).

The final clean-clone run was `/tmp/legacy-app-rescue-polish6-final.qh5ZaJ` at that exact commit. It ran `npm ci`, `npm test`, all 36 registered claim commands independently, `npm run build`, `cargo fmt --check`, `cargo clippy --all-targets --locked -- -D warnings`, `cargo build --release --locked`, `cargo package --locked --no-verify --allow-dirty`, `npm audit --audit-level=high`, and `npm run verify:package-managers` successfully.

Final cold-live evidence is in `/work/.evidence/polish-6/`: `live-landing-mobile.png`, `live-demo-mobile.png`, `live-demo-scrolled-mobile.png`, `live-privacy-mobile.png`, `live-404-desktop.png`, and `live-browser.json`. `npm run verify:live -- https://legacy-app-rescue.sociobot.in /work/.evidence/polish-6` and `npm run verify:url -- https://legacy-app-rescue.sociobot.in /work/.evidence/polish-6` each passed all routes, demo isolation, keyboard-focus handoff, mobile targets, console checks, and Axe serious/critical checks.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the no-alteration boundary and byte-for-byte APK scan assertion. | `@claim:safety-boundaries`; `live-landing-mobile.png`; live `/`. |
| F-1-2 | Kept refusal cleanup and the no-root boundary. | `@claim:safety-boundaries`, `@claim:export-refusal-cleanup`; live `/privacy`. |
| F-1-3 | Kept selected-path-only scanning beside an unpassed sentinel. | `@claim:input-scope`; clean-clone claim log. |
| F-1-4 | Kept the 16-character SHA-256 device-serial fingerprint. | `@claim:device-serial-hash`; `live-privacy-mobile.png`; live `/privacy`. |
| F-1-5 | Kept evidence-not-guarantee wording and compatibility reasons. | `@claim:compatibility-limit`; live `/terms`. |
| F-1-6 | Replaced the unproved merchant-of-record wording in README and Terms with “Sociobot handles checkout.” | `@claim:merchant-and-refund`; cold live `/terms` wording check. |
| F-1-7 | Kept named browser storage, URL-token removal, and Sociobot-only verification. | `@claim:browser-license-storage`; live `/privacy`. |
| F-1-8 | Kept blocked-proxy, unchanged-file APK scan coverage. | `@claim:apk-transfer-boundary`; clean-clone claim log. |
| F-1-9 | Kept the precise non-executable bundled-sample statement. | `@claim:sample-is-noninstallable`; `live-demo-mobile.png`; live `/?demo=1`. |
| F-1-10 | Kept unsigned macOS and Windows package validation. | `@claim:unsigned-builds`; live `/#install`. |
| F-1-11 | Kept the unsupported ZIP64 promise removed. | `@claim:manifest-record`; `.factory/copy-audit.md`; live `/`. |
| F-1-12 | Kept offline-proxy CLI demo and scan coverage. | `@claim:no-cli-telemetry`; clean-clone claim log. |
| F-1-13 | Kept only the tested Sociobot license-service wording. | `@claim:paid-license`, `@claim:browser-license-storage`; live `/privacy`. |
| F-1-14 | Kept recorded busy-service retry guidance. | `@claim:license-busy-recovery`; live `/#restore`. |
| F-1-15 | Kept the speculative Windows first-run prediction removed. | `@claim:unsigned-builds`; `.factory/copy-audit.md`. |
| F-1-16 | Kept portable winget submission fields validated. | `@claim:winget-submission-manifest`; clean-clone claim log. |
| F-1-17 | Kept concise, neutral winget submission guidance. | `@claim:winget-submission-manifest`; README audit. |
| F-1-18 | Kept plain `--ci` output coverage. | `@claim:ci-output`; clean-clone claim log. |
| F-1-19 | Kept “Create a preservation record (manifest)”. | `.factory/copy-audit.md`; `live-landing-mobile.png`; live `/`. |
| F-1-20 | Kept “What the tool does not change”. | `.factory/copy-audit.md`; `live-landing-mobile.png`; live `/`. |
| F-1-21 | Kept “Install Legacy App Rescue”. | `.factory/copy-audit.md`; live `/#install`. |
| F-1-22 | Kept the action label “Restore a license”. | Browser accessibility suite; live `/#restore`. |
| F-1-23 | Kept split winget guidance below the sentence limit. | `.factory/copy-audit.md`; README audit. |
| F-1-24 | Kept split package-manager verification guidance. | `npm run verify:package-managers`; README audit. |
| F-2-1 | Kept actionable desktop-download guidance and no mobile installer command. | `@claim:mobile-install-guidance`; `live-landing-mobile.png`; live `/`. |
| F-2-2 | Uses “Android app file (APK)” at first use and “APK” thereafter. | `.factory/copy-audit.md`; `live-landing-mobile.png`; live `/`. |
| F-2-3 | Keeps “preservation record (manifest)” before its short form. | `.factory/copy-audit.md`; `live-demo-mobile.png`; live `/?demo=1`. |
| F-2-4 | Keeps “desktop command-line tool (CLI)” before its short form. | `.factory/copy-audit.md`; live `/`. |
| F-2-5 | Keeps the useful preservation-record contents instead of a slogan. | `.factory/copy-audit.md`; `live-landing-mobile.png`; live `/`. |
| F-2-6 | Keeps plain “file fingerprint” and “shortened fingerprint” wording. | `.factory/copy-audit.md`, `@claim:device-serial-hash`; live `/`. |
| F-2-7 | Keeps Android-version, device-type, and device-match language. | `.factory/copy-audit.md`; live `/`. |
| F-2-8 | Explains `run-as` as Android granting the app’s own data-access permission. | `@claim:export-refusal-cleanup`; live `/privacy`. |
| F-3-1 | Keeps the demo banner, Reset demo, and Start for real visible after a real end-of-page mobile scroll. | `@claim:demo-sandbox`; `live-demo-scrolled-mobile.png`; live `/?demo=1`. |
| F-3-2 | Keeps the decorative “A local preservation tool” label removed. | First-screen regression in browser suite; `live-landing-mobile.png`; live `/`. |
| F-3-3 | Keeps “PLATE / 017” removed. | First-screen regression in browser suite; `live-landing-mobile.png`; live `/`. |
| F-4-1 | Keeps the free one-APK/one-selected-device limit and batch refusal. | `@claim:free-tier-limit`; `live-landing-mobile.png`; live `/`. |
| F-4-2 | Keeps selected-device facts and match reasons in the record. | `@claim:device-context-record`; live how-it-works section. |
| F-4-3 | Keeps the requested `--output` path behavior. | `@claim:custom-output-path`; README CLI audit. |
| F-4-4 | Keeps two-device selection and proves only `--serial` is inspected. | `@claim:device-selection`; README CLI audit. |
| F-4-5 | Keeps parseable undecorated `--json` output. | `@claim:json-output`; README CLI audit. |
| F-4-6 | Keeps APK byte-size and permitted export-archive hashes. | `@claim:manifest-file-size`, `@claim:export-archive-hash`; README audit. |
| F-4-7 | Keeps the complete release asset set tied to the recorded v0.1.3 metadata and workflow. | `@claim:release-asset-set`; `npm run verify:package-managers`. |
| F-4-8 | Keeps HTTP-404 focus handoff to the landing h1. | Browser route regression; `live-404-desktop.png`; live `/missing-specimen`. |
| F-4-9 | Keeps duplicate landing eyebrow labels removed. | First-screen regression; `live-landing-mobile.png`; live `/`. |
| F-4-10 | Keeps canonical, Open Graph, Twitter, and Apple-touch metadata on HTTP 404. | `live-browser.json`; `live-404-desktop.png`; live `/missing-specimen`. |
| F-6-1 | Made verification injection test-only, added a recorded valid Sociobot response, and now runs the released CLI through invalid activation, licensed two-APK scan, selected-device inspection, and permitted export. | `@claim:field-kit`; clean-clone log shows two APK entries, export hash, and three verification calls. |
| F-6-2 | Added a recorded hosted-checkout fixture asserting amount `1900`, `USD`, and one-time billing. | `@claim:paid-license`; cold live hosted-checkout price/type check and `verify:billing`. |
| F-6-3 | Added the explicit `signer-fallback` claim and malformed APK Signing Block fixture. | `@claim:signer-fallback`; clean-clone claim log verifies successful scan, no signer, and whole-file SHA-256. |
| F-6-4 | Removed the unproved “for version 0.x” entitlement promise. | `.factory/copy-audit.md`; cold live `/terms` check rejects that phrase. |
| F-6-5 | Renamed the README demo heading to “Try it with sample data”. | README audit and `rg`; one-click live `/?demo=1` check. |
| F-6-6 | Renamed macOS actions to “Download for Apple silicon” and “Download for Intel Mac”. | Browser install regression and cold live macOS-UA check. |
| F-6-7 | Replaced later app-file variants with “APK” across landing, README, and legal copy. | `.factory/copy-audit.md`; cold live `/` and README wording audit. |

No review finding remains open.
