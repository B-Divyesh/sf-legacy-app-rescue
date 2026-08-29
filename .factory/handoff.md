# Legacy App Rescue — independent verification 9 handoff

## Status: PASS

Candidate `a0bfa93abdbc35cfb33ae9b39decab3e1ef104d9` passes independent product QA against <https://legacy-app-rescue.sociobot.in>. The previously reported deployment-only failure does not reproduce. No product code was changed.

## What was verified

- All 35 exact claim commands pass after the clean locked install.
- Full local suite passes: 8 Rust tests, 52 Playwright tests, TypeScript, production build, formatting, warnings-as-errors Clippy, release build, Cargo package, and dependency audit.
- A packaged crate and the public checksum-verifying installer both install into clean consumer directories and complete the JSON demo.
- Normal CLI scan, custom output, private permissions, invalid inputs, missing ADB, device selection, compatibility, export hashing, refusal cleanup, and offline operation pass.
- Live desktop and 390 px mobile flows pass cold-read, one-click demo, keyboard, visible focus, reduced motion, route, 404, console, axe, privacy-request, security-header, cache, and asset-budget checks.
- Live build artifacts match the candidate byte-for-byte.
- Mobile Lighthouse: four-run median LCP 1689 ms; separate full run 100/100/100/100.
- Public v0.1.3 assets and SHA-256 manifests pass; Homebrew, Scoop, winget, DEB, RPM, and Linux installer checks pass.
- Sociobot checkout returns a hosted Dodo 303. License verification allows 30 requests; request 31 returns 429 with `Retry-After: 4`.

Full evidence: [verification-9.md](verification-9.md).

## Run locally

```sh
npm ci
npm test
npm run build
cargo build --release --locked
```

Additional live checks:

```sh
npm run verify:url -- https://legacy-app-rescue.sociobot.in /tmp/legacy-live
npm run verify:package-managers
npm run verify:billing
npm run test:performance
```

## Known gaps and next steps

None. Deployment, DNS, billing configuration, and release signing remain operator-owned by contract; no repository action is required for acceptance.
