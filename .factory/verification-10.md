# Independent verification 10 — PASS

**Candidate:** `d22b86643c655550de2a091166d079282a1ee3e3` (`main`)  
**Release:** `v0.1.3`  
**Live URL:** <https://legacy-app-rescue.sociobot.in>  
**Verified:** 2026-08-29 UTC from the supplied clean checkout  
**Work order:** `legacy-app-rescue-verify-10`

## Decision

**PASS — accept this candidate.** The previously reported deployment-only failure does not reproduce. The live static product is byte-identical to this candidate's production build, the published installers work, and no release-blocking defect was found.

## Mandatory claims and cold first read

`.factory/claims.json` exists and contains 36 entries. I first invoked every listed command literally before dependency installation. Each invocation reached the shared Rust pretest, then exited 127 at `tsc: not found` because a clean checkout has no `node_modules`; no tagged assertion ran. After the repository's required `npm ci` bootstrap (24 packages, zero vulnerabilities), I reran every exact command independently. **All 36 claim tests passed.** This is an installation precondition, not a product-claim failure. Aggregate output is retained at `/tmp/legacy-app-rescue-verification-10-evidence/claims-installed.log`.

| Claim | Result | Claim | Result |
| --- | --- | --- | --- |
| `manifest-record` | PASS | `compatibility-verdict` | PASS |
| `demo-sandbox` | PASS | `local-private` | PASS |
| `field-kit` | PASS | `platform-builds` | PASS |
| `mobile-install-guidance` | PASS | `paid-license` | PASS |
| `binary-manifest` | PASS | `installer-verified` | PASS |
| `browser-license-cache` | PASS | `browser-license-removal` | PASS |
| `export-refusal-cleanup` | PASS | `safety-boundaries` | PASS |
| `input-scope` | PASS | `device-serial-hash` | PASS |
| `compatibility-limit` | PASS | `merchant-and-refund` | PASS |
| `browser-license-storage` | PASS | `release-metadata-privacy` | PASS |
| `apk-transfer-boundary` | PASS | `sample-is-noninstallable` | PASS |
| `unsigned-builds` | PASS | `no-cli-telemetry` | PASS |
| `license-busy-recovery` | PASS | `winget-submission-manifest` | PASS |
| `ci-output` | PASS | `free-tier-limit` | PASS |
| `device-context-record` | PASS | `custom-output-path` | PASS |
| `device-selection` | PASS | `json-output` | PASS |
| `manifest-file-size` | PASS | `signer-fallback` | PASS |
| `export-archive-hash` | PASS | `release-asset-set` | PASS |

The cold first screen also passes:

- What it does: **“Record your Android app before it disappears.”** The next sentence says it records an Android app file and checks another device.
- For whom: people preserving an old app they own.
- First action: **“Try it with sample data.”** Adjacent copy says it opens a finished record in separate demo storage.

The action is visible without scrolling on desktop and at 390 px. Keyboard activation opens the completed Orchard Notes record in one click and shows the persistent **“Demo — sample data, nothing is saved”** banner. Reset and Start for real remain available at the bottom of the record. The landing page, README, privacy page, terms, and demo copy have no uncovered claim-like sentence after comparison with the registry.

## Clean build and test matrix

All installed-dependency checks passed at the candidate commit:

```text
npm ci                                         PASS — 24 packages, 0 vulnerabilities
# all 36 exact .factory/claims.json commands   PASS
npm test                                       PASS — 8 Rust + 53 Playwright tests
npm run check                                  PASS
npm run build                                  PASS — dist/site
cargo fmt --check                              PASS
cargo clippy --all-targets --all-features -- -D warnings
                                                PASS
cargo build --release --locked                 PASS
cargo package --locked                         PASS — clean clone, 90 files, 3.3 MiB compressed
npm audit --audit-level=high                    PASS — 0 vulnerabilities
npm run verify:url -- <live-url> <evidence>    PASS — 6 routes
npm run verify:package-managers                 PASS
npm run verify:billing                          PASS
npm run test:performance                        PASS
```

The exact Vite output is 22,708 bytes JavaScript (7.95 kB gzip), 14,207 bytes CSS (3.97 kB gzip), 34,800 bytes of self-hosted fonts, and a 50,182-byte mobile hero. These are well below the 200/50/120/300 kB budgets.

## CLI, package, and end-to-end behavior

I cloned candidate `d22b866…` into a new temporary source tree, ran `cargo package --locked`, unpacked the resulting crate, and installed it with `cargo install --path … --root … --locked` into an empty consumer root.

- `rescue --version` reports `rescue 0.1.3`; `--help` documents scan, device, demo, license, JSON, and CI modes.
- `rescue demo` creates a unique temporary folder and reports the preservation record path. `rescue --json demo` returns schema `1.0`, `in.sociobot.orchardnotes`, a 64-character APK hash, signer evidence, Android 13 arm64 device facts, and a compatible verdict.
- A separate user-supplied APK scan recorded package/version/SDK fields, exactly matched the source file's 576-byte size and SHA-256, and wrote the requested record with mode `0600`.
- Missing APK, directory input, and empty APK all exit 1 with a reason and next step. A missing required APK exits 2 with command usage. Missing ADB exits 1 and tells the user to install Android Platform Tools.
- Integration and unit cases cover the free one-file boundary, unlicensed batch refusal, selected-device behavior, Android-version and CPU incompatibility, binary XML, malformed signer fallback, app-data export hash and mode, Android refusal cleanup, and absence of a root bypass.
- Demo and scan also pass with all HTTP proxy endpoints unusable, corroborating the no-telemetry/offline CLI behavior.

No server, account, Android device, or network is needed for the bundled demo.

## Live browser, accessibility, privacy, and performance

The project verifier checked `/`, `/?demo=1`, `/demo`, `/privacy`, `/terms`, and a genuine HTTP 404 at 390 px. Every applicable route has the correct title, `lang="en"`, one `h1`, one `main`, image alternatives, no horizontal overflow, no sub-44 px target, no console/page error, and zero Axe serious/critical findings. All four app routes also have no overflow at 320 px.

Independent keyboard checks found:

- First Tab reaches **Skip to main content** with a 3 px `#d6a744` outline and 3 px offset; Enter focuses `main`.
- The sample action is 348 × 48.8 CSS px, has the same visible focus treatment, and Enter opens `/?demo=1`.
- Demo reset/exit work in the verifier's keyboard path, and the 404 home link returns focus to the landing heading.
- With reduced motion requested, there are zero running animations, the full terminal result appears immediately, and the control reads Replay.

Fresh browser request logs show:

- Landing: only the product origin and GitHub's Releases API. It writes only the one-hour `release:legacy-app-rescue` cache and sets no cookie.
- Direct demo: only the product origin. It writes only `demo:legacy-app-rescue:opened` and sets no cookie.
- A fake invalid license return: product origin, GitHub Releases, and the documented Sociobot verification endpoint only. The token is stripped from the address bar, the response is handled without console error, and the page says the license is inactive.

The live root sends HSTS, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, a restrictive permissions policy, and a CSP limited to self plus the documented GitHub and Sociobot APIs. HTML uses `Cache-Control: public, must-revalidate, max-age=30`; hashed JavaScript/CSS/assets use `public, max-age=31536000, immutable`.

Four throttled mobile performance runs scored 100, 100, 100, and 99. LCP values were 1,684, 1,692, 1,669, and 1,759 ms (median 1,688 ms), CLS was 0, and TBT was 0–71 ms. An independent live Lighthouse run scored **100 performance / 100 accessibility / 100 best practices / 100 SEO**, with LCP 1,389 ms, TBT 0, and CLS 0.

## Deployment identity, installers, and request allowance

All served production resources compared below are byte-identical to the fresh candidate build:

| Resource | SHA-256 |
| --- | --- |
| `/` / `dist/site/index.html` | `45da7ad59359ce832937667036f09a2e1f9c61b1201af3e0a149e4dff7ac5464` |
| `assets/app-Bh29BZ8c.js` | `8b9b354963e7a9c533bceed13dd24be07762ac9cd73769744e0a069e3efdd78f` |
| `assets/index-DZjDUoYJ.css` | `475ec7206e02e5c36457a416c3bee9fadebe401322a60b2403622accd13fea8d` |
| `assets/field-guide-hero.webp` | `f7fe143805f2d7dfd6b6c9645f5100131e5070ba124a192584f2f41e6b2cbe25` |
| `assets/field-guide-hero-800.webp` | `619f49ee467c7b825df94a7385065fb036e86a9de904be60fa9b7b1054587b49` |
| `install.sh` | `490d27892a1cf768219bb3855758fcc4b107a3040e53c70eb43cfc4305dc5ec9` |
| `install.ps1` | `13e5b6bf8f50af0f275710ecc8dee464d01cdf26d20e102dc8c1bc867f2e61b1` |
| HTTP 404 document | `1f0ec3d9a858273fd87ccdda3871b50751151f25b177c326d5be257cc1febcd1` |

The public v0.1.3 release provides Linux tar/DEB/RPM, Windows ZIP, Intel and Apple-silicon macOS tar/PKG files, `SHA256SUMS`, and valid `latest.json`. The downloaded Linux archive matches both manifests at `1518b41be1372cffb465819c580785d0f4cde1b34f2e2d0604479ff17a52bf42`. The live one-line installer independently verified it, installed into an empty directory, and ran the JSON demo. Homebrew, Scoop, and winget checks pass. All rendered HTTP links return 200, except the expected hosted checkout redirect; email links were excluded.

The checkout returns the required Dodo-hosted 303. The documented license verification allowance is enforced: requests **1–30** return 200; request **31** returns **429** with **`Retry-After: 4`**.

This is a local-first CLI with a static site. It has no product-owned backend, service worker/PWA, or sign-in flow, so backend concurrency/persistence/health, service-worker update/offline reload, and Entra authority checks do not apply. The deterministic preservation job does not need an AI feature.

## Findings by severity

None.
