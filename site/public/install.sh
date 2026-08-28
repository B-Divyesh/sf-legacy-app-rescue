#!/bin/sh
set -eu

REPO="B-Divyesh/sf-legacy-app-rescue"
BASE="https://github.com/$REPO/releases/latest/download"
SYSTEM=$(uname -s)
MACHINE=$(uname -m)

case "$SYSTEM-$MACHINE" in
  Linux-x86_64|Linux-amd64) FILE="rescue-linux-x86_64.tar.gz" ;;
  Darwin-arm64|Darwin-aarch64) FILE="rescue-macos-arm64.tar.gz" ;;
  Darwin-x86_64|Darwin-amd64) FILE="rescue-macos-x86_64.tar.gz" ;;
  *) echo "Legacy App Rescue has no installer for $SYSTEM $MACHINE." >&2; exit 1 ;;
esac

RESCUE_TMP=$(mktemp -d)
trap 'rm -rf "$RESCUE_TMP"' EXIT INT TERM
curl -fL "$BASE/$FILE" -o "$RESCUE_TMP/$FILE"
curl -fL "$BASE/SHA256SUMS" -o "$RESCUE_TMP/SHA256SUMS"
EXPECTED=$(awk -v file="$FILE" '$2 == file {print $1}' "$RESCUE_TMP/SHA256SUMS")
[ -n "$EXPECTED" ] || { echo "Checksum for $FILE is missing." >&2; exit 1; }

if command -v sha256sum >/dev/null 2>&1; then ACTUAL=$(sha256sum "$RESCUE_TMP/$FILE" | awk '{print $1}')
elif command -v shasum >/dev/null 2>&1; then ACTUAL=$(shasum -a 256 "$RESCUE_TMP/$FILE" | awk '{print $1}')
else echo "A SHA-256 tool is required." >&2; exit 1
fi
[ "$ACTUAL" = "$EXPECTED" ] || { echo "Checksum did not match. Nothing was installed." >&2; exit 1; }

tar -xzf "$RESCUE_TMP/$FILE" -C "$RESCUE_TMP"
RESCUE_INSTALL_DIR=${LEGACY_RESCUE_INSTALL_DIR:-"$HOME/.local/bin"}
mkdir -p "$RESCUE_INSTALL_DIR"
install -m 755 "$RESCUE_TMP/rescue" "$RESCUE_INSTALL_DIR/rescue"
echo "Installed rescue at $RESCUE_INSTALL_DIR/rescue"
case ":$PATH:" in *":$RESCUE_INSTALL_DIR:"*) ;; *) echo "Add $RESCUE_INSTALL_DIR to PATH to run rescue." ;; esac
