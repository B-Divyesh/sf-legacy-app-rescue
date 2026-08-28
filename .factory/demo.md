# Demo sandbox

## Entry points

- Website: `https://legacy-app-rescue.sociobot.in/demo`
- Local site: `http://localhost:5173/demo`
- CLI: `rescue demo`
- From source: `cargo run -- demo`

## Sample data

The fictional **Orchard Notes 1.7.0** APK is assembled from `examples/sample-apk/AndroidManifest.xml`. It includes a small fake arm64 library and a fake v1 signature block. It cannot be installed and contains no third-party code.

The sample device is an Android 13 arm64 “Archive Phone.” The compatibility verdict is `compatible`.

## Isolation and reset

The CLI creates a unique folder under the system temporary directory and prints the manifest path. It reads no device or user APK.

The web demo stores only `demo:legacy-app-rescue:opened`. **Reset demo** deletes every `demo:legacy-app-rescue:` key and loads the sample again. **Start for real** deletes the demo namespace before returning home.

Tests use a fresh browser context and a temporary directory. The paid export test uses a fake ADB executable and the bundled APK fixture.
