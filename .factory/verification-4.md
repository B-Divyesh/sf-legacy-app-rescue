# Independent verification 4 — FAIL

**Candidate:** `e0a83a294248fa2f85ebb618d151ef1988a91a2c` (`main`)  
**Live URL:** <https://legacy-app-rescue.sociobot.in>  
**Verified:** 2026-08-28 UTC from the supplied clean checkout

## Release decision

**FAIL — do not accept or promote this candidate.** The previously reported deployment and rate-limit failures are repaired: the deployed web files byte-match this candidate, immutable caching is active, checkout redirects correctly, and one fresh client received 30 allowed verification responses followed by HTTP 429 with `Retry-After`. Fresh product QA found two major product-owned blockers, plus contract failures that the current tests do not cover.

| Severity | Finding and fresh evidence | Required correction |
| --- | --- | --- |
| **Major — release blocker** | **The paid CLI tier can be unlocked with any text.** `LEGACY_RESCUE_LICENSE=not-a-real-license target/release/rescue ...` completed a two-APK batch and wrote both records. The separately downloaded published v0.1.0 binary also accepted `LEGACY_RESCUE_LICENSE=bogus` and completed the paid batch. `src/license.rs::is_unlocked` treats every non-empty value as valid without calling Sociobot. The `@claim:field-kit` test relies on this bypass (`LEGACY_RESCUE_LICENSE=sandbox-license`), so it institutionalizes rather than detects the defect. | Remove the unconditional environment bypass from release behavior. If tests need an override, compile it only for tests or inject a mock verifier. Add a test proving an arbitrary token cannot unlock batch scan or data export. |
| **Major — release blocker** | **Exported private app data is world-readable under a normal output directory.** With a fake authorized ADB device, a `0755` output directory, and the real release binary path, the manifest was correctly `0600` but `in.sociobot.orchardnotes-data.tar` was `0644`. The archive represents private app data and the brief explicitly requires protecting it. | Create the data archive with owner-only permissions (`0600`) from the start on Unix, retain safe Windows ACL behavior, and add a permission assertion to the Field Kit test. |
| **Major — acceptance contract** | **The claims registry is incomplete.** Public promises without their own `.factory/claims.json` entries/tagged tests include: installer SHA-256 verification and placement, every command being non-interactive, once-per-day browser license verification, the exact 30-request browser retry behavior, and refusal cleanup/no-root behavior. The strict claims contract says an unlisted claim fails review. | Add one exact tagged observable test per retained promise, or remove/qualify the promise. Do not fold unrelated promises into broad claims. |
| **Moderate — accessibility baseline** | Several interactive targets are below the required 44×44 CSS px. Fresh 390 px measurements include `Demo` 43×44, `Replay` 77×36, footer `Terms` 43×44, `Have a license?` 350×24.8, and email links 139–156×22. Axe reports no serious/critical findings, but it does not enforce this 44 px product requirement. Lighthouse also reports only 49.72% legible text because terminal `code` renders at 11.7 px. | Make every interactive target at least 44×44 and raise content text to the product's 16 px baseline. |
| **Moderate — installer selection** | A Pixel 7 user agent is told “Download the Linux build” and receives the Linux x86_64 archive. A normal Apple-silicon browser identity (`MacIntel`, as Safari/Chrome expose) receives `rescue-macos-x86_64.pkg`, not the available arm64 package. | Detect unsupported mobile operating systems explicitly. For macOS, provide a clear architecture choice or a universal build instead of inferring ARM from the UA string. |
| **Moderate — error recovery** | The API's 31st browser request returned 429 and network headers included `retry-after: 3`, but browser JavaScript read `response.headers.get('Retry-After')` as `null` because the response does not expose that header through CORS. The production UI therefore cannot show the promised retry time; the passing UI test supplies a mocked `Access-Control-Expose-Headers`. | Expose `Retry-After` from the Sociobot endpoint or return the wait in a CORS-readable body, then test the real browser response. |
| **Moderate — routing** | `GET /not-a-real-page-qa` renders the designed missing-page UI but returns HTTP **200**, not 404. This is a soft 404 despite the contract's real-404 requirement. | Make unknown paths return status 404 while preserving the designed page and route recovery. |
| **Minor — CLI contract** | Successful `rescue --json license status` and `rescue --json license remove` print prose, not JSON. | Honor `--json` for every successful public subcommand or scope the documented option explicitly. |
| **Minor — plain words** | Copy uses the field-guide metaphor as product language (`Recorded specimen 017`, `Three field notes`, `Preserve a whole device shelf`, `This specimen is missing`) despite the supplied plain-words rule and the design thesis saying the metaphor stops at organization. | Rename these labels/headings for the actual APK, device, demo, and missing-page jobs. |

## Mandatory claims and first-read gates

`.factory/claims.json` exists and declares eight tests. I invoked every exact command before broader QA. The checkout initially had no installed Node dependencies, so the first raw invocation reached `cargo test` and then stopped at `tsc: not found`; after the documented clean install (`npm ci`), every exact claim command passed independently:

| Claim | Exact declared command | Result after clean install |
| --- | --- | --- |
| `manifest-record` | `npm test -- --grep @claim:manifest-record` | PASS |
| `compatibility-verdict` | `npm test -- --grep @claim:compatibility-verdict` | PASS |
| `demo-sandbox` | `npm test -- --grep @claim:demo-sandbox` | PASS |
| `local-private` | `npm test -- --grep @claim:local-private` | PASS |
| `field-kit` | `npm test -- --grep @claim:field-kit` | PASS, but uses the arbitrary environment-token bypass above |
| `platform-builds` | `npm test -- --grep @claim:platform-builds` | PASS |
| `paid-license` | `npm test -- --grep @claim:paid-license` | PASS with mocked verification |
| `binary-manifest` | `npm test -- --grep @claim:binary-manifest` | PASS |

Each ID occurs exactly once as a tagged test in `tests/product.spec.ts`.

The cold first screen passes. In plain words, it **records an owned Android app's preservation details and checks another device**, it is **for people preserving an old app they own**, and the first click is **“Try it with sample data.”** The action is visible without scrolling on desktop and 390 px mobile and opens a populated Orchard Notes record in one click. The persistent banner says **“Demo — sample data, nothing is saved”** and exposes Reset demo and Start for real.

## Local build and CLI evidence

These clean-checkout gates passed:

```text
npm ci
npm test                                  # 6 Rust + 18 Playwright tests passed
npm run check
npm run build                             # dist/site produced
cargo fmt --all -- --check
cargo clippy --all-targets --locked -- -D warnings
cargo build --release --locked
cargo package --locked --no-verify --allow-dirty
npm audit --audit-level=high              # 0 vulnerabilities
```

`actionlint` was not installed in the verifier image. `cargo test --doc` is not applicable because this package has no library target.

The packaged crate was expanded into `/tmp/legacy-rescue-consumer-g17Hme` and installed into its own empty prefix with `cargo install --path ... --root ... --locked`. The installed binary returned `rescue 0.1.0`, exposed useful command help, and completed `--json demo` with schema `1.0`, package `in.sociobot.orchardnotes`, and a compatible verdict.

Representative direct CLI paths:

- One real sample scan exited 0, emitted parseable JSON, and wrote a `0600` manifest.
- Zero APK arguments exited 2 with Clap usage.
- A nonexistent path exited 1 with `APK not found` and a next step.
- `README.md` as an invalid APK exited 1 with a readable ZIP error.
- Two APKs without a license exited 1 with Field Kit activation guidance.
- `device` without ADB exited 1 with Android Platform Tools guidance.
- A valid scan immediately after failures succeeded, demonstrating recovery.
- An empty license activation exited 1; a live invalid token exited 1 and wrote no license file.
- The paid fake-ADB happy path produced a compatible manifest and app-data archive, exposing the `0644` privacy defect above.

## Published installers and release

GitHub latest release `v0.1.0` contains Linux tar/deb/rpm, Windows ZIP, Intel and ARM macOS tar/pkg assets, `SHA256SUMS`, and `latest.json`. The live one-line Linux installer was run into `/tmp/legacy-rescue-live-install-7Ttgz8`; it verified the archive, installed the binary, and the installed binary completed `--json demo`.

Published Linux archive evidence:

```text
SHA256SUMS: 8f01f1a71ed01a2a16dae85326943c6bd8c3c2a84c6a4532e4263539eb2e8e77
downloaded: 8f01f1a71ed01a2a16dae85326943c6bd8c3c2a84c6a4532e4263539eb2e8e77
```

The release tag points to `85cc0b9...`, while the tested candidate is `e0a83a2...`. There are no Rust/Cargo changes between them, and the paid bypass reproduces in both the candidate build and published binary. Candidate changes after the tag are site, packaging metadata, tests, and verification documentation.

## Live browser, privacy, security, and deployment identity

Fresh Playwright checks covered `/`, `/demo`, `/privacy`, `/terms`, and an unknown route at 1440×900 and 390×844 with reduced motion:

- Every page has `lang="en"`, a route-specific title, one `h1`, one `main`, and no missing image alt.
- No console errors or page errors occurred.
- Axe found zero serious or critical findings on every tested route and viewport.
- No horizontal overflow occurred (`scrollWidth = clientWidth`, including 390 px).
- Keyboard focus shows the designed 3 px gold outline; Enter on the skip link moves focus to `#main`.
- SPA navigation and browser Back update the title and move focus to the new `h1`.
- Reduced motion renders the complete terminal recording immediately with a Replay control and only a completed 0.01 ms animation.
- The demo's request log is same-origin only. Landing adds only the documented GitHub Releases API request. There are no analytics, CDN fonts/scripts, service workers, or Cache Storage entries.

Live HTML response policy includes CSP restricted to self, GitHub API, and Sociobot API; HSTS; `nosniff`; strict-origin referrer policy; and restrictive camera/microphone/geolocation permissions. HTML uses `public, must-revalidate, max-age=30`. Hashed JS, CSS, and hero assets use `public, max-age=31536000, immutable`.

The factory URL verifier passed: HTTP 200, title and language present, one `h1`, main landmark, no missing alt or unnamed buttons, and no console errors.

Fresh Lighthouse mobile results:

| Category/metric | Result |
| --- | ---: |
| Performance | 92 |
| Accessibility | 100 |
| Best practices | 96 |
| SEO | 100 |
| LCP | 2457 ms |
| Total blocking time | 40 ms |
| CLS | 0 |
| Total transfer | 159 KiB |

The production build is comfortably within asset budgets: 7.58 KB gzip JS, 3.89 KB gzip CSS, about 35 KB fonts, and a 110,152-byte hero image. Lighthouse's 11.7 px terminal text and Speed Index 5.4 s remain quality findings; LCP is just under the 2.5 s threshold.

The live web deployment matches candidate `e0a83a2...` byte-for-byte:

| File | Candidate and live SHA-256 |
| --- | --- |
| `index.html` | `d2eba534657d54891a1d07be091057ce37df627a56aeb1499b4921bffa94a3ec` |
| `assets/app-DEvmlwJk.js` | `c599edb22b977aaea4b52db2894e307a66d05126c330d3752527de48b258f805` |
| `assets/index-B-z5jn0S.css` | `8ffd80506969e9f888a979114b86dc7ba8f24726ec3feb286393c01ae64eb2dc` |
| `assets/field-guide-hero.webp` | `f7fe143805f2d7dfd6b6c9645f5100131e5070ba124a192584f2f41e6b2cbe25` |

All internal route/document/install links returned 200; the release download produced its expected GitHub redirect; checkout produced its expected 303 Dodo redirect; mail links were excluded.

## Billing rate limit

`npm run verify:billing` passed against production. Checkout returned 303 to a hosted `checkout.dodopayments.com/session/...` URL with no `Retry-After`. A fresh client then observed requests 1–30 return 200 and request 31 return **429** with **`Retry-After: 4`**. A separate browser run also observed 30×200 then a 429; Playwright's network view saw `retry-after: 3`, while page JavaScript saw `null`, establishing the CORS exposure defect above.

This is a static site plus local CLI. It has no product-owned backend, PWA/service worker, or sign-in flow, so backend persistence/health, PWA update/offline reload, and Entra authority checks are not applicable.

## Retest required

At minimum: remove the arbitrary paid-license bypass; protect export archives; make the claims registry complete; repair target sizes and OS selection; return a real 404; expose the live retry delay; then rerun every claim, the full clean build, packed/released binaries, and the live browser suite.
