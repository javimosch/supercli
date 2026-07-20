---
name: pkl
description: Use this skill when the user wants configuration-as-code with validation — evaluate Pkl modules, generate JSON/YAML/properties output, or amend existing config files with type-safe schemas.
---

# pkl Plugin

Apple's configuration language with rich validation, IDE support, and multi-format output. Define configs as typed Pkl modules and render them to JSON, YAML, properties, or other formats for apps and tooling.

## Installation

```bash
brew install pkl
# or download from https://github.com/apple/pkl/releases
```

## Basic Usage

```bash
# Evaluate a Pkl module and print JSON to stdout
pkl eval config.pkl

# Write output to a file
pkl eval -o config.json config.pkl

# Format a Pkl file in place
pkl format config.pkl

# Run the Pkl REPL
pkl repl
```

## Common Patterns

```bash
# Evaluate with a specific output format
pkl eval -f yaml config.pkl

# Amend an existing JSON file using a Pkl amend module
pkl eval -m amend config.pkl

# Analyze module dependencies
pkl project resolve

# Check syntax without evaluating
pkl eval --no-cache --trace config.pkl
```

## Usage Examples

- "Convert this Pkl config to JSON for my app"
- "Validate and format my deployment config.pkl"
- "Generate YAML from a typed Pkl module"

## SuperCLI

```bash
sc pkl _ _ eval config.pkl
sc pkl _ _ format config.pkl
sc plugins learn pkl
```
