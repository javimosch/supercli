# RTK Plugin for SuperCLI

[RTK](https://github.com/rtk-ai/rtk) (Rust Token Killer) is a high-performance CLI proxy that reduces LLM token consumption by 60-90% on common dev commands.

## Installation

```bash
# Install RTK binary
curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/refs/heads/master/install.sh | sh

# Add to PATH
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc  # or ~/.zshrc
source ~/.bashrc

# Install supercli plugin
supercli plugins install ./plugins/rtk

# Setup OpenCode integration
supercli rtk self init
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli rtk self version` | Show RTK version |
| `supercli rtk self init` | Initialize OpenCode hook |
| `supercli rtk analytics gain` | Token savings statistics |
| `supercli rtk analytics gain --graph` | ASCII graph of savings |
| `supercli rtk <any>` | Passthrough to RTK CLI |

## Common RTK Commands

```bash
# Git operations
supercli rtk git status
supercli rtk git diff
supercli rtk git log -n 10

# File operations
supercli rtk ls
supercli rtk read <file>

# Test output compression
supercli rtk test cargo test
supercli rtk test pytest

# Build & lint
supercli rtk cargo build
supercli rtk tsc
```

## Token Savings Examples

| Operation | Standard | With RTK | Savings |
|-----------|----------|----------|---------|
| `git status` | ~2,000 tokens | ~200 tokens | -80% |
| `cargo test` | ~25,000 tokens | ~2,500 tokens | -90% |
| `ls -la` | ~800 tokens | ~150 tokens | -80% |

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
