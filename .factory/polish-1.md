# Polish round 1

Candidate `e0c033680c317d1e2ca73f73c1280de183eb43ec` was repaired against adversarial review `7d6835fd9f468414f8c45cbf47ef8a0418d51a1a` on 29 August 2026. There were no earlier `review-*` or `polish-*` reports. The earlier `verification-*` regressions remain covered by the 42-test suite.

Evidence screenshots are in `/work/.evidence/polish-1/`. Live checks use <https://legacy-app-rescue.sociobot.in>.

| Finding | Change made | Evidence |
| --- | --- | --- |
| F-1-1 | Kept the safety boundary and added a byte-for-byte APK immutability test plus refused-export coverage. | `@claim:safety-boundaries`; `live-landing-mobile.png`; live `/#main` boundary section. |
| F-1-2 | Kept the Android-control limit and exercised a fake ADB refusal that leaves no archive and never invokes a bypass. | `@claim:safety-boundaries` and `@claim:export-refusal-cleanup`; `live-landing-mobile.png`; live `/privacy`. |
| F-1-3 | Added a selected-APK test beside an unpassed sentinel file. | `@claim:input-scope`; `live-landing-mobile.png`; live `/privacy`. |
| F-1-4 | Added a fake-device test that checks the exact 16-character SHA-256 prefix and absence of the raw serial. | `@claim:device-serial-hash`; `live-privacy-mobile.png`; live `/privacy`. |
| F-1-5 | Kept the limitation in every manifest note and verified the reason plus non-guarantee terms. | `@claim:compatibility-limit`; `live-demo-mobile.png`; live `/terms`. |
| F-1-6 | Rewrote the copy to “Sociobot handles checkout” and verified a recorded revoked verdict cannot activate the license. | `@claim:merchant-and-refund`; `live-landing-mobile.png`; live `/#field-kit` and `/terms`. |
| F-1-7 | Named the two browser keys, stripped the URL token, checked cookies, and proved token-bearing requests go only to Sociobot. | `@claim:browser-license-storage`; `live-landing-mobile.png`; live `/#restore` and `/privacy`. |
| F-1-8 | Added a real scan with blocked proxies and a before/after APK byte comparison. | `@claim:apk-transfer-boundary`; `live-privacy-mobile.png`; live `/privacy`. |
| F-1-9 | Reworded the sample claim precisely and inspected the built APK entry list for any DEX executable. | `@claim:sample-is-noninstallable`; `live-demo-mobile.png`; live `/?demo=1`. |
| F-1-10 | Inspected the released Windows PE certificate table and macOS XAR table of contents, plus both packaging jobs. | `@claim:unsigned-builds`; `live-landing-mobile.png`; live `/#install`. |
| F-1-11 | Removed the unhelpful version-specific ZIP64 promise. Signer failure still preserves the whole-file hash under `manifest-record`. | claims-registry test and copy audit; `live-landing-mobile.png`; live landing copy check. |
| F-1-12 | Added offline-proxy runs of the bundled demo and a supplied-APK scan. | `@claim:no-cli-telemetry`; `live-privacy-mobile.png`; live `/privacy`. |
| F-1-13 | Replaced the overly narrow CLI destination sentence with the tested Sociobot license-service wording. Browser destination remains explicit and tested. | `@claim:paid-license` and `@claim:browser-license-storage`; `live-privacy-mobile.png`; live `/privacy`. |
| F-1-14 | Promoted the recorded 429 recovery flow to a declared claim with an exact visible retry delay. | `@claim:license-busy-recovery`; `live-landing-mobile.png`; live `/#restore`. |
| F-1-15 | Removed the speculative Windows prompt prediction and retained the verifiable unsigned-build fact. | `@claim:unsigned-builds`; `live-landing-mobile.png`; live `/#install`. |
| F-1-16 | Validated the current winget version, architecture, installer type, alias, URL, checksum, and schema. | `@claim:winget-submission-manifest`; `live-landing-mobile.png`; live `/#install`. |
| F-1-17 | Split the winget guidance into two short sentences and tied readiness to the validated manifest. | `@claim:winget-submission-manifest`; `live-landing-mobile.png`; live `/#install`. |
| F-1-18 | Implemented distinct plain `--ci` demo/device output and compared it with decorated output. | `@claim:ci-output`; `live-demo-mobile.png`; live `/?demo=1`. |
| F-1-19 | Replaced “Make a record you can check later” with “Create a preservation manifest.” | copy audit and full browser suite; `live-landing-mobile.png`; live landing “Three steps.” |
| F-1-20 | Replaced the abstract safety heading with “What the tool does not change.” | copy audit and full browser suite; `live-landing-mobile.png`; live landing boundary section. |
| F-1-21 | Replaced “Add one small command” with “Install Legacy App Rescue.” | copy audit and full browser suite; `live-landing-mobile.png`; live `/#install`. |
| F-1-22 | Replaced the question link with the action “Restore a license.” | accessibility smoke and mobile-target test; `live-landing-mobile.png`; live `/#restore`. |
| F-1-23 | Split the winget explanation into two sentences under 22 words. | copy audit; `live-landing-mobile.png`; live `/#install`. |
| F-1-24 | Split the package-manager verifier explanation into three short sentences. | copy audit and `npm run verify:package-managers`; `live-landing-mobile.png`; live install links. |

## Additional acceptance work

- The first screen now says exactly what is recorded and what device is checked. Its primary action opens `/?demo=1` in one click.
- `/?demo=1` and `/demo` share an isolated `demo:legacy-app-rescue:` namespace, persistent banner, reset, and exit that clears demo keys.
- Each route updates its title, description, canonical URL, Open Graph fields, Twitter fields, focus, announcement, and history state.
- The deployed 404 returns HTTP 404 and uses the same header, footer, legal links, focus treatment, and field-guide palette.
- `.factory/claims.json` has 26 unique entries and exactly one `@claim:<id>` test for each.
- Version 0.1.3 was built by GitHub Actions for all four targets and published with `.deb`, `.rpm`, two `.pkg` files, Windows ZIP, checksums, and `latest.json`.
