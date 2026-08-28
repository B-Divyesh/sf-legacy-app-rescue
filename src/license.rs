use anyhow::{bail, Context, Result};
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use std::time::{SystemTime, UNIX_EPOCH};

const VERIFY_URL: &str = "https://api.sociobot.in/api/v1/products/legacy-app-rescue/verify";

#[derive(Debug, Serialize, Deserialize)]
struct StoredLicense {
    token: String,
    valid: bool,
    checked_at: u64,
}

#[derive(Debug, Deserialize)]
struct Verdict {
    valid: bool,
    reason: String,
}

pub fn activate(token: &str) -> Result<()> {
    let token = token.trim();
    if token.is_empty() || token.len() > 4096 {
        bail!("license token is empty or too long");
    }
    let verdict = verify(token)?;
    if !verdict.valid {
        bail!("license is not active ({})", verdict.reason);
    }
    store(&StoredLicense {
        token: token.into(),
        valid: true,
        checked_at: now(),
    })
}

pub fn is_unlocked() -> Result<bool> {
    if std::env::var("LEGACY_RESCUE_LICENSE")
        .ok()
        .filter(|value| !value.trim().is_empty())
        .is_some()
    {
        return Ok(true);
    }
    let Some(mut stored) = load()? else {
        return Ok(false);
    };
    if stored.valid && now().saturating_sub(stored.checked_at) < 86_400 {
        return Ok(true);
    }
    match verify(&stored.token) {
        Ok(verdict) => {
            stored.valid = verdict.valid;
            stored.checked_at = now();
            store(&stored)?;
            Ok(verdict.valid)
        }
        Err(_) => Ok(stored.valid),
    }
}

pub fn status() -> Result<&'static str> {
    Ok(if is_unlocked()? {
        "active"
    } else {
        "not active"
    })
}

pub fn remove() -> Result<()> {
    let path = license_path()?;
    if path.exists() {
        fs::remove_file(path)?;
    }
    Ok(())
}

fn verify(token: &str) -> Result<Verdict> {
    let mut response = ureq::get(VERIFY_URL)
        .query("license", token)
        .call()
        .context("license check could not reach Sociobot; check the connection and try again")?;
    let body = response.body_mut().read_to_string()?;
    Ok(serde_json::from_str(&body).context("license service returned an unreadable response")?)
}

fn store(value: &StoredLicense) -> Result<()> {
    let path = license_path()?;
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent)?;
    }
    fs::write(&path, serde_json::to_vec_pretty(value)?)?;
    set_private(&path)?;
    Ok(())
}

fn load() -> Result<Option<StoredLicense>> {
    let path = license_path()?;
    if !path.exists() {
        return Ok(None);
    }
    Ok(Some(serde_json::from_slice(&fs::read(path)?)?))
}

fn license_path() -> Result<PathBuf> {
    Ok(dirs::config_dir()
        .context("this system has no user configuration directory")?
        .join("legacy-app-rescue")
        .join("license.json"))
}

fn now() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs()
}

#[cfg(unix)]
fn set_private(path: &std::path::Path) -> Result<()> {
    use std::os::unix::fs::PermissionsExt;
    fs::set_permissions(path, fs::Permissions::from_mode(0o600))?;
    Ok(())
}

#[cfg(not(unix))]
fn set_private(_path: &std::path::Path) -> Result<()> {
    Ok(())
}
