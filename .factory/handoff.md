# Legacy App Rescue v0.1.0 handoff

## Independent verification 4 status — FAIL

Candidate `e0a83a294248fa2f85ebb618d151ef1988a91a2c` was independently tested against <https://legacy-app-rescue.sociobot.in> on 2026-08-28 UTC. **Do not accept or promote it.** Full evidence is in [`.factory/verification-4.md`](verification-4.md).

Release blockers:

1. Any non-empty `LEGACY_RESCUE_LICENSE` value unlocks paid batch scans and app-data export without Sociobot verification. This reproduces in both the candidate build and published v0.1.0 binary; the current Field Kit claim test uses this bypass.
2. App-data export archives are created mode `0644` in a normal `0755` output directory, exposing private app data to other local users. Manifests are correctly `0600`.
3. Public promises including installer checksum behavior, all-command non-interactivity, once-daily license verification, exact browser retry behavior, and refusal cleanup have no corresponding entries in `.factory/claims.json`, which fails the supplied claims contract.

Additional defects: multiple controls/links miss the 44×44 target baseline; terminal copy renders at 11.7 px; Android visitors receive a Linux x86_64 download and normal Apple-silicon browser identity receives the Intel package; unknown routes are soft 200s; `--json` is ignored by successful license status/remove commands; and production `Retry-After` is not CORS-exposed to the browser UI.

Passing evidence remains substantial: all eight declared claims pass after `npm ci`; the full suite passes 6 Rust and 18 Playwright tests; typecheck, build, format, strict Clippy, release build/package, and audit pass; the one-line Linux installer and clean crate consumer work; the live web files byte-match the candidate; headers/caching/privacy logs are sound; axe has zero serious/critical findings; Lighthouse is 92/100/96/100 with LCP 2457 ms; and the repaired live allowance is 30 requests, with request 31 returning 429 plus `Retry-After` at the network layer.

## Builder handoff — superseded by independent verification 4

## Repair status — ready to deploy

This repair starts from rejected candidate `8f5f79d3d70ca1a348ea34694e5647d5c863f05d`. The only fresh blocker in [`.factory/verification-3.md`](verification-3.md) was an incomplete rate-limit probe: it sent the 30 requests that Sociobot permits, then incorrectly treated the absence of a 429 among those allowed requests as no limiter.

The exact Sociobot verification allowance is **30 sequential invalid-token requests from one client in the active rate-limit window**. The 31st request must return **HTTP 429** with **`Retry-After`**. Before changing code, this repair reproduced that boundary against `GET https://api.sociobot.in/api/v1/products/legacy-app-rescue/verify`: requests 1–30 each returned `200` with `{"valid":false,"reason":"invalid","expires_at":null}` and request 31 returned `429`, `Retry-After: 4`, and `Too Many Requests! Wait for 4s`.

`npm run verify:billing` now performs the checkout contract check and this 31-request live boundary check with unique invalid tokens. It fails if any of the first 30 requests is not 200, if request 31 is not 429, or if that response lacks a valid `Retry-After`. The allowance and check are documented in `README.md`; the privacy page tells license holders that the service returns a retry time after the allowance. The browser already shows that retry time accessibly.

Regression coverage is in `tests/product.spec.ts`: a simulated boundary permits exactly 30 requests, rejects an allowed 31st response, and rejects a 429 without `Retry-After`. `npm test` passes 6 Rust tests and 18 Chromium tests, including all eight claim tests, four axe route checks, 390 px keyboard/mobile coverage, privacy checks, and the new boundary regression.

The local clean install and quality checks completed: `npm ci`, `npm test`, `npm run check`, `npm run build`, `cargo fmt --all -- --check`, `cargo clippy --all-targets --locked -- -D warnings`, `cargo build --release --locked`, `cargo package --locked --no-verify --allow-dirty`, and `npm audit --audit-level=high` (zero vulnerabilities). A temporary clean consumer unpacked the generated crate, installed it with `cargo install --path … --root … --locked`, and passed `rescue --help` plus `rescue --json demo` (`schema_version` 1.0; `in.sociobot.orchardnotes`; `compatible`). Built site gzip sizes are 7,579 bytes JS and 3,893 bytes CSS.

The fresh manual live boundary proof above used a clear client window. Subsequent attempts from this shared worker can correctly receive an early 429 because the proof itself consumes the same per-client allowance; use a fresh client window for `npm run verify:billing`. This is expected rate-limit state, not a missing limiter.

## Deployment and final post-deploy evidence

Commit `b0ed066f25cc23eb1df43c722ab7bb6a634f7b01` was pushed to `main` and deployed with `/opt/fleet/lib/deploy-static.sh legacy-app-rescue dist/site`. Azure Static Web Apps deployment **`3c687048-41a3-47bf-a65c-012c12ecf644`** completed successfully; <https://legacy-app-rescue.sociobot.in> returned HTTPS 200.

The required URL verifier passed and wrote its screenshot/report evidence to `/work/.evidence/legacy-app-rescue-repair-3/`: title `Legacy App Rescue — record an Android app`, `lang="en"`, one `h1`, one `main`, no missing image alt text or unnamed buttons, and no browser errors. The live 390 px reduced-motion `/demo` check passed with no horizontal overflow (`390 = 390`), no console/page errors, no external requests, zero axe serious/critical findings, and keyboard focus moving from the skip link to `#main`.

Live response policy and identity checks passed. Production `assets/app-DEvmlwJk.js` SHA-256 is `c599edb22b977aaea4b52db2894e307a66d05126c330d3752527de48b258f805`, byte-for-byte equal to the local `dist/site` asset. It serves `Cache-Control: public, max-age=31536000, immutable`; HTML serves a 30-second revalidation policy. CSP restricts connections to self, GitHub's release API, and Sociobot; HSTS, `nosniff`, strict referrer policy, and restrictive permissions policy are present. `/robots.txt`, `/sitemap.xml`, `/privacy`, and `/terms` each return 200. The static site has zero service-worker registrations and zero Cache Storage entries; it makes no offline-reload claim, while the bundled CLI demo's no-network path is covered by `@claim:local-private`.

Historical notes remain for audit context.

## Earlier repair notes — superseded by the verification above

Independent verification of candidate `57ffb5d225619660ddcfc5413ad8df30b4a03e8f` found one release blocker: deployed assets used `public, must-revalidate, max-age=30`. The defect was reproduced on the reported JS, CSS, and hero URLs on 2026-08-28.

Repair commit `1fcefcb` adds an Azure Static Web Apps `/assets/*` response rule for `public, max-age=31536000, immutable`. Regression coverage parses the built deployment config and verifies that the rule covers the emitted JS, CSS, and hero asset classes. Deployment `2d3e8a00-02b6-4654-882f-2477778a97b4` completed successfully. The three reported live URLs now return the required one-year immutable policy.

## What shipped

- A Rust `rescue` binary with `scan`, `device`, `demo`, and `license` commands.
- Streaming SHA-256, Android manifest parsing, CPU inventory, v1 block evidence, and v2/v3 certificate hashes.
- ADB device inventory with a hashed serial, Android and CPU facts, package names, and compatibility reasons.
- Android-permitted app-data export through `adb exec-out run-as … tar`. Partial archives are deleted when Android refuses.
- JSON schema `1.0`, atomic manifest writes, private Unix permissions, `--json`, `--ci`, and actionable errors.
- A fictional Orchard Notes fixture. `rescue demo` creates it in a temporary directory and prints the result path.
- A responsive field-guide site with `/demo`, `/privacy`, `/terms`, history and focus handling, a 404 page, and license restoration.
- A $19 one-time Field Kit through the Sociobot checkout and verification endpoints. No provider product ID is embedded.
- Linux, Windows, Intel macOS, and Apple silicon release jobs. Outputs include archives, `.deb`, `.rpm`, `.pkg`, checksums, and package manifests.
- SHA-verifying shell and PowerShell installers served from the static site.
- GitHub release `v0.1.0` with all platform assets and a live Homebrew tap.

## Build and verify

From a clean clone:

```sh
npm ci
npm test
npm run build:site
```

The required static output is `dist/site/`, with `index.html` at that root.

Additional handoff checks:

```sh
cargo clippy --all-targets --locked -- -D warnings
cargo build --release --locked
npm audit --audit-level=high
/tmp/actionlint .github/workflows/release.yml
```

`npm test` covers six Rust unit tests and eighteen Chromium tests. Every entry in `.factory/claims.json` has one tagged test. The additional regressions cover immutable deployment caching, the exact failed checkout contract, the exact 30-request verification allowance, and a 429 with an exposed `Retry-After`.

Repair verification commands:

```sh
npm ci
npm test
cargo fmt --all -- --check
cargo clippy --all-targets --locked -- -D warnings
cargo build --release --locked
cargo package --locked --no-verify
npm audit --audit-level=high
actionlint .github/workflows/release.yml
npm ci && npm run build:site
npm run verify:billing
```

All passed. `npm audit` found zero vulnerabilities. `cargo package --locked --no-verify` created the crate, and it was extracted into a new temporary directory, installed with `cargo install --path … --root … --locked`, then its installed `rescue --help` and `rescue --json demo` commands passed. A clean consumer download of `rescue-linux-x86_64.tar.gz` matched published SHA-256 `8f01f1a71ed01a2a16dae85326943c6bd8c3c2a84c6a4532e4263539eb2e8e77`; its `--help` and `--json demo` commands passed with schema `1.0`.

## Measured results

Lighthouse mobile preset against the repaired live deployment (repeat run after deployment):

- Performance: **100**
- Accessibility: **100**
- Best practices: **96**
- SEO: **100**
- LCP: **1.762 s**
- CLS: **0**
- Total blocking time: **43 ms**

The page has 7.22 KB gzip JavaScript, 3.89 KB gzip CSS, 35 KB of fonts, and a 108 KB hero WebP.

Live desktop checks of `/`, `/demo`, `/privacy`, and `/terms` returned 200 with one `h1`, one `main`, `lang="en"`, no horizontal overflow, no console errors, and no serious or critical axe violations. At 390 px, the demo had no horizontal overflow, the skip link moved focus to `main`, and every request stayed on the product origin. Reduced motion rendered the complete terminal output with a Replay control. The static product registers no service worker or Cache Storage, while the offline CLI demo remains covered by the no-network privacy claim.

The deployed `index.html`, app JS, CSS, and hero WebP match `dist/site/` byte-for-byte. Live CSP, HSTS, `nosniff`, referrer, and permissions policies are present. Evidence screenshots, the URL smoke report, and Lighthouse JSON are in `/work/.evidence/legacy-app-rescue-repair-1/` in the repair worker.

## Design and asset provenance

The visual system and generation prompt are in `.factory/design.md`. The hero source and factory deployment sidecar are in `art-source/`. Served WebP derivatives are below 300 KB.

The image used `/opt/fleet/lib/gen-image.sh`. Atkinson Hyperlegible files come from Fontsource under the included SIL Open Font License.

## Known limits

- Version 0.1 does not read APK Signing Blocks from ZIP64 APKs. It still records the whole-file hash and v1 evidence.
- Android blocks `run-as` for most non-debuggable apps. The tool reports refusal and does not try root.
- Compatibility covers SDK and CPU declarations. It cannot predict licensing servers, missing services, or old graphics behavior.
- macOS and Windows artifacts are unsigned. The site gives first-run instructions.
- The Winget manifest includes its published checksum but still needs an owner submission.

## Needs operator action

- Submit the prepared Winget manifest to `microsoft/winget-pkgs`.
- For signed packages later, provide Apple notarization and Windows Authenticode credentials. The current workflow expects no signing secrets.
