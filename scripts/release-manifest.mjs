import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const [directory, inputTag, repository] = process.argv.slice(2);
const tag = inputTag || 'v0.1.0';
const files = readdirSync(directory).filter(name => name.startsWith('rescue-'));
const digest = name => createHash('sha256').update(readFileSync(join(directory, name))).digest('hex');
const url = name => `https://github.com/${repository}/releases/download/${tag}/${name}`;
const assets = Object.fromEntries(files.map(name => [name, { url: url(name), sha256: digest(name) }]));
writeFileSync(join(directory, 'latest.json'), JSON.stringify({ version: tag, assets }, null, 2) + '\n');

const macArm = 'rescue-macos-arm64.tar.gz';
writeFileSync(join(directory, 'legacy-app-rescue.rb'), `class LegacyAppRescue < Formula
  desc "Preserve Android APK evidence and check device compatibility locally"
  homepage "https://legacy-app-rescue.sociobot.in"
  version "${tag.replace(/^v/, '')}"
  license "MIT"

  on_macos do
    if Hardware::CPU.arm?
      url "${url(macArm)}"
      sha256 "${assets[macArm]?.sha256 || ''}"
    else
      url "${url('rescue-macos-x86_64.tar.gz')}"
      sha256 "${assets['rescue-macos-x86_64.tar.gz']?.sha256 || ''}"
    end
  end

  on_linux do
    url "${url('rescue-linux-x86_64.tar.gz')}"
    sha256 "${assets['rescue-linux-x86_64.tar.gz']?.sha256 || ''}"
  end

  def install
    bin.install "rescue"
  end

  test do
    assert_match "Legacy App Rescue", shell_output("#{bin}/rescue --help")
  end
end
`);

const scoop = {
  version: tag.replace(/^v/, ''),
  description: 'Preserve Android APK evidence and check device compatibility locally.',
  homepage: 'https://legacy-app-rescue.sociobot.in',
  license: 'MIT',
  architecture: { '64bit': { url: url('rescue-windows-x86_64.zip'), hash: assets['rescue-windows-x86_64.zip']?.sha256 || '' } },
  bin: 'rescue.exe',
  checkver: { github: `https://github.com/${repository}` },
  autoupdate: { architecture: { '64bit': { url: `https://github.com/${repository}/releases/download/v$version/rescue-windows-x86_64.zip` } } }
};
writeFileSync(join(directory, 'legacy-app-rescue-scoop.json'), JSON.stringify(scoop, null, 2) + '\n');

