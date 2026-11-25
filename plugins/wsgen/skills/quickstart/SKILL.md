---
name: wsgen
description: Use this skill when the user wants to use wsgen, OpenJDK Development Kit (JDK) (headless).
---

# wsgen Plugin

wsgen — OpenJDK Development Kit (JDK) (headless).

## Commands
- `wsgen <resource> <action>` — Execute wsgen commands
- `wsgen self version` — Print wsgen version
- `wsgen _ _` — Passthrough to wsgen CLI

## Usage Examples
- "wsgen --help"
- "wsgen self version"

## Installation
```bash
apt-get install openjdk-8-jdk-headless 2>/dev/null || which wsgen
```

## Key Features
- CLI-based tool
- Scriptable and automatable
- Pipeline-ready output
- system based
