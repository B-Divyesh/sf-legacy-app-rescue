# Independent verification 8 — PASS

**Candidate:** `4d996122d5c6c06672ecf1e5a5599fad6f457b47` (`main`)  
**Release:** `v0.1.3`  
**Live URL:** <https://legacy-app-rescue.sociobot.in>  
**Verified:** 2026-08-29 UTC from the supplied clean checkout  
**Work order:** `legacy-app-rescue-verify-8`

## Decision

**PASS — accept this candidate.** The reported deployment-only concern does not reproduce: a fresh production build is byte-identical to the live HTML, JavaScript, CSS, and responsive hero assets. No release-blocking defect was found.

## Mandatory claims and cold first read

`.factory/claims.json` exists with 27 entries. After `npm ci` (0 vulnerabilities), I ran **each of its 27 exact `test` commands independently** from this checkout. Every command passed; the retained log is `/tmp/legacy-claims.log` and ends `ALL_CLAIMS_PASS 27`.

All declared claims passed: `manifest-record`, `compatibility-verdict`, `demo-sandbox`, `local-private`, `field-kit`, `platform-builds`, `mobile-install-guidance`, `paid-license`, `binary-manifest`, `installer-verified`, `browser-license-cache`, `browser-license-removal`, `export-refusal-cleanup`, `safety-boundaries`, `input-scope`, `device-serial-hash`, `compatibility-limit`, `merchant-and-refund`, `browser-license-storage`, `release-metadata-privacy`, `apk-transfer-boundary`, `sample-is-noninstallable`, `unsigned-builds`, `no-cli-telemetry`, `license-busy-recovery`, `winget-submission-manifest`, and `ci-output`.

Cold live first read passes on desktop and 390 px mobile. The first screen says **“Record your Android app before it disappears,”** names people preserving an old app they own, and its primary action is **“Try it with sample data.”** The adjacent text says it opens a finished record in separate demo storage. Clicking it loads the Orchard Notes sample, with the persistent **“Demo — sample data, nothing is saved”** banner, Reset demo, and Start for real controls.

## Local verification

- `npm ci`: PASS; 0 vulnerabilities.
- `npm test`: PASS — 8 Rust unit tests and 43 Playwright tests, including all claims, navigation/history, keyboard/mobile, proxy privacy, 404, and Axe checks.
- `npm run check`, `npm run build`, `cargo fmt --all -- --check`, `cargo clippy --all-targets --locked -- -D warnings`, `cargo build --release --locked`, and `cargo package --locked --no-verify --allow-dirty`: PASS.
- `npm audit --audit-level=high`: PASS; 0 vulnerabilities.
- `npm run test:performance`: PASS (exit 0). Independent mobile Lighthouse samples: LCP 2179, 1677, 1694, and 1695 ms; median 1694.5 ms; CLS 0. The first cold sample scored 83 performance with 629 ms TBT; the other three scored 96/100/100. It does not breach the enforced LCP/CLS gate, but is recorded for performance monitoring.

The production build is `dist/site/`, with 22.83 kB JS (7.98 kB gzip) and 14.21 kB CSS (3.97 kB gzip), within the static asset budgets.

## CLI, package, installer, and invalid-input paths

I unpacked `target/package/legacy-app-rescue-0.1.3.crate` into a fresh consumer directory, installed it with `cargo install --path … --root … --locked`, and exercised its public CLI. It reports `rescue 0.1.3`; `rescue --json demo` emitted schema version `1.0`, the fictional `in.sociobot.orchardnotes` APK, a 64-character SHA-256, signer evidence, an Android 13 arm64 sample device, and a `compatible` verdict.

Recovery behavior is concrete and safe: a missing APK and a directory exit 1 with an explanatory message and a `rescue --help` next step; missing required APK input exits 2 with Clap usage.

The live `site/public/install.sh`, directed to a new temporary install directory, downloaded the public v0.1.3 Linux archive, verified `SHA256SUMS`, installed the binary, and completed `rescue --json demo`. `npm run verify:package-managers` also passed for Homebrew, Scoop, and winget.

## Live privacy, accessibility, deployment identity, and headers

`npm run verify:live -- https://legacy-app-rescue.sociobot.in /tmp/legacy-live-evidence-8` passed. It checked `/`, `/?demo=1`, `/demo`, `/privacy`, `/terms`, and a real 404 at 390 px (the 404 at desktop). Each applicable route has the expected route title, exactly one `h1` and `main`, no horizontal overflow, no console/page errors, no target below 44 px, and no Axe serious/critical violation. Evidence is in `/tmp/legacy-live-evidence-8/`.

Direct demo request logging found only the product origin. The landing-page download metadata uses only the documented GitHub Releases API; license verification is limited to Sociobot. There are no analytics or third-party font/script requests. Demo storage is exactly `demo:legacy-app-rescue:opened`; Reset keeps the isolated sample and Start for real clears every `demo:` key. Keyboard coverage passed the local suite (visible skip link, Enter to `main`, operable controls); the stylesheet’s reduced-motion branch is covered by the suite.

Live responses send HSTS, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, restrictive permissions policy, and CSP limited to self plus `api.github.com` and `api.sociobot.in`. HTML is cached for 30 seconds; hashed assets have `Cache-Control: public, max-age=31536000, immutable`.

Fresh build/live SHA-256 matches:

| Resource | SHA-256 |
| --- | --- |
| `/` / `dist/site/index.html` | `430b755f459c4e0540a1f2590e706f30d7e78399263382019ad37c4694f4463d` |
| `assets/app-Dgl34MBk.js` | `4d098e56c0f959139f3a63fc6fb9c1a5b676cf318b208ec7b494fe1617898a97` |
| `assets/index-DZjDUoYJ.css` | `475ec7206e02e5c36457a416c3bee9fadebe401322a60b2403622accd13fea8d` |
| `assets/field-guide-hero.webp` | `f7fe143805f2d7dfd6b6c9645f5100131e5070ba124a192584f2f41e6b2cbe25` |
| `assets/field-guide-hero-800.webp` | `619f49ee467c7b825df94a7385065fb036e86a9de904be60fa9b7b1054587b49` |

## Billing and scope

`npm run verify:billing` passed against the live Sociobot service: checkout returned a hosted Dodo `303` without `Retry-After`. The documented single-client verification allowance is enforced: requests 1–30 returned 200 and request 31 returned **429** with `Retry-After: 4`.

This is a local-first CLI/static site, not a PWA or product backend, and has no sign-in. Service-worker update/offline-reload, backend concurrency/persistence/health, and Entra tenant checks do not apply. The brief does not imply a useful generative-AI operation beyond the local preservation workflow.

## Findings by severity

- **Low — verifier utility naming gap:** the attached accessibility instruction names `verify-url.sh`, but this checkout contains no such file. Equivalent and broader project verification is available as `npm run verify:live`, which passed; direct markup/header inspection also covered title, language, main landmark, image alt text, and console errors. This is not a product release blocker.
- No critical, high, or medium defects.
