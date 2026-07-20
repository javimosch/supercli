---
name: chsrc
description: Use this skill when the user wants to switch package manager mirrors or registries — speed up npm, pip, brew, cargo, or apt downloads by pointing to a faster regional mirror.
---

# chsrc Plugin

Cross-platform universal source mirror changer. Switches software sources for package managers and language toolchains (brew, pip, npm, cargo, apt, and more).

## Installation

```bash
brew install chsrc
# or download from GitHub releases
curl -L https://github.com/RubyMetric/chsrc/releases/latest/download/chsrc-x64-linux \
  -o /usr/local/bin/chsrc && chmod +x /usr/local/bin/chsrc
```

## Basic Usage

```bash
# List available mirrors
chsrc list

# Set a mirror for a tool (interactive selection)
chsrc set npm
chsrc set pip
chsrc set brew

# Reset to default mirrors
chsrc reset npm
```

## Usage Examples

- "Switch npm to a faster mirror in China"
- "Change pip registry to Tsinghua mirror"
- "Reset brew sources to default"

## SuperCLI

```bash
sc chsrc source list
sc chsrc source set npm
sc plugins learn chsrc
```
