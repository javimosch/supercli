# tldx - Domain Availability Research Tool

## Overview
tldx is a domain availability research tool with smart keyword-based permutations and fast concurrent RDAP availability checks. Great for finding available domains for projects and startups.

## Quick Start

### Check domain availability
```bash
sc tldx check domains "keyword1 keyword2"
```

### Show only available domains
```bash
sc tldx check available "keyword1 keyword2"
```

### Show available TLD presets
```bash
sc tldx show presets
```

### Passthrough to tldx CLI
```bash
sc tldx _ <tldx-args>
```

## Key Features

- **Smart Permutations**: Keyword-based domain permutations with prefixes and suffixes
- **Regex Support**: Pattern matching for generating domain combinations
- **Fast Checks**: Concurrent RDAP availability checks
- **Multiple Formats**: Output in text, json, json-stream, json-array, csv, grouped, grouped-tld
- **TLD Presets**: Quick selection of common or curated TLD sets
- **Length Filtering**: Optional filtering by domain length

## Installation

```bash
go install github.com/brandonyoungdev/tldx@latest
```

Or via package managers:
- macOS (Homebrew): `brew install tldx`
- Windows (winget): `winget install tldx`
- Arch Linux (AUR): Available in AUR

## Usage Examples

### Basic availability check
```bash
tldx myproject
```

### Check specific TLDs
```bash
tldx myproject --tlds com,io,ai
```

### Add prefixes and suffixes
```bash
tldx project --prefixes get,my,use --suffixes ify,ly
```

### Show only available domains
```bash
tldx myproject --only-available
```

### Output as JSON
```bash
tldx myproject --format json
```

### Use TLD preset
```bash
tldx myproject --tld-preset popular
```

## Notes

- Results stream as they're found for immediate feedback
- Use `--show-stats` to see statistics at the end
- Supports brace expansion on macOS and Linux
- Great for technical founders and indie hackers
