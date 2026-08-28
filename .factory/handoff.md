# Legacy App Rescue v0.1.0 handoff

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

`npm test` covers six Rust unit tests and fourteen Chromium tests. Every entry in `.factory/claims.json` has one tagged test.

## Measured results

Lighthouse mobile preset against the production build:

- Performance: **99**
- Accessibility: **100**
- Best practices: **96** before the first release; the only deduction was the expected GitHub `releases/latest` 404
- SEO: **100**
- LCP: **2.0 s**
- CLS: **0**
- Total blocking time: **50 ms**

Desktop Lighthouse measured 100 performance, 100 accessibility, 96 best practices, and 100 SEO. The page has 7.1 KB gzip JavaScript, 3.9 KB gzip CSS, 35 KB of fonts, and a 108 KB hero WebP.

The axe pass reports no serious or critical violations on `/`, `/demo`, `/privacy`, or `/terms`. The 390 px test reports no horizontal overflow and verifies the skip-link path.

## Design and asset provenance

The visual system and generation prompt are in `.factory/design.md`. The hero source and factory deployment sidecar are in `art-source/`. Served WebP derivatives are below 300 KB.

The image used `/opt/fleet/lib/gen-image.sh`. Atkinson Hyperlegible files come from Fontsource under the included SIL Open Font License.

## Known limits

- Version 0.1 does not read APK Signing Blocks from ZIP64 APKs. It still records the whole-file hash and v1 evidence.
- Android blocks `run-as` for most non-debuggable apps. The tool reports refusal and does not try root.
- Compatibility covers SDK and CPU declarations. It cannot predict licensing servers, missing services, or old graphics behavior.
- macOS and Windows artifacts are unsigned. The site gives first-run instructions.
- The Winget manifest needs its published checksum and an owner submission.

## Needs operator action

- Register `legacy-app-rescue` in Sociobot billing at **$19 one-time** with this site's return URL.
- Submit the Winget manifest after inserting the published Windows SHA-256.
- For signed packages later, provide Apple notarization and Windows Authenticode credentials. The current workflow expects no signing secrets.
