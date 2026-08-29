# Legacy App Rescue — polish round 3 handoff

## Status: PASS

Repair commits: `d983b969632d57aa4aa5a048c920d55f0411a5e0` and `5eeeb608945701b323531abccb2301d99abb3fee` on `main`.

The final Static Web Apps deployment was `dc8ef218-ff41-4666-b4e5-fae94081af3c`. The live site is <https://legacy-app-rescue.sociobot.in>.

## What changed

- Made the full demo header sticky. The sample-data banner and both controls remain visible at the real end of the 390 px mobile record.
- Strengthened `@claim:demo-sandbox`: it now scrolls to the calculated document end, proves the scroll happened, checks every control remains in the viewport, then operates Reset demo and Start for real.
- Added the same genuine scroll assertion and screenshot to `scripts/verify-live.mjs`.
- Removed the two non-informative first-screen labels: “A local preservation tool” and “PLATE / 017”. A browser regression test prevents their return.
- Updated the demo claim, demo documentation, copy audit, and catalog description. The catalog line is verb-first and 50 characters: “Record Android app evidence and check a target device.”

## Verification

### Clean clone

Final remote clean checkout: `/tmp/legacy-app-rescue-final-clean.2TkVXf` at `f449122bd540d1459b6bc138be659824ccc75a3d`; full log: `/tmp/legacy-app-rescue-final-clean.log`.

- `npm ci`: PASS, 0 vulnerabilities.
- Every one of the 27 exact commands in `.factory/claims.json`: PASS independently. The log records `ALL_CLAIMS_PASS 27`.
- `npm test`: PASS — 8 Rust tests and 43 Playwright tests. This includes the route, keyboard, mobile, privacy, offline-proxy, demo-isolation, metadata, 404, and Axe serious/critical checks.
- `cargo fmt --all -- --check`: PASS.
- `cargo clippy --all-targets --locked -- -D warnings`: PASS.
- `cargo build --release --locked`: PASS.
- `cargo package --locked --no-verify --allow-dirty`: PASS — 79 files, 3.6 MiB source package.
- `npm audit --audit-level=high`: PASS, 0 vulnerabilities.
- `npm run build`: PASS — `dist/site/`; 22.83 kB JavaScript (7.98 kB gzip) and 14.21 kB CSS (3.97 kB gzip).

### Additional release checks

- `npm run verify:billing`: PASS — checkout gave a hosted Dodo 303 without `Retry-After`; request 31 of the license-rate test returned 429 with `Retry-After: 4`.
- `npm run verify:package-managers`: PASS — Homebrew, Scoop, and winget resolve to v0.1.3.
- `npm run test:performance`: PASS — four mobile Lighthouse runs scored 100 performance. LCP was 1669, 1665, 1664, and 1659 ms; median 1664.5 ms; TBT and CLS were zero.

### Cold live re-check

`npm run verify:live -- https://legacy-app-rescue.sociobot.in /work/.evidence/polish-3`: PASS after final deployment.

- `/`, `/?demo=1`, `/demo`, `/privacy`, and `/terms`: 200, route-specific title, one `h1`, one `main`, no horizontal overflow, no console errors, no Axe serious/critical violations, and no targets below 44 px.
- `/missing-specimen`: 404, designed page, title, legal links, and a home action.
- The live direct demo used only same-origin requests; Reset demo retained the isolated sample; Start for real cleared every `demo:` key.
- The verifier proved the demo really reached its scroll maximum, then captured the persistent banner and controls at the record end: `/work/.evidence/polish-3/live-demo-scrolled-mobile.png`.
- Other evidence: `live-landing-mobile.png`, `live-demo-mobile.png`, `live-privacy-mobile.png`, `live-404-desktop.png`, and `live-browser.json` in `/work/.evidence/polish-3/`.

## Run locally

```sh
npm ci
npm test
npm run build
npm run test:performance
npm run verify:billing
npm run verify:package-managers
npm run verify:live -- https://legacy-app-rescue.sociobot.in /work/.evidence/polish-3
```

## Known gaps / operator action

None. The CLI and installer release process remains the existing GitHub Actions tag workflow; this static-site repair did not publish a new CLI release because the shipped binary behavior was unchanged.
