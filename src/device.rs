use crate::apk::hex_hash;
use crate::model::{DataExport, DeviceInfo};
use anyhow::{bail, Context, Result};
use std::fs::{self, File};
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
    let file = File::create(output)?;
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
