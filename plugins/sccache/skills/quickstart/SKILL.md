---
name: sccache
description: Use this skill when the user wants to manage a shared compiler cache with cloud storage support.
---

# sccache Plugin

sccache is a compiler caching tool (like ccache) with support for local and cloud storage backends (S3, GCS, Azure, Redis).

## Commands

### Version Info
- `sccache self version` — Print sccache version

### Cache Management
- `sccache stats show` — Show cache statistics (hits, misses, size)
- `sccache cache clear` — Clear the entire cache

### Server Management
- `sccache server start` — Start the sccache daemon
- `sccache server stop` — Stop the sccache daemon

### Passthrough
- `sccache _ _` — Pass raw arguments to sccache binary

## Usage Examples

```bash
# Check cache stats
sc sccache stats show --json

# Clear cache
sc sccache cache clear

# Use sccache as compiler wrapper
export RUSTC_WRAPPER=sccache
cargo build
sc sccache stats show --json
```
