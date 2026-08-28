use serde::{Deserialize, Serialize};

pub const SCHEMA_VERSION: &str = "1.0";

#[derive(Debug, Clone, Default, Serialize, Deserialize, PartialEq)]
pub struct ApkMetadata {
    pub path: String,
    pub file_name: String,
    pub sha256: String,
    pub size_bytes: u64,
    pub package: Option<String>,
    pub version_name: Option<String>,
    pub version_code: Option<u64>,
    pub min_sdk: Option<u32>,
    pub target_sdk: Option<u32>,
    pub max_sdk: Option<u32>,
    pub native_abis: Vec<String>,
    pub signers: Vec<Signer>,
    pub debuggable: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct Signer {
    pub scheme: String,
    pub sha256: String,
    pub source: String,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize, PartialEq)]
pub struct DeviceInfo {
    pub serial_hash: String,
    pub manufacturer: String,
    pub model: String,
    pub android_version: String,
    pub sdk: u32,
    pub abis: Vec<String>,
    pub installed_user_packages: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "snake_case")]
pub enum Verdict {
    Compatible,
    Caution,
    Incompatible,
    Unknown,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct Compatibility {
    pub apk_sha256: String,
    pub device_serial_hash: String,
    pub verdict: Verdict,
    pub reasons: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct DataExport {
    pub package: String,
    pub path: String,
    pub sha256: String,
    pub size_bytes: u64,
    pub method: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct PreservationManifest {
    pub schema_version: String,
    pub tool: ToolInfo,
    pub apks: Vec<ApkMetadata>,
    pub device: Option<DeviceInfo>,
    pub compatibility: Vec<Compatibility>,
    pub data_exports: Vec<DataExport>,
    pub notes: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ToolInfo {
    pub name: String,
    pub version: String,
}

impl PreservationManifest {
    pub fn new() -> Self {
        Self {
            schema_version: SCHEMA_VERSION.into(),
            tool: ToolInfo {
                name: "Legacy App Rescue".into(),
                version: env!("CARGO_PKG_VERSION").into(),
            },
            apks: vec![],
            device: None,
            compatibility: vec![],
            data_exports: vec![],
            notes: vec![
                "This manifest records preservation evidence. It does not guarantee that an APK will install or run.".into(),
            ],
        }
    }
}
