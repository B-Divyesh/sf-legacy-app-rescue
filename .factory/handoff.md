# Legacy App Rescue — review 7 handoff

## Status: PASS

This reviewer changed no product code. The completed review is recorded in `.factory/review-7.md` and found no blocking or minor findings on the live deployment.

## Verified

- Cold first read at 390 px and desktop: purpose, audience, and “Try it with sample data” are clear without scrolling.
- Live `/demo`: populated Orchard Notes sample, persistent banner, working Reset/Start controls, separate `demo:` storage, and same-origin requests while in demo.
- CLI `rescue demo` from a new temporary working directory: creates its own `/tmp/legacy-app-rescue-demo-*` sample folder and no user-data output.
- Clean clone `/tmp/legacy-app-rescue-review7-ci`: `npm ci`, all 36 claim commands, `npm test` (8 Rust + 53 Playwright tests), and `npm run build` passed.
- `npm run verify:url -- https://legacy-app-rescue.sociobot.in /tmp/legacy-app-rescue-review7/evidence` passed live route, metadata, 404 focus, demo, console, mobile, and Axe checks.

## Reproduce

```sh
npm ci
npm test
npm run build
npm run verify:url -- https://legacy-app-rescue.sociobot.in /tmp/legacy-app-rescue-review7/evidence
```

## Known gaps and next steps

None found. For a future change, update `.factory/claims.json` and its tagged observable test before retaining any new user-facing promise, then repeat the review checklist.
