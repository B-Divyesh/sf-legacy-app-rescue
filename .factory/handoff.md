# Legacy App Rescue review-2 handoff

## Status: FAIL

This reviewer made no product-code changes. `.factory/review-2.md` records one blocking claims-registry gap and seven minor plain-language findings from a new cold live review.

## Verification performed

- Installed the locked dependencies with `npm ci`.
- Loaded the live landing in fresh 390 × 844 and 1440 × 900 Chromium contexts.
- Checked direct demo isolation, reset, exit, storage namespace, and request origins; ran `rescue demo` from a temporary working directory.
- Ran all 26 commands listed in `.factory/claims.json` independently: all PASS.
- Ran `npm test`: 8 Rust and 42 Playwright tests PASS.
- Ran `npm run build`: PASS; `dist/site/` produced.
- Checked route metadata, history/focus behavior, Axe results, headers, robots/sitemap, 404 behavior, and crawled links.

## Remaining work

- Resolve F-2-1 before acceptance by declaring and testing the live mobile availability statement, or remove that categorical claim.
- Resolve F-2-2 through F-2-8 by expanding core terms and making the evidence summary plain-language.
