class LegacyAppRescue < Formula
  desc "Preserve Android APK evidence and check device compatibility locally"
  homepage "https://legacy-app-rescue.sociobot.in"
  version "0.1.2"
  license "MIT"

  on_macos do
    if Hardware::CPU.arm?
      url "https://github.com/B-Divyesh/sf-legacy-app-rescue/releases/download/v0.1.2/rescue-macos-arm64.tar.gz"
      sha256 "93eb74c218a743729e339f1fb6a3a85b992711e7d101f8a84efabe064acf3407"
    else
      url "https://github.com/B-Divyesh/sf-legacy-app-rescue/releases/download/v0.1.2/rescue-macos-x86_64.tar.gz"
      sha256 "e37f700b7e6c268d273d2245f86ed028c2d7b47faf4c353170a14915f805ac31"
    end
  end

  on_linux do
    url "https://github.com/B-Divyesh/sf-legacy-app-rescue/releases/download/v0.1.2/rescue-linux-x86_64.tar.gz"
    sha256 "38fcb105c7c123af4db29f214dc4e92730b5a6547fa10209797251db2c5dd4a1"
  end

  def install
    bin.install "rescue"
  end

  test do
    assert_match "Legacy App Rescue", shell_output("#{bin}/rescue --help")
  end
end
