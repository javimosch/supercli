#!/bin/sh
# mk-version-json.sh — regenerate docs/version-{zig,machin}-<os>-<arch>.json
# after a GitHub release so the CLIs' `update --check` sees it.
#
# Usage:
#   scripts/mk-version-json.sh zig v0.1.1-zig
#   scripts/mk-version-json.sh machin v0.2.0-machin
#
# For each release asset matching <impl>-<os>-<arch>, downloads it, computes
# sha256, and writes docs/version-<impl>-<os>-<arch>.json:
#   {"ok":true,"version":"<sha256[:12]>","download":"<asset url>","sha256":"<full>"}
# (cli-update-spec version.schema.json shape.)
set -eu

IMPL="$1"
TAG="$2"
REPO="javimosch/supercli"
BIN="sc-$IMPL"
OUT="$(cd "$(dirname "$0")/.." && pwd)/docs"

command -v curl >/dev/null || { echo "need curl"; exit 1; }
command -v gh >/dev/null || { echo "need gh"; exit 1; }

ASSETS=$(gh release view "$TAG" --repo "$REPO" --json assets -q '.assets[].name' | grep "^$BIN-")
[ -n "$ASSETS" ] || { echo "no $BIN-* assets on $TAG"; exit 1; }

TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

for asset in $ASSETS; do
    plat="${asset#"$BIN"-}"                      # e.g. linux-amd64
    url="https://github.com/$REPO/releases/download/$TAG/$asset"
    echo "== $plat: $url"
    curl -fsSL "$url" -o "$TMP/$asset"
    sha=$(sha256sum "$TMP/$asset" | cut -d' ' -f1)
    ver=$(echo "$sha" | cut -c1-12)
    printf '{"ok":true,"version":"%s","download":"%s","sha256":"%s"}\n' \
        "$ver" "$url" "$sha" > "$OUT/version-$IMPL-$plat.json"
    echo "   wrote docs/version-$IMPL-$plat.json  version=$ver"
done
echo "done — commit and push docs/ so raw.githubusercontent.com serves them"
