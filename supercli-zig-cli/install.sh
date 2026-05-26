#!/bin/bash
set -e

VERSION="v0.1.0-zig"
REPO="javimosch/supercli"
REPLACE_SC=false

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --replace)
            REPLACE_SC=true
            shift
            ;;
        *)
            echo "Unknown option: $1"
            echo "Usage: $0 [--replace]"
            exit 1
            ;;
    esac
done

echo "SuperCLI Zig Installer"
echo "======================="
echo ""

# Detect OS and architecture
OS="$(uname -s)"
ARCH="$(uname -m)"

case "$OS" in
    Linux)
        OS_NAME="linux"
        ;;
    Darwin)
        OS_NAME="darwin"
        ;;
    *)
        echo "Unsupported OS: $OS"
        exit 1
        ;;
esac

case "$ARCH" in
    x86_64)
        ARCH_NAME="amd64"
        ;;
    aarch64|arm64)
        ARCH_NAME="arm64"
        ;;
    *)
        echo "Unsupported architecture: $ARCH"
        exit 1
        ;;
esac

BINARY_NAME="sc-zig-${OS_NAME}-${ARCH_NAME}"
INSTALL_DIR="/usr/local/bin"
BINARY_PATH="${INSTALL_DIR}/sc-zig"

echo "Detected: $OS_NAME-$ARCH_NAME"
echo "Downloading: $BINARY_NAME"
echo ""

# Check if sc already exists
if command -v sc &> /dev/null; then
    echo "Warning: 'sc' command already exists at $(which sc)"
    if [ "$REPLACE_SC" = false ]; then
        echo "Installing as 'sc-zig' to avoid conflict."
        echo "Use --replace flag to replace the existing 'sc' command."
        BINARY_PATH="${INSTALL_DIR}/sc-zig"
    else
        echo "Replacing with Zig version (--replace flag set)."
        BINARY_PATH="${INSTALL_DIR}/sc"
    fi
else
    BINARY_PATH="${INSTALL_DIR}/sc-zig"
fi

# Download
DOWNLOAD_URL="https://github.com/${REPO}/releases/download/${VERSION}/${BINARY_NAME}"
echo "Downloading from: $DOWNLOAD_URL"
curl -fsSL "$DOWNLOAD_URL" -o /tmp/sc-zig-temp
chmod +x /tmp/sc-zig-temp

# Install
echo "Installing to: $BINARY_PATH"
sudo mv /tmp/sc-zig-temp "$BINARY_PATH"

# Test installation
echo ""
echo "Testing installation..."
if "$BINARY_PATH" --version > /dev/null 2>&1; then
    echo "✓ Installation successful!"
    echo ""
    echo "Version info:"
    "$BINARY_PATH" --version
else
    echo "✗ Installation test failed"
    exit 1
fi

echo ""
echo "To use as 'sc' command, run:"
if [ "$BINARY_PATH" = "${INSTALL_DIR}/sc-zig" ]; then
    echo "  sudo ln -sf ${INSTALL_DIR}/sc-zig ${INSTALL_DIR}/sc"
    echo ""
    echo "Or run: sc-zig install-as-sc"
else
    echo "  Already installed as 'sc'"
fi

echo ""
echo "To update plugins:"
echo "  sc plugins update"
echo ""
echo "To revert to Node.js version:"
echo "  npm uninstall -g supercli"
echo "  npm install -g supercli"