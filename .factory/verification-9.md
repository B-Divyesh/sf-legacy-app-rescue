# Independent verification 9 — PASS

**Candidate:** `a0bfa93abdbc35cfb33ae9b39decab3e1ef104d9` (`main`)  
**Release:** `v0.1.3`  
**Live URL:** <https://legacy-app-rescue.sociobot.in>  
**Verified:** 2026-08-29 UTC from the supplied clean checkout  
**Work order:** `legacy-app-rescue-verify-9`

## Decision

**PASS — accept this candidate.** The previously reported deployment-only failure does not reproduce. The live static product is byte-identical to this candidate's production build, sends the intended cache and security headers, and exposes working v0.1.3 installers. No release-blocking defect was found.

## Mandatory claims and cold first read

`.factory/claims.json` exists with 35 entries. After the locked dependency install, I ran every exact `test` command independently. All 35 passed. Logs are `/tmp/claim-<id>.log`; the aggregate result is `/tmp/claim-results.tsv` with 35 zero exit codes.

The literal pre-install command reached the repository pretest but could not start TypeScript because `node_modules` did not yet exist (`tsc: not found`, exit 127). No tagged claim test ran in that attempt. `npm ci` then installed the clean clone's locked dependencies with zero vulnerabilities; every declared command passed. This is an installation precondition, not a failed product claim.

| Claim ID | Result |
| --- | --- |
| `manifest-record` | PASS |
| `compatibility-verdict` | PASS |
| `demo-sandbox` | PASS |
| `local-private` | PASS |
| `field-kit` | PASS |
| `platform-builds` | PASS |
| `mobile-install-guidance` | PASS |
| `paid-license` | PASS |
| `binary-manifest` | PASS |
| `installer-verified` | PASS |
| `browser-license-cache` | PASS |
| `browser-license-removal` | PASS |
| `export-refusal-cleanup` | PASS |
| `safety-boundaries` | PASS |
| `input-scope` | PASS |
| `device-serial-hash` | PASS |
| `compatibility-limit` | PASS |
| `merchant-and-refund` | PASS |
| `browser-license-storage` | PASS |
| `release-metadata-privacy` | PASS |
| `apk-transfer-boundary` | PASS |
| `sample-is-noninstallable` | PASS |
| `unsigned-builds` | PASS |
| `no-cli-telemetry` | PASS |
| `license-busy-recovery` | PASS |
| `winget-submission-manifest` | PASS |
| `ci-output` | PASS |
| `free-tier-limit` | PASS |
| `device-context-record` | PASS |
| `custom-output-path` | PASS |
| `device-selection` | PASS |
| `json-output` | PASS |
| `manifest-file-size` | PASS |
| `export-archive-hash` | PASS |
| `release-asset-set` | PASS |

Cold first read passes on desktop and 390 px mobile:

- What it does: **“Record your Android app before it disappears.”** The next sentence says it records an Android app file and checks another device.
- For whom: people preserving an old app they own.
- First action: **“Try it with sample data.”** Adjacent copy says it opens a finished record in separate demo storage.

The action is visible without scrolling at 390 px (348 × 48.8 CSS px). Keyboard activation opens the Orchard Notes sample and the persistent **“Demo — sample data, nothing is saved”** banner. Reset demo reloads only `demo:legacy-app-rescue:opened`; Start for real removes the demo namespace and returns focus to the landing heading.

## Clean build and test matrix

All commands passed from candidate `a0bfa93…`:

```text
npm ci                                         PASS — 24 packages, 0 vulnerabilities
npm test                                       PASS — 8 Rust + 52 Playwright tests
npm run check                                  PASS
npm run build                                  PASS — dist/site
cargo fmt --all -- --check                     PASS
cargo clippy --all-targets --locked -- -D warnings
                                                PASS
cargo build --release --locked                 PASS
cargo package --locked --no-verify --allow-dirty
                                                PASS — 85 files, 3.3 MiB compressed
npm audit --audit-level=high                   PASS — 0 vulnerabilities
npm run verify:url -- <live-url> <evidence>    PASS
npm run verify:package-managers                PASS
npm run verify:billing                         PASS
npm run test:performance                       PASS
```

The exact Vite build is 22,799 bytes JavaScript (8,018 bytes gzip) and 14,207 bytes CSS (3,995 bytes gzip). The two self-hosted fonts total 34,800 bytes. The selected 800 px mobile hero is 50,182 bytes. All are below contract budgets.

## Packaged CLI and end-to-end behavior

I unpacked `target/package/legacy-app-rescue-0.1.3.crate`, installed it with `cargo install --path ... --root ... --locked` into a new consumer root, and exercised the installed binary.

- `rescue --version` reports `rescue 0.1.3`; `--help` documents scan, device, demo, license, JSON, and CI modes.
- `rescue demo` creates the fictional Orchard Notes APK in a unique temporary directory and prints the preservation-record path.
- `rescue --json demo` emits schema `1.0`, package `in.sociobot.orchardnotes`, a 64-character APK SHA-256, signer evidence, Android 13 arm64 device facts, and a `compatible` verdict.
- A normal packaged-binary scan writes the requested path with mode `0600`, byte size `690`, signer evidence, and the expected whole-file hash.
- Missing APK, directory input, and empty APK exit 1 with a reason and next step. Missing required APK arguments exit 2 with usage. An unlicensed batch exits 1 and names the Field Kit activation step.
- Device inventory and `scan --device` without ADB exit 1 and tell the user to install Android Platform Tools.
- The passing fake-ADB integrations cover authorized device inventory, multi-device `--serial` selection, SDK/CPU match reasons, 16-character serial hashing, private `0600` data export, export SHA-256, refusal cleanup, and no root bypass.
- The offline/proxy claim runs demo and scan with HTTP(S)/ALL proxy endpoints unusable. Both pass without network access.

## Live browser, accessibility, and privacy

`npm run verify:url` checked `/`, `/?demo=1`, `/demo`, `/privacy`, `/terms`, and a real HTTP 404. At 390 px, every applicable route has its correct title, `lang="en"`, one `h1`, one `main`, no missing image alternative, no horizontal overflow, no target below 44 px, no console/page error, and zero axe serious/critical findings. Desktop cold load also had no console or page error.

Independent keyboard-only evidence:

- First Tab focuses **Skip to main content** with a designed 3 px `#d6a744` outline and 3 px offset.
- Enter moves focus to `main`.
- The next Tab reaches **Try it with sample data**; Enter opens the demo.
- Tab/Space operates Reset demo, and Tab/Enter operates Start for real.
- In `prefers-reduced-motion: reduce`, the terminal is complete with a Replay control and the page has no active animations.

Fresh browser request logs show:

- Landing: product origin plus `https://api.github.com` for release metadata.
- Direct demo: product origin only.
- Fake license return: product origin, GitHub release metadata, and `https://api.sociobot.in`; the fake token's only external destination is Sociobot. The query token is stripped from the address bar.
- No cookies, analytics, third-party fonts, or third-party scripts were observed.

The live root response sends HSTS, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, restrictive permissions policy, and a CSP limited to self plus the documented GitHub and Sociobot APIs. HTML uses `Cache-Control: public, must-revalidate, max-age=30`; hashed JS, CSS, fonts, and images use `public, max-age=31536000, immutable`.

Four throttled mobile Lighthouse performance samples scored 92, 100, 99, and 100, with LCP 1661, 1656, 1734, and 1717 ms (median 1689 ms), CLS 0, and TBT 0–334 ms. A separate full-category run scored **100 performance / 100 accessibility / 100 best practices / 100 SEO**, with LCP 1679 ms, TBT 0, and CLS 0.

## Deployment identity, installers, and billing allowance

Fresh build/live SHA-256 values match exactly:

| Resource | SHA-256 |
| --- | --- |
| `/` / `dist/site/index.html` | `10ac67490ff34f911ad74a45ff95818c76e5be8bdb3a08a2492675414bbe3963` |
| `assets/app-DKqjZMGV.js` | `cbfdf10cc4d2583db84492ad691165898b708fa770b7e6eb63627e9806b49317` |
| `assets/index-DZjDUoYJ.css` | `475ec7206e02e5c36457a416c3bee9fadebe401322a60b2403622accd13fea8d` |
| `assets/field-guide-hero.webp` | `f7fe143805f2d7dfd6b6c9645f5100131e5070ba124a192584f2f41e6b2cbe25` |
| `assets/field-guide-hero-800.webp` | `619f49ee467c7b825df94a7385065fb036e86a9de904be60fa9b7b1054587b49` |
| `assets/field-guide-hero-720.webp` | `c3e349f11868c635fe6e7fd01a902af3ce7bba5666ec849a90c92e08835cde5b` |
| `install.sh` | `490d27892a1cf768219bb3855758fcc4b107a3040e53c70eb43cfc4305dc5ec9` |
| `install.ps1` | `13e5b6bf8f50af0f275710ecc8dee464d01cdf26d20e102dc8c1bc867f2e61b1` |
| HTTP 404 document | `1f0ec3d9a858273fd87ccdda3871b50751151f25b177c326d5be257cc1febcd1` |

The public v0.1.3 release contains Linux tar/DEB/RPM, Windows ZIP, Intel and Apple-silicon macOS tar/PKG files, `SHA256SUMS`, and `latest.json`. The downloaded Linux archive hash is `1518b41be1372cffb465819c580785d0f4cde1b34f2e2d0604479ff17a52bf42`, matching both published manifests. The live one-line installer verified that checksum, installed into an empty directory, and ran the v0.1.3 JSON demo. The downloaded DEB and RPM also match `SHA256SUMS`; DEB metadata reports `legacy-app-rescue 0.1.3-1 amd64`. Homebrew, Scoop, and winget verification passed.

The live checkout returns the required Dodo-hosted 303 with no `Retry-After`. The documented verification allowance is enforced: requests 1–30 returned 200; request 31 returned **429** with **`Retry-After: 4`**.

The v0.1.3 release tag predates later site/copy/test polish. Candidate changes since the tag do not alter CLI runtime behavior; the only `src/` diff adds two test assertions. The installed release binary therefore exercises the candidate's runtime CLI implementation, while byte matching separately proves the current site deployment.

This product is a local-first CLI plus static site. It has no product-owned backend, service worker/PWA, or sign-in flow, so backend concurrency/persistence/health, service-worker update/offline reload, and Entra authority checks do not apply. A generative-AI step would not improve the deterministic preservation job.

## Findings by severity

None.
