class LegacyAppRescue < Formula
  desc "Preserve Android APK evidence and check device compatibility locally"
  homepage "https://legacy-app-rescue.sociobot.in"
  version "0.1.3"
  license "MIT"

  on_macos do
    if Hardware::CPU.arm?
      url "https://github.com/B-Divyesh/sf-legacy-app-rescue/releases/download/v0.1.3/rescue-macos-arm64.tar.gz"
      sha256 "d68d0ea5194142ccfe344b58d932a2fecf62e14552d632f19a660a95e1d467cb"
    else
      url "https://github.com/B-Divyesh/sf-legacy-app-rescue/releases/download/v0.1.3/rescue-macos-x86_64.tar.gz"
      sha256 "fb464dbe2c1aa2ee633d95ca6f8a0fdf5ce5f578c33db1f4a620c13e99af5248"
    end
  end

  on_linux do
    url "https://github.com/B-Divyesh/sf-legacy-app-rescue/releases/download/v0.1.3/rescue-linux-x86_64.tar.gz"
    sha256 "1518b41be1372cffb465819c580785d0f4cde1b34f2e2d0604479ff17a52bf42"
  end

  def install
    bin.install "rescue"
  end

  test do
    assert_match "Legacy App Rescue", shell_output("#{bin}/rescue --help")
  end
end
