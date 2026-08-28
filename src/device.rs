use crate::apk::hex_hash;
use crate::model::{DataExport, DeviceInfo};
use anyhow::{bail, Context, Result};
use std::fs::{self, File, OpenOptions};
use std::path::Path;
use std::process::{Command, Stdio};

fn adb_command(serial: Option<&str>) -> Command {
    let mut command = Command::new("adb");
    if let Some(serial) = serial {
        command.arg("-s").arg(serial);
    }
    command
}

pub fn inspect(serial: Option<&str>) -> Result<DeviceInfo> {
    ensure_adb()?;
    let selected = match serial {
        Some(value) => value.to_owned(),
        None => select_device()?,
    };
    let manufacturer = getprop(&selected, "ro.product.manufacturer")?;
    let model = getprop(&selected, "ro.product.model")?;
    let android_version = getprop(&selected, "ro.build.version.release")?;
    let sdk = getprop(&selected, "ro.build.version.sdk")?
        .parse()
        .context("device returned an invalid Android API level")?;
    let abis = getprop(&selected, "ro.product.cpu.abilist")?
        .split(',')
        .map(str::trim)
        .filter(|value| !value.is_empty())
        .map(str::to_owned)
        .collect();
    let packages = adb_output(&selected, &["shell", "pm", "list", "packages", "-3"])?
        .lines()
        .filter_map(|line| line.strip_prefix("package:"))
        .map(str::to_owned)
        .collect();
    Ok(DeviceInfo {
        serial_hash: hex_hash(selected.as_bytes())[..16].into(),
        manufacturer,
        model,
        android_version,
        sdk,
        abis,
        installed_user_packages: packages,
    })
}

pub fn export_data(serial: Option<&str>, package: &str, output: &Path) -> Result<DataExport> {
    if package.is_empty()
        || !package
            .bytes()
            .all(|byte| byte.is_ascii_alphanumeric() || matches!(byte, b'.' | b'_'))
    {
        bail!("package name contains unsupported characters");
    }
    ensure_adb()?;
    let selected = match serial {
        Some(value) => value.to_owned(),
        None => select_device()?,
    };
    if let Some(parent) = output.parent() {
        fs::create_dir_all(parent)?;
    }
    // This archive can contain private app data. On Unix set the mode at
    // creation time, rather than repairing a world-readable file afterwards.
    let file = create_private_file(output)?;
    let child = adb_command(Some(&selected))
        .args(["exec-out", "run-as", package, "tar", "-cf", "-", "."])
        .stdout(Stdio::from(file))
        .stderr(Stdio::piped())
        .spawn()
        .context("could not start adb data export")?;
    let result = child.wait_with_output()?;
    if !result.status.success() {
        let _ = fs::remove_file(output);
        let detail = String::from_utf8_lossy(&result.stderr);
        bail!(
            "Android did not allow data export for {package}: {}. The app must allow adb run-as; no root bypass is attempted",
            detail.trim()
        );
    }
    let bytes = fs::read(output)?;
    Ok(DataExport {
        package: package.into(),
        path: output.to_string_lossy().into_owned(),
        sha256: hex_hash(&bytes),
        size_bytes: bytes.len() as u64,
        method: "adb run-as + tar".into(),
    })
}

#[cfg(unix)]
fn create_private_file(path: &Path) -> Result<File> {
    use std::os::unix::fs::OpenOptionsExt;
    Ok(OpenOptions::new()
        .write(true)
        .create(true)
        .truncate(true)
        .mode(0o600)
        .open(path)?)
}

#[cfg(not(unix))]
fn create_private_file(path: &Path) -> Result<File> {
    Ok(File::create(path)?)
}

fn ensure_adb() -> Result<()> {
    Command::new("adb").arg("version").output().context(
        "adb is not installed or is not on PATH; install Android Platform Tools and try again",
    )?;
    Ok(())
}

fn select_device() -> Result<String> {
    let output = Command::new("adb").arg("devices").output()?;
    if !output.status.success() {
        bail!("adb could not list devices; unlock the device and accept its USB debugging prompt");
    }
    let devices: Vec<String> = String::from_utf8_lossy(&output.stdout)
        .lines()
        .skip(1)
        .filter_map(|line| {
            let mut fields = line.split_whitespace();
            let serial = fields.next()?;
            (fields.next() == Some("device")).then(|| serial.to_owned())
        })
        .collect();
    match devices.as_slice() {
        [] => bail!("no authorized Android device found; connect one with USB debugging enabled"),
        [only] => Ok(only.clone()),
        _ => bail!("more than one Android device is attached; pass --serial DEVICE"),
    }
}

fn getprop(serial: &str, property: &str) -> Result<String> {
    adb_output(serial, &["shell", "getprop", property])
}

fn adb_output(serial: &str, arguments: &[&str]) -> Result<String> {
    let output = adb_command(Some(serial)).args(arguments).output()?;
    if !output.status.success() {
        bail!(
            "adb command failed: {}",
            String::from_utf8_lossy(&output.stderr).trim()
        );
    }
    Ok(String::from_utf8_lossy(&output.stdout).trim().into())
}

#[cfg(all(test, unix))]
mod tests {
    use super::*;
    use std::fs;
    use std::os::unix::fs::PermissionsExt;

    #[test]
    fn app_data_export_is_private_and_cleans_up_on_refusal() {
        let root = tempfile::tempdir().unwrap();
        let bin = root.path().join("bin");
        fs::create_dir(&bin).unwrap();
        let adb = bin.join("adb");
        fs::write(
            &adb,
            r#"#!/bin/sh
if [ "$1" = "version" ]; then exit 0; fi
if [ "$1" = "-s" ]; then shift 2; fi
if [ "$1" = "exec-out" ]; then
  if [ "$LEGACY_RESCUE_TEST_ADB_REFUSE" = "1" ]; then echo "run-as refused" >&2; exit 1; fi
  printf "private fixture data"; exit 0
fi
exit 1
"#,
        )
        .unwrap();
        fs::set_permissions(&adb, fs::Permissions::from_mode(0o755)).unwrap();
        let old_path = std::env::var_os("PATH");
        let old_refusal = std::env::var_os("LEGACY_RESCUE_TEST_ADB_REFUSE");
        std::env::set_var(
            "PATH",
            format!(
                "{}:{}",
                bin.display(),
                old_path.as_deref().unwrap_or_default().to_string_lossy()
            ),
        );

        let archive = root.path().join("private.tar");
        let exported = export_data(Some("FIELD123"), "in.sociobot.orchardnotes", &archive).unwrap();
        assert_eq!(exported.size_bytes, 20);
        assert_eq!(
            fs::metadata(&archive).unwrap().permissions().mode() & 0o777,
            0o600
        );

        std::env::set_var("LEGACY_RESCUE_TEST_ADB_REFUSE", "1");
        let refused = root.path().join("refused.tar");
        let error = export_data(Some("FIELD123"), "in.sociobot.orchardnotes", &refused)
            .unwrap_err()
            .to_string();
        assert!(error.contains("no root bypass is attempted"));
        assert!(!refused.exists());

        match old_path {
            Some(value) => std::env::set_var("PATH", value),
            None => std::env::remove_var("PATH"),
        }
        match old_refusal {
            Some(value) => std::env::set_var("LEGACY_RESCUE_TEST_ADB_REFUSE", value),
            None => std::env::remove_var("LEGACY_RESCUE_TEST_ADB_REFUSE"),
        }
    }
}
