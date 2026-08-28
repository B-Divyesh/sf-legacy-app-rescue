class LegacyAppRescue < Formula
  desc "Preserve Android APK evidence and check device compatibility locally"
  homepage "https://legacy-app-rescue.sociobot.in"
  version "0.1.1"
  license "MIT"

  on_macos do
    if Hardware::CPU.arm?
      url "https://github.com/B-Divyesh/sf-legacy-app-rescue/releases/download/v0.1.1/rescue-macos-arm64.tar.gz"
      sha256 "913c59882f0443edb9676cd67097a2f3fcfffe12e6432c86e5a5c0e04b52202a"
    else
      url "https://github.com/B-Divyesh/sf-legacy-app-rescue/releases/download/v0.1.1/rescue-macos-x86_64.tar.gz"
      sha256 "e18086e3ac9684d7217c0742903a835d0d66d6fb2ef7fb2bdbdd368eec162b93"
    end
  end

  on_linux do
    url "https://github.com/B-Divyesh/sf-legacy-app-rescue/releases/download/v0.1.1/rescue-linux-x86_64.tar.gz"
    sha256 "502e045a0984b6cd055427e3758919d9f16314f5fc91b7fd4148f25069ad1206"
  end

  def install
    bin.install "rescue"
  end

  test do
    assert_match "Legacy App Rescue", shell_output("#{bin}/rescue --help")
  end
end
