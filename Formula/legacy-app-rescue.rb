class LegacyAppRescue < Formula
  desc "Preserve Android APK evidence and check device compatibility locally"
  homepage "https://legacy-app-rescue.sociobot.in"
  version "0.1.2"
  license "MIT"

  on_macos do
    if Hardware::CPU.arm?
      url "https://github.com/B-Divyesh/sf-legacy-app-rescue/releases/download/v0.1.2/rescue-macos-arm64.tar.gz"
      sha256 "2d09579614be7637a4e5b51d7477a0acfb219ec566872e3bd328024326f4edcb"
    else
      url "https://github.com/B-Divyesh/sf-legacy-app-rescue/releases/download/v0.1.2/rescue-macos-x86_64.tar.gz"
      sha256 "587c122e02709b2350b20de53481dd9fc44151c6e8bf342a0c2ba8034a1cd287"
    end
  end

  on_linux do
    url "https://github.com/B-Divyesh/sf-legacy-app-rescue/releases/download/v0.1.2/rescue-linux-x86_64.tar.gz"
    sha256 "840e1f62e2d37f1d06b1eb6bd59ac88fb94c680985c87d5bd8fdd26aab3806b5"
  end

  def install
    bin.install "rescue"
  end

  test do
    assert_match "Legacy App Rescue", shell_output("#{bin}/rescue --help")
  end
end
