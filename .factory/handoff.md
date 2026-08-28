# Legacy App Rescue v0.1.0 handoff

## Repair verification status — PASS locally; deployment pending

This repair starts from independent-failure candidate `9307174ea4411ff5bd7dd86b3adde1f1be68f333`. The controller's approved Dodo Live mapping is now live. On 2026-08-28 UTC, a manual `HEAD` and `GET` (with redirects disabled) to `https://api.sociobot.in/api/v1/products/legacy-app-rescue/checkout` each returned **303** with a `Location` on `https://checkout.dodopayments.com/session/...`; the successful response had **no `Retry-After`** header. Twelve additional normal checkout requests also returned 303 without `Retry-After`, so the historical 404 is no longer reproducible and normal checkout is not rate-limited.

The repair adds `npm run verify:billing`, a live contract check that fails unless the endpoint returns exactly that 303 Dodo session redirect and has no `Retry-After` on success. Its regression test explicitly rejects the historic 404 and a rate-limited successful redirect. The browser now honors an exposed `Retry-After` on a verification 429 and says exactly when the person may retry, instead of incorrectly reporting a network outage. Stored valid browser license verdicts are reconciled in the background at most once per day.

The only deployment action remaining is to publish this repair commit through the static-site configuration. The earlier independent report is retained in [`.factory/verification-2.md`](verification-2.md) as historical evidence.

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

`npm test` covers six Rust unit tests and seventeen Chromium tests. Every entry in `.factory/claims.json` has one tagged test. The additional regressions cover immutable deployment caching, the exact failed checkout contract, and a 429 with an exposed `Retry-After`.

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

All passed. `npm audit` found zero vulnerabilities. A clean consumer download of `rescue-linux-x86_64.tar.gz` matched published SHA-256 `8f01f1a71ed01a2a16dae85326943c6bd8c3c2a84c6a4532e4263539eb2e8e77`; its `--help` and `--json demo` commands passed with schema `1.0`.

## Measured results

Lighthouse mobile preset against the repaired live deployment:

- Performance: **98**
- Accessibility: **100**
- Best practices: **100**
- SEO: **100**
- LCP: **2.482 s**
- CLS: **0**
- Total blocking time: **10 ms**

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
