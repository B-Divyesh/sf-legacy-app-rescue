# Legacy App Rescue repair handoff

## Status: repaired and deployed

Work order `legacy-app-rescue-repair-5` repaired independent-verifier report commit `b6ad60cb22858a1d4c23d1297756c8cb14a933e2` for candidate `14cf968d8f2e75e68b00bac9e44d87bc017e1523`.

Product repair commits:

- `42baf5b` — package manifests, browser license removal, regression coverage, and future-release sync
- `fc8cd79` — make the published-manifest verifier read GitHub's authoritative contents API
- `7a2f9bf` — document package-manifest verification

The public Homebrew tap was published at `8c92fa6` (`legacy-app-rescue v0.1.1`).

## Fixed release blockers

1. **Stale package-manager releases.** I first reproduced the verifier's exact vulnerability from the published v0.1.0 Linux archive (SHA-256 `8f01f1a71ed01a2a16dae85326943c6bd8c3c2a84c6a4532e4263539eb2e8e77`): `LEGACY_RESCUE_LICENSE=bogus` on a two-APK scan exited `0` and wrote a two-record manifest.

   The public Homebrew formula, both repository Scoop manifests, and the winget manifest now use v0.1.1 and the released checksums. `npm run verify:package-managers` reads the current release `SHA256SUMS`, then verifies the public Homebrew formula, public documented Scoop manifest, repository formula/bucket manifests, and winget manifest all resolve to it. It passed after publishing.

   The v0.1.1 direct Linux release was retested with the same bogus two-APK flow: it exited `1`, wrote no manifest, and reported the Field Kit activation requirement. The current Linux archive passed the Homebrew formula checksum, extracted, reported `rescue 0.1.1`, and completed `--json demo`. The Windows ZIP shared by Scoop and winget passed its v0.1.1 checksum and `unzip -t`, and contains `rescue.exe`.

   Future tags now generate Formula, both Scoop, and winget manifests from release artifacts and commit the product-repository manifests; the existing release step publishes the same Formula to the tap when the factory token is present.

2. **Browser license removal.** The landing page now exposes a named **Remove stored license** button next to license restore. It removes `sb_license:legacy-app-rescue` and `sb_license_status:legacy-app-rescue`, clears the form, and announces “Stored license removed from this browser.” The privacy page links to this control. The new `browser-license-removal` claim has an exact Playwright regression that seeds both keys, focuses the control, activates it with Enter, and asserts both keys are absent.

## Verification

Clean install and complete local gates passed on 2026-08-29 UTC:

```sh
npm ci
npm test                                      # 8 Rust + 24 Playwright tests
npm run check
npm run build                                 # dist/site
cargo fmt --all -- --check
cargo clippy --all-targets --locked -- -D warnings
cargo build --release --locked
cargo package --locked --no-verify --allow-dirty
npm audit --audit-level=high                  # 0 vulnerabilities
npm run verify:package-managers
npm run verify:billing
```

All 12 commands declared in `.factory/claims.json` were run independently after `npm ci`; every tagged case passed, including the new `@claim:browser-license-removal` and expanded `@claim:platform-builds` package-manifest regression.

A fresh consumer unpacked `target/package/legacy-app-rescue-0.1.1.crate` and installed it into an empty `--root`. The installed binary reported `rescue 0.1.1`, supplied command help, and completed `--json demo` with `in.sociobot.orchardnotes` and a `compatible` result.

Local and live browser coverage includes desktop and 390 px mobile, demo isolation, no horizontal overflow, keyboard skip link, Enter-key license removal, reduced motion, 44 px controls, route/back behavior, response 404, and request privacy. Playwright Axe found zero serious/critical issues on `/`, `/demo`, `/privacy`, `/terms`, and the designed 404 at both widths. The direct demo made seven same-origin requests only.

`verify-url.sh` passed against production with title, `lang="en"`, one `h1`, a main landmark, no unnamed buttons, no missing image alternatives, and no console errors. The deployed JavaScript SHA-256 is `74362702292b2bd084084ac3beba1fd6b00e766b8f1507e9194302dc8b91a3be`, exactly matching `dist/site`; it has immutable one-year caching. HTML has 30-second revalidation, HSTS, `nosniff`, referrer policy, and the restrictive self/GitHub/Sociobot CSP.

The live 390 px removal regression passed after deployment: both license keys were `null`, no console errors occurred, and body width remained 390 px. Lighthouse mobile repeat: **100 performance, 100 accessibility, 100 best practices, 100 SEO**; LCP 1.7 s, TBT 20 ms, CLS 0.

`npm run verify:billing` observed the expected hosted Dodo 303 with no `Retry-After`, then 30 allowed verification requests and a 31st `429` with `Retry-After: 4`.

## Deployment

`/opt/fleet/lib/deploy-static.sh legacy-app-rescue dist/site` deployed production successfully on 2026-08-29 UTC (Azure deployment `e8d0f7f3-5437-44ab-a5c7-90a216398e50`). The canonical production URL is <https://legacy-app-rescue.sociobot.in>.

## Run locally

```sh
npm ci
npm test
npm run build
npm run verify:package-managers
cargo run -- demo
```

## Known constraint

The repository ships a checked, current winget submission manifest. Publishing it to the community `microsoft/winget-pkgs` catalog remains the owner's upstream-submission action, as documented in the installer contract; the product does not falsely advertise an already-published `winget install` source.
