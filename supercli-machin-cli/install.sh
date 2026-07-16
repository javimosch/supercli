#!/bin/bash
# install.sh — download a prebuilt sc-machin release, or print build-from-source
# instructions if this OS/arch isn't published yet (machin cross-compiles by
# invoking `cc`, so the release matrix is native-runner builds, not a full
# cross-compile grid like sc-zig's).
set -e

VERSION="${SC_MACHIN_VERSION:-v0.1.0-machin}"
REPO="javimosch/supercli"
REPLACE_SC=false
CUSTOM_PATH=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --replace) REPLACE_SC=true; shift ;;
        --path) CUSTOM_PATH="$2"; shift 2 ;;
        --path=*) CUSTOM_PATH="${1#*=}"; shift ;;
        *) echo "Unknown option: $1"; echo "Usage: $0 [--replace] [--path <dir>]"; exit 1 ;;
    esac
done

echo "SuperCLI (machin) Installer"
echo "==========================="
echo ""

OS="$(uname -s)"
ARCH="$(uname -m)"
case "$OS" in
    Linux)  OS_NAME="linux" ;;
    Darwin) OS_NAME="darwin" ;;
    *) echo "Unsupported OS: $OS"; exit 1 ;;
esac
case "$ARCH" in
    x86_64)        ARCH_NAME="amd64" ;;
    aarch64|arm64) ARCH_NAME="arm64" ;;
    *) echo "Unsupported architecture: $ARCH"; exit 1 ;;
esac

BINARY_NAME="sc-machin-${OS_NAME}-${ARCH_NAME}"
echo "Detected: $OS_NAME-$ARCH_NAME"

if [ -n "$CUSTOM_PATH" ]; then
    INSTALL_DIR="$CUSTOM_PATH"; INSTALL_CMD="mv"; TARGET_NAME="sc-machin"
elif [ "$REPLACE_SC" = true ]; then
    TARGET_NAME="sc"
    if [ -w "/usr/local/bin" ]; then INSTALL_DIR="/usr/local/bin"; INSTALL_CMD="mv"
    elif sudo -n true 2>/dev/null; then INSTALL_DIR="/usr/local/bin"; INSTALL_CMD="sudo mv"
    else INSTALL_DIR="$HOME/.local/bin"; INSTALL_CMD="mv"; echo "Note: no sudo, installing to $INSTALL_DIR"
    fi
else
    TARGET_NAME="sc-machin"
    if command -v sc &> /dev/null; then
        echo "Note: 'sc' already exists at $(which sc)"
        echo "Installing as 'sc-machin' (use --replace to replace it)"
    fi
    if [ -w "/usr/local/bin" ]; then INSTALL_DIR="/usr/local/bin"; INSTALL_CMD="mv"
    elif sudo -n true 2>/dev/null; then INSTALL_DIR="/usr/local/bin"; INSTALL_CMD="sudo mv"
    else INSTALL_DIR="$HOME/.local/bin"; INSTALL_CMD="mv"; echo "Note: no sudo, installing to $INSTALL_DIR (no password needed)"
    fi
fi

BINARY_PATH="${INSTALL_DIR}/${TARGET_NAME}"
mkdir -p "$INSTALL_DIR"

DOWNLOAD_URL="https://github.com/${REPO}/releases/download/${VERSION}/${BINARY_NAME}"
echo "Downloading from: $DOWNLOAD_URL"
if ! curl -fsSL "$DOWNLOAD_URL" -o /tmp/sc-machin-temp 2>/dev/null; then
    echo ""
    echo "No prebuilt binary for $OS_NAME-$ARCH_NAME yet. Build from source instead:"
    echo "  git clone https://github.com/${REPO}.git && cd supercli/supercli-machin-cli"
    echo "  ./build.sh   # requires machin (https://github.com/javimosch/machin) + a C compiler"
    exit 1
fi
chmod +x /tmp/sc-machin-temp

echo "Installing to: $BINARY_PATH"
$INSTALL_CMD /tmp/sc-machin-temp "$BINARY_PATH"

echo ""
echo "Testing installation..."
if "$BINARY_PATH" --version > /dev/null 2>&1; then
    echo "Installation successful!"
    "$BINARY_PATH" --version
else
    echo "Installation test failed"
    exit 1
fi

echo ""
echo "Binary installed as: $BINARY_PATH"

if echo "$BINARY_PATH" | grep -q "\.local/bin"; then
    echo ""
    echo "Add to PATH if needed:"
    echo "  echo 'export PATH=\"\$HOME/.local/bin:\$PATH\"' >> ~/.bashrc && source ~/.bashrc"
fi

if [ "$TARGET_NAME" = "sc-machin" ]; then
    echo ""
    echo "To use as 'sc' command, run:"
    echo "  ln -sf $BINARY_PATH $INSTALL_DIR/sc"
fi

echo ""
echo "Quick start:"
echo "  $TARGET_NAME                     # Bootstrap info (JSON)"
echo "  $TARGET_NAME plugins explore --name=memory"
echo "  $TARGET_NAME plugins install agentmemory-cli"
echo "  $TARGET_NAME commands --query=memory"
