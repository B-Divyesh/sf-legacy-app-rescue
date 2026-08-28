mod apk;
mod compat;
mod demo;
mod device;
mod license;
mod model;

use anyhow::{bail, Context, Result};
use clap::{Parser, Subcommand};
use model::PreservationManifest;
use std::collections::BTreeSet;
use std::fs;
use std::path::{Path, PathBuf};

#[derive(Parser)]
#[command(
    name = "rescue",
    version,
    about = "Record Android APKs before their devices disappear.",
    long_about = "Inventory user-supplied APKs, compare them with an attached Android device, and write a preservation manifest. Legacy App Rescue never uploads, cracks, or re-signs an APK."
)]
struct Cli {
    /// Print machine-readable JSON to stdout.
    #[arg(long, global = true)]
    json: bool,
    /// Disable decorative terminal output.
    #[arg(long, global = true)]
    ci: bool,
    #[command(subcommand)]
    command: Command,
}

#[derive(Subcommand)]
enum Command {
    /// Inspect one or more APK files and write a preservation manifest.
    Scan {
        /// APK files supplied by you. Directories are not searched.
        #[arg(required = true, value_name = "APK")]
        apks: Vec<PathBuf>,
        /// Where to write the JSON manifest.
        #[arg(short, long, default_value = "preservation-manifest.json")]
        output: PathBuf,
        /// Inventory an attached device and check APK compatibility.
        #[arg(long)]
        device: bool,
        /// Select an attached device by adb serial.
        #[arg(long, requires = "device")]
        serial: Option<String>,
        /// Export this scanned package's data when Android run-as permits it. Field Kit license required.
        #[arg(long, requires = "device", value_name = "PACKAGE")]
        export_data: Vec<String>,
    },
    /// Inventory one attached Android device without reading an APK.
    Device {
        /// Select an attached device by adb serial.
        #[arg(long)]
        serial: Option<String>,
    },
    /// Run the complete scan on bundled fictional sample data in a temporary folder.
    Demo {
        /// Write the sample manifest at a chosen path instead of a temporary folder.
        #[arg(short, long)]
        output: Option<PathBuf>,
    },
    /// Store, check, or remove a Field Kit license.
    License {
        #[command(subcommand)]
        command: LicenseCommand,
    },
}

#[derive(Subcommand)]
enum LicenseCommand {
    /// Verify and store a license token from your receipt.
    Activate { token: String },
    /// Show whether the stored license is active.
    Status,
    /// Remove the stored license from this computer.
    Remove,
}

fn main() {
    if let Err(error) = run() {
        eprintln!("error: {error:#}");
        eprintln!("next: Run 'rescue --help' for commands and examples.");
        std::process::exit(1);
    }
}

fn run() -> Result<()> {
    let cli = Cli::parse();
    match cli.command {
        Command::Scan {
            apks,
            output,
            device: with_device,
            serial,
            export_data,
        } => {
            if (apks.len() > 1 || !export_data.is_empty()) && !license::is_unlocked()? {
                bail!("batch scans and app-data export need the $19 Field Kit; activate a license with 'rescue license activate TOKEN'");
            }
            let mut manifest = PreservationManifest::new();
            for path in &apks {
                manifest.apks.push(apk::inspect(path)?);
            }
            if with_device {
                let found = device::inspect(serial.as_deref())?;
                for apk in &manifest.apks {
                    manifest.compatibility.push(compat::assess(apk, &found));
                }
                manifest.device = Some(found);
            }
            if !export_data.is_empty() {
                let scanned: BTreeSet<&str> = manifest
                    .apks
                    .iter()
                    .filter_map(|apk| apk.package.as_deref())
                    .collect();
                for package in export_data {
                    if !scanned.contains(package.as_str()) {
                        bail!("data export was requested for {package}, but that package is not in the scanned APK set");
                    }
                    let export_path = output
                        .parent()
                        .unwrap_or_else(|| Path::new("."))
                        .join(format!("{package}-data.tar"));
                    manifest.data_exports.push(device::export_data(
                        serial.as_deref(),
                        &package,
                        &export_path,
                    )?);
                }
            }
            write_manifest(&output, &manifest)?;
            if cli.json {
                println!("{}", serde_json::to_string(&manifest)?);
            } else {
                print_summary(&manifest, &output);
            }
        }
        Command::Device { serial } => {
            let found = device::inspect(serial.as_deref())?;
            if cli.json {
                println!("{}", serde_json::to_string(&found)?);
            } else {
                println!(
                    "Device: {} {} · Android {} (API {})",
                    found.manufacturer, found.model, found.android_version, found.sdk
                );
                println!("CPU: {}", found.abis.join(", "));
                println!("User packages: {}", found.installed_user_packages.len());
                println!("Serial is stored only as hash {}.", found.serial_hash);
            }
        }
        Command::Demo { output } => {
            let (manifest, path) = demo::run(output.as_deref())?;
            if cli.json {
                println!("{}", serde_json::to_string(&manifest)?);
            } else {
                println!("LEGACY APP RESCUE · SAMPLE RECORD");
                println!("✓ APK hash recorded");
                println!(
                    "✓ Package: {}",
                    manifest.apks[0].package.as_deref().unwrap_or("unknown")
                );
                println!(
                    "✓ SDK range: {} → {}",
                    manifest.apks[0].min_sdk.unwrap_or(0),
                    manifest.apks[0].target_sdk.unwrap_or(0)
                );
                println!(
                    "✓ Signer evidence: {} record",
                    manifest.apks[0].signers.len()
                );
                println!("✓ Device match: {:?}", manifest.compatibility[0].verdict);
                println!("Manifest: {}", path.display());
                println!(
                    "Demo used bundled sample data. Nothing was saved to your normal records."
                );
            }
        }
        Command::License { command } => match command {
            LicenseCommand::Activate { token } => {
                license::activate(&token)?;
                if cli.json {
                    println!("{}", serde_json::json!({ "license": "active" }));
                } else {
                    println!("Field Kit license saved and active.");
                }
            }
            LicenseCommand::Status => {
                let status = license::status()?;
                if cli.json {
                    println!("{}", serde_json::json!({ "license": status }));
                } else {
                    println!("Field Kit license: {status}.");
                }
            }
            LicenseCommand::Remove => {
                license::remove()?;
                if cli.json {
                    println!("{}", serde_json::json!({ "license": "removed" }));
                } else {
                    println!("Field Kit license removed from this computer.");
                }
            }
        },
    }
    Ok(())
}

fn write_manifest(path: &Path, manifest: &PreservationManifest) -> Result<()> {
    if let Some(parent) = path
        .parent()
        .filter(|parent| !parent.as_os_str().is_empty())
    {
        fs::create_dir_all(parent)?;
    }
    let temporary = path.with_extension("json.tmp");
    fs::write(&temporary, serde_json::to_vec_pretty(manifest)?)?;
    set_private(&temporary)?;
    fs::rename(&temporary, path).with_context(|| format!("could not write {}", path.display()))?;
    Ok(())
}

fn print_summary(manifest: &PreservationManifest, path: &Path) {
    println!("Recorded {} APK(s).", manifest.apks.len());
    for apk in &manifest.apks {
        println!(
            "  {} · {}",
            apk.package.as_deref().unwrap_or("unknown package"),
            &apk.sha256[..12]
        );
    }
    for match_result in &manifest.compatibility {
        println!(
            "  Device match: {:?} — {}",
            match_result.verdict,
            match_result.reasons.join(" ")
        );
    }
    println!("Manifest: {}", path.display());
}

#[cfg(unix)]
fn set_private(path: &Path) -> Result<()> {
    use std::os::unix::fs::PermissionsExt;
    fs::set_permissions(path, fs::Permissions::from_mode(0o600))?;
    Ok(())
}

#[cfg(not(unix))]
fn set_private(_path: &Path) -> Result<()> {
    Ok(())
}
