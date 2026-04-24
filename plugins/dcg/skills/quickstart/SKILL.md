---
name: dcg
description: Use this skill when the user wants to evaluate, explain, or scan commands for safety issues, block dangerous git/shell commands, or manage command guard policies.
---

# dcg Plugin

Destructive Command Guard (dcg) blocks dangerous git and shell commands from being executed by agents. Provides headless test, explain, scan, and exception management with structured JSON output.

## Commands

### Command Safety
- `dcg command test` — Evaluate whether a command would be allowed or blocked
- `dcg command explain` — Explain why a command is blocked or allowed

### Repository Scanning
- `dcg repo scan` — Scan repository for destructive commands embedded in files

### Exceptions
- `dcg exception allow-once` — Create a temporary exception for a blocked command

### Configuration
- `dcg config packs` — List enabled rule packs
- `dcg config allowlist` — Manage allowlist entries

### Utility
- `dcg self version` — Print dcg version
- `dcg _ _` — Passthrough to dcg CLI

## Usage Examples
- "Would git reset --hard be blocked?"
- "Explain why rm -rf / is blocked"
- "Scan this repo for dangerous commands in scripts"
- "Test if kubectl delete namespace prod would be allowed"
- "List all enabled rule packs"

## Installation

```bash
curl -fsSL "https://raw.githubusercontent.com/Dicklesworthstone/destructive_command_guard/main/install.sh?$(date +%s)" | bash -s -- --easy-mode
```

## Examples

```bash
# Test a command
dcg command test "rm -rf ./build"
dcg command test --format json "kubectl delete namespace prod"

# Test with a specific config
dcg command test --config .dcg.prod.toml "docker system prune"

# Test with extra packs enabled
dcg command test --with-packs containers.docker,database.postgresql "docker system prune"

# Explain a blocked command
dcg command explain "git reset --hard HEAD"
dcg command explain --format json "git reset --hard HEAD"
dcg command explain --verbose "rm -rf /tmp/build"

# Scan repository for destructive commands
dcg repo scan
dcg repo scan --format json
dcg repo scan ./my-project --format json

# Create a temporary exception
dcg exception allow-once ab12
dcg exception allow-once ab12 --single-use

# List enabled packs
dcg config packs --verbose
dcg config packs --format json

# List allowlist entries
dcg config allowlist list
```

## Key Features
- Block dangerous git commands (force push, destructive reset, etc.)
- Block dangerous shell commands (rm -rf, recursive deletes, etc.)
- 40+ modular rule packs (core, containers, databases, cloud providers, etc.)
- Pattern matching with whitelist and blacklist
- JSON and token-efficient (toon) output formats
- CI/CD integration with exit codes (0=allow, 1=block)
- Repository scanning for destructive commands in committed files
- Temporary allow-once exceptions with short codes
- Configurable via .dcg.toml or DCG_CONFIG environment variable
- Sub-microsecond evaluation latency with SIMD-accelerated rejection

## Output Formats

- **pretty** — Human-readable output with context and suggestions (default)
- **json** — Structured payload for scripts and CI pipelines
- **toon** — Token-efficient encoding for agent-to-agent pipelines

## Notes
- `dcg test` exits with code 0 if allowed, 1 if blocked
- Use `--format json` for machine parsing in CI pipelines
- Add `--no-color` if parsers choke on ANSI output
- Config precedence: DCG_CONFIG env > project .dcg.toml > user/system config
