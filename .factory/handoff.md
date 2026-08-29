# Legacy App Rescue — polish round 2 handoff

## Status: PASS

Repair commit: `10b154b061f22b474d7cf8b00c714dc5bb235042` (`fix: polish mobile install and plain language`). It is pushed to `origin/main` and deployed to <https://legacy-app-rescue.sociobot.in> as Static Web Apps deployment `937dfe3c-dff8-458e-9fab-f357222a4340`.

## What changed

- Added the 27th public claim, `mobile-install-guidance`, with an isolated Android-browser assertion.
- Mobile visitors now see clear desktop-install guidance, a desktop-download link, and no blank/copyable installer command.
- Rewrote the cold landing and README so Android app file (APK), preservation record (manifest), desktop command-line tool (CLI), file fingerprint, and `run-as` are explained at first use.
- Replaced the empty preview slogan with the actual contents of the preservation record.
- Updated titles/descriptions, demo documentation, catalog description, copy audit, and all affected claim evidence without changing the field-guide visual system.

## How to run and verify

```sh
npm ci
npm test
cargo clippy --all-targets --locked -- -D warnings
cargo build --release --locked
npm run build
npm run verify:billing
npm run verify:package-managers
node scripts/verify-live.mjs https://legacy-app-rescue.sociobot.in /work/.evidence/polish-2
```

The demo is one click at <https://legacy-app-rescue.sociobot.in/?demo=1> (also `/demo`). It uses only the `demo:legacy-app-rescue:` browser-storage namespace; **Reset demo** reseeds it and **Start for real** clears it.

## Exact verification evidence

- Clean clone `/tmp/legacy-app-rescue-clean.PcHcyI`: `npm ci`, then every one of the 27 commands in `.factory/claims.json` passed.
- `npm test`: PASS — 8 Rust tests and 42 Playwright tests, covering every declared claim, keyboard/mobile paths, routing, privacy, and Axe smoke checks.
- `npm run build`: PASS; output is `dist/site/` with 22.96 kB JS (8.02 kB gzip) and 14.42 kB CSS (4.00 kB gzip).
- `cargo clippy --all-targets --locked -- -D warnings`, `cargo build --release --locked`, `cargo package --locked --no-verify`, and `npm audit --audit-level=high`: PASS.
- `npm run verify:billing`: hosted checkout returned a Dodo 303; 30 invalid verification requests were allowed and request 31 returned 429 with `Retry-After: 4`.
- `npm run verify:package-managers`: PASS for Homebrew, Scoop, and winget v0.1.3 manifests.
- Mobile Lighthouse: performance 100, LCP 1657 ms, TBT 0 ms, CLS 0.
- Cold deployed-site check: `node scripts/verify-live.mjs …` passed `/`, `/?demo=1`, `/demo`, `/privacy`, `/terms`, and the HTTP 404 with no console/page errors and no Axe serious/critical issues. Screenshots and JSON are in `/work/.evidence/polish-2/`.
- A separate Android-UA cold check confirmed every F-2 rewrite, the hidden mobile command row, and the visible desktop-download action; see `live-finding-recheck.json` and `live-mobile-install-and-copy.png` in the same directory.

## Known gaps / next steps

None. The current release remains unsigned on macOS and Windows by design; that fact is shown and tested, not hidden.
