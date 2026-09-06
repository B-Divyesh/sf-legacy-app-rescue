# Legacy App Rescue — verification 11 handoff

## Status: PASS

- **Implementation SHA:** `ae763326f4e2d0f000a57bade0462951e386b89f`
- **Documentation SHA:** `deb3f50a985e07b769dabdd35054b23fa1878d6b`
- **Live site:** <https://legacy-app-rescue.sociobot.in>

Independent QA completed from a clean clone. All 36 declared claim commands passed, as did `npm test` (8 Rust and 54 Playwright tests), build, format, Clippy, release package, audit, package-manager, billing/rate-limit, URL/Axe, and mobile performance checks.

Fresh desktop and phone browser sessions showed the job, audience, and sample action before scrolling. The sample opened the Orchard Notes record with its persistent sample label. Reset and Start for real kept real storage unchanged. Keyboard focus passed on paper and dark terminal surfaces at 10.44:1 and 17.29:1 contrast. Live HTML, JavaScript, and CSS byte-match the candidate build.

The clean packaged crate installed into a separate consumer prefix. Installed `rescue 0.1.3 --json demo` emitted the expected Orchard Notes 1.7.0 compatible preservation record.

## How to verify

```sh
npm ci
npm test
npm run build:site
npm run verify:url -- https://legacy-app-rescue.sociobot.in /work/.evidence/verification-11-live
npm run verify:package-managers
npm run verify:billing
npm run test:performance
```

See `.factory/verification-11.md` for the full evidence and earlier-finding disposition.

## Known gaps

None. The product is a local CLI plus static site; it has no product backend, tenant state, service-worker update claim, or sign-in persistence to verify. The public billing allowance was checked: 30 verification requests succeed, then request 31 returns 429 with `Retry-After`.
