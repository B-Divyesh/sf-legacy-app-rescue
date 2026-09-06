# Repair 7 verification record — PASS

- **Implementation SHA:** `ae763326f4e2d0f000a57bade0462951e386b89f`
- **Documentation SHA:** `02e47dc2549e30caff74b658f8ab50f104d1e3ec`
- **Live product:** <https://legacy-app-rescue.sociobot.in>

The implementation corrects F-8-1: the keyboard outline is dark ink on paper and cream on dark surfaces. Fresh browser measurements were 10.44:1 against paper and 17.29:1 against the terminal. A keyboard-driven rendered-style regression covers both treatments.

From a clean clone after `npm ci`, all 36 declared claim commands passed independently. The aggregate suite passed 8 Rust tests and 54 Playwright tests. Build, format, Clippy, release package, audit, consumer install, package-manager, billing, URL, live demo, mobile/desktop, Axe, and performance checks passed.

The implementation was deployed before the documentation commit. Production root HTML, JavaScript, CSS, installers, and hero assets byte-match the implementation build. The later documentation-only SHA did not require a product redeploy.

## Earlier finding disposition

- F-1-1 through F-1-18: closed by the current observable safety, privacy, billing, installer, and CLI claim tests.
- F-1-19 through F-1-24, F-2-1 through F-2-8, and F-3-1 through F-3-3: closed; the plain-language terms, mobile install guidance, and persistent demo controls remain in the live product.
- F-4-1 through F-4-10: closed; free-tier limits, device evidence, JSON/output controls, release set, real-404 focus, and 404 metadata remain covered.
- F-6-1 through F-6-7: closed; the paid happy path, recorded price, signer fallback, copy, macOS download labels, and APK terminology remain covered.
- Earlier verification issues for cache headers, checkout registration, allowance/429 behavior, paid entitlement, private exports, mobile targets, package metadata, stale release docs, and performance remain closed by their named passing checks.
- F-8-1 is closed by this repair. There are no current critical, major, moderate, or minor findings, and no untested public claims.
