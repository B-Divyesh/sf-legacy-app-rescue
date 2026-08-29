# Independent verification 6 — FAIL

**Candidate:** `1329c1f9f602941bf31e9e309329c761ca6b0476` (`main`)  
**Live URL:** <https://legacy-app-rescue.sociobot.in>  
**Verified:** 2026-08-29 UTC from the supplied clean checkout  
**Work order:** `legacy-app-rescue-verify-6`

## Release decision

**FAIL — do not accept or promote this candidate.** The earlier package-manager and browser-license defects are repaired, and the functional product works. Two current acceptance defects remain: the published v0.1.1 RPM identifies itself as v0.1.0, and mobile LCP repeatedly misses the supplied `<2.5 s` budget.

## Findings by severity

### Major — published v0.1.1 RPM has the same package version as vulnerable v0.1.0

Fresh checks against the public releases found:

- `packaging/nfpm.yaml` still contains `version: 0.1.0`.
- The current `v0.1.1` release's `rescue-linux-x86_64.rpm` matches the published SHA-256 `697efa8aeb51f4ec236859171b688ad340946e72eb88fe071c8dd4dd0859b4f4`.
- Its authoritative RPM headers are `name=legacy-app-rescue`, `version=0.1.0`, `release=1`, `arch=x86_64`, and `sourcerpm=legacy-app-rescue-0.1.0-1.src.rpm`.
- The public v0.1.0 RPM has exactly the same `0.1.0-1` package version and source-RPM identity.
- Extracted binaries prove that the packages are behaviorally different despite identical package identities: the old package reports `rescue 0.1.0`, accepts a bogus-license two-APK batch, exits 0, and writes output. The current package reports `rescue 0.1.1`, rejects the same operation, exits 1, and writes no output.
- The `.deb` is correct at `0.1.1-1`, so the defect is isolated to RPM packaging.

An RPM package manager has no higher package version with which to upgrade the vulnerable v0.1.0 package. This defeats the purpose of the repaired release for existing RPM users. The passing `@claim:platform-builds` test and `npm run verify:package-managers` do not inspect native package metadata, so neither detects this defect.

**Required correction:** derive the nfpm version from the release/Cargo version, publish a package with a strictly newer RPM EVR, and add a release test that reads `.deb`, `.rpm`, macOS package, archive, and binary versions rather than checking URLs and checksums alone.

### Major — mobile LCP misses the required budget in every completed run

Four completed, fresh throttled mobile Lighthouse runs against production produced:

| Run | Performance | LCP | TBT | CLS | Transfer |
| ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | 92 | 2,940 ms | 180 ms | 0 | 163,673 B |
| 2 | 97 | 2,520 ms | 41 ms | 0 | 163,727 B |
| 3 | 94 | 2,888 ms | 137 ms | 0 | 163,700 B |
| 4 | 96 | 2,526 ms | 114 ms | 0 | 163,691 B |

All four completed runs were above 2,500 ms; the middle-pair median was **2,707 ms**. The supplied strict `<2.5 s` budget is not met reliably. Accessibility, best-practices, and SEO scores were 100 in all four runs, and all performance scores remained above 90. An earlier attempt produced a partial 1,900 ms report but ended with a browser-tab crash, so it is excluded rather than counted as a pass.

**Required correction:** reduce or eliminate the recurring LCP delay, then repeat the throttled mobile measurement enough times to demonstrate a stable result below 2.5 seconds.

### Minor — release documentation and manual-release default remain at v0.1.0

- `CHANGELOG.md` ends at `0.1.0` and does not describe the v0.1.1 license-bypass and release repairs.
- `.github/workflows/release.yml` defaults a manual `workflow_dispatch` run to `v0.1.0` even though the package is v0.1.1.

These do not explain the current runtime behavior, but they make release provenance and a manual rebuild error-prone.

## Mandatory claims and first-read gates

`.factory/claims.json` exists with 12 entries. Each ID occurs exactly once as `@claim:<id>` in `tests/product.spec.ts`.

The literal pre-install invocation in the dependency-free checkout reached the common Rust pretest and then all 12 commands exited 127 at `tsc: not found`. After the required clean `npm ci`, every exact declared command was rerun independently and passed:

| Claim | Exact command | Installed result |
| --- | --- | --- |
| `manifest-record` | `npm test -- --grep @claim:manifest-record` | PASS |
| `compatibility-verdict` | `npm test -- --grep @claim:compatibility-verdict` | PASS |
| `demo-sandbox` | `npm test -- --grep @claim:demo-sandbox` | PASS |
| `local-private` | `npm test -- --grep @claim:local-private` | PASS |
| `field-kit` | `npm test -- --grep @claim:field-kit` | PASS |
| `platform-builds` | `npm test -- --grep @claim:platform-builds` | PASS; coverage gap noted above |
| `paid-license` | `npm test -- --grep @claim:paid-license` | PASS |
| `binary-manifest` | `npm test -- --grep @claim:binary-manifest` | PASS |
| `installer-verified` | `npm test -- --grep @claim:installer-verified` | PASS |
| `browser-license-cache` | `npm test -- --grep @claim:browser-license-cache` | PASS |
| `browser-license-removal` | `npm test -- --grep @claim:browser-license-removal` | PASS |
| `export-refusal-cleanup` | `npm test -- --grep @claim:export-refusal-cleanup` | PASS |

The cold first screen **passes** on desktop and 390 px mobile:

- What it does: **“Record your Android app before it disappears.”**
- Who it is for: **“For people preserving an old app they own…”**
- First action: **“Try it with sample data.”** The adjacent copy says it shows a finished record without touching the user's files.
- The action is in the first viewport. One click opens a populated Orchard Notes record.
- The demo banner remains visible, says **“Demo — sample data, nothing is saved”**, and includes Reset demo and Start for real.

Reset retained only `demo:legacy-app-rescue:opened`; Start for real removed the demo namespace. The public claim wording maps to the listed claim categories; no new material unlisted outcome claim was found.

## Clean install, tests, type/lint, and production build

After `npm ci`:

```text
npm test                                  PASS — 8 Rust + 24 Playwright tests
npm run check                             PASS — TypeScript no-emit check
npm run build                             PASS — produced dist/site
cargo fmt --all -- --check                PASS
cargo clippy --all-targets --locked -- -D warnings
                                          PASS
cargo build --release --locked            PASS
cargo package --locked --no-verify --allow-dirty
                                          PASS
npm audit --audit-level=high              PASS — 0 vulnerabilities
npm run verify:package-managers           PASS, but misses RPM metadata
npm run verify:billing                    PASS
```

The exact production output is 22,072 B JavaScript (7,887 B gzip), 14,389 B CSS (3,981 B gzip), 34,800 B of fonts, and a 37,026 B mobile hero. The JS, CSS, font, image, and total-transfer budgets pass.

## Packaged CLI and job-to-be-done

`target/package/legacy-app-rescue-0.1.1.crate` was expanded and installed into an empty consumer prefix. The installed binary:

- reports `rescue 0.1.1` and provides useful top-level and `scan` help;
- completes `--json demo` with schema `1.0`, `in.sociobot.orchardnotes`, signer evidence, API 21→28, arm64, an Android 13 device, and a `compatible` verdict;
- scans the generated APK normally and writes a parseable mode-0600 manifest;
- inventories a representative fake authorized device, records a 16-character serial hash, Android 13/API 33, both CPUs, and user packages, then produces a compatible verdict;
- exits 2 for a missing APK argument and `--serial` without `--device`;
- exits 1 with a corrective message for a missing path, a directory, a malformed ZIP, no authorized device, and multiple attached devices;
- rejects a bogus-license two-APK batch with exit 1 and no output file;
- passes the app-data success/refusal test: successful output is private, refusal removes the partial archive, and no root path is attempted.

The demo's generated manifest is mode 0644 because it contains fictional data; a real `scan` manifest is mode 0600.

## Public release and installers

The GitHub latest release is v0.1.1 and publishes Linux tar/deb/rpm, Windows ZIP, Intel and Apple-silicon macOS tar/pkg assets, `SHA256SUMS`, `latest.json`, Homebrew, and Scoop metadata. `latest.json` parses and identifies v0.1.1 assets.

The Linux archive checksum matched:

```text
502e045a0984b6cd055427e3758919d9f16314f5fc91b7fd4148f25069ad1206  rescue-linux-x86_64.tar.gz
```

Its binary reports v0.1.1 and completes the JSON demo. The live `install.sh` was run into a fresh directory; it verified SHA-256, installed v0.1.1, and the installed binary completed the demo. The public Homebrew tap and documented Scoop/winget manifests resolve to v0.1.1 and current checksums. The RPM exception remains release-blocking as detailed above.

Tag `v0.1.1` resolves to commit `72552e0fabf75c9f00583f1297faa05ef24259b9`. Candidate changes after that tag do not alter Rust source; they repair browser/package metadata and tests. The live website is the candidate build: every publicly served file in `dist/site` matched production byte-for-byte. For example:

| File | Candidate and live SHA-256 |
| --- | --- |
| `index.html` | `5d14f77271908d4b825d9a7e9684a2c76e932c42a0e06d372502c75f0568dcc4` |
| `assets/app-BeMnReYW.js` | `74362702292b2bd084084ac3beba1fd6b00e766b8f1507e9194302dc8b91a3be` |
| `assets/index-D_riv8nn.css` | `837619895685ae3f42a817d6cd5c8a57cd52a53d50724c1bec23bdfdc8622f5a` |
| `assets/field-guide-hero.webp` | `f7fe143805f2d7dfd6b6c9645f5100131e5070ba124a192584f2f41e6b2cbe25` |

`staticwebapp.config.json` is deployment configuration and correctly returns the designed 404 rather than being exposed as a public file.

## Live browser, accessibility, privacy, and navigation

Fresh Chromium coverage at 1440×900 and 390×844 found:

- `/`, `/demo`, `/privacy`, and `/terms` return 200, have route-specific titles, `lang="en"`, exactly one `h1`, one main landmark, and no images missing alt text.
- A missing route returns HTTP 404 with the designed page, a useful heading, and a home link.
- Axe found zero serious or critical findings on all four real routes at both sizes and on the 404 page.
- There were no console errors, page errors, or horizontal overflow on any tested real route.
- Full keyboard traversal reached 19 focusable controls before returning to the document. Every interactive control had the designed 3 px focus ring and a target of at least 44×44 px. Enter operated the skip link, navigation, and license removal; Space operated the terminal pause control. SPA navigation and browser Back changed the title and focused the route `h1`.
- Reduced motion rendered the complete terminal immediately, changed its control to Replay, and reduced the manifest animation to 0.01 ms.
- Browser license removal deleted both `sb_license:legacy-app-rescue` and `sb_license_status:legacy-app-rescue` and announced completion.
- `/demo` made only same-origin requests. The landing page additionally contacted only GitHub's documented Releases API. No analytics, CDN fonts/scripts, service worker, or sign-in flow exists.
- Every discovered HTTP(S) link returned 200 or its expected GitHub 302 / Sociobot checkout 303. Mail links were excluded from HTTP crawling.

The factory `verify-url.sh` passed with HTTPS 200, a title, language, one `h1`, main landmark, named buttons, image alternatives, and no console errors.

Production sends HSTS, `nosniff`, strict-origin referrer policy, restrictive permissions policy, and a CSP limited to self, GitHub's API, and Sociobot's API. HTML uses `public, must-revalidate, max-age=30`; hashed JS, CSS, and image assets use `public, max-age=31536000, immutable`.

## Billing allowance and non-applicable checks

The production checkout returned 303 to `checkout.dodopayments.com` with no `Retry-After`. A fresh client received **30** allowed license-verification responses; request **31** returned **429** with `Retry-After: 4`. A later invalid-token check returned the expected no-store JSON response and allowed the production site origin through CORS.

This is a static site plus local CLI. It has no product-owned backend, service-worker PWA, or sign-in flow, so backend concurrency/persistence/health, PWA offline-update, and Entra-authority checks are not applicable. The preservation workflow does not gain an obvious safe capability from generative AI, so no missed AI leverage finding applies.

## Retest required

1. Publish an RPM with a version newer than `0.1.0-1`, verify a normal upgrade from the v0.1.0 package, and add native-package metadata checks.
2. Bring repeat mobile LCP reliably below 2.5 seconds.
3. Update the changelog and manual workflow default.
4. Rerun every claim, clean build, consumer CLI, native-package, installer, billing, accessibility, privacy, deployment-identity, and repeated Lighthouse check.
