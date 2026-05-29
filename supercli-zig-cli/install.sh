#!/bin/bash
set -e

VERSION="v0.1.0-zig"
REPO="javimosch/supercli"
REPLACE_SC=false
CUSTOM_PATH=""

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --replace)
            REPLACE_SC=true
            shift
            ;;
        --path)
            CUSTOM_PATH="$2"
            shift 2
            ;;
        --path=*)
            CUSTOM_PATH="${1#*=}"
            shift
            ;;
        *)
            echo "Unknown option: $1"
            echo "Usage: $0 [--replace] [--path <dir>]"
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
    Linux)  OS_NAME="linux" ;;
    Darwin) OS_NAME="darwin" ;;
    *)
        echo "Unsupported OS: $OS"
        exit 1
        ;;
esac

case "$ARCH" in
    x86_64)       ARCH_NAME="amd64" ;;
    aarch64|arm64) ARCH_NAME="arm64" ;;
    *)
        echo "Unsupported architecture: $ARCH"
        exit 1
        ;;
esac

BINARY_NAME="sc-zig-${OS_NAME}-${ARCH_NAME}"
echo "Detected: $OS_NAME-$ARCH_NAME"
echo "Downloading: $BINARY_NAME"
echo ""

# Determine install directory and binary name
if [ -n "$CUSTOM_PATH" ]; then
    # Explicit path provided — always use it, no sudo needed
    INSTALL_DIR="$CUSTOM_PATH"
    INSTALL_CMD="mv"  # no sudo
    TARGET_NAME="sc-zig"
elif [ "$REPLACE_SC" = true ]; then
    # Replace mode: try /usr/local/bin/sc, fall back to ~/.local/bin/sc
    TARGET_NAME="sc"
    if [ -w "/usr/local/bin" ]; then
        INSTALL_DIR="/usr/local/bin"
        INSTALL_CMD="mv"
    elif sudo -n true 2>/dev/null; then
        INSTALL_DIR="/usr/local/bin"
        INSTALL_CMD="sudo mv"
    else
        INSTALL_DIR="$HOME/.local/bin"
        INSTALL_CMD="mv"
        echo "Note: No sudo available, installing to $INSTALL_DIR"
    fi
else
    # Default: install as sc-zig
    TARGET_NAME="sc-zig"
    # Check if sc already exists
    if command -v sc &> /dev/null; then
        echo "Note: 'sc' already exists at $(which sc)"
        echo "Installing as 'sc-zig' (use --replace to replace it)"
    fi
    # Try /usr/local/bin, fall back to ~/.local/bin (no sudo required)
    if [ -w "/usr/local/bin" ]; then
        INSTALL_DIR="/usr/local/bin"
        INSTALL_CMD="mv"
    elif sudo -n true 2>/dev/null; then
        INSTALL_DIR="/usr/local/bin"
        INSTALL_CMD="sudo mv"
    else
        INSTALL_DIR="$HOME/.local/bin"
        INSTALL_CMD="mv"
        echo "Note: No sudo available, installing to $INSTALL_DIR (no password needed)"
    fi
fi

BINARY_PATH="${INSTALL_DIR}/${TARGET_NAME}"

# Ensure install dir exists
mkdir -p "$INSTALL_DIR"

# Download
DOWNLOAD_URL="https://github.com/${REPO}/releases/download/${VERSION}/${BINARY_NAME}"
echo "Downloading from: $DOWNLOAD_URL"
curl -fsSL "$DOWNLOAD_URL" -o /tmp/sc-zig-temp
chmod +x /tmp/sc-zig-temp

# Install
echo "Installing to: $BINARY_PATH"
$INSTALL_CMD /tmp/sc-zig-temp "$BINARY_PATH"

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
echo "Binary installed as: $BINARY_PATH"

# PATH hint if installed to ~/.local/bin
if echo "$BINARY_PATH" | grep -q "\.local/bin"; then
    echo ""
    echo "Add to PATH if needed:"
    echo "  echo 'export PATH=\"\$HOME/.local/bin:\$PATH\"' >> ~/.bashrc && source ~/.bashrc"
fi

if [ "$TARGET_NAME" = "sc-zig" ]; then
    echo ""
    echo "To use as 'sc' command, run:"
    echo "  ln -sf $BINARY_PATH $INSTALL_DIR/sc"
fi

echo ""
echo "Quick start:"
echo "  $TARGET_NAME --json              # Bootstrap info"
echo "  $TARGET_NAME plugins explore --name memory --json"
echo "  $TARGET_NAME plugins install agentmemory-cli"
echo "  $TARGET_NAME commands --json     # List all commands"
echo ""
echo "To revert to Node.js version:"
echo "  npm uninstall -g supercli"
echo "  npm install -g superacli"