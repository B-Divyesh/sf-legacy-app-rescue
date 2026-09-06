# Record an Android app before it disappears — verification 11

**Verdict: PASS**

- **Finding count:** 0
- **Untested public claims:** 0
- **Implementation candidate:** `ae763326f4e2d0f000a57bade0462951e386b89f`
- **Documentation head:** `deb3f50a985e07b769dabdd35054b23fa1878d6b`
- **Live URL:** <https://legacy-app-rescue.sociobot.in>
- **Verified:** 2026-09-06 UTC

The implementation is the `ae76332` focus-contrast repair. The only later changes through `deb3f50` are `.factory/handoff.md` and `.factory/repair-7.md`; they do not change the product image. A fresh build of this checkout byte-matched live `index.html`, `app-Dj3LkjBM.js`, and `index-BaJZn4PQ.css`.

## Job, audience, and first action

Fresh desktop (1440×900) and phone (iPhone 13) browser contexts showed this before scrolling:

- **Job:** “Record your Android app before it disappears.”
- **Audience:** people preserving an old app they own.
- **First action:** **Try it with sample data**; adjacent text says it opens a finished record in separate demo storage.

Keyboard activation opened the completed Orchard Notes 1.7.0 preservation record. The persistent **Demo — sample data, nothing is saved** label remained present. At the actual end of the record, Reset demo and Start for real stayed visible. A real-storage sentinel stayed `unchanged` before demo, after reset, and after exit; demo keys were removed on exit. Evidence is under `/work/.evidence/verification-11-live/`.

## Claims

From a fresh clone at `deb3f50`, after the documented `npm ci`, I ran every exact `test` command in `.factory/claims.json` independently. All 36 passed; the complete log is `/tmp/legacy-app-rescue-verify-11.psqgEL/claims.log`.

| Claims | Result |
| --- | --- |
| `manifest-record`, `compatibility-verdict`, `demo-sandbox`, `local-private`, `field-kit`, `platform-builds` | PASS |
| `mobile-install-guidance`, `paid-license`, `binary-manifest`, `installer-verified`, `browser-license-cache`, `browser-license-removal` | PASS |
| `export-refusal-cleanup`, `safety-boundaries`, `input-scope`, `device-serial-hash`, `compatibility-limit`, `merchant-and-refund` | PASS |
| `browser-license-storage`, `release-metadata-privacy`, `apk-transfer-boundary`, `sample-is-noninstallable`, `unsigned-builds`, `no-cli-telemetry` | PASS |
| `license-busy-recovery`, `winget-submission-manifest`, `ci-output`, `free-tier-limit`, `device-context-record`, `custom-output-path` | PASS |
| `device-selection`, `json-output`, `manifest-file-size`, `signer-fallback`, `export-archive-hash`, `release-asset-set` | PASS |

The aggregate `npm test` also passed: 8 Rust tests and 54 Playwright tests. The suite covers invalid and boundary cases (missing/empty input, one-file free limit, refusal to batch without a license, selected-device handling, malformed signer data), recovery (license 429 with retry direction), and both successful and refused Android app-data export paths.

The live landing, README, privacy page, terms, and demo were compared to the claim registry and copy audit. Retained measurable promises map to the 36 entries above; no unlisted public claim was found.

## Live site, accessibility, privacy, and routes

`npm run verify:url -- https://legacy-app-rescue.sociobot.in /work/.evidence/verification-11-live` passed all six checked routes: `/`, `/?demo=1`, `/demo`, `/privacy`, `/terms`, and a deliberate HTTP 404.

- Every normal route had its expected title, `lang="en"`, one `h1`, one `main`, image alternatives, no console or page error, no horizontal overflow at 390 px, and no target below 44 px.
- Axe found zero serious or critical issues. The designed missing page returned HTTP 404, has its own metadata and a home action, and that action moved focus to the landing heading.
- Keyboard checking reached the skip link, sample action, terminal control, reset, exit, and 404 recovery. The sample action has a 3 px dark-ink focus outline on paper (10.44:1); the terminal control has a 3 px cream outline on dark terminal (17.29:1). Reduced-motion mode completed the recording without ongoing animation and retained the visible terminal focus treatment.
- Request logs show direct demo uses only the product origin. Landing uses the product origin plus the GitHub Releases API for release metadata; no cookie was set. The license flow’s tests restrict token storage and verification to the documented browser storage and Sociobot origin.
- HTTPS returned 200 on normal pages, with HSTS, `nosniff`, strict referrer policy, restrictive permissions policy, and a CSP allowing only the stated GitHub and Sociobot connections. The one `404` link seen in a raw crawl was the designed 404 document’s own skip-to-main link; it is expected and works on the page, not a broken user path.
- `/privacy`, `/terms`, release, checkout, and mail links resolved. Checkout returned the expected hosted Dodo 303. There is no product backend, sign-in tenant, service-worker update, or app-data persistence promise to test; the public license allowance was checked instead.

## CLI, package, billing, and quality checks

The packaged v0.1.3 crate was unpacked and installed with `cargo install --path … --root <empty-prefix> --locked`. The installed `rescue --version` returned `rescue 0.1.3`. `rescue --json demo` returned the Orchard Notes package, a 64-character APK SHA-256, and a `compatible` verdict.

| Command or check | Result |
| --- | --- |
| `npm ci` | PASS — 24 packages, 0 vulnerabilities |
| `npm test` | PASS — 8 Rust + 54 Playwright |
| `npm run build:site` | PASS — `dist/site/` |
| `cargo fmt --all -- --check` | PASS |
| `cargo clippy --all-targets --locked -- -D warnings` | PASS |
| `cargo build --release --locked` and `cargo package --locked` | PASS |
| `npm audit --audit-level=high` | PASS — 0 vulnerabilities |
| `npm run verify:package-managers` | PASS — Homebrew, Scoop, winget v0.1.3 metadata |
| `npm run verify:billing` | PASS — Dodo 303; 30 allowed verification requests, then 429 with `Retry-After: 4` |
| `npm run test:performance` | PASS — four mobile runs: 100 performance, LCP 1659/1660/1656/1657 ms, TBT 0, CLS 0 |

The compressed initial JavaScript is 7.95 kB, CSS 4.02 kB, and the self-hosted font total is 34.8 kB, all within the stated budgets.

## Earlier findings

All earlier findings were inspected and remain closed:

| Earlier set | Current disposition and evidence |
| --- | --- |
| F-1-1–F-1-18 | Closed by the current safety, privacy, billing, installer, device, and CLI claim tests listed above. |
| F-1-19–F-1-24 | Closed by the current copy audit: section/action names are plain, and all audited sentences are at most 22 words. |
| F-2-1–F-2-8 | Closed by the live mobile first read and `mobile-install-guidance`, plus the current first-use APK, manifest, CLI, device, and `run-as` wording. |
| F-3-1–F-3-3 | Closed by the actual-end-of-record mobile demo check and the removal of decorative landing labels. |
| F-4-1–F-4-10 | Closed by the free-limit, device/JSON/output, release-set, package-manager, real-404, and live browser checks. |
| F-6-1–F-6-7 | Closed by the paid happy-path fixture, $19 one-time billing check, signer fallback, plain demo copy, macOS labels, and APK terminology checks. |
| F-8-1 | Closed. This verification independently measured and keyboard-reached the repaired paper and terminal focus outlines. |
| Earlier verification-only notes | Cache headers, checkout registration, allowance/429 behavior, paid entitlement, private exports, mobile targets, stale release material, package metadata, and performance were rechecked by the passing commands above. |

## Result

**PASS.** There are zero findings at every severity and zero untested public claims.
