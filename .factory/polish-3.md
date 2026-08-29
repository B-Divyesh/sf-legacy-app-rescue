# Polish round 3 — PASS

**Reviewed base:** `564f0e7eafb2c2b40654fbb58932eccbac5928a2` and every earlier `.factory/review-*.md` and `.factory/polish-*.md`.

**Repair commits:** `d983b969632d57aa4aa5a048c920d55f0411a5e0`, `5eeeb608945701b323531abccb2301d99abb3fee`.

**Final deployment:** Static Web Apps `dc8ef218-ff41-4666-b4e5-fae94081af3c` to <https://legacy-app-rescue.sociobot.in>.

**Evidence:** final remote clean-clone log `/tmp/legacy-app-rescue-final-clean.log` at `f449122bd540d1459b6bc138be659824ccc75a3d`; live screenshots and report in `/work/.evidence/polish-3/`.

Every prior finding remains fixed and was re-exercised. F-3-1 is fixed with a genuine scroll assertion rather than an initial-viewport-only check.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Retained the no-alteration boundary and byte-for-byte APK scan assertion. | `@claim:safety-boundaries`; clean log; live `/` boundary section. |
| F-1-2 | Retained refused-ADB cleanup and no-root behavior. | `@claim:safety-boundaries`, `@claim:export-refusal-cleanup`; live `/privacy`. |
| F-1-3 | Retained passed-path-only scanning beside an unpassed sentinel. | `@claim:input-scope`; live `/privacy`. |
| F-1-4 | Retained the 16-character SHA-256 device fingerprint behavior. | `@claim:device-serial-hash`; live `/privacy`. |
| F-1-5 | Retained evidence-not-guarantee compatibility wording and record note. | `@claim:compatibility-limit`; live `/terms`. |
| F-1-6 | Retained tested Sociobot checkout and revoked-license wording. | `@claim:merchant-and-refund`; live `/#field-kit`. |
| F-1-7 | Retained named browser storage, URL token removal, and Sociobot-only verification. | `@claim:browser-license-storage`; live `/privacy`. |
| F-1-8 | Retained blocked-proxy APK scan and unchanged-file assertion. | `@claim:apk-transfer-boundary`; `README.md` check. |
| F-1-9 | Retained the precise non-executable bundled-sample wording. | `@claim:sample-is-noninstallable`; live `/?demo=1`. |
| F-1-10 | Retained unsigned macOS/Windows package validation. | `@claim:unsigned-builds`; live `/#install`. |
| F-1-11 | Kept the untestable ZIP64 version promise removed. | `@claim:manifest-record`; copy audit; live landing. |
| F-1-12 | Retained offline-proxy CLI demo and scan coverage. | `@claim:no-cli-telemetry`; `README.md` check. |
| F-1-13 | Retained tested Sociobot license-service wording. | `@claim:paid-license`, `@claim:browser-license-storage`; live `/privacy`. |
| F-1-14 | Retained recorded 429 retry guidance. | `@claim:license-busy-recovery`; live `/#restore`. |
| F-1-15 | Kept the speculative Windows prompt prediction removed. | `@claim:unsigned-builds`; `README.md` check. |
| F-1-16 | Retained current portable winget fields and manifest validation. | `@claim:winget-submission-manifest`; `README.md` check. |
| F-1-17 | Retained short, neutral winget submission guidance. | `@claim:winget-submission-manifest`; `README.md` check. |
| F-1-18 | Retained the plain `--ci` output assertion. | `@claim:ci-output`; clean log. |
| F-1-19 | Retained “Create a preservation record (manifest)”. | `copy-audit.md`; `live-landing-mobile.png`; live `/`. |
| F-1-20 | Retained “What the tool does not change”. | `copy-audit.md`; `live-landing-mobile.png`; live `/` boundary section. |
| F-1-21 | Retained “Install Legacy App Rescue”. | `copy-audit.md`; `live-landing-mobile.png`; live `/#install`. |
| F-1-22 | Retained the action label “Restore a license”. | accessibility suite; live `/#restore`. |
| F-1-23 | Retained split winget guidance below 22 words. | `copy-audit.md`; clean README check. |
| F-1-24 | Retained split package-manager wording below 22 words. | `copy-audit.md`; `npm run verify:package-managers`. |
| F-2-1 | Retained mobile desktop-download guidance and removed unusable mobile installer commands. | `@claim:mobile-install-guidance`; `live-landing-mobile.png`; live `/`. |
| F-2-2 | Retained first-use “Android app file (APK)” expansion. | `copy-audit.md`; `live-landing-mobile.png`; live `/`. |
| F-2-3 | Retained first-use “preservation record (manifest)” expansion. | `copy-audit.md`; `live-landing-mobile.png`; live `/?demo=1`. |
| F-2-4 | Retained first-use “desktop command-line tool (CLI)” expansion. | `copy-audit.md`; `live-landing-mobile.png`; live `/`. |
| F-2-5 | Retained useful preservation-record contents in place of the slogan. | `copy-audit.md`; `live-landing-mobile.png`; live `/`. |
| F-2-6 | Retained plain “unique file fingerprint” and “shortened fingerprint” wording. | `copy-audit.md`, `@claim:device-serial-hash`; live `/`. |
| F-2-7 | Retained Android-version, device-type, and device-match language. | `copy-audit.md`; `live-landing-mobile.png`; live `/`. |
| F-2-8 | Retained the explanation of Android's app data-access permission (`run-as`). | `copy-audit.md`, `@claim:export-refusal-cleanup`; live `/privacy`. |
| F-3-1 | Made the complete demo header sticky. The claim and live verifier now calculate the real scroll maximum, assert it was reached, prove the banner and both controls are within the 390×844 viewport, then activate Reset and Start for real. | `@claim:demo-sandbox`; `live-demo-scrolled-mobile.png`; live `/?demo=1`. |
| F-3-2 | Removed “A local preservation tool” from both client and prerendered first-screen templates. | `regression: the first screen omits decorative labels that do not explain the product`; `live-landing-mobile.png`; live `/`. |
| F-3-3 | Removed “PLATE / 017” and its unused visual selector. | Same regression test; `live-landing-mobile.png`; live `/`. |

## Final acceptance evidence

- Clean clone: all 27 declared claims passed independently, then `npm test` passed 8 Rust and 43 Playwright tests.
- `cargo fmt --all -- --check`, `cargo clippy --all-targets --locked -- -D warnings`, `cargo build --release --locked`, `cargo package --locked --no-verify --allow-dirty`, `npm audit --audit-level=high`, `npm run build`, `npm run test:performance`, `npm run verify:billing`, and `npm run verify:package-managers` all passed.
- Cold production verification passed after the final deploy: all declared routes and the 404, mobile layout, titles/metadata, console, Axe serious/critical, demo isolation, and the new end-of-record banner check.
