# Independent verification 5 — FAIL

**Candidate:** `14cf968d8f2e75e68b00bac9e44d87bc017e1523` (`main`)  
**Live URL:** <https://legacy-app-rescue.sociobot.in>  
**Verified:** 2026-08-28 UTC from the supplied clean checkout

## Release decision

**FAIL — do not accept or promote this candidate.** The previously reported product, deployment, caching, checkout, and rate-limit defects are repaired in the v0.1.1 direct release. However, two documented package-manager paths still deliver vulnerable v0.1.0, and the browser cannot perform its advertised license-token removal.

| Severity | Fresh evidence | Required correction |
| --- | --- | --- |
| **Major — release blocker** | The README documents `brew install B-Divyesh/legacy-app-rescue/legacy-app-rescue`, but the public tap formula still says `version "0.1.0"` and downloads v0.1.0. The documented Scoop bucket in this repository also has `"version": "0.1.0"` and a v0.1.0 URL. Both facts were confirmed against their public raw GitHub URLs. I downloaded the exact Linux v0.1.0 artifact named by the formula (SHA-256 `8f01f1a71ed01a2a16dae85326943c6bd8c3c2a84c6a4532e4263539eb2e8e77`) and ran a two-APK batch with `LEGACY_RESCUE_LICENSE=bogus`; it exited **0** and wrote a two-record manifest. That is the paid-license bypass fixed in v0.1.1. `Formula/legacy-app-rescue.rb`, `bucket/legacy-app-rescue.json`, `scoop-bucket/legacy-app-rescue.json`, and the winget manifest are all stale at v0.1.0. | Publish the generated v0.1.1 formula to the public tap, update both repository Scoop manifests and winget metadata to v0.1.1 with current checksums, and add a release test that every documented package-manager path resolves to the current version. Retest an actual install from each documented package manager. |
| **Major — acceptance/claims blocker** | The landing page says, “The token stays in this browser and can be removed.” There is no Remove/Forget/Clear button or link. In a fresh browser I entered an invalid token; the page correctly reported it inactive, but retained both `sb_license:legacy-app-rescue` and `sb_license_status:legacy-app-rescue`. The page exposed no removal affordance. The promise also has no dedicated entry/tagged test in `.factory/claims.json`; `@claim:paid-license` only tests storage, URL stripping, the mocked verification request, and the checkout link. | Add an accessible removal action that deletes both keys and reports completion, with its own claim entry and observable test, or remove the promise and clearly document browser-storage removal. |

## Mandatory claims and first-read gates

`.factory/claims.json` exists with eleven entries. On the literal first invocation from the dependency-free checkout, every declared `npm test` command reached the common Rust pretest and then stopped at `tsc: not found`; no tagged claim case ran. After the required clean install with `npm ci`, I reran every exact command independently. All eleven tagged cases passed:

| Claim | Exact declared command | Installed result |
| --- | --- | --- |
| `manifest-record` | `npm test -- --grep @claim:manifest-record` | PASS |
| `compatibility-verdict` | `npm test -- --grep @claim:compatibility-verdict` | PASS |
| `demo-sandbox` | `npm test -- --grep @claim:demo-sandbox` | PASS |
| `local-private` | `npm test -- --grep @claim:local-private` | PASS |
| `field-kit` | `npm test -- --grep @claim:field-kit` | PASS |
| `platform-builds` | `npm test -- --grep @claim:platform-builds` | PASS, but it does not test the documented package-manager versions |
| `paid-license` | `npm test -- --grep @claim:paid-license` | PASS with a mocked verification response; it does not test token removal |
| `binary-manifest` | `npm test -- --grep @claim:binary-manifest` | PASS |
| `installer-verified` | `npm test -- --grep @claim:installer-verified` | PASS |
| `browser-license-cache` | `npm test -- --grep @claim:browser-license-cache` | PASS |
| `export-refusal-cleanup` | `npm test -- --grep @claim:export-refusal-cleanup` | PASS |

Each claim ID occurs exactly once in `tests/product.spec.ts`.

The cold live first screen **passes**. In plain words, the product records an Android app the user owns and checks another device; it is for a person preserving an old app; and the first click is **Try it with sample data**. The action is visible in the first viewport on desktop and 390 px mobile and opens a populated Orchard Notes record in one click. The persistent banner says **Demo — sample data, nothing is saved** and exposes Reset demo and Start for real.

## Local build and clean-consumer CLI

All repository gates passed after `npm ci`:

```text
npm test                                  8 Rust + 23 Playwright tests passed
npm run check                             passed
npm run build                             passed; produced dist/site
cargo fmt --all -- --check                passed
cargo clippy --all-targets --locked -- -D warnings
cargo build --release --locked            passed
cargo package --locked --no-verify        passed
npm audit --audit-level=high              0 vulnerabilities
```

The packaged `legacy-app-rescue-0.1.1.crate` was expanded into `/tmp/legacy-consumer-ViZm47` and installed into the empty prefix `/tmp/legacy-install-VJazoB`. Its installed binary reported `rescue 0.1.1`, provided useful top-level and scan help, and completed `--json demo` with schema `1.0`, package `in.sociobot.orchardnotes`, signer evidence, API 21→28, arm64, an Android 13 device, and a `compatible` verdict.

Independent CLI cases:

- A normal sample scan exited 0, emitted parseable JSON, and wrote a mode `0600` manifest.
- No APK argument exited 2 with usage.
- A missing APK, directory path, and non-ZIP input each exited 1 with a specific cause and `rescue --help` recovery step.
- `--serial` without `--device` exited 2 with the required-argument explanation.
- `device` without ADB exited 1 with Android Platform Tools guidance.
- Empty license activation exited 1. JSON license status/removal returned valid JSON.
- A two-APK scan with `LEGACY_RESCUE_LICENSE=not-a-real-license` exited 1 and wrote no manifest, confirming the candidate fix.

## Published release and installers

GitHub latest is v0.1.1 and contains Linux tar/deb/rpm, Windows ZIP, Intel and Apple-silicon macOS tar/pkg assets, `SHA256SUMS`, `latest.json`, and generated package manifests. The downloaded v0.1.1 Linux archive hash was:

```text
expected  502e045a0984b6cd055427e3758919d9f16314f5fc91b7fd4148f25069ad1206
actual    502e045a0984b6cd055427e3758919d9f16314f5fc91b7fd4148f25069ad1206
```

The live `install.sh` was run into `/tmp/legacy-live-install-hcS9FW`; it verified the download, installed `rescue 0.1.1`, and the installed binary completed the JSON demo. It rejected the bogus-license batch and wrote no output.

Tag `v0.1.1` points to `72552e0fabf75c9f00583f1297faa05ef24259b9`. Its only difference from the candidate is `.factory/handoff.md`, so the released program and site source are the candidate's product code. The package-manager blocker exists because the generated release metadata was not propagated to the documented tap/bucket locations.

## Live browser, privacy, accessibility, and deployment identity

Fresh Playwright checks covered `/`, `/demo`, `/privacy`, `/terms`, and an unknown route at 1440×900 and 390×844:

- Every real page returns 200, has `lang="en"`, a route-specific title, one `h1`, one `main`, and no missing image alt text. The unknown route returns HTTP 404 with the designed recovery page.
- Axe found zero serious or critical findings at both widths on every real route.
- No console/page errors occurred on the real routes, and no route had horizontal overflow.
- Keyboard traversal reached every control without a trap. Each focused interactive element had a 3 px visible outline and measured at least 44×44 CSS px. The skip link moved focus to main; SPA navigation and browser Back updated the title and focused the new `h1`.
- Reduced motion rendered the terminal recording immediately; its only animation was finished with a 0.01 ms duration.
- The direct `/demo` request log was same-origin only. Reset retained only `demo:legacy-app-rescue:opened`; Start for real removed the demo namespace. The landing page additionally called only the documented GitHub Releases API. There were no analytics, CDN fonts/scripts, service workers, or sign-in flows.
- All discovered internal links returned 200; the release asset produced its expected GitHub redirect; checkout produced its expected 303 Dodo redirect; and `sociobot.in` returned 200.

The factory `verify-url.sh` passed: HTTPS 200, expected title/language, one `h1`, a main landmark, no missing alt text or unnamed buttons, and no browser errors.

The live response includes HSTS, `nosniff`, strict-origin referrer policy, restrictive permissions policy, and a CSP limited to self, GitHub's release API, and Sociobot's API. HTML uses `public, must-revalidate, max-age=30`; hashed JS, CSS, and hero assets use `public, max-age=31536000, immutable`.

The local production build and live deployment match byte-for-byte:

| File | Candidate and live SHA-256 |
| --- | --- |
| `index.html` | `7adeb8baccf07f620d44189aef9dfe1de714cd79490685cf3cb4161d48ed6add` |
| `assets/app-Cu2YknR_.js` | `72d085954b1e5c172bf2776e5057340955d4e855734ed491537b57188327a7c5` |
| `assets/index-B8DeJN98.css` | `13fff983a32fc9b80f1b1564f5ac64afff2cc73ce68b260344ad5b3b9ca0f5c7` |
| `assets/field-guide-hero.webp` | `f7fe143805f2d7dfd6b6c9645f5100131e5070ba124a192584f2f41e6b2cbe25` |

Production assets are within budget: 7.84 KB gzip JavaScript, 3.99 KB gzip CSS, 34.8 KB total fonts, and a 110,152-byte hero image. A repeat Lighthouse mobile run scored **98 performance, 100 accessibility, 100 best practices, and 100 SEO**, with LCP 1.9 s, TBT 130 ms, CLS 0, Speed Index 1.1 s, and 160 KiB transfer.

## Billing rate limit and scope

`npm run verify:billing` passed against production. Checkout returned 303 to `checkout.dodopayments.com`. A fresh client received 30 allowed verification responses; request 31 returned **429** with **`Retry-After: 4`**. The observed documented allowance is **30 requests per client/window**.

This is a static site plus local CLI. It has no product-owned backend, service worker/PWA, or sign-in flow, so backend concurrency/persistence/health, offline service-worker updates, and Entra authority checks are not applicable.

## Retest required

Update the public Homebrew/Scoop/winget paths to v0.1.1, prove they install the repaired binary, and add browser license removal plus a claim test. Then rerun the full claims, clean build, package-consumer, package-manager, billing, and live-browser checks.
