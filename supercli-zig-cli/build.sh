#!/usr/bin/env bash
# build.sh — Build sc-zig (SuperCLI clean-room Zig implementation)
set -e

cd "$(dirname "$0")"

echo "=== Building sc-zig (ReleaseSmall) ==="
zig build -Doptimize=ReleaseSmall
echo "Binary: zig-out/bin/sc-zig"
ls -lh zig-out/bin/sc-zig

echo ""
echo "=== Cross-compile targets ==="

echo "linux/amd64:"
zig build -Doptimize=ReleaseSmall -Dtarget=x86_64-linux-musl
cp zig-out/bin/sc-zig sc-zig-linux-amd64
ls -lh sc-zig-linux-amd64

echo "linux/arm64:"
zig build -Doptimize=ReleaseSmall -Dtarget=aarch64-linux-musl
cp zig-out/bin/sc-zig sc-zig-linux-arm64
ls -lh sc-zig-linux-arm64

echo "darwin/amd64:"
zig build -Doptimize=ReleaseSmall -Dtarget=x86_64-macos
cp zig-out/bin/sc-zig sc-zig-darwin-amd64
ls -lh sc-zig-darwin-amd64

echo "darwin/arm64:"
zig build -Doptimize=ReleaseSmall -Dtarget=aarch64-macos
cp zig-out/bin/sc-zig sc-zig-darwin-arm64
ls -lh sc-zig-darwin-arm64

echo ""
echo "=== Done ==="
