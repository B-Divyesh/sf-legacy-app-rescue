# Legacy App Rescue

Record an Android app before its device disappears.

Legacy App Rescue is a local desktop command-line tool (CLI) for people preserving Android app files (APKs) they lawfully own. It writes a preservation record with app details, signing evidence, Android version needs, device types, and a device match. It never downloads or uploads an APK.

Live site: <https://legacy-app-rescue.sociobot.in>

## Try the complete demo

The demo creates a fictional Android app file (APK) in a temporary folder. It scans the app file, matches a sample Android 13 device, and prints the preservation record path.

```sh
rescue demo
```

Open the website sandbox at <https://legacy-app-rescue.sociobot.in/?demo=1>. Its browser storage uses the `demo:legacy-app-rescue:` prefix.

The sample source is in [`examples/sample-apk`](examples/sample-apk). It has a preservation manifest, but no DEX executable.

## Install

### Linux and macOS

```sh
curl -fsSL https://legacy-app-rescue.sociobot.in/install.sh | sh
```

The script downloads the matching archive, verifies SHA-256, and places `rescue` in `~/.local/bin`.

The macOS package is unsigned. Right-click the downloaded package, then choose **Open**.

### Windows PowerShell

```powershell
irm https://legacy-app-rescue.sociobot.in/install.ps1 | iex
```

The Windows build is unsigned.

### Homebrew

```sh
brew install B-Divyesh/legacy-app-rescue/legacy-app-rescue
```

### Scoop

```powershell
scoop bucket add legacy-app-rescue https://github.com/B-Divyesh/sf-legacy-app-rescue
scoop install legacy-app-rescue
```

Release assets include Linux `.deb` and `.rpm` packages, macOS `.pkg` files, a Windows portable ZIP, `SHA256SUMS`, and `latest.json`.

### winget manifest

The checked v0.1.3 manifest is [`winget/B-Divyesh.LegacyAppRescue.yaml`](winget/B-Divyesh.LegacyAppRescue.yaml). Submit it to `microsoft/winget-pkgs` after checking the release. It is not a public winget source until Microsoft accepts it.

## Use the desktop command-line tool (CLI)

Scan one Android app file (APK) for free:

```sh
rescue scan path/to/old-game.apk
```

Choose another preservation record (manifest) path:

```sh
rescue scan old-game.apk --output archive/old-game.json
```

Connect one authorized Android device and check compatibility:

```sh
rescue scan old-game.apk --device
```

If several devices are attached, select one:

```sh
rescue scan old-game.apk --device --serial DEVICE_SERIAL
```

Print JSON for scripts:

```sh
rescue --json scan old-game.apk
```

`--ci` removes decorative output.

## What the preservation record contains

- Whole-file fingerprint (SHA-256) and file size
- Package name and version
- Minimum, target, and maximum Android API levels
- Supported device-type folders
- Signing certificate fingerprints when present
- A shortened fingerprint of the device serial
- Device model, Android version, device types, and installed app names
- Device match results with reasons
- Exported data archive hashes

A device match checks declared Android-version and device-type needs. It does not promise that licensing, remote services, or old graphics code work.

## Field Kit — $19 once

The free command scans one app file and checks one device. Field Kit adds batch scans and app-data export when Android grants `run-as` permission.

Buy at <https://api.sociobot.in/api/v1/products/legacy-app-rescue/checkout>. Sociobot is the merchant of record.

Activate the token from the receipt:

```sh
rescue license activate TOKEN
rescue license status
```

Then scan a set:

```sh
rescue scan first.apk second.apk --device
```

Export data for a package present in the scanned APK set:

```sh
rescue scan old-game.apk --device \
  --export-data com.example.oldgame \
  --output archive/preservation-manifest.json
```

Android must grant that app's own data-access permission (`adb run-as`). Legacy App Rescue stops on refusal and does not try root.

## Limits and safety

Legacy App Rescue does not distribute APKs, remove DRM, crack apps, or re-sign third-party software. Use it only with files and data you may lawfully access.

Plain XML and Android binary XML manifests are supported. The tool still records the whole-file fingerprint when signer parsing is unavailable.

## Build from source

Requirements: Rust stable, Node 22 or newer, and npm.

```sh
cargo build --release --locked
npm ci
npm test
npm run build:site
npm run verify:billing
npm run verify:package-managers
```

The site output is exactly `dist/site/`. The release workflow builds platform binaries on GitHub Actions.

## Deploy the static site

The factory deploys this product as a static site. Build the deployment directory with:

```sh
npm ci
npm run build:site
```

Deploy `dist/site/` through the factory work-order configuration. Do not add DNS, billing, or deployment secrets to this repository.

`npm run verify:billing` is a live release check. It confirms the Sociobot checkout returns a `303` to a hosted Dodo session and that a successful redirect has no `Retry-After` header. It also checks that the verification service enforces its documented rate limit.

`npm run verify:package-managers` is a live release check. It checks public Homebrew and Scoop checksums against the current GitHub Release. It also checks the repository manifests.

## Test individual promises

Public claims live in [`.factory/claims.json`](.factory/claims.json). For example:

```sh
npm test -- --grep @claim:manifest-record
npm test -- --grep @claim:local-private
```

## Privacy and license

The desktop command-line tool (CLI) has no telemetry. App-file scanning and the bundled demo need no network. License activation uses the Sociobot license service. The website verifies a stored license at most once a day. If the license service is busy, it asks you to try again shortly.

The source is available under the [MIT License](LICENSE). See the site [privacy page](https://legacy-app-rescue.sociobot.in/privacy) and [terms](https://legacy-app-rescue.sociobot.in/terms).
