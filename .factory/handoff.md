# Legacy App Rescue handoff

## Independent verification 7 — PASS

Candidate `e0c033680c317d1e2ca73f73c1280de183eb43ec` was independently verified against <https://legacy-app-rescue.sociobot.in> on 2026-08-29 UTC and **PASSes** release acceptance. No severity findings remain.

Fresh evidence is recorded in [verification-7.md](verification-7.md): all 12 declared claim commands and the 26-test clean suite pass; the first-read and one-click demo gates pass; Rust, TypeScript, production build, package, clean-consumer CLI, public installer, accessibility, privacy, performance, live deployment identity, and billing-rate-limit checks pass. The live license service allowed 30 verification requests and returned `429` with `Retry-After: 4` on request 31.

The v0.1.2 Linux archive checksum, installer, `.deb` metadata, and RPM checksum/header (`0:0.1.2-1 x86_64`) were exercised fresh.

## Status: PASS

Release-blocking findings from independent verification 6 (`cc79db5`, candidate `1329c1f`) are repaired, published, deployed, and verified on 2026-08-29 UTC.

- Product: <https://legacy-app-rescue.sociobot.in>
- Release: <https://github.com/B-Divyesh/sf-legacy-app-rescue/releases/tag/v0.1.2>
- Repair commits: `9b4ecd3` (product/package fix), `110168b` (exact published-RPM CI upgrade), `4fbd013` (v0.1.2 package manifests)
- Successful release runs: `33226137808` and exact-upgrade rerun `33226296389`

## Repairs

### Native package version and upgrade

- Bumped Cargo, npm, site, changelog, and release defaults to `0.1.2`.
- Replaced the hard-coded nfpm version with `${PACKAGE_VERSION}` derived from `Cargo.toml`.
- The release rejects a tag that differs from the Cargo version.
- Linux CI reads `.deb` and `.rpm` metadata and runs the binaries extracted from the Debian package and tar archive.
- macOS CI reads `.pkg` metadata and runs each archive binary.
- Windows CI expands the ZIP and runs its binary.
- Linux CI installs the actual public v0.1.1 RPM, confirms its broken native EVR is `0.1.0-1`, runs `dnf upgrade` with the candidate RPM, confirms `0.1.2-1`, and runs the installed `rescue 0.1.2` binary.
- `scripts/release-manifest.mjs` now requires an explicit release tag instead of silently defaulting to v0.1.0.

Public retest evidence:

```text
public v0.1.1 RPM: legacy-app-rescue 0:0.1.0-1 x86_64
public v0.1.2 RPM: legacy-app-rescue 0:0.1.2-1 x86_64
installed-before=0.1.0-1
installed-after=0.1.2-1
rescue 0.1.2
```

The public v0.1.2 RPM SHA-256 is `ff1b09a75205238e8def43a65f2d7562b4175d2860edc910bd1ddb89ce1059fa`. The Debian package reports `0.1.2-1`. `latest.json` lists eight platform assets, all returning HTTP 200. SHA256SUMS matched the tested RPM, Debian package, and Linux archive. The repository Homebrew/Scoop/winget manifests and the public Homebrew tap resolve to v0.1.2 with current checksums.

### Stable mobile LCP

- The landing page is pre-rendered into production HTML, so its headline and primary action no longer wait for JavaScript.
- SPA routing preserves the pre-rendered first route and keeps the existing focus/back behavior.
- Added an 800 px WebP derivative so a Lighthouse mobile DPR does not fetch the 1200 px image after narrowly outgrowing 720 px.
- Added a JavaScript-disabled first-screen regression and `npm run test:performance`, which performs four throttled mobile Lighthouse runs and fails if any run or the median reaches 2,500 ms.

Before repair, production reproduced at 2,614 ms LCP. Four local repaired runs measured 1,658, 1,655, 1,659, and 1,657 ms (median 1,657.5 ms). Four production runs measured:

| Run | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS | Transfer |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | 100 | 100 | 100 | 100 | 1,378 ms | 0 ms | 0 | 106,583 B |
| 2 | 100 | 100 | 100 | 100 | 1,365 ms | 0 ms | 0 | 106,571 B |
| 3 | 100 | 100 | 100 | 100 | 1,371 ms | 0 ms | 0 | 106,623 B |
| 4 | 100 | 100 | 100 | 100 | 1,373 ms | 0 ms | 0 | 106,565 B |

Production median LCP is **1,372 ms**, below the strict 2,500 ms budget with 1,128 ms headroom.

## Verification

Clean/local gates:

```text
npm ci                                      PASS — 0 vulnerabilities
npm test                                    PASS — 8 Rust + 26 Playwright tests
npm run check                               PASS
npm run build                               PASS — dist/site
cargo fmt --all -- --check                  PASS
cargo clippy --all-targets --locked -- -D warnings
                                             PASS
cargo build --release --locked              PASS
cargo package --locked --no-verify --allow-dirty
                                             PASS — 0.1.2 crate
npm audit --audit-level=high                PASS — 0 vulnerabilities
npm run test:performance                    PASS — four runs; median 1,657.5 ms
npm run verify:billing                      PASS — checkout 303; 30 allowed, request 31 returned 429 + Retry-After
npm run verify:package-managers             PASS — Homebrew, Scoop, winget v0.1.2
actionlint .github/workflows/release.yml     PASS
```

A clean consumer installed `target/package/legacy-app-rescue-0.1.2.crate`; its binary reported `rescue 0.1.2`, and its JSON demo returned schema `1.0`, package `in.sociobot.orchardnotes`, and verdict `compatible`.

The public one-line Linux installer verified SHA-256, installed `rescue 0.1.2` into an empty directory, and completed the JSON demo.

Live browser verification covered `/`, `/demo`, `/privacy`, and `/terms` at 1440×900 and 390×844. Every route returned 200 with one `<h1>`, one `<main>`, no console/page errors, no horizontal overflow, no serious/critical axe issues, and no undersized mobile controls. The skip link focused `main`; the JavaScript-disabled 390 px first screen rendered its heading/action and selected the 800 px hero. `/demo` made only same-origin requests. The designed missing route returned HTTP 404 with a home link. No service worker or offline-update claim exists; the CLI demo remains usable with unreachable HTTP proxies.

`verify-url.sh` passed the deployed URL. Live HTML, JavaScript, CSS, and the 800 px hero matched `dist/site` byte-for-byte. Production returns HSTS, nosniff, strict-origin referrer policy, restrictive permissions policy, and the declared CSP.

## Run it

```sh
npm ci
npm test
npm run test:performance
npm run verify:package-managers
npm run verify:billing
npm run build
cargo fmt --all -- --check
cargo clippy --all-targets --locked -- -D warnings
cargo package --locked --no-verify --allow-dirty
```

## Known gaps and operator action

- No release-blocking gaps remain.
- GitHub Actions does not currently expose `FACTORY_GITHUB_TOKEN` to the release job, so its optional Homebrew-tap step was skipped. The v0.1.2 tap was updated through the GitHub API at commit `77201e2`; configure that secret to automate future tap updates.
- macOS and Windows packages remain unsigned as documented; signing requires owner certificates.

## Adversarial first-read review 1 — 2026-08-29

Reviewer-only work order `legacy-app-rescue-review-1` completed without changing product code. The live site was inspected cold at 390 px and desktop, all twelve declared claim commands were run after `npm ci`, and `npm test`, `npm run verify:billing`, and `npm run build` passed. The demo was verified at `/demo`: it showed Orchard Notes sample data, used the `demo:` storage namespace, reset correctly, cleared on Start for real, and made only same-origin demo requests.

The review result is **FAIL**. `.factory/review-1.md` records 18 blocking unlisted-claim findings and 6 minor copy findings, with exact quotes and concrete fixes. No product implementation was modified. Resolve those findings, then repeat the independent claims and live review.
