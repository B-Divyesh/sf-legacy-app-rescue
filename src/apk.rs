use crate::model::{ApkMetadata, Signer};
use anyhow::{bail, Context, Result};
use quick_xml::events::Event;
use quick_xml::Reader;
use sha2::{Digest, Sha256};
use std::collections::BTreeSet;
use std::fs::File;
use std::io::{Read, Seek, SeekFrom};
use std::path::Path;
use zip::ZipArchive;

const APK_SIG_MAGIC: &[u8; 16] = b"APK Sig Block 42";

pub fn inspect(path: &Path) -> Result<ApkMetadata> {
    if !path.exists() {
        bail!("APK not found: {}", path.display());
    }
    if !path.is_file() {
        bail!("APK path is not a file: {}", path.display());
    }

    let size_bytes = path.metadata()?.len();
    let sha256 = hash_file(path)?;
    let file = File::open(path)?;
    let mut zip = ZipArchive::new(file)
        .with_context(|| format!("{} is not a readable APK or ZIP file", path.display()))?;

    let mut manifest_bytes = Vec::new();
    zip.by_name("AndroidManifest.xml")
        .context("APK has no AndroidManifest.xml")?
        .read_to_end(&mut manifest_bytes)?;
    let mut meta = parse_manifest(&manifest_bytes).unwrap_or_default();
    meta.path = path.to_string_lossy().into_owned();
    meta.file_name = path
        .file_name()
        .map(|name| name.to_string_lossy().into_owned())
        .unwrap_or_default();
    meta.sha256 = sha256;
    meta.size_bytes = size_bytes;

    let mut abis = BTreeSet::new();
    let mut v1_signers = Vec::new();
    for index in 0..zip.len() {
        let mut entry = zip.by_index(index)?;
        let name = entry.name().to_owned();
        let parts: Vec<&str> = name.split('/').collect();
        if parts.len() >= 3 && parts[0] == "lib" && name.ends_with(".so") {
            abis.insert(parts[1].to_owned());
        }
        let upper = name.to_ascii_uppercase();
        if upper.starts_with("META-INF/")
            && (upper.ends_with(".RSA") || upper.ends_with(".DSA") || upper.ends_with(".EC"))
        {
            let mut bytes = Vec::new();
            entry.read_to_end(&mut bytes)?;
            v1_signers.push(Signer {
                scheme: "v1-signature-block".into(),
                sha256: hex_hash(&bytes),
                source: name,
            });
        }
    }
    meta.native_abis = abis.into_iter().collect();
    meta.signers = extract_apk_signing_certificates(path).unwrap_or_default();
    meta.signers.extend(v1_signers);
    meta.signers
        .sort_by(|a, b| (&a.scheme, &a.sha256).cmp(&(&b.scheme, &b.sha256)));
    meta.signers
        .dedup_by(|a, b| a.scheme == b.scheme && a.sha256 == b.sha256);
    Ok(meta)
}

fn hash_file(path: &Path) -> Result<String> {
    let mut file = File::open(path)?;
    let mut digest = Sha256::new();
    let mut buf = [0u8; 128 * 1024];
    loop {
        let count = file.read(&mut buf)?;
        if count == 0 {
            break;
        }
        digest.update(&buf[..count]);
    }
    Ok(format!("{:x}", digest.finalize()))
}

pub fn hex_hash(bytes: &[u8]) -> String {
    format!("{:x}", Sha256::digest(bytes))
}

fn parse_manifest(bytes: &[u8]) -> Result<ApkMetadata> {
    if bytes.starts_with(b"<?xml") || bytes.first() == Some(&b'<') {
        parse_text_manifest(bytes)
    } else {
        parse_binary_manifest(bytes)
    }
}

fn parse_text_manifest(bytes: &[u8]) -> Result<ApkMetadata> {
    let mut reader = Reader::from_reader(bytes);
    reader.config_mut().trim_text(true);
    let mut result = ApkMetadata::default();
    loop {
        match reader.read_event()? {
            Event::Start(event) | Event::Empty(event) => {
                let tag = String::from_utf8_lossy(event.name().as_ref()).to_string();
                for attribute in event.attributes().flatten() {
                    let key = String::from_utf8_lossy(attribute.key.as_ref()).to_string();
                    let key = key.rsplit(':').next().unwrap_or(&key);
                    let value = attribute
                        .decode_and_unescape_value(reader.decoder())?
                        .into_owned();
                    apply_value(&mut result, &tag, key, &value);
                }
            }
            Event::Eof => break,
            _ => {}
        }
    }
    Ok(result)
}

fn parse_binary_manifest(bytes: &[u8]) -> Result<ApkMetadata> {
    if bytes.len() < 8 || u16_at(bytes, 0)? != 0x0003 {
        bail!("AndroidManifest.xml has an unknown format");
    }
    let mut offset = u16_at(bytes, 2)? as usize;
    let mut strings = Vec::new();
    let mut result = ApkMetadata::default();

    while offset + 8 <= bytes.len() {
        let kind = u16_at(bytes, offset)?;
        let header_size = u16_at(bytes, offset + 2)? as usize;
        let chunk_size = u32_at(bytes, offset + 4)? as usize;
        if chunk_size < header_size || offset + chunk_size > bytes.len() {
            bail!("AndroidManifest.xml contains a damaged chunk");
        }
        match kind {
            0x0001 => strings = parse_string_pool(&bytes[offset..offset + chunk_size])?,
            0x0102 if !strings.is_empty() && header_size >= 16 => {
                let ext = offset + 16;
                if ext + 20 > offset + chunk_size {
                    bail!("AndroidManifest.xml contains a short element");
                }
                let tag = string_at(&strings, u32_at(bytes, ext + 4)?);
                let attribute_start = u16_at(bytes, ext + 8)? as usize;
                let attribute_size = u16_at(bytes, ext + 10)? as usize;
                let attribute_count = u16_at(bytes, ext + 12)? as usize;
                if attribute_size < 20 {
                    bail!("AndroidManifest.xml contains a short attribute");
                }
                for index in 0..attribute_count {
                    let attr = ext + attribute_start + index * attribute_size;
                    if attr + 20 > offset + chunk_size {
                        break;
                    }
                    let name = string_at(&strings, u32_at(bytes, attr + 4)?);
                    let raw = u32_at(bytes, attr + 8)?;
                    let data_type = bytes[attr + 15];
                    let data = u32_at(bytes, attr + 16)?;
                    let value = if raw != u32::MAX {
                        string_at(&strings, raw)
                    } else {
                        typed_value(&strings, data_type, data)
                    };
                    apply_value(&mut result, &tag, &name, &value);
                }
            }
            _ => {}
        }
        offset += chunk_size;
    }
    Ok(result)
}

fn apply_value(meta: &mut ApkMetadata, tag: &str, key: &str, value: &str) {
    match (tag, key) {
        ("manifest", "package") => meta.package = Some(value.into()),
        ("manifest", "versionName") => meta.version_name = Some(value.into()),
        ("manifest", "versionCode") => meta.version_code = value.parse().ok(),
        ("uses-sdk", "minSdkVersion") => meta.min_sdk = sdk_number(value),
        ("uses-sdk", "targetSdkVersion") => meta.target_sdk = sdk_number(value),
        ("uses-sdk", "maxSdkVersion") => meta.max_sdk = sdk_number(value),
        ("application", "debuggable") => meta.debuggable = parse_bool(value),
        _ => {}
    }
}

fn sdk_number(value: &str) -> Option<u32> {
    value.parse().ok()
}

fn parse_bool(value: &str) -> Option<bool> {
    match value {
        "true" | "1" => Some(true),
        "false" | "0" => Some(false),
        _ => None,
    }
}

fn typed_value(strings: &[String], kind: u8, data: u32) -> String {
    match kind {
        0x03 => string_at(strings, data),
        0x10 | 0x11 => data.to_string(),
        0x12 => (data != 0).to_string(),
        _ => format!("0x{data:08x}"),
    }
}

fn parse_string_pool(chunk: &[u8]) -> Result<Vec<String>> {
    if chunk.len() < 28 {
        bail!("short Android string pool");
    }
    let count = u32_at(chunk, 8)? as usize;
    let flags = u32_at(chunk, 16)?;
    let strings_start = u32_at(chunk, 20)? as usize;
    let utf8 = flags & 0x100 != 0;
    if 28 + count * 4 > chunk.len() || strings_start > chunk.len() {
        bail!("damaged Android string pool");
    }
    let mut result = Vec::with_capacity(count);
    for index in 0..count {
        let start = strings_start + u32_at(chunk, 28 + index * 4)? as usize;
        if start >= chunk.len() {
            bail!("string offset outside Android string pool");
        }
        result.push(if utf8 {
            decode_utf8_string(chunk, start)?
        } else {
            decode_utf16_string(chunk, start)?
        });
    }
    Ok(result)
}

fn decode_utf8_string(bytes: &[u8], mut offset: usize) -> Result<String> {
    let (_, used) = length8(bytes, offset)?;
    offset += used;
    let (byte_len, used) = length8(bytes, offset)?;
    offset += used;
    let end = offset
        .checked_add(byte_len)
        .context("string length overflow")?;
    Ok(std::str::from_utf8(bytes.get(offset..end).context("short UTF-8 string")?)?.into())
}

fn decode_utf16_string(bytes: &[u8], mut offset: usize) -> Result<String> {
    let (units, used) = length16(bytes, offset)?;
    offset += used;
    let end = offset
        .checked_add(units * 2)
        .context("string length overflow")?;
    let slice = bytes.get(offset..end).context("short UTF-16 string")?;
    let (pairs, _) = slice.as_chunks::<2>();
    let values: Vec<u16> = pairs.iter().map(|part| u16::from_le_bytes(*part)).collect();
    Ok(String::from_utf16(&values)?)
}

fn length8(bytes: &[u8], offset: usize) -> Result<(usize, usize)> {
    let first = *bytes.get(offset).context("short UTF-8 length")? as usize;
    if first & 0x80 == 0 {
        Ok((first, 1))
    } else {
        let second = *bytes.get(offset + 1).context("short UTF-8 length")? as usize;
        Ok((((first & 0x7f) << 8) | second, 2))
    }
}

fn length16(bytes: &[u8], offset: usize) -> Result<(usize, usize)> {
    let first = u16_at(bytes, offset)? as usize;
    if first & 0x8000 == 0 {
        Ok((first, 2))
    } else {
        let second = u16_at(bytes, offset + 2)? as usize;
        Ok((((first & 0x7fff) << 16) | second, 4))
    }
}

fn string_at(strings: &[String], index: u32) -> String {
    if index == u32::MAX {
        String::new()
    } else {
        strings.get(index as usize).cloned().unwrap_or_default()
    }
}

fn extract_apk_signing_certificates(path: &Path) -> Result<Vec<Signer>> {
    let mut file = File::open(path)?;
    let length = file.metadata()?.len();
    let tail_len = length.min(65_557) as usize;
    file.seek(SeekFrom::End(-(tail_len as i64)))?;
    let mut tail = vec![0; tail_len];
    file.read_exact(&mut tail)?;
    let eocd = tail
        .windows(4)
        .rposition(|window| window == [0x50, 0x4b, 0x05, 0x06])
        .context("ZIP end record not found")?;
    let central_offset = u32_at(&tail, eocd + 16)? as u64;
    if central_offset < 24 {
        return Ok(vec![]);
    }
    file.seek(SeekFrom::Start(central_offset - 24))?;
    let mut footer = [0u8; 24];
    file.read_exact(&mut footer)?;
    if &footer[8..] != APK_SIG_MAGIC {
        return Ok(vec![]);
    }
    let size = u64::from_le_bytes(footer[0..8].try_into().unwrap());
    if !(24..=16 * 1024 * 1024).contains(&size) || size + 8 > central_offset {
        bail!("APK signing block has an unsafe size");
    }
    let start = central_offset - size - 8;
    file.seek(SeekFrom::Start(start))?;
    let mut block = vec![0u8; (size + 8) as usize];
    file.read_exact(&mut block)?;
    if u64::from_le_bytes(block[0..8].try_into().unwrap()) != size {
        bail!("APK signing block sizes do not match");
    }

    let mut result = Vec::new();
    let mut pos = 8usize;
    let entries_end = block.len() - 24;
    while pos + 12 <= entries_end {
        let entry_len = u64::from_le_bytes(block[pos..pos + 8].try_into().unwrap()) as usize;
        if entry_len < 4 || pos + 8 + entry_len > entries_end {
            break;
        }
        let id = u32_at(&block, pos + 8)?;
        let scheme = match id {
            0x7109_871a => Some("v2"),
            0xf053_68c0 => Some("v3"),
            0x1b93_ad61 => Some("v3.1"),
            _ => None,
        };
        if let Some(scheme) = scheme {
            for cert in signing_certificates(&block[pos + 12..pos + 8 + entry_len]) {
                result.push(Signer {
                    scheme: scheme.into(),
                    sha256: hex_hash(cert),
                    source: "APK Signing Block certificate".into(),
                });
            }
        }
        pos += 8 + entry_len;
    }
    Ok(result)
}

fn signing_certificates(value: &[u8]) -> Vec<&[u8]> {
    let mut certs = Vec::new();
    let Some(signers) = length_prefixed(value) else {
        return certs;
    };
    let mut signers_pos = 0;
    while signers_pos < signers.len() {
        let Some(signer) = length_prefixed(&signers[signers_pos..]) else {
            break;
        };
        signers_pos += 4 + signer.len();
        let Some(signed_data) = length_prefixed(signer) else {
            continue;
        };
        let Some(digests) = length_prefixed(signed_data) else {
            continue;
        };
        let certs_offset = 4 + digests.len();
        let Some(cert_sequence) = length_prefixed(&signed_data[certs_offset..]) else {
            continue;
        };
        let mut cert_pos = 0;
        while cert_pos < cert_sequence.len() {
            let Some(cert) = length_prefixed(&cert_sequence[cert_pos..]) else {
                break;
            };
            cert_pos += 4 + cert.len();
            certs.push(cert);
        }
    }
    certs
}

fn length_prefixed(bytes: &[u8]) -> Option<&[u8]> {
    let len = u32::from_le_bytes(bytes.get(0..4)?.try_into().ok()?) as usize;
    bytes.get(4..4 + len)
}

fn u16_at(bytes: &[u8], offset: usize) -> Result<u16> {
    Ok(u16::from_le_bytes(
        bytes
            .get(offset..offset + 2)
            .context("short data")?
            .try_into()?,
    ))
}

fn u32_at(bytes: &[u8], offset: usize) -> Result<u32> {
    Ok(u32::from_le_bytes(
        bytes
            .get(offset..offset + 4)
            .context("short data")?
            .try_into()?,
    ))
}

#[cfg(test)]
mod tests {
    use super::*;

    fn append_u16(out: &mut Vec<u8>, value: u16) {
        out.extend(value.to_le_bytes());
    }

    fn append_u32(out: &mut Vec<u8>, value: u32) {
        out.extend(value.to_le_bytes());
    }

    fn string_pool(strings: &[&str]) -> Vec<u8> {
        let mut data = Vec::new();
        let mut offsets = Vec::new();
        for value in strings {
            offsets.push(data.len() as u32);
            data.push(value.len() as u8);
            data.push(value.len() as u8);
            data.extend(value.as_bytes());
            data.push(0);
        }
        while data.len() % 4 != 0 {
            data.push(0);
        }
        let start = 28 + offsets.len() * 4;
        let mut out = Vec::new();
        append_u16(&mut out, 0x0001);
        append_u16(&mut out, 28);
        append_u32(&mut out, (start + data.len()) as u32);
        append_u32(&mut out, strings.len() as u32);
        append_u32(&mut out, 0);
        append_u32(&mut out, 0x100);
        append_u32(&mut out, start as u32);
        append_u32(&mut out, 0);
        for offset in offsets {
            append_u32(&mut out, offset);
        }
        out.extend(data);
        out
    }

    fn start_element(name: u32, attributes: &[(u32, u32, u8, u32)]) -> Vec<u8> {
        let size = 36 + attributes.len() * 20;
        let mut out = Vec::new();
        append_u16(&mut out, 0x0102);
        append_u16(&mut out, 16);
        append_u32(&mut out, size as u32);
        append_u32(&mut out, 1);
        append_u32(&mut out, u32::MAX);
        append_u32(&mut out, u32::MAX);
        append_u32(&mut out, name);
        append_u16(&mut out, 20);
        append_u16(&mut out, 20);
        append_u16(&mut out, attributes.len() as u16);
        append_u16(&mut out, 0);
        append_u16(&mut out, 0);
        append_u16(&mut out, 0);
        for (attribute_name, raw, kind, data) in attributes {
            append_u32(&mut out, u32::MAX);
            append_u32(&mut out, *attribute_name);
            append_u32(&mut out, *raw);
            append_u16(&mut out, 8);
            out.push(0);
            out.push(*kind);
            append_u32(&mut out, *data);
        }
        out
    }

    #[test]
    fn parses_plain_manifest() {
        let xml = br#"<manifest xmlns:android="http://schemas.android.com/apk/res/android" package="in.sociobot.orchard" android:versionCode="17" android:versionName="1.7"><uses-sdk android:minSdkVersion="21" android:targetSdkVersion="28"/><application android:debuggable="false"/></manifest>"#;
        let parsed = parse_manifest(xml).unwrap();
        assert_eq!(parsed.package.as_deref(), Some("in.sociobot.orchard"));
        assert_eq!(parsed.min_sdk, Some(21));
        assert_eq!(parsed.version_code, Some(17));
        assert_eq!(parsed.debuggable, Some(false));
    }

    #[test]
    fn parses_binary_manifest() {
        let strings = [
            "manifest",
            "package",
            "in.sociobot.binary",
            "versionCode",
            "uses-sdk",
            "minSdkVersion",
            "targetSdkVersion",
            "application",
            "debuggable",
        ];
        let pool = string_pool(&strings);
        let manifest = start_element(0, &[(1, 2, 0x03, 2), (3, u32::MAX, 0x10, 42)]);
        let sdk = start_element(4, &[(5, u32::MAX, 0x10, 23), (6, u32::MAX, 0x10, 33)]);
        let application = start_element(7, &[(8, u32::MAX, 0x12, 0)]);
        let total = 8 + pool.len() + manifest.len() + sdk.len() + application.len();
        let mut xml = Vec::new();
        append_u16(&mut xml, 0x0003);
        append_u16(&mut xml, 8);
        append_u32(&mut xml, total as u32);
        xml.extend(pool);
        xml.extend(manifest);
        xml.extend(sdk);
        xml.extend(application);

        let parsed = parse_manifest(&xml).unwrap();
        assert_eq!(parsed.package.as_deref(), Some("in.sociobot.binary"));
        assert_eq!(parsed.version_code, Some(42));
        assert_eq!(parsed.min_sdk, Some(23));
        assert_eq!(parsed.target_sdk, Some(33));
        assert_eq!(parsed.debuggable, Some(false));
    }

    #[test]
    fn extracts_signing_certificate() {
        fn field(value: &[u8]) -> Vec<u8> {
            let mut out = (value.len() as u32).to_le_bytes().to_vec();
            out.extend(value);
            out
        }
        let certificate = b"fictional-der-certificate";
        let certificate_sequence = field(certificate);
        let signed_data = [
            field(b"digests"),
            field(&certificate_sequence),
            field(b"attrs"),
        ]
        .concat();
        let signer = [
            field(&signed_data),
            field(b"signatures"),
            field(b"public-key"),
        ]
        .concat();
        let value = field(&field(&signer));
        assert_eq!(signing_certificates(&value), vec![certificate.as_slice()]);
    }

    #[test]
    fn sha_is_stable() {
        assert_eq!(
            hex_hash(b"field note"),
            "50348e0f8a9f6180c47a2b021af1bb07635b59ab6e04c99159394f0f99605221"
        );
    }
}
