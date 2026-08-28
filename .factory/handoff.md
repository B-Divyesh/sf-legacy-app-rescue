# Legacy App Rescue v0.1.1 handoff

## Repair status

Repaired verifier candidate `e0a83a294248fa2f85ebb618d151ef1988a91a2c` for work order `legacy-app-rescue-repair-4`.

### Fixed findings

- Removed the `LEGACY_RESCUE_LICENSE` environment bypass. Field Kit actions now require a stored token and perform a fresh Sociobot verification; an arbitrary token cannot enable a batch scan in the release binary.
- App-data export creates its archive with Unix mode `0600` from creation. A failed `adb run-as` removes the partial archive and reports that no root bypass is attempted.
- Added three claim entries and exact tagged regressions for installer checksum/placement, one-day browser license caching, and refused export cleanup. The registry now covers every retained public promise from the verification report.
- All license subcommands now honor `--json` on successful status/removal (and activation).
- Repaired the mobile target baseline, terminal text size, Mac download choice, mobile download guidance, designed 404 configuration, and field-guide metaphors in product copy.
- The browser no longer promises an exact retry time from Sociobot. The service presently does not CORS-expose `Retry-After`, so the UI gives the honest generic busy/retry message; it still displays an exact delay when an exposed header is supplied.

## Verification

Clean-install and quality gates passed:

```sh
npm ci
npm test                         # 8 Rust + 23 Playwright tests
npm run check
npm run build                    # dist/site
cargo fmt --all -- --check
cargo clippy --all-targets --locked -- -D warnings
cargo build --release --locked
cargo package --locked --no-verify --allow-dirty
npm audit --audit-level=high     # 0 vulnerabilities
npm run verify:billing
```

`npm run verify:billing` observed a Dodo checkout 303 with no `Retry-After`, then 30 allowed invalid verification requests and a 31st `429` with `Retry-After: 4`.

Every `.factory/claims.json` command was run independently after `npm ci`. All eleven passed. The complete browser suite covers desktop and 390 px mobile, keyboard skip-link/focus behavior, target dimensions, reduced motion, privacy request logs, four axe route scans, unsupported mobile guidance, Mac architecture choice, and 404 configuration. Axe reported no serious or critical violations. The built initial assets are 7.82 KB gzip JavaScript and 3.97 KB gzip CSS.

The packaged `legacy-app-rescue-0.1.1.crate` was expanded into a fresh temporary consumer and installed with `cargo install --path … --root … --locked`. Its installed `rescue 0.1.1` completed `--json demo` with the expected compatible Orchard Notes record.

## Run and deploy

```sh
npm ci
npm test
npm run build
cargo run -- demo
```

The static deployment input remains `dist/site`; release binaries are built only by `.github/workflows/release.yml` from the `v0.1.1` tag.

## Post-deploy evidence

`/opt/fleet/lib/deploy-static.sh legacy-app-rescue dist/site` completed successfully on 2026-08-28 UTC. The canonical URL returns HTTPS 200. The factory URL verifier wrote evidence to `/tmp/legacy-rescue-live-evidence-wE9uAD` and reported title `Legacy App Rescue — record an Android app`, `lang="en"`, one `h1`, a `main` landmark, no missing image alt text or unnamed buttons, and no browser errors.

Live route checks returned 200 for `/`, `/demo`, `/privacy`, `/terms`, `/robots.txt`, `/sitemap.xml`, `/install.sh`, and `/favicon.svg`; an unknown route returned the designed page with HTTP **404**. The live JavaScript SHA-256 equals the local built asset (`72d085954b1e5c172bf2776e5057340955d4e855734ed491537b57188327a7c5`). It has `Cache-Control: public, max-age=31536000, immutable`; HTML has the 30-second revalidation policy. The live CSP permits only self, GitHub's release API, and Sociobot's API, and HSTS, `nosniff`, referrer, and permissions headers are present.

The standalone `@axe-core/cli` could not find a system Chrome binary in the worker. The equivalent installed Playwright axe integration was run directly against live `/`, `/demo`, `/privacy`, and `/terms` at 390 px with reduced motion: all had zero serious/critical findings, zero console/page errors, no horizontal overflow, and no targets below 44×44 px.

## Known constraints

This is a local CLI plus static site. It has no product-owned backend, service worker, or sign-in flow. The only network call needed by a paid CLI action is Sociobot license verification; APK scans, the CLI demo, and web demo remain local/no-upload.
