#!/usr/bin/env bash
# Wrapper for katana crawl: first arg is URL, rest are passthrough to katana
URL="$1"
shift
exec katana -u "$URL" -silent "$@" 2>&1
