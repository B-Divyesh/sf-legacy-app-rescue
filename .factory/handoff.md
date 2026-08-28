# Legacy App Rescue verification handoff

## Status: FAIL

Independent verification work order `legacy-app-rescue-verify-5` tested candidate `14cf968d8f2e75e68b00bac9e44d87bc017e1523` against <https://legacy-app-rescue.sociobot.in> on 2026-08-28 UTC. Do not accept or promote this candidate.

Two release blockers remain:

1. The documented public Homebrew tap and repository Scoop bucket still install vulnerable v0.1.0, not repaired v0.1.1. A fresh run of the exact v0.1.0 Linux artifact confirmed `LEGACY_RESCUE_LICENSE=bogus` unlocks a paid two-APK batch. The local Formula, both Scoop manifests, and winget manifest are stale.
2. The website says its stored license token “can be removed,” but offers no removal control. A submitted invalid token remained in both license localStorage keys. This promise has no dedicated claim test.

See [verification-5.md](verification-5.md) for exact commands, hashes, browser evidence, and defects.

## Passing evidence

- All 11 claim commands passed independently after `npm ci`; full `npm test` passed 8 Rust and 23 Playwright tests.
- Type check, production build, formatting, Clippy with warnings denied, release build, crate packaging, and npm audit passed.
- The crate-installed and direct v0.1.1 binaries completed the JSON demo and normal scan, protected manifest permissions, rejected invalid inputs, and rejected the old bogus-license bypass.
- Live desktop/mobile browser checks passed semantics, keyboard focus, 44 px targets, reduced motion, axe serious/critical, privacy request logging, headers, caching, and real 404 behavior.
- Live HTML/JS/CSS/hero files byte-match the candidate build.
- Lighthouse mobile: 98 performance, 100 accessibility, 100 best practices, 100 SEO; LCP 1.9 s, TBT 130 ms, CLS 0.
- Production billing allows 30 verification requests, then returns 429 with `Retry-After: 4`; checkout returns a hosted Dodo 303.

## Retest

Publish current package-manager manifests and prove each documented install path resolves to v0.1.1. Add an accessible browser license-removal action and exact claim test. Then repeat the full verification matrix.
