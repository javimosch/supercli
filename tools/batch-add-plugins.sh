#!/bin/bash
# Batch add plugins: ./batch-add-plugins.sh <plugin_name> <binary> <description> <install_cmd> <github_url> <tags>
# Creates all 4 files for a plugin

NAME="$1"
BINARY="$2"
DESC="$3"
INSTALL="$4"
URL="$5"
TAGS="$6"

DIR="$(dirname "$0")/../plugins/$NAME"
mkdir -p "$DIR/skills/quickstart"

# plugin.json
cat > "$DIR/plugin.json" << JSONEOF
{
  "name": "$NAME",
  "version": "0.1.0",
  "description": "$DESC",
  "source": "$URL",
  "checks": [{"type": "binary", "name": "$BINARY"}],
  "install_guidance": {
    "plugin": "$NAME",
    "binary": "$BINARY",
    "check": "which $BINARY",
    "install_steps": [
      "$INSTALL",
      "Verify: $BINARY --version",
      "supercli plugins install ./plugins/$NAME --on-conflict replace --json"
    ]
  },
  "learn": {"file": "skills/quickstart/SKILL.md"},
  "commands": [
    {
      "namespace": "$NAME",
      "resource": "self",
      "action": "version",
      "description": "Print $NAME version",
      "adapter": "process",
      "adapterConfig": {"command": "$BINARY", "baseArgs": ["--version"], "missingDependencyHelp": "Install $NAME: $INSTALL"},
      "args": []
    },
    {
      "namespace": "$NAME",
      "resource": "_",
      "action": "_",
      "description": "Passthrough to $BINARY CLI",
      "adapter": "process",
      "adapterConfig": {"command": "$BINARY", "passthrough": true, "missingDependencyHelp": "Install $NAME: $INSTALL"},
      "args": []
    }
  ]
}
JSONEOF

# meta.json
cat > "$DIR/meta.json" << METAEOF
{
  "description": "$DESC",
  "tags": ["$NAME", "$TAGS"],
  "has_learn": true
}
METAEOF

# install-guidance.json
cat > "$DIR/install-guidance.json" << INSTEOF
{
  "plugin": "$NAME",
  "binary": "$BINARY",
  "check": "which $BINARY",
  "install_steps": [
    "$INSTALL",
    "Verify: $BINARY --version",
    "supercli plugins install ./plugins/$NAME --on-conflict replace --json"
  ]
}
INSTEOF

# SKILL.md
SKILL_NAME="$NAME"
cat > "$DIR/skills/quickstart/SKILL.md" << SKILLEOF
---
name: $SKILL_NAME
description: Use this skill when the user wants to use the $BINARY command-line tool.
---

# $NAME Plugin

$DESC

## Commands
- \`$NAME self version\` — Print version
- \`$NAME _ _\` — Passthrough to $BINARY

## Installation
\`\`\`bash
$INSTALL
\`\`\`
SKILLEOF

echo "Created plugin: $NAME"
