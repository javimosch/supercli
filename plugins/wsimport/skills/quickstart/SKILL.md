---
name: wsimport
description: Use this skill when the user wants to use wsimport, OpenJDK Development Kit (JDK) (headless).
---

# wsimport Plugin

wsimport — OpenJDK Development Kit (JDK) (headless).

## Commands
- `wsimport <resource> <action>` — Execute wsimport commands
- `wsimport self version` — Print wsimport version
- `wsimport _ _` — Passthrough to wsimport CLI

## Usage Examples
- "wsimport --help"
- "wsimport self version"

## Installation
```bash
apt-get install openjdk-8-jdk-headless 2>/dev/null || which wsimport
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
