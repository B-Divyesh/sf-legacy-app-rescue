# Copy audit

Audited from the landing page, demo, legal routes, and `README.md` on 29 August 2026. Shell commands, hashes, package identifiers, file paths, and generated terminal rows are excluded from prose counts. Every prose sentence is 22 words or fewer. No retained sentence uses a banned marketing word.

## Landing and route copy

| Copy | Words | Result |
| --- | ---: | --- |
| Record your Android app before it disappears | 7 | Headline; pass |
| For people preserving an old app they own, it records the Android app file (APK) and checks another device. | 19 | First-use terms; pass |
| Open a finished record in separate demo storage. | 8 | `demo-sandbox` |
| Runs on macOS, Windows, and Linux. | 6 | `platform-builds` |
| APK scans stay on your computer. | 6 | `local-private` |
| One APK scan is free. | 5 | `free-tier-limit` |
| Field Kit costs $19 once. | 5 | `paid-license` |
| See what the preservation record contains | 6 | Section heading; pass |
| The record includes its package name, unique file fingerprint, signer evidence, Android version needs, and device match. | 16 | `manifest-record`, `compatibility-verdict` |
| This recording comes from a bundled sample APK. | 9 | `demo-sandbox` |
| Run the same scan with rescue demo. | 7 | Action guidance; pass |
| Create a preservation record (manifest) | 5 | Section heading; pass |
| Give the desktop command-line tool (CLI) an APK you already own. | 11 | First-use terms; pass |
| It reads the file in place. | 6 | `safety-boundaries` |
| Add `--device` to record the Android version, device types, and installed app list. | 13 | `device-context-record` |
| The record lists app version, needed Android version, device types, signing evidence, and device match reasons. | 16 | `device-context-record` |
| What the tool does not change | 6 | Section heading; pass |
| Legacy App Rescue does not download, crack, patch, or re-sign APKs. | 11 | `safety-boundaries` |
| It cannot bypass Android data controls. | 6 | `safety-boundaries` |
| Reads only paths you pass. | 5 | `input-scope` |
| Keeps a shortened fingerprint of the device serial. | 8 | `device-serial-hash` |
| Labels compatibility as evidence, not a guarantee. | 7 | `compatibility-limit` |
| Exports app data only after Android grants the app's data-access permission (`run-as`). | 12 | `export-refusal-cleanup` |
| Install Legacy App Rescue | 4 | Section heading; pass |
| The free command scans one APK and checks one device. | 10 | `free-tier-limit` |
| Field Kit adds batch scans and permitted app-data export. | 9 | `field-kit` |
| Sociobot handles checkout. | 3 | `merchant-and-refund` |
| A refunded license stops Field Kit. | 6 | `merchant-and-refund` |
| Stored only in this browser. | 5 | `browser-license-storage` |
| Remove it here at any time. | 6 | `browser-license-removal` |
| Install Legacy App Rescue from a Mac, Windows, or Linux computer. | 11 | `mobile-install-guidance` |
| Open the desktop downloads to choose an installer. | 8 | `mobile-install-guidance` |
| Inspect a finished preservation record | 5 | Demo h1; pass |
| The sample is a fictional orchard notebook Android app file (APK) matched with an Android 13 phone. | 17 | `demo-sandbox` |
| Keep preservation records on your computer | 6 | Privacy h1; pass |
| Use the tool for apps you may preserve | 8 | Terms h1; pass |
| Field Kit costs $19 once. | 5 | `paid-license` |
| It adds batch scans and permitted app-data export. | 7 | `field-kit` |
| Sociobot handles checkout. | 3 | `merchant-and-refund` |
| A refunded license stops Field Kit. | 6 | `merchant-and-refund` |
| This page is missing | 4 | 404 h1; pass |
| The page may have moved. | 5 | 404 recovery; pass |
| Your files were not involved. | 5 | 404 safety; pass |

The earlier decorative eyebrow labels “The product”, “Three steps”, “Clear boundaries”, “Install”, “A local preservation tool”, and “PLATE / 017” are absent.

## README audit

| Copy | Words | Result |
| --- | ---: | --- |
| Record an Android app before its device disappears. | 8 | Pass |
| Legacy App Rescue is a local desktop command-line tool (CLI) for people preserving Android app files (APKs) they lawfully own. | 19 | First-use terms; pass |
| It writes a preservation record with app details, signing evidence, Android version needs, device types, and a device match. | 17 | `device-context-record` |
| It never downloads or uploads an APK. | 7 | `apk-transfer-boundary` |
| The demo creates a fictional Android app file (APK) in a temporary folder. | 13 | `demo-sandbox` |
| It scans the APK, matches a sample Android 13 device, and prints the preservation record path. | 16 | `demo-sandbox` |
| Release assets include Linux `.deb` and `.rpm` packages, macOS `.pkg` files, a Windows portable ZIP, `SHA256SUMS`, and `latest.json`. | 18 | `release-asset-set` |
| Scan one APK for free. | 5 | `free-tier-limit` |
| Choose another preservation record (manifest) path. | 7 | `custom-output-path` |
| Connect one authorized Android device and check compatibility. | 8 | `compatibility-verdict` |
| If several devices are attached, select one. | 7 | `device-selection` |
| Print JSON for scripts. | 4 | `json-output` |
| `--ci` removes decorative output. | 5 | `ci-output` |
| Whole-file fingerprint (SHA-256) and file size | 6 | `manifest-file-size` |
| Exported data archive hashes | 4 | `export-archive-hash` |
| The free command scans one APK and checks one device. | 10 | `free-tier-limit` |
| Field Kit adds batch scans and app-data export when Android grants `run-as` permission. | 12 | `field-kit` |
| Sociobot handles checkout. | 3 | `merchant-and-refund` |
| A device match checks declared Android-version and device-type needs. | 9 | `compatibility-verdict` |
| It does not promise that licensing, remote services, or old graphics code work. | 13 | `compatibility-limit` |
| Android must grant that app's own data-access permission (`adb run-as`). | 9 | `export-refusal-cleanup` |
| Legacy App Rescue stops on refusal and does not try root. | 11 | `export-refusal-cleanup` |
| The tool still records the whole-file fingerprint when signer parsing is unavailable. | 12 | `signer-fallback` |
| The desktop command-line tool (CLI) has no telemetry. | 8 | `no-cli-telemetry` |
| APK scanning and the bundled demo need no network. | 9 | `no-cli-telemetry` |
| License activation uses the Sociobot license service. | 7 | `paid-license` |
| The website verifies a stored license at most once a day. | 11 | `browser-license-cache` |
| If the license service is busy, it asks you to try again shortly. | 13 | `license-busy-recovery` |

## Terminology

| Concept | First-use wording | Short form afterwards |
| --- | --- | --- |
| Android install file | Android app file (APK) | APK |
| Desktop command | desktop command-line tool (CLI) | CLI |
| Preservation output | preservation record (manifest) | record / manifest |
| File identity | unique file fingerprint | fingerprint |
| Android export permission | app's own data-access permission (`run-as`) | run-as |
| Compatibility result | device match | device match |

## First-screen read-aloud

“Record your Android app before it disappears. For people preserving an old app they own, it records the Android app file (APK) and checks another device. Try it with sample data.”

## Catalog description

"Record APK evidence before an old Android device disappears." It is 57 characters, starts with a verb, and maps to the tested preservation-record claim.
