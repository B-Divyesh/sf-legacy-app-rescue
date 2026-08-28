# Independent verification 3 — FAIL

**Candidate:** `8f5f79d3d70ca1a348ea34694e5647d5c863f05d` (`main`)  
**Live URL:** <https://legacy-app-rescue.sociobot.in>  
**Verified:** 2026-08-28 UTC from a clean checkout

## Release decision

**FAIL — do not accept this candidate.** The previous deployment-only failures are repaired: the live release exactly matches this candidate's built web assets, hashed assets are immutable, and the Field Kit checkout now returns the expected Dodo redirect. One release-blocking acceptance defect remains: the product's Sociobot license-verification server integration has no documented request allowance and did not return `429` plus `Retry-After` after 30 consecutive invalid-token requests from one client. The required observable allowance is therefore unknown and unverified.

| Severity | Fresh evidence | Required correction |
| --- | --- | --- |
| Major — release blocker | `GET https://api.sociobot.in/api/v1/products/legacy-app-rescue/verify?license=qa-invalid-rate-probe-1` through `...-30`, sent sequentially from this verifier on 2026-08-28, each returned `200`, `{"valid":false,"reason":"invalid","expires_at":null}`, and no `Retry-After`. `README.md`, the landing page, and product code contain no documented allowance. | Enforce and document an allowance at the Sociobot verification/billing edge. Retest from one client past that stated allowance; it must receive HTTP `429` with a meaningful `Retry-After` header. |

The live checkout itself passes: `npm run verify:billing` received the required HTTP `303` to a `https://checkout.dodopayments.com/session/...` URL and no `Retry-After`. This fixes the checkout 404 recorded in `verification-2.md`, but does not fix the rate-limit gate.

## Required claims gate

`.factory/claims.json` exists with eight entries. Before broader QA, after `npm ci` in this clean checkout, I ran every declared command sequentially through the demo entry point. Each passed. A subsequent full `npm test` also passed all of them, along with all regression and accessibility tests.

| Claim | Exact declared command | Result |
| --- | --- | --- |
| `manifest-record` | `npm test -- --grep @claim:manifest-record` | PASS |
| `compatibility-verdict` | `npm test -- --grep @claim:compatibility-verdict` | PASS |
| `demo-sandbox` | `npm test -- --grep @claim:demo-sandbox` | PASS |
| `local-private` | `npm test -- --grep @claim:local-private` | PASS |
| `field-kit` | `npm test -- --grep @claim:field-kit` | PASS |
| `platform-builds` | `npm test -- --grep @claim:platform-builds` | PASS |
| `paid-license` | `npm test -- --grep @claim:paid-license` | PASS (mocked verification response only) |
| `binary-manifest` | `npm test -- --grep @claim:binary-manifest` | PASS |

`npm test` result: 6 Rust unit tests and 17 Playwright tests passed. This includes the eight tagged claim tests, checkout/429 UI regressions, four route axe smoke tests, keyboard/mobile, and the not-found route.

## First read, privacy, accessibility, and live deployment

The cold live first screen passes the plain-words and demo gates. It says **“Record your Android app before it disappears”**, identifies people preserving an old app they own, states that it records needs and checks another device, and presents one-click **“Try it with sample data”** next to **“See a finished record. Nothing touches your files.”** The three facts name supported operating systems, local APK scans, and the $19 one-time upgrade.

Fresh Playwright evidence:

- Desktop `/`: HTTP 200; title `Legacy App Rescue — record an Android app`; exactly one `h1` and `main`; no console/page errors; zero axe serious or critical findings; no horizontal overflow. The only non-product-origin request is the documented GitHub Releases API lookup.
- Mobile 390 px reduced-motion `/demo`: HTTP 200; title `Demo — Legacy App Rescue`; exactly one `h1` and `main`; `scrollWidth = clientWidth = 390`; no console/page errors; zero axe serious or critical findings. Tab focused the visible skip link and Enter moved focus to `#main`.
- The demo created its persistent **“Demo — sample data, nothing is saved”** state, uses only `demo:legacy-app-rescue:opened` in the browser test, and its complete request log stayed at `legacy-app-rescue.sociobot.in`. The CLI demo also completed with unreachable HTTP proxy settings in the required privacy claim.

Live response headers include CSP (`connect-src` restricted to self, GitHub API, and Sociobot API), HSTS, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, and a restrictive permissions policy. HTML routes have `public, must-revalidate, max-age=30`; live content-hashed JS, CSS, and hero WebP each have `Cache-Control: public, max-age=31536000, immutable`.

The live deployed files byte-match this candidate's `dist/site/`:

- `index.html`: `098922b7a3d2ce8711dd606cc34b3e2aafb479a86b63277dd1b2214ab3184b8a`
- `assets/app-DrD6JTaT.js`: `02bc53d1ab460307039e0b8d27851f6360d68eaff6e552d9f18d1840201e83d0`
- `assets/index-B-z5jn0S.css`: `8ffd80506969e9f888a979114b86dc7ba8f24726ec3feb286393c01ae64eb2dc`
- `assets/field-guide-hero.webp`: `f7fe143805f2d7dfd6b6c9645f5100131e5070ba124a192584f2f41e6b2cbe25`

Initial gzip sizes are 7.52 KB JavaScript and 3.89 KB CSS, within the static-product budgets.

## Local build, CLI, packaging, and installer evidence

The following passed from this clean checkout:

```sh
npm ci
npm test
npm run check
npm run build
cargo fmt --all -- --check
cargo clippy --all-targets --locked -- -D warnings
cargo build --release --locked
cargo package --locked --no-verify
npm audit --audit-level=high
npm run verify:billing
```

`npm run build` produced `dist/site/`; `npm audit` found zero vulnerabilities. `actionlint` was not installed in the verifier environment, so it was not run.

I unpacked `target/package/legacy-app-rescue-0.1.0.crate` into a new temporary consumer directory and installed it with `cargo install --path … --root … --locked`. Its installed public binary displayed useful `--help`, ran `--json demo` (schema version `1.0`, `in.sociobot.orchardnotes`, `compatible`), and rejected a missing APK with exit 1 and recovery text. The release binary was also tested: the published `rescue-linux-x86_64.tar.gz` SHA-256 `8f01f1a71ed01a2a16dae85326943c6bd8c3c2a84c6a4532e4263539eb2e8e77` matches `SHA256SUMS`, and its extracted binary successfully ran `--json demo`.

Representative direct CLI checks passed: the sample demo wrote an inventory; a normal one-APK scan returned one APK and no device; an unlicensed two-APK batch exited 1 with Field Kit activation instructions; and an invalid export missing `--device` exited 2 with Clap's required-argument guidance. The paid export path itself is covered by the passing fake-authorized-ADB `@claim:field-kit` test.

This static CLI product has no PWA/service worker or sign-in flow, so no offline-reload/update or Entra sign-in path applies.

## Historical context and next step

`verification.md` records the earlier cache-header failure and `verification-2.md` records the earlier checkout 404. Both are now resolved by fresh evidence above. The sole open blocker is verifiable server-side request limiting for the Sociobot license service. After that edge is corrected, rerun the 30-request probe past the documented allowance and this full verification.
