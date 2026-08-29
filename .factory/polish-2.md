# Polish round 2 — PASS

**Repair commit:** `10b154b061f22b474d7cf8b00c714dc5bb235042`  
**Reviewed base:** `9fbd3765bccfaac66d6d0942bd6878fc6b5d17a0` and every available `.factory/review-*.md`, `.factory/polish-*.md`, and verification record.  
**Live check:** <https://legacy-app-rescue.sociobot.in> on 2026-08-29 UTC.

Evidence directory: `/work/.evidence/polish-2/`. `live-browser.json` covers the cold mobile checks for `/`, `/?demo=1`, `/demo`, `/privacy`, `/terms`, and the HTTP 404. `live-finding-recheck.json` and `live-mobile-install-and-copy.png` cover the revised mobile install/copy path.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the no-alteration boundary and its byte-for-byte APK test. | `@claim:safety-boundaries`; `live-landing-mobile.png`; live `/#main`. |
| F-1-2 | Kept the no-bypass boundary and refused-ADB cleanup coverage. | `@claim:safety-boundaries`, `@claim:export-refusal-cleanup`; live `/privacy`. |
| F-1-3 | Kept selected-path-only scanning with an unpassed sentinel test. | `@claim:input-scope`; live `/privacy`. |
| F-1-4 | Kept the 16-character device fingerprint behavior and test. | `@claim:device-serial-hash`; live `/privacy`. |
| F-1-5 | Kept the evidence-not-guarantee limit with record and terms coverage. | `@claim:compatibility-limit`; live `/terms`. |
| F-1-6 | Kept checkout/refund copy limited to the tested Sociobot/revoked-license behavior. | `@claim:merchant-and-refund`; live `/#field-kit`. |
| F-1-7 | Kept named browser storage and Sociobot-only token verification. | `@claim:browser-license-storage`; live `/#restore`, `/privacy`. |
| F-1-8 | Kept no-transfer/no-change scan coverage behind unusable proxies. | `@claim:apk-transfer-boundary`; live `/privacy`. |
| F-1-9 | Kept the precise non-executable sample statement and ZIP inspection. | `@claim:sample-is-noninstallable`; live `/?demo=1`. |
| F-1-10 | Kept the unsigned package assertion and release-packaging inspection. | `@claim:unsigned-builds`; live `/#install`. |
| F-1-11 | Removed the unhelpful ZIP64 promise; whole-file evidence remains tested. | `@claim:manifest-record`; live landing copy check. |
| F-1-12 | Kept no-telemetry/no-network proxy checks for scan and demo. | `@claim:no-cli-telemetry`; `README.md` check. |
| F-1-13 | Uses the tested Sociobot license-service wording. | `@claim:paid-license`, `@claim:browser-license-storage`; live `/privacy`. |
| F-1-14 | Kept the recorded busy-service retry behavior. | `@claim:license-busy-recovery`; live `/#restore`. |
| F-1-15 | Keeps only the verifiable unsigned-build fact; speculative Windows behavior remains absent. | `@claim:unsigned-builds`; `README.md` check. |
| F-1-16 | Keeps the current portable winget submission fields validated. | `@claim:winget-submission-manifest`; `README.md` check. |
| F-1-17 | Keeps short, neutral winget submission guidance. | `@claim:winget-submission-manifest`; `README.md` check. |
| F-1-18 | Keeps plain `--ci` output tested against decorated output. | `@claim:ci-output`; `README.md` check. |
| F-1-19 | Replaced the vague heading with “Create a preservation record (manifest)”. | `copy-audit.md`; `live-mobile-install-and-copy.png`; live landing. |
| F-1-20 | Retained the concrete “What the tool does not change” heading. | `copy-audit.md`; live landing. |
| F-1-21 | Retained “Install Legacy App Rescue”. | `copy-audit.md`; live `/#install`. |
| F-1-22 | Retained the action label “Restore a license”. | accessibility suite; live landing. |
| F-1-23 | Retained split winget guidance under the sentence limit. | `copy-audit.md`; `README.md` check. |
| F-1-24 | Retained split package-manager verifier guidance under the sentence limit. | `copy-audit.md`; `npm run verify:package-managers`. |
| F-2-1 | Replaced “No mobile build is available” with actionable desktop-download guidance, hid the unusable command row, and registered the mobile claim. | `@claim:mobile-install-guidance`; `live-mobile-install-and-copy.png`; live `/` Android-UA check. |
| F-2-2 | Expanded first use to “Android app file (APK)” on landing, demo, privacy, README, and demo documentation. | `copy-audit.md`; `live-mobile-install-and-copy.png`; live `/`. |
| F-2-3 | Expanded the output to “preservation record (manifest)” before the short form. | `copy-audit.md`; `live-mobile-install-and-copy.png`; live `/`, `/?demo=1`. |
| F-2-4 | Expanded CLI to “desktop command-line tool (CLI)” at first use on landing, privacy, terms, and README. | `copy-audit.md`; `live-mobile-install-and-copy.png`; live `/`. |
| F-2-5 | Replaced the empty package-name slogan with the actual preservation-record contents. | `copy-audit.md`; `live-mobile-install-and-copy.png`; live `/`. |
| F-2-6 | Replaced user-facing hash wording with “unique file fingerprint” and “shortened fingerprint.” | `copy-audit.md`; `@claim:device-serial-hash`; live `/`. |
| F-2-7 | Rewrote the landing result summary in Android-version/device-type/device-match language. | `copy-audit.md`; `live-mobile-install-and-copy.png`; live `/`. |
| F-2-8 | Explained `run-as` as Android granting the app’s own data-access permission. | `copy-audit.md`; `@claim:export-refusal-cleanup`; live `/`, `/privacy`. |

## Verification

- Clean clone at `/tmp/legacy-app-rescue-clean.PcHcyI`: `npm ci`, then every one of the 27 commands declared in `.factory/claims.json`; all passed.
- `npm test`: PASS — 8 Rust tests and 42 Playwright tests, including route, keyboard, mobile, privacy, and Axe checks.
- `cargo clippy --all-targets --locked -- -D warnings`, `cargo build --release --locked`, `cargo package --locked --no-verify`, and `npm audit --audit-level=high`: PASS.
- `npm run build`: PASS; `dist/site/` built with 22.96 kB JS (8.02 kB gzip) and 14.42 kB CSS (4.00 kB gzip).
- `npm run verify:billing`: PASS — hosted Dodo checkout 303 and request 31 returned 429 with `Retry-After: 4` after 30 allowed verification requests.
- `npm run verify:package-managers`: PASS.
- Lighthouse mobile production-build check: performance 100, LCP 1657 ms, TBT 0 ms, CLS 0.
- Deployment: Static Web Apps deployment `937dfe3c-dff8-458e-9fab-f357222a4340` succeeded. `node scripts/verify-live.mjs https://legacy-app-rescue.sociobot.in /work/.evidence/polish-2` passed all six routes, demo isolation, mobile target sizes, console, Axe serious/critical, and HTTP 404 checks.

There are no unresolved review findings or known acceptance gaps.
