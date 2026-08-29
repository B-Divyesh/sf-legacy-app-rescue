# Legacy App Rescue verification handoff

## Status: FAIL

Independent verification work order `legacy-app-rescue-verify-6` tested candidate `1329c1f9f602941bf31e9e309329c761ca6b0476` and <https://legacy-app-rescue.sociobot.in> on 2026-08-29 UTC.

Do not accept or promote this candidate. Full evidence is in `.factory/verification-6.md`.

## Release blockers

1. The public v0.1.1 RPM is packaged as `legacy-app-rescue-0.1.0-1`, exactly the same RPM version as the vulnerable v0.1.0 release. The current binary inside is v0.1.1 and correctly rejects the old bogus-license batch bypass, but a normal RPM update cannot distinguish the repaired package. `packaging/nfpm.yaml` hard-codes `version: 0.1.0`; existing tests do not inspect native package metadata.
2. Four completed throttled mobile Lighthouse runs measured LCP at 2,940, 2,520, 2,888, and 2,526 ms. Every completed run misses the required `<2.5 s` budget; the middle-pair median is 2,707 ms. An earlier attempt ended with a browser-tab crash and was excluded.

Minor release hygiene gaps: `CHANGELOG.md` stops at v0.1.0, and the manual release workflow still defaults to v0.1.0.

## What passed

- Cold first-read and one-click sample demo on desktop and 390 px mobile.
- All 12 exact claim tests after `npm ci`; 8 Rust and 24 Playwright tests in the full suite.
- Type check, production build to `dist/site`, Rust format, clippy with warnings denied, release build, crate packaging, and npm audit.
- Clean-consumer CLI demo, real single scan, representative attached-device scan, JSON output, manifest permissions, invalid inputs, device errors, and bogus-license rejection.
- GitHub release matrix/assets, `latest.json`, checksums, live Linux installer, Homebrew, Scoop, winget, and `.deb` version. The RPM version is the exception above.
- Live/candidate byte identity for every publicly served site file.
- Desktop/mobile layout, keyboard traversal and operation, visible focus, reduced motion, SPA/back focus, and designed 404.
- Zero axe serious/critical findings across all routes at both widths; no console/page errors.
- Demo request privacy and storage isolation, license removal, security headers, caching, and bundle budgets.
- Billing checkout and API allowance: 30 verification requests allowed; request 31 returned 429 with `Retry-After: 4`.

## Commands to reproduce

```sh
npm ci
npm test
npm run check
npm run build
cargo fmt --all -- --check
cargo clippy --all-targets --locked -- -D warnings
cargo build --release --locked
cargo package --locked --no-verify --allow-dirty
npm audit --audit-level=high
npm run verify:package-managers
npm run verify:billing
```

Inspect `packaging/nfpm.yaml`, then compare the package headers of the public v0.1.0 and v0.1.1 RPM assets; both report `legacy-app-rescue 0.1.0-1 x86_64`.

## Required next steps

- Derive native package versions from Cargo/release metadata and publish a strictly newer repaired RPM.
- Test native package metadata and an actual RPM upgrade in CI.
- Stabilize mobile LCP below 2.5 seconds and repeat the measurement.
- Add the v0.1.1 changelog entry and correct the manual release default.

No product code was modified during verification.
