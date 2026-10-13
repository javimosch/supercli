# cargo-dist Plugin for SuperCLI

[cargo-dist](https://github.com/axodotdev/cargo-dist) (binary `cargo-dist`, invoked as
`cargo dist`) builds and distributes Rust binaries: per-platform release tarballs,
shell/powershell/Homebrew installers, npm wrappers, and a generated GitHub Actions
workflow so `git tag v1.2.3` produces a complete, shippable release.

## Installation

```bash
# Install cargo-dist binary (pick one)
cargo install cargo-dist --locked
# or: brew install axodotdev/tap/dist
# or: mise use cargo-dist

# Install supercli plugin
supercli plugins install ./plugins/cargo-dist
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli cargo-dist self version` | Show version |
| `supercli cargo-dist project init` | Initialize dist in the workspace |
| `supercli cargo-dist release plan` | Print the release plan (JSON) |
| `supercli cargo-dist release build` | Build artifacts locally |
| `supercli cargo-dist ci generate` | Regenerate CI/installers |
| `supercli cargo-dist <any>` | Passthrough to cargo-dist |

## Usage

```bash
# Initialize in a cargo workspace
supercli cargo-dist project init

# Preview the release that a tag would produce
supercli cargo-dist release plan

# Build all artifacts + installers locally
supercli cargo-dist release build
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
