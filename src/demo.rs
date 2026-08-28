use crate::apk;
use crate::compat;
use crate::model::{DeviceInfo, PreservationManifest};
use anyhow::Result;
use std::fs::{self, File};
use std::io::Write;
use std::path::{Path, PathBuf};
use zip::write::SimpleFileOptions;
use zip::ZipWriter;

pub fn run(output: Option<&Path>) -> Result<(PreservationManifest, PathBuf)> {
    let root = match output {
        Some(path) => path
            .parent()
            .unwrap_or_else(|| Path::new("."))
            .to_path_buf(),
        None => std::env::temp_dir().join(format!("legacy-app-rescue-demo-{}", std::process::id())),
    };
    fs::create_dir_all(&root)?;
    let apk_path = root.join("orchard-notes-1.7.apk");
    build_fixture(&apk_path)?;
    let apk = apk::inspect(&apk_path)?;
    let device = DeviceInfo {
        serial_hash: "demo-4f92c68a".into(),
        manufacturer: "Sample".into(),
        model: "Archive Phone".into(),
        android_version: "13".into(),
        sdk: 33,
        abis: vec!["arm64-v8a".into(), "armeabi-v7a".into()],
        installed_user_packages: vec!["in.sociobot.orchardnotes".into()],
    };
    let verdict = compat::assess(&apk, &device);
    let mut manifest = PreservationManifest::new();
    manifest.apks.push(apk);
    manifest.compatibility.push(verdict);
    manifest.device = Some(device);
    manifest
        .notes
        .push("Demo fixture only. No device or personal file was read.".into());
    let manifest_path = output
        .map(Path::to_path_buf)
        .unwrap_or_else(|| root.join("preservation-manifest.json"));
    fs::write(&manifest_path, serde_json::to_vec_pretty(&manifest)?)?;
    Ok((manifest, manifest_path))
}

fn build_fixture(path: &Path) -> Result<()> {
    let file = File::create(path)?;
    let mut zip = ZipWriter::new(file);
    let options = SimpleFileOptions::default().compression_method(zip::CompressionMethod::Deflated);
    zip.start_file("AndroidManifest.xml", options)?;
    zip.write_all(include_bytes!("../examples/sample-apk/AndroidManifest.xml"))?;
    zip.start_file("lib/arm64-v8a/liborchard.so", options)?;
    zip.write_all(b"LEGACY_APP_RESCUE_DEMO_NATIVE_FIXTURE")?;
    zip.start_file("META-INF/ORCHARD.RSA", options)?;
    zip.write_all(b"FICTIONAL_DEMO_SIGNATURE_BLOCK_NOT_A_CERTIFICATE")?;
    zip.finish()?;
    Ok(())
}
