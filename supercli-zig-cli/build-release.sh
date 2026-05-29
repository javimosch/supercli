#!/bin/bash
set -e

echo "Building sc-zig for multiple platforms..."

OUTPUT_DIR="zig-out/release"
mkdir -p "$OUTPUT_DIR"

# Linux amd64
echo "Building for linux-amd64..."
zig build -Dtarget=x86_64-linux --release=small
cp zig-out/bin/sc-zig "$OUTPUT_DIR/sc-zig-linux-amd64"
echo "✓ linux-amd64: $(du -h $OUTPUT_DIR/sc-zig-linux-amd64 | cut -f1)"

# Linux arm64
echo "Building for linux-arm64..."
zig build -Dtarget=aarch64-linux --release=small
cp zig-out/bin/sc-zig "$OUTPUT_DIR/sc-zig-linux-arm64"
echo "✓ linux-arm64: $(du -h $OUTPUT_DIR/sc-zig-linux-arm64 | cut -f1)"

# Darwin amd64
echo "Building for darwin-amd64..."
zig build -Dtarget=x86_64-macos --release=small
cp zig-out/bin/sc-zig "$OUTPUT_DIR/sc-zig-darwin-amd64"
echo "✓ darwin-amd64: $(du -h $OUTPUT_DIR/sc-zig-darwin-amd64 | cut -f1)"

# Darwin arm64
echo "Building for darwin-arm64..."
zig build -Dtarget=aarch64-macos --release=small
cp zig-out/bin/sc-zig "$OUTPUT_DIR/sc-zig-darwin-arm64"
echo "✓ darwin-arm64: $(du -h $OUTPUT_DIR/sc-zig-darwin-arm64 | cut -f1)"

echo ""
echo "All builds complete! Binaries in: $OUTPUT_DIR"
ls -lh "$OUTPUT_DIR"