# Independent verification — FAIL

**Candidate:** `9307174ea4411ff5bd7dd86b3adde1f1be68f333` (`main`)  
**Live URL:** <https://legacy-app-rescue.sociobot.in>  
**Verified:** 2026-08-28 UTC from a clean checkout

## Release decision

**FAIL — do not accept the candidate.** The production Field Kit checkout that the landing page and README advertise is not registered: a fresh `HEAD` request to `https://api.sociobot.in/api/v1/products/legacy-app-rescue/checkout` returned **404** at 20:23 UTC. A visitor cannot buy the advertised $19 one-time upgrade, so the paid end-to-end flow is broken.

| Severity | Evidence | Required correction |
| --- | --- | --- |
| Major — release blocker | The live **Buy Field Kit for $19** link targets the documented Sociobot checkout endpoint. That endpoint returns HTTP 404, not checkout or a redirect. | Register/configure the `legacy-app-rescue` product and its return URL in Sociobot billing, then retest a real checkout entry response. |
| Major — release blocker | The product-owned checkout integration has no documented request allowance. The invalid-token verification request returned 200 with `{ "valid": false, "reason": "invalid" }`, but no rate-limit headers or allowance documentation; checkout returned 404 and no `Retry-After`. Therefore the required over-limit 429 behaviour cannot be verified or an allowance observed. | Document and enforce an allowance at the billing edge; verify that a client past it receives 429 and `Retry-After`. |

The test-only `@claim:paid-license` test passed because it mocks the verification response and only asserts the checkout link's text/href. It does **not** exercise a functioning production checkout, so it does not mitigate the live failure.

## Required claims gate

`.factory/claims.json` exists with eight entries. On the clean checkout I installed with `npm ci` and ran every declared command sequentially through the product demo entry point. All passed:

| Claim | Exact declared command | Result |
| --- | --- | --- |
| manifest-record | `npm test -- --grep @claim:manifest-record` | PASS |
| compatibility-verdict | `npm test -- --grep @claim:compatibility-verdict` | PASS |
| demo-sandbox | `npm test -- --grep @claim:demo-sandbox` | PASS |
| local-private | `npm test -- --grep @claim:local-private` | PASS |
| field-kit | `npm test -- --grep @claim:field-kit` | PASS |
| platform-builds | `npm test -- --grep @claim:platform-builds` | PASS |
| paid-license | `npm test -- --grep @claim:paid-license` | PASS (mocked only; see blocker) |
| binary-manifest | `npm test -- --grep @claim:binary-manifest` | PASS |

The first attempt at a loop overlapped preview-server teardown and produced `127.0.0.1:4173 is already used` for three entries. Each affected command was rerun singly after the port was released and passed; this is recorded as test orchestration noise, not a product claim failure.

## First read, live deployment, and privacy

Cold live-page reading passes the plain-words and demo gate. The first screen says **“Record your Android app before it disappears”**, says it is for people preserving an old app they own, and explains that it records needs and checks another device. It provides one-click **Try it with sample data** with the adjacent explanation “See a finished record. Nothing touches your files.” The three initial facts state platforms, local APK scans, and price.

The live `/demo` page showed the persistent **Demo — sample data, nothing is saved** banner, one Reset demo action, Start for real, and its fictional Orchard Notes record. In a fresh 390 px Playwright context, it created only `demo:legacy-app-rescue:opened`; all demo requests stayed at `legacy-app-rescue.sociobot.in`; no console or page errors occurred; `scrollWidth = clientWidth = 390`; Tab visibly reached the skip link and Enter moved focus to `#main`; reduced motion rendered the recording complete and exposed Replay.

Fresh live desktop checks found one `h1` and `main` on `/`, `/demo`, `/privacy`, and `/terms`, no serious/critical axe findings (the initial page and a repeat at `/demo` were specifically checked), and no console/page errors under normal network conditions. The landing page makes the documented GitHub release API request; the demo makes no external request. Response headers include CSP with only `self`, `api.github.com`, and `api.sociobot.in` connections; HSTS; `nosniff`; strict referrer policy; and permissions policy.

The deployed shell and core assets match this candidate build byte-for-byte:

- `index.html`: `89b27b9fcfe5fb7d142b37c0c22a6bf7bcbc009e47b38ec37fb045ef942d88bc`
- `assets/app-CFVl0z2g.js`: `47a4bbed7d1e78c8194a03be530a9c818946674320d35c3c75be1a6781be60cd`

The prior deployment-only cache defect is resolved: live hashed JS, CSS, and hero image each return `Cache-Control: public, max-age=31536000, immutable`. HTML routes return a sensible 30-second revalidation policy.

## Local quality gates and CLI/installer evidence

All passed from the clean checkout:

```sh
npm ci
npm test                 # 6 Rust unit tests, 15 Playwright tests
npm run check
npm run build            # produces dist/site/
cargo fmt --all -- --check
cargo clippy --all-targets --locked -- -D warnings
cargo build --release --locked
cargo package --locked --no-verify
npm audit --audit-level=high
```

The built site is 7.22 KB gzip JavaScript and 3.89 KB gzip CSS. The CLI's `--help`, `--json demo`, normal sample inventory/compatibility path, and error paths were exercised. The demo emitted schema `1.0`, package `in.sociobot.orchardnotes`, and `compatible`; a missing APK exits 1 with a direct recovery instruction; an unlicensed multi-APK scan exits 1 and explains Field Kit activation.

The packed `legacy-app-rescue-0.1.0.crate` was unpacked into a new temporary directory and installed with `cargo install --path … --root … --locked`; its installed binary successfully ran `--json demo` and the missing-APK recovery path. The published v0.1.0 Linux archive was downloaded, its SHA-256 (`8f01f1a71ed01a2a16dae85326943c6bd8c3c2a84c6a4532e4263539eb2e8e77`) matched `SHA256SUMS`, and its extracted binary ran the same successful demo. GitHub's latest release lists all expected Linux, Windows, and both macOS artifacts plus checksum and manifest files.

This static CLI product has no service worker/PWA or sign-in flow. The only server integration is the Sociobot billing/verification service; its missing checkout and untestable documented rate allowance are the blockers above.
