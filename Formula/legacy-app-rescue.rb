class LegacyAppRescue < Formula
  desc "Preserve Android APK evidence and check device compatibility locally"
  homepage "https://legacy-app-rescue.sociobot.in"
  version "0.1.0"
  license "MIT"

  on_macos do
    if Hardware::CPU.arm?
      url "https://github.com/B-Divyesh/sf-legacy-app-rescue/releases/download/v0.1.0/rescue-macos-arm64.tar.gz"
      sha256 "e374012dfac3d0866609be26865c916fb9956b66645fba025ed10f7ccf293aba"
    else
      url "https://github.com/B-Divyesh/sf-legacy-app-rescue/releases/download/v0.1.0/rescue-macos-x86_64.tar.gz"
      sha256 "c120aa66293b66c3c19569965ca67e134aa475755c19c58dbbf2e70027bf2cbd"
    end
  end

  on_linux do
    url "https://github.com/B-Divyesh/sf-legacy-app-rescue/releases/download/v0.1.0/rescue-linux-x86_64.tar.gz"
    sha256 "8f01f1a71ed01a2a16dae85326943c6bd8c3c2a84c6a4532e4263539eb2e8e77"
  end

  def install
    bin.install "rescue"
  end

  test do
    assert_match "Legacy App Rescue", shell_output("#{bin}/rescue --help")
  end
end
