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
    let Some(stored) = load()? else {
        return Ok(false);
    };
    // A local config file is user-controlled, so it cannot by itself grant a
    // paid capability. Verify every Field Kit operation with Sociobot.
    let verdict = verify(&stored.token)?;
    let checked = record_verdict(stored, now(), verdict);
    let valid = checked.valid;
    store(&checked)?;
    Ok(valid)
}

fn record_verdict(mut stored: StoredLicense, checked_at: u64, verdict: Verdict) -> StoredLicense {
    stored.valid = verdict.valid;
    stored.checked_at = checked_at;
    stored
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
    let verify_url = if std::env::var("LEGACY_RESCUE_TEST_MODE").as_deref() == Ok("1") {
        std::env::var("LEGACY_RESCUE_LICENSE_VERIFY_URL").unwrap_or_else(|_| VERIFY_URL.to_owned())
    } else {
        VERIFY_URL.to_owned()
    };
    let mut response = ureq::get(&verify_url)
        .query("license", token)
        .call()
        .context("license check could not reach Sociobot; check the connection and try again")?;
    let body = response.body_mut().read_to_string()?;
    serde_json::from_str(&body).context("license service returned an unreadable response")
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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn invalid_verdict_never_unlocks_a_license() {
        let stored = StoredLicense {
            token: "not-a-real-license".into(),
            valid: true,
            checked_at: 0,
        };
        let checked = record_verdict(
            stored,
            100,
            Verdict {
                valid: false,
                reason: "invalid".into(),
            },
        );
        assert!(!checked.valid);
        assert_eq!(checked.checked_at, 100);
    }
}
