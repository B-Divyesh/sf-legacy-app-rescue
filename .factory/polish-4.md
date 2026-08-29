# Polish round 4 — PASS

**Reviewed candidate:** `4d996122d5c6c06672ecf1e5a5599fad6f457b47` through review commit `e3ad7ea9468c1aba9402d3ad6e7198abb5155bd3`.

**Repair commit:** `f5f23ea4791b85d527534d9b22878fd42ccae2e1`.

**Deployment:** production Static Web App `sf-legacy-app-rescue`, serving <https://legacy-app-rescue.sociobot.in> (deployment host: <https://blue-plant-09d076810.7.azurestaticapps.net>).

**Evidence:** clean-clone log: `/work/.evidence/polish-4-clean-clone.log`; cold-live report and screenshots: `/work/.evidence/polish-4/`.

Every finding in reviews 1–4 was rechecked against the repaired source and the cold production site. All claim tests use shipped fixtures or fake ADB/browser responses; no claim test spends money or reads a personal APK.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the no-alteration boundary with byte-for-byte APK evidence. | `@claim:safety-boundaries`; clean-clone log; live `/` in `live-landing-mobile.png`. |
| F-1-2 | Kept refusal cleanup and no-root behavior. | `@claim:safety-boundaries`, `@claim:export-refusal-cleanup`; live `/privacy`. |
| F-1-3 | Kept passed-path-only scanning beside an unpassed sentinel. | `@claim:input-scope`; clean-clone log. |
| F-1-4 | Kept the 16-character SHA-256 serial fingerprint. | `@claim:device-serial-hash`; live `/privacy`. |
| F-1-5 | Kept evidence-not-guarantee wording and recorded reasons. | `@claim:compatibility-limit`; live `/terms`. |
| F-1-6 | Kept tested Sociobot checkout and revoked-license behavior. | `@claim:merchant-and-refund`; live `/#field-kit`. |
| F-1-7 | Kept named browser storage and Sociobot-only token verification. | `@claim:browser-license-storage`; live `/privacy`. |
| F-1-8 | Kept blocked-proxy, unchanged-file APK scan evidence. | `@claim:apk-transfer-boundary`; clean-clone log. |
| F-1-9 | Kept the precise no-DEX sample statement. | `@claim:sample-is-noninstallable`; live `/?demo=1` in `live-demo-mobile.png`. |
| F-1-10 | Kept unsigned macOS and Windows package validation. | `@claim:unsigned-builds`; live `/#install`. |
| F-1-11 | Kept the unsupported ZIP64 version promise removed. | Copy audit; cold landing check. |
| F-1-12 | Kept offline-proxy scan and demo coverage. | `@claim:no-cli-telemetry`; clean-clone log. |
| F-1-13 | Kept the tested Sociobot license-service wording. | `@claim:paid-license`, `@claim:browser-license-storage`; live `/privacy`. |
| F-1-14 | Kept recorded 429 retry guidance. | `@claim:license-busy-recovery`; live `/#restore`. |
| F-1-15 | Kept the speculative Windows first-run prediction removed. | Copy audit; `@claim:unsigned-builds`. |
| F-1-16 | Kept portable winget submission fields validated. | `@claim:winget-submission-manifest`; clean-clone log. |
| F-1-17 | Kept concise, neutral winget submission guidance. | `@claim:winget-submission-manifest`; README audit. |
| F-1-18 | Kept plain `--ci` output coverage. | `@claim:ci-output`; clean-clone log. |
| F-1-19 | Kept “Create a preservation record (manifest)”. | `.factory/copy-audit.md`; `live-landing-mobile.png`. |
| F-1-20 | Kept “What the tool does not change”. | `.factory/copy-audit.md`; live `/`. |
| F-1-21 | Kept “Install Legacy App Rescue”. | `.factory/copy-audit.md`; live `/#install`. |
| F-1-22 | Kept “Restore a license”. | Keyboard suite; live `/#restore`. |
| F-1-23 | Kept split winget guidance below 22 words. | `.factory/copy-audit.md`; README check. |
| F-1-24 | Kept split package-manager verification wording. | `.factory/copy-audit.md`; `npm run verify:package-managers`. |
| F-2-1 | Kept actionable desktop-download guidance for mobile visitors. | `@claim:mobile-install-guidance`; `live-landing-mobile.png`. |
| F-2-2 | Kept first-use “Android app file (APK)” expansion. | `.factory/copy-audit.md`; live `/`. |
| F-2-3 | Kept first-use “preservation record (manifest)” expansion. | `.factory/copy-audit.md`; live `/?demo=1`. |
| F-2-4 | Kept first-use “desktop command-line tool (CLI)” expansion. | `.factory/copy-audit.md`; live `/`. |
| F-2-5 | Kept useful preservation-record contents in place of the slogan. | `.factory/copy-audit.md`; `live-landing-mobile.png`. |
| F-2-6 | Kept plain “file fingerprint” and “shortened fingerprint” wording. | `.factory/copy-audit.md`; `@claim:device-serial-hash`. |
| F-2-7 | Kept Android-version, device-type, and device-match language. | `.factory/copy-audit.md`; live `/`. |
| F-2-8 | Kept the explanation of Android app data-access permission. | `@claim:export-refusal-cleanup`; live `/privacy`. |
| F-3-1 | Kept the sticky demo banner and real end-of-scroll controls. | `@claim:demo-sandbox`; `live-demo-scrolled-mobile.png`. |
| F-3-2 | Removed “A local preservation tool”. | First-screen regression; `live-landing-mobile.png`. |
| F-3-3 | Removed “PLATE / 017”. | First-screen regression; `live-landing-mobile.png`. |
| F-4-1 | Registered the free one-app/one-selected-device limit and tested unlicensed batch refusal. | `@claim:free-tier-limit`; live first-screen fact in `live-landing-mobile.png`. |
| F-4-2 | Registered selected-device facts and match reasons in the preservation record. | `@claim:device-context-record`; live how-it-works section. |
| F-4-3 | Registered and tested the requested `--output` path. | `@claim:custom-output-path`; README CLI check. |
| F-4-4 | Registered two-device selection and proved only `--serial` is inspected. | `@claim:device-selection`; README CLI check. |
| F-4-5 | Registered and parsed undecorated `--json` output. | `@claim:json-output`; README CLI check. |
| F-4-6 | Registered both APK byte size and permitted export archive hash. | `@claim:manifest-file-size`, `@claim:export-archive-hash`; README field list. |
| F-4-7 | Registered the complete release asset set against a recorded v0.1.3 release fixture and workflow. | `@claim:release-asset-set`; README install check. |
| F-4-8 | Added static-404 focus handoff and a browser regression beginning at an HTTP 404. | `a separately served HTTP 404 sends its home action back to the landing heading`; cold `verify:url` pass. |
| F-4-9 | Removed all four duplicate landing eyebrow labels. | First-screen regression; `live-landing-mobile.png`; copy audit. |
| F-4-10 | Added canonical, Open Graph, Twitter, and Apple-touch metadata to the actual HTTP 404. | Route regression; `live-404-desktop.png`; `live-browser.json`. |

## Final acceptance evidence

- A final fresh local clone at `/tmp/legacy-app-rescue-polish4-final.vMRn2z` from `1e52d850917c5b15d1acb76549f6e4e0106f13e3` ran `npm ci`, each of the 35 exact `.factory/claims.json` commands independently, `npm test`, and `npm run build`; all passed. The full suite reports 8 Rust and 52 Playwright tests. Evidence: `/work/.evidence/polish-4-final-clean-clone.log`.
- `cargo fmt --all -- --check`, `cargo clippy --all-targets --locked -- -D warnings`, `cargo build --release --locked`, `cargo package --locked --no-verify --allow-dirty`, and `npm audit --audit-level=high` passed.
- `npm run test:performance` passed: performance 100 on all four mobile runs; LCP values 1660, 1662, 1657, and 1657 ms; median 1658.5 ms; TBT 0 ms and CLS 0.
- `npm run verify:billing` passed: hosted Dodo checkout returned 303 with no `Retry-After`; verification allowed 30 requests and request 31 returned 429 with `Retry-After: 4`.
- `npm run verify:package-managers` passed for the v0.1.3 Homebrew, Scoop, and winget manifests.
- After production deployment, `npm run verify:url -- https://legacy-app-rescue.sociobot.in /work/.evidence/polish-4` passed cold. It checked `/`, `?demo=1`, `/demo`, `/privacy`, `/terms`, and HTTP 404 for titles, `lang`, main/h1, image alternatives, console errors, mobile overflow/targets, Axe serious/critical findings, demo isolation, static-404 metadata, and the return-focus handoff.

No review finding or known acceptance gap remains.
