#!/bin/bash
#
# Batch generate plugin files from a data file.
#
# Reads tool definitions from scripts/plugin-data.txt (pipe-delimited format)
# and generates the complete plugin directory structure for each tool:
# - plugin.json (manifest with commands)
# - meta.json (registry metadata)
# - install-guidance.json (install steps)
# - skills/quickstart/SKILL.md (if has_learn=true)
#
# Format: name|binary|description|tags|install_cmd|source|has_learn|cwd
#
# Usage: bash scripts/batch-gen-plugin.sh
#

set -e
DATA_FILE="scripts/plugin-data.txt"
BASE_DIR="plugins"
CREATED=0
SKIPPED=0

while IFS='|' read -r name binary description tags install_cmd source has_learn cwd; do
  # Skip empty lines and comments
  [[ -z "$name" || "$name" == \#* ]] && continue
  
  DIR="$BASE_DIR/$name"
  
  if [ -d "$DIR" ]; then
    echo "  SKIPPED (already exists): $name"
    SKIPPED=$((SKIPPED + 1))
    continue
  fi
  
  echo "  CREATING: $name"
  CREATED=$((CREATED + 1))
  mkdir -p "$DIR/skills/quickstart"
  
  # Determine cwd config
  CWD_JSON=""
  if [ "$cwd" = "invoke_cwd" ]; then
    CWD_JSON=', "cwd": "invoke_cwd"'
  fi
  
  # plugin.json
  cat > "$DIR/plugin.json" << PLUGINEOF
{
  "name": "$name",
  "version": "0.1.0",
  "description": "$description",
  "source": "$source",
  "checks": [{ "type": "binary", "name": "$binary" }],
  "install_guidance": {
    "plugin": "$name",
    "binary": "$binary",
    "check": "which $binary",
    "install_steps": ["$install_cmd", "Verify: $binary --version", "supercli plugins install ./plugins/$name --on-conflict replace --json"]
  },
  "commands": [{
    "namespace": "$name",
    "resource": "_",
    "action": "_",
    "description": "Passthrough to $binary CLI",
    "adapter": "process",
    "adapterConfig": {
      "command": "$binary",
      "passthrough": true,
      "missingDependencyHelp": "Install $name: $install_cmd"$CWD_JSON
    },
    "args": []
  }]
}
PLUGINEOF

  # meta.json
  cat > "$DIR/meta.json" << METAEOF
{
  "description": "$description",
  "tags": [$tags],
  "has_learn": $has_learn
}
METAEOF

  # install-guidance.json
  cat > "$DIR/install-guidance.json" << GUIDANCEEOF
{
  "plugin": "$name",
  "binary": "$binary",
  "check": "which $binary",
  "install_steps": ["$install_cmd", "Verify: $binary --version", "supercli plugins install ./plugins/$name --on-conflict replace --json"]
}
GUIDANCEEOF

  # SKILL.md only if has_learn is true
  if [ "$has_learn" = "true" ]; then
    cat > "$DIR/skills/quickstart/SKILL.md" << SKILLEOF
---
name: $name
description: $description
---
# $name Plugin
$description

## Usage
- \`$name _ _ <args>\` — Run $binary with any arguments
SKILLEOF
  fi

  # Validate JSON
  node -e "JSON.parse(require('fs').readFileSync('$DIR/plugin.json'));" 2>/dev/null || echo "  WARNING: plugin.json invalid!"
  node -e "JSON.parse(require('fs').readFileSync('$DIR/meta.json'));" 2>/dev/null || echo "  WARNING: meta.json invalid!"
  node -e "JSON.parse(require('fs').readFileSync('$DIR/install-guidance.json'));" 2>/dev/null || echo "  WARNING: install-guidance.json invalid!"

done < "$DATA_FILE"

echo ""
echo "Created: $CREATED | Skipped (already exist): $SKIPPED"
echo "Done!"
