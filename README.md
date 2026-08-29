# Legacy App Rescue

Record an Android app before its device disappears.

Legacy App Rescue is a local CLI for people preserving APKs they lawfully own. It writes a JSON record of each APK, its signer evidence, SDK needs, native CPUs, and device compatibility. It never downloads or uploads an APK.

Live site: <https://legacy-app-rescue.sociobot.in>

## Try the complete demo

The demo creates a fictional APK in a temporary folder. It scans the APK, matches a sample Android 13 device, and prints the manifest path.

```sh
rescue demo
```

The website sandbox is at <https://legacy-app-rescue.sociobot.in/demo>. Its browser storage uses the `demo:legacy-app-rescue:` prefix.

The sample source is in [`examples/sample-apk`](examples/sample-apk). It contains no installable app code.

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

The Windows build is unsigned. Windows may ask you to confirm the first run.

### Homebrew

```sh
brew install B-Divyesh/legacy-app-rescue/legacy-app-rescue
```

### Scoop

```powershell
scoop bucket add legacy-app-rescue https://github.com/B-Divyesh/sf-legacy-app-rescue
scoop install legacy-app-rescue
```

Release assets include Linux `.deb` and `.rpm` packages, macOS `.pkg` files, a Windows portable ZIP, `SHA256SUMS`, and `latest.json`. The `winget/` manifest is ready for owner submission after release checksums are filled.

### winget manifest

The checked v0.1.2 manifest is [`winget/B-Divyesh.LegacyAppRescue.yaml`](winget/B-Divyesh.LegacyAppRescue.yaml). It is ready to submit to `microsoft/winget-pkgs`; it is not presented as an installed winget source until that upstream submission is accepted.

## Use the CLI

Scan one APK for free:

```sh
rescue scan path/to/old-game.apk
```

Choose another manifest path:

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

## What the manifest records

- Whole-file SHA-256 and file size
- Package name and version
- Minimum, target, and maximum Android API levels
- Native library CPU folders
- APK v2/v3 certificate hashes when present
- APK v1 signature-block hashes when present
- A short hash of the device serial
- Device model, Android API, CPUs, and user package names
- Compatibility verdicts with reasons
- Exported data archive hashes

A compatibility verdict covers declared SDK and CPU needs. It does not promise that licensing, remote services, or old graphics code will still work.

## Field Kit — $19 once

The free command scans one APK and checks one device. Field Kit adds batch scans and app-data export when Android permits `run-as`.

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

Android must allow `adb run-as` for that app. Legacy App Rescue stops on refusal and does not try root.

## Limits and safety

Legacy App Rescue does not distribute APKs, remove DRM, crack apps, or re-sign third-party software. Use it only with files and data you may lawfully access.

Plain XML and Android binary XML manifests are supported. ZIP64 APK Signing Blocks are not read in version 0.1. The tool still records the whole-file hash when signer parsing is unavailable.

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

`npm run verify:billing` is a live release check. It confirms the Sociobot checkout returns a `303` to a hosted Dodo session and that a successful redirect has no `Retry-After` header. It also checks that the verification service enforces its documented rate limit.

`npm run verify:package-managers` is a live release check. It compares the public Homebrew formula and documented Scoop manifest with the current GitHub Release's `SHA256SUMS`, then checks the repository Homebrew, Scoop, and winget manifests.

## Test individual promises

Public claims live in [`.factory/claims.json`](.factory/claims.json). For example:

```sh
npm test -- --grep @claim:manifest-record
npm test -- --grep @claim:local-private
```

## Privacy and license

The CLI has no telemetry. APK scanning and the bundled demo need no network. License activation contacts only `api.sociobot.in`. The website verifies a stored license at most once a day. If the license service is busy, it asks you to try again shortly.

The source is available under the [MIT License](LICENSE). See the site [privacy page](https://legacy-app-rescue.sociobot.in/privacy) and [terms](https://legacy-app-rescue.sociobot.in/terms).
