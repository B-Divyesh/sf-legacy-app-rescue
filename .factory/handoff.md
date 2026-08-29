# Legacy App Rescue handoff

## Status: PASS

Perfection-loop round 1 closes every finding in `.factory/review-1.md`. The finding-by-finding map is in `.factory/polish-1.md`. There were no earlier `review-*` or `polish-*` files.

- Live product: <https://legacy-app-rescue.sociobot.in>
- One-click demo: <https://legacy-app-rescue.sociobot.in/?demo=1>
- CLI release: <https://github.com/B-Divyesh/sf-legacy-app-rescue/releases/tag/v0.1.3>
- Release workflow: <https://github.com/B-Divyesh/sf-legacy-app-rescue/actions/runs/33230336067> — success
- Release tag: `v0.1.3` at `e6664faf68f28f172f6d3db4dea57c7fd7941e97`
- Release-manifest commit: `be21d00`
- Public Homebrew tap commit: `2073c74`
- Azure Static Web Apps deployment: `2c005a92-e72f-4d64-910c-94e066c707e0`

## What changed

- Rewrote the first screen to name the APK record and device check directly.
- Made `/?demo=1` the one-click sample path while retaining canonical `/demo` routing.
- Kept demo state in `demo:legacy-app-rescue:*`; Reset demo reseeds it and Start for real clears it.
- Added 14 missing claim entries and observable claim tests. The registry now has 26 unique claims and exactly one tagged test for each.
- Tested APK immutability, selected-input scope, serial hashing, compatibility limits, revoked licenses, browser token storage, network boundaries, sample contents, released artifact signatures, retry guidance, winget readiness, and `--ci` output.
- Implemented plain `--ci` output for demo and device commands.
- Replaced all six review-flagged headings, actions, and long README sentences.
- Updated route titles, descriptions, canonicals, Open Graph/Twitter metadata, focus restoration, and query-string navigation.
- Rebuilt the production 404 with the product header, footer, legal links, focus style, and field-guide identity. It returns HTTP 404.
- Published v0.1.3 for Linux, Windows, Intel Mac, and Apple silicon. Updated Homebrew, Scoop, and winget manifests.
- Added `scripts/verify-live.mjs` for cold route, console, axe, touch-target, demo-isolation, and real-404 checks.

## Verification evidence

Local verification on 29 August 2026:

```text
npm ci                                      PASS — 0 vulnerabilities
npm test                                    PASS — 8 Rust tests + 42 Playwright tests
cargo fmt --all -- --check                  PASS
cargo clippy --all-targets --locked -- -D warnings
                                             PASS
npm run build                               PASS — dist/site
npm run test:performance                    PASS — 4/4 performance 100
mobile LCP                                  1663, 1660, 1658, 1655 ms; median 1659 ms
initial JavaScript                          8.00 KB gzip
initial CSS                                 3.98 KB gzip
npm run verify:package-managers             PASS — Homebrew, Scoop, winget v0.1.3
npm run verify:billing                      PASS — checkout 303; request 31 returned 429 + Retry-After: 4
```

Every command in `.factory/claims.json` was also run independently from a fresh clone. All 26 passed. The full clean-clone suite then passed.

Release verification:

- GitHub Actions run `33230336067` completed every Linux, Windows, macOS x86_64, macOS arm64, and release job.
- The release contains eight platform assets plus `SHA256SUMS`, `latest.json`, and package-manager manifests.
- The public Linux installer verified SHA-256, installed `rescue 0.1.3`, and completed `rescue --ci demo` with package `in.sociobot.orchardnotes`.
- The downloaded v0.1.3 RPM matched `SHA256SUMS`; the GitHub job verified RPM identity `0:0.1.3-1` and the real v0.1.1 upgrade path.
- The downloaded Debian package reports `legacy-app-rescue 0.1.3-1 amd64`.
- `@claim:unsigned-builds` inspected the released Windows PE certificate table and macOS package XAR table; both are unsigned as documented.

Live verification:

- `verify-url.sh` returned HTTP 200, load 926 ms, title/lang/main/alt checks passed, and no console errors occurred.
- `npm run verify:live` checked `/`, `/?demo=1`, `/demo`, `/privacy`, `/terms`, and a missing route cold.
- Each real route returned 200 with its own title, one `h1`, one `main`, no horizontal overflow, no undersized control, no console error, and no serious/critical axe result.
- The missing route returned HTTP 404 with the product title and home link.
- The live demo used only same-origin requests before exit, stored only `demo:legacy-app-rescue:opened`, reset, and cleared the demo namespace on exit.
- Screenshots and machine-readable results are under `/work/.evidence/polish-1/`.

## Run and verify

```sh
npm ci
npm test
npm run test:performance
npm run verify:package-managers
npm run verify:billing
npm run build
npm run verify:live -- https://legacy-app-rescue.sociobot.in /work/.evidence/polish-1
cargo fmt --all -- --check
cargo clippy --all-targets --locked -- -D warnings
cargo package --locked --no-verify --allow-dirty
```

## Known gaps

No acceptance finding remains. macOS and Windows artifacts are intentionally unsigned because the owner has not supplied signing certificates; the site states this and the release artifacts are tested. The public Homebrew tap was updated manually because the release workflow lacks its optional `FACTORY_GITHUB_TOKEN`; future releases can repeat the documented manual update.
