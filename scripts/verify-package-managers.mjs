import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const repository = 'B-Divyesh/sf-legacy-app-rescue';
const releaseBase = `https://github.com/${repository}/releases/download`;
const publicFormula = 'https://raw.githubusercontent.com/B-Divyesh/homebrew-legacy-app-rescue/main/Formula/legacy-app-rescue.rb';
const publicScoop = `https://raw.githubusercontent.com/${repository}/main/scoop-bucket/legacy-app-rescue.json`;

function fail(message) {
  throw new Error(`Package-manager release check failed: ${message}`);
}

function packageVersion(directory = root) {
  const cargo = readFileSync(resolve(directory, 'Cargo.toml'), 'utf8');
  const version = cargo.match(/^version = "([^"]+)"$/m)?.[1];
  if (!version) fail('Cargo.toml has no package version.');
  return version;
}

function expectedUrl(version, filename) {
  return `${releaseBase}/v${version}/${filename}`;
}

function assertIncludes(value, expected, label) {
  if (!value.includes(expected)) fail(`${label} does not contain ${expected}.`);
}

function verifyFormula(formula, version, hashes, label) {
  assertIncludes(formula, `version "${version}"`, `${label} version`);
  for (const filename of ['rescue-macos-arm64.tar.gz', 'rescue-macos-x86_64.tar.gz', 'rescue-linux-x86_64.tar.gz']) {
    assertIncludes(formula, expectedUrl(version, filename), `${label} ${filename} URL`);
    assertIncludes(formula, `sha256 "${hashes[filename]}"`, `${label} ${filename} checksum`);
  }
}

function verifyScoop(manifestText, version, hashes, label) {
  const manifest = JSON.parse(manifestText);
  const asset = manifest.architecture?.['64bit'];
  if (manifest.version !== version) fail(`${label} version is ${manifest.version}, expected ${version}.`);
  if (asset?.url !== expectedUrl(version, 'rescue-windows-x86_64.zip')) fail(`${label} does not resolve the v${version} Windows archive.`);
  if (asset?.hash?.toLowerCase() !== hashes['rescue-windows-x86_64.zip']) fail(`${label} checksum does not match the v${version} Windows archive.`);
}

function verifyWinget(manifest, version, hashes) {
  assertIncludes(manifest, `PackageVersion: ${version}`, 'winget version');
  assertIncludes(manifest, `InstallerUrl: ${expectedUrl(version, 'rescue-windows-x86_64.zip')}`, 'winget Windows URL');
  assertIncludes(manifest, `InstallerSha256: ${hashes['rescue-windows-x86_64.zip'].toUpperCase()}`, 'winget checksum');
}

export function verifyRepositoryPackageManifests({ version = packageVersion(), hashes, directory = root } = {}) {
  if (!hashes) fail('release checksums are required.');
  verifyFormula(readFileSync(resolve(directory, 'Formula/legacy-app-rescue.rb'), 'utf8'), version, hashes, 'repository Homebrew formula');
  verifyScoop(readFileSync(resolve(directory, 'bucket/legacy-app-rescue.json'), 'utf8'), version, hashes, 'repository bucket manifest');
  verifyScoop(readFileSync(resolve(directory, 'scoop-bucket/legacy-app-rescue.json'), 'utf8'), version, hashes, 'documented Scoop manifest');
  verifyWinget(readFileSync(resolve(directory, 'winget/B-Divyesh.LegacyAppRescue.yaml'), 'utf8'), version, hashes);
  return version;
}

function parseSums(text) {
  const hashes = {};
  for (const line of text.trim().split('\n')) {
    const match = line.match(/^([a-f0-9]{64})  (rescue-[^\s]+)$/i);
    if (match) hashes[match[2]] = match[1].toLowerCase();
  }
  if (!hashes['rescue-linux-x86_64.tar.gz'] || !hashes['rescue-windows-x86_64.zip']) fail('published SHA256SUMS is incomplete.');
  return hashes;
}

async function textFrom(fetchImplementation, url) {
  const response = await fetchImplementation(url);
  if (!response.ok) fail(`${url} returned ${response.status}.`);
  return response.text();
}

export async function verifyPublishedPackageManagers(fetchImplementation = fetch) {
  const version = packageVersion();
  const sums = parseSums(await textFrom(fetchImplementation, `${releaseBase}/v${version}/SHA256SUMS`));
  verifyRepositoryPackageManifests({ version, hashes: sums });
  verifyFormula(await textFrom(fetchImplementation, publicFormula), version, sums, 'published Homebrew formula');
  verifyScoop(await textFrom(fetchImplementation, publicScoop), version, sums, 'published Scoop manifest');
  return { version, hashes: sums };
}

if (process.argv[1]?.endsWith('/verify-package-managers.mjs')) {
  const { version } = await verifyPublishedPackageManagers();
  console.log(`Homebrew, Scoop, and winget manifests resolve to the repaired v${version} release.`);
}
