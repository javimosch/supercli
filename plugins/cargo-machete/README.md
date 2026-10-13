# cargo-machete Plugin for SuperCLI

[cargo-machete](https://github.com/bnjjj/cargo-machete) finds unused dependencies
in Rust projects — it scans your source for imports of each declared crate and
reports the dead weight. Works on workspaces, runs in CI, and can auto-remove
findings with `--fix`.

## Installation

```bash
cargo install cargo-machete
# or: cargo binstall cargo-machete
# or: brew install cargo-machete

# Install supercli plugin
supercli plugins install ./plugins/cargo-machete
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli cargo-machete self version` | Show version |
| `supercli cargo-machete deps scan` | Scan crate/workspace for unused deps |
| `supercli cargo-machete deps fix` | Remove unused deps from Cargo.toml |
| `supercli cargo-machete <any>` | Passthrough to cargo-machete CLI |

## Usage

```bash
# Scan current workspace (run inside a Rust project)
supercli cargo-machete deps scan

# Scan a specific path
supercli cargo-machete deps scan ./crates/my-crate

# Auto-remove unused deps
supercli cargo-machete deps fix
```

Note: exit code is non-zero when unused deps are found — that *is* the report.

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
