class LegacyAppRescue < Formula
  desc "Preserve Android APK evidence and check device compatibility locally"
  homepage "https://legacy-app-rescue.sociobot.in"
  version "0.1.0"
  license "MIT"

  # The release workflow publishes a formula with platform SHA-256 values.
  # Use the formula from the B-Divyesh/homebrew-legacy-app-rescue tap.
  url "https://github.com/B-Divyesh/sf-legacy-app-rescue/releases/download/v0.1.0/rescue-macos-arm64.tar.gz"
  sha256 "RELEASE_WORKFLOW_REPLACES_THIS"

  def install
    bin.install "rescue"
  end
end

