# Legacy App Rescue — review 4 handoff

## Status: FAIL

This reviewer made no product-code changes. The committed artifacts are `.factory/review-4.md` and this handoff.

## Verification completed

- Used fresh 390 px Android and desktop browser contexts against <https://legacy-app-rescue.sociobot.in>.
- Verified the one-click demo, mobile end-of-record banner, reset/exit isolation, request log, and CLI demo in a temporary working directory.
- Made a clean clone at `/tmp/legacy-app-rescue-review4.ciPHHi`; ran `npm ci`, every one of the 27 exact claim commands, and `npm test`.
- All 27 claim commands passed. `npm test` passed: 8 Rust tests and 43 Playwright tests. The build created `dist/site/`.
- Checked route titles, descriptions, canonical/OG surface, focus/history, 404 behavior, security headers, and crawled links.

## Remaining work

The acceptance blockers are documented in `.factory/review-4.md`:

- F-4-1 through F-4-7: visitor-facing free-tier, device-record, CLI, preservation-field, and release-asset statements have no exact `claims.json` entry and observable tagged sandbox test.
- F-4-8: returning home from the separately served 404 lands with focus on `body`, not the landing `h1`.
- F-4-9 and F-4-10: duplicate eyebrow labels and incomplete static-404 metadata.

Run the clean verification again after repair with `npm ci && npm test`, then execute every command listed in `.factory/claims.json` independently from a clean clone.
