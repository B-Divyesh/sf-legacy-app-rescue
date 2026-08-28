use crate::model::{ApkMetadata, Compatibility, DeviceInfo, Verdict};

pub fn assess(apk: &ApkMetadata, device: &DeviceInfo) -> Compatibility {
    let mut hard = Vec::new();
    let mut cautions = Vec::new();

    if let Some(min) = apk.min_sdk {
        if min > device.sdk {
            hard.push(format!(
                "APK needs Android API {min}; device has API {}.",
                device.sdk
            ));
        }
    }
    if let Some(max) = apk.max_sdk {
        if max < device.sdk {
            cautions.push(format!(
                "APK declares max API {max}; device has API {}.",
                device.sdk
            ));
        }
    }
    if !apk.native_abis.is_empty()
        && !apk
            .native_abis
            .iter()
            .any(|abi| device.abis.iter().any(|device_abi| device_abi == abi))
    {
        hard.push(format!(
            "Native code supports {}; device supports {}.",
            apk.native_abis.join(", "),
            device.abis.join(", ")
        ));
    }
    let target = apk.target_sdk.unwrap_or(1);
    if device.sdk >= 35 && target < 24 {
        hard.push(
            "Android 15 or newer blocks normal installation for apps targeting below API 24."
                .into(),
        );
    } else if device.sdk == 34 && target < 23 {
        hard.push("Android 14 blocks normal installation for apps targeting below API 23.".into());
    } else if target < 26 {
        cautions.push(
            "The APK targets an old Android version and may lose features on a modern device."
                .into(),
        );
    }

    let (verdict, reasons) = if !hard.is_empty() {
        hard.extend(cautions);
        (Verdict::Incompatible, hard)
    } else if !cautions.is_empty() {
        (Verdict::Caution, cautions)
    } else if apk.package.is_none() {
        (
            Verdict::Unknown,
            vec!["The package manifest could not be read.".into()],
        )
    } else {
        (
            Verdict::Compatible,
            vec!["SDK level and native CPU requirements match this device.".into()],
        )
    };

    Compatibility {
        apk_sha256: apk.sha256.clone(),
        device_serial_hash: device.serial_hash.clone(),
        verdict,
        reasons,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn rejects_missing_abi() {
        let apk = ApkMetadata {
            sha256: "a".into(),
            package: Some("in.sociobot.sample".into()),
            min_sdk: Some(21),
            target_sdk: Some(33),
            native_abis: vec!["armeabi-v7a".into()],
            ..Default::default()
        };
        let device = DeviceInfo {
            serial_hash: "d".into(),
            sdk: 33,
            abis: vec!["x86_64".into()],
            ..Default::default()
        };
        assert_eq!(assess(&apk, &device).verdict, Verdict::Incompatible);
    }

    #[test]
    fn applies_android_sideload_floor() {
        let apk = ApkMetadata {
            sha256: "a".into(),
            package: Some("in.sociobot.old".into()),
            min_sdk: Some(14),
            target_sdk: Some(22),
            ..Default::default()
        };
        let android_14 = DeviceInfo {
            serial_hash: "d".into(),
            sdk: 34,
            ..Default::default()
        };
        assert_eq!(assess(&apk, &android_14).verdict, Verdict::Incompatible);
    }
}
