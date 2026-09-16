#!/bin/sh

set -eu

APP="git-tui"
VERSION="0.0.1"
URL="https://github.com/BuboTerrae/git-tui/releases/download/beta/gittui"

OS="$(uname -s)"
ARCH="$(uname -m)"

TMP_DIR="$(mktemp -d)"

echo -e "\e[38;5;27mDownloading $APP binaries\033[0m"
curl -fsSL --progress-bar "$URL" -o "$TMP_DIR/$APP"
echo -e "\e[38;5;27mBinaries downloaded\033[0m"

echo -e "\e[38;5;150mInstalling\033[0m \e[38;5;27m$APP\033[0m \e[38;5;87mv$VERSION\e[0m for ${OS}-${ARCH}"
sudo install -m 755 "$TMP_DIR/$APP" "/usr/local/bin/$APP"

rm -rf "$TMP_DIR"

echo -e "\e[38;5;150m[SUCCESS] Installed\033[0m \e[38;5;27m$APP\033[0m \e[38;5;87mv$VERSION\e[0m"