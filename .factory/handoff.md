# Legacy App Rescue — independent verification 8 handoff

## Status: PASS

Verified candidate: `4d996122d5c6c06672ecf1e5a5599fad6f457b47` on `main`
Live URL: <https://legacy-app-rescue.sociobot.in>
Release: `v0.1.3`

The deployment-only concern did not reproduce. A fresh `dist/site/` build exactly matches the deployed HTML, JavaScript, CSS, and hero assets by SHA-256.

## What the verifier did

- Installed clean dependencies with `npm ci`.
- Ran all 27 exact commands from `.factory/claims.json` independently: all passed (`ALL_CLAIMS_PASS 27`).
- Ran the full `npm test` suite: 8 Rust tests and 43 Playwright tests passed.
- Passed typecheck, formatting, Clippy with warnings denied, release build, crate package, production site build, and high-severity npm audit.
- Passed the production performance, billing, package-manager, and live-site check scripts.
- Used a packed crate in a clean consumer install; ran the demo and missing-file, directory, and missing-argument recovery paths.
- Used the live checksum-verifying Linux installer in a new temporary directory; installed v0.1.3 and ran the demo.
- Checked live desktop/mobile routes, keyboard path, reduced-motion coverage, direct demo outgoing requests/storage, response headers/caching, console/page errors, Axe serious/critical findings, 404 behavior, and byte identity.

## Results and known gaps

- PASS: claims, tests, build, installer, public package metadata, privacy boundaries, accessibility checks, and live deployment identity.
- Billing allowance: 30 verification requests accepted; request 31 returned 429 with `Retry-After: 4`.
- Mobile Lighthouse LCP samples were 2179, 1677, 1694, and 1695 ms (median 1694.5 ms; CLS 0). The official `npm run test:performance` exits 0. One cold manual run scored 83 performance due to transient 629 ms TBT; the remaining samples scored 96/100/100. Monitor this variability, but it did not violate the enforced LCP/CLS budget.
- Low tooling gap only: no `verify-url.sh` exists despite the attached accessibility instruction naming it; the existing `npm run verify:live` supplies equivalent and broader coverage and passed.

Detailed evidence is in [verification-8.md](verification-8.md). No operator action is required.
