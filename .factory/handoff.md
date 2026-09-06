# Legacy App Rescue — repair 7 handoff

## Status: PASS

- **Implementation SHA:** `ae763326f4e2d0f000a57bade0462951e386b89f`
- **Prior review/documentation SHA:** `9a064f7f1ab36d5fbfa805265431d00a25f2b8d7`
- **Deployment:** static site deployed to `https://legacy-app-rescue.sociobot.in` and checked cold over HTTPS.

## What changed

- Fixed review finding F-8-1 at its cause. Keyboard focus now uses dark ink on paper and cream on terminal and dark sections.
- Preserved the 3 px outline and 3 px offset. The rendered focus ring measures 10.44:1 against paper and 17.29:1 against the terminal.
- Added a browser regression that reaches the primary sample action and terminal pause control with Tab, then checks the rendered outline style, width, and contrast. It does not inspect source tokens.
- Updated the visual thesis with the two focus tokens and their contrast purpose.
- Copied the verb-first catalog description to `/work/.evidence/catalog-description.txt` (61 characters).

## Verification

From a new clone of `ae76332` after `npm ci`:

- All 36 exact commands in `.factory/claims.json` passed independently.
- `npm test` passed: 8 Rust tests and 54 Playwright tests.
- `npm run build:site`, `cargo fmt --all -- --check`, `cargo clippy --all-targets --locked -- -D warnings`, `cargo build --release --locked`, `cargo package --locked`, and `npm audit --audit-level=high` passed.
- The clean packaged crate installed into a fresh consumer prefix. `rescue 0.1.3 --json demo` produced the Orchard Notes preservation record and compatible verdict.
- `npm run verify:package-managers` confirmed Homebrew, Scoop, and winget metadata for v0.1.3.
- `npm run verify:billing` confirmed the hosted Dodo checkout redirect and the documented 30-request allowance followed by `429` with `Retry-After: 4`.
- `npm run test:performance` passed all four mobile runs: 100 performance; LCP 1661, 1655, 1657, and 1657 ms; median 1657 ms; zero TBT and CLS.

## Live checks

- `npm run verify:url -- https://legacy-app-rescue.sociobot.in /work/.evidence/repair-7-live` passed six live routes, console checks, mobile targets, Playwright Axe serious/critical checks, demo isolation, reset/exit, and the deliberate HTTP 404.
- Fresh desktop and Android-phone contexts both showed the job, audience, and **Try it with sample data** action before scrolling.
- One click loaded the persistent demo label and populated Orchard Notes 1.7.0 record. Reset and exit left a seeded real-data sentinel unchanged.
- The fresh `dist/site` root, JavaScript, CSS, installers, and hero assets match production byte-for-byte.

## Earlier findings

All findings from reviews 1, 2, 3, 4, 6, and 8 remain closed. F-8-1 is closed by the rendered keyboard-focus regression described above. The static local-first CLI has no product backend, service-worker update claim, or sign-in path, so backend persistence/health and PWA update checks do not apply.

## Known gaps and next steps

No known product gaps remain. The CLI release stays at v0.1.3 because this repair changes only the static site’s focus treatment and browser coverage. Keep the rendered contrast regression when changing palette or focus styles.
