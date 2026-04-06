# RTK Quickstart

RTK (Rust Token Killer) is a CLI proxy that reduces LLM token consumption by 60-90% on common dev commands.

## Prerequisites

- Install RTK:
  ```bash
  curl -fsSL https://raw.githubusercontent.com/rtk-ai/rtk/refs/heads/master/install.sh | sh
  ```
- Add to PATH:
  ```bash
  echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc  # or ~/.zshrc
  source ~/.bashrc
  ```
- Install supercli plugin: `supercli plugins install ./plugins/rtk`
- Setup OpenCode integration: `supercli rtk self init`

## Usage

### Check version
```bash
supercli rtk self version
```

### View token savings
```bash
supercli rtk analytics gain
supercli rtk analytics gain --graph
supercli rtk analytics gain --daily
```

### Initialize OpenCode hook
```bash
supercli rtk self init
```

### Common commands via passthrough

```bash
# Git operations
supercli rtk git status
supercli rtk git diff
supercli rtk git log -n 10
supercli rtk git push

# Directory listing
supercli rtk ls

# File reading
supercli rtk read <file>

# Test runners
supercli rtk test cargo test
supercli rtk test pytest
supercli rtk test npm test

# Build tools
supercli rtk cargo build
supercli rtk tsc
supercli rtk ruff check
```

## How It Works

RTK intercepts command output and applies four strategies:

1. **Smart Filtering** - Removes noise (comments, whitespace, boilerplate)
2. **Grouping** - Aggregates similar items
3. **Truncation** - Keeps relevant context, cuts redundancy
4. **Deduplication** - Collapses repeated log lines

## Privacy

RTK collects anonymous aggregate usage metrics (enabled by default). To opt-out:
```bash
export RTK_TELEMETRY_DISABLED=1
```
