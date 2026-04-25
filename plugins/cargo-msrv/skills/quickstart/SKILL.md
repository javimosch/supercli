---
name: cargo-msrv
description: Use this skill when the user wants to find the Minimum Supported Rust Version (MSRV) for a Rust project, verify Rust version compatibility, or check MSRV for crates.
---

# cargo-msrv Plugin

Cargo subcommand to determine the Minimum Supported Rust Version (MSRV). Verify Rust version compatibility for crates and projects.

## Commands

### MSRV Detection
- `cargo-msrv rust find` — Find the minimum supported Rust version

### Utility
- `cargo-msrv _ _` — Passthrough to cargo msrv CLI

## Usage Examples
- "Find MSRV for this project"
- "Determine minimum Rust version"
- "Verify Rust compatibility"
- "Check MSRV for crate"

## Installation

```bash
cargo install cargo-msrv
```

## Examples

```bash
# Find MSRV for current project
cargo msrv

# Search with version range
cargo msrv --min 1.56.0 --max 1.70.0

# Verify specific version
cargo msrv --verify 1.60.0

# JSON output
cargo msrv --output-format json

# Any cargo msrv command with passthrough
cargo msrv --min 1.50.0
cargo msrv --bisect
cargo msrv --release
```

## Key Features
- **MSRV** - Minimum Rust Version
- **Search** - Auto-detect MSRV
- **Verify** - Verify MSRV
- **Bisect** - Binary search
- **Cargo** - Cargo integration
- **Rust** - Rust compatibility
- **Projects** - Project MSRV
- **Crates** - Crate MSRV
- **Config** - Config support
- **CI** - CI integration

## Notes
- Runs on Rust projects
- Great for MSRV verification
- Supports Cargo workspaces
- Configurable search range
