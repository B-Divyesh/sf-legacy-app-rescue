# Copy audit

Audited from the built landing page and README on 29 August 2026. Code samples, hashes, package identifiers, and file paths are excluded from prose counts.

## Landing page

| Copy | Words | Result |
| --- | ---: | --- |
| Record your Android app before it disappears | 7 | Pass |
| For people preserving an old app they own, it records the Android app file (APK) and checks another device. | 19 | Pass |
| Open a finished record in separate demo storage. | 8 | Claim: demo-sandbox |
| Runs on macOS, Windows, and Linux. | 6 | Claim: platform-builds |
| APK scans stay on your computer. | 6 | Claim: local-private |
| One APK is free. Field Kit costs $19 once. | 9 | Claims: field-kit, paid-license |
| See what the preservation record contains | 6 | Pass |
| The record includes its package name, unique file fingerprint, signer evidence, Android version needs, and device match. | 16 | Pass |
| This recording comes from a bundled sample Android app file (APK). | 12 | Claim: demo-sandbox |
| Demo — sample data, nothing is saved | 7 | Claim: demo-sandbox |
| Create a preservation record (manifest) | 5 | Pass |
| Give the desktop command-line tool (CLI) an Android app file you already own. | 13 | Pass |
| It reads the file in place. | 6 | Pass |
| Add `--device` to record the Android version, device types, and installed app list. | 13 | Pass |
| The record lists app version, needed Android version, device types, signing evidence, and device match reasons. | 16 | Pass |
| Legacy App Rescue does not download, crack, patch, or re-sign APKs. | 11 | Claim: safety-boundaries |
| It cannot bypass Android data controls. | 6 | Claim: safety-boundaries |
| Reads only paths you pass. | 5 | Claim: input-scope |
| Keeps a shortened fingerprint of the device serial. | 8 | Claim: device-serial-hash |
| Labels compatibility as evidence, not a guarantee. | 7 | Claim: compatibility-limit |
| Exports app data only after Android grants the app's data-access permission (`run-as`). | 12 | Claim: export-refusal-cleanup |
| Install Legacy App Rescue from a Mac, Windows, or Linux computer. | 11 | Claim: mobile-install-guidance |
| Open the desktop downloads to choose an installer. | 8 | Claim: mobile-install-guidance |
| The free command scans one app file and checks one device. | 11 | Claim: field-kit |
| Field Kit adds batch scans and permitted app-data export. | 9 | Claim: field-kit |
| Sociobot handles checkout. A refunded license stops Field Kit. | 9 | Claim: merchant-and-refund |

No landing sentence exceeds 22 words. No landing sentence contains a banned marketing word.

## README first-use audit

| Copy | Words | Result |
| --- | ---: | --- |
| Legacy App Rescue is a local desktop command-line tool (CLI) for people preserving Android app files (APKs) they lawfully own. | 19 | Pass |
| It writes a preservation record with app details, signing evidence, Android version needs, device types, and a device match. | 17 | Pass |
| The demo creates a fictional Android app file (APK) in a temporary folder. | 13 | Claim: demo-sandbox |
| It scans the app file, matches a sample Android 13 device, and prints the preservation record path. | 17 | Claim: demo-sandbox |
| A device match checks declared Android-version and device-type needs. | 9 | Claim: compatibility-verdict |
| It does not promise that licensing, remote services, or old graphics code work. | 13 | Claim: compatibility-limit |
| Android must grant that app's own data-access permission (`adb run-as`). | 9 | Claim: export-refusal-cleanup |
| The desktop command-line tool (CLI) has no telemetry. | 8 | Claim: no-cli-telemetry |

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

"Record Android app evidence and check a target device." It is 54 characters and starts with a verb.
