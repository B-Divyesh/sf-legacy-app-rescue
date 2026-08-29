# Legacy App Rescue — independent verification 10 handoff

## Status: PASS

Candidate `d22b86643c655550de2a091166d079282a1ee3e3` is accepted against the researched brief and work order at <https://legacy-app-rescue.sociobot.in>. The previously reported deployment-only failure did not reproduce. Fresh build artifacts match the deployment byte-for-byte, the released v0.1.3 installers are available and valid, and no defect was found.

## What was verified

- The cold first screen identifies the job, intended owner, and first action in plain words. **Try it with sample data** opens a completed, isolated record in one click.
- After `npm ci`, all 36 exact commands in `.factory/claims.json` pass independently. The full suite passes 8 Rust and 53 Playwright tests.
- TypeScript, formatting, Clippy with warnings denied, exact Vite build, locked release build, clean crate packaging/install, npm audit, package-manager checks, and billing checks pass.
- The installed candidate CLI handles demo and normal scans, selected output, JSON, file size/hash, private file mode, missing/empty/directory input, absent ADB, device compatibility, multiple devices, and denied export cleanup.
- The live root, demo routes, privacy, terms, and 404 pass desktop/390 px browser checks, keyboard use, focus, reduced motion, mobile overflow/targets, console/page errors, and Axe serious/critical checks.
- Fresh request logs confirm direct demo traffic stays same-origin, landing adds only GitHub Releases, license verification sends the fake token only to Sociobot, and no cookies are set.
- Security and cache headers are present. Candidate/live hashes match for HTML, JS, CSS, fonts, art, installer scripts, terminal recording, and 404 assets.
- The release contains Linux, Windows, Intel Mac, and Apple-silicon Mac artifacts plus checksums and `latest.json`. A fresh Linux download matches SHA-256 and the live installer runs the demo.
- The Sociobot license endpoint allows 30 requests; request 31 returns 429 with `Retry-After: 4`.
- Lighthouse: 100/100/100/100 on a live full-category run. Four mobile performance runs scored 100/100/100/99 with 1,688 ms median LCP, 0 CLS, and 0–71 ms TBT.

## Reproduce

```sh
npm ci
npm test
npm run check
npm run build
cargo fmt --check
cargo clippy --all-targets --all-features -- -D warnings
cargo build --release --locked
cargo package --locked
npm run verify:url -- https://legacy-app-rescue.sociobot.in /tmp/legacy-rescue-live
npm run verify:package-managers
npm run verify:billing
npm run test:performance
cargo run -- demo
```

The detailed report is [verification-10.md](verification-10.md). Transient logs and screenshots from this run are in `/tmp/legacy-app-rescue-verification-10-evidence/` in the verification container.

## Findings and next steps

No known gaps and no operator action required. No product code was modified during verification.
