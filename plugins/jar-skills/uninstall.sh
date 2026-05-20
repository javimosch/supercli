#!/bin/bash

set -e

# jar-skills plugin uninstaller
# Removes rtk-context-memory-graph skill and optionally restores AGENTS.md

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLUGIN_NAME="jar-skills"

# Parse arguments
UNINSTALL_MODE="local"
TARGET_PROJECT=""
RESTORE_AGENTS=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --global)
      UNINSTALL_MODE="global"
      shift
      ;;
    --local)
      UNINSTALL_MODE="local"
      shift
      ;;
    --project)
      TARGET_PROJECT="$2"
      shift 2
      ;;
    --restore-agents)
      RESTORE_AGENTS=true
      shift
      ;;
    --help)
      cat << 'EOF'
jar-skills uninstaller

Usage: ./uninstall.sh [OPTIONS]

Options:
  --global             Uninstall skill from ~/.agents/skills/ (default: local project)
  --local              Uninstall skill from ./.agents/skills/ (default)
  --project <path>     Uninstall from target project (optional)
  --restore-agents     Restore AGENTS.md from backup if it exists (only with --local)
  --help               Show this help message

Examples:
  # Uninstall from global location
  ./uninstall.sh --global

  # Uninstall from local project
  ./uninstall.sh --local

  # Uninstall locally and restore AGENTS.md backup
  ./uninstall.sh --local --restore-agents

EOF
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      echo "Use --help for usage information"
      exit 1
      ;;
  esac
done

# Determine uninstall paths
if [[ "$UNINSTALL_MODE" == "global" ]]; then
  SKILL_DIR="$HOME/.agents/skills/rtk-context-memory-graph"
  echo "Uninstalling rtk-context-memory-graph skill from global location..."
else
  # Try to find project root if not specified
  if [[ -z "$TARGET_PROJECT" ]]; then
    if [[ -d ".git" ]] || [[ -f "package.json" ]] || [[ -f "pyproject.toml" ]]; then
      TARGET_PROJECT="."
    else
      TARGET_PROJECT="${PWD}"
    fi
  fi
  SKILL_DIR="$TARGET_PROJECT/.agents/skills/rtk-context-memory-graph"
  echo "Uninstalling rtk-context-memory-graph skill from local project..."
fi

# Check if skill directory exists
if [[ ! -d "$SKILL_DIR" ]]; then
  echo "✗ Skill directory not found: $SKILL_DIR"
  echo "  Nothing to uninstall"
  exit 0
fi

# Check for SHA256 file and warn if skill has local modifications
SHA256_FILE="$SKILL_DIR/.skill-sha256"
if [[ -f "$SHA256_FILE" ]] && [[ -f "$SKILL_DIR/SKILL.md" ]]; then
  STORED_SHA256=$(cat "$SHA256_FILE")
  CURRENT_SHA256=$(sha256sum "$SKILL_DIR/SKILL.md" | awk '{print $1}')

  if [[ "$STORED_SHA256" != "$CURRENT_SHA256" ]]; then
    echo "⚠ The installed skill has local modifications that will be removed:"
    echo "  Stored SHA256:  $STORED_SHA256"
    echo "  Current SHA256: $CURRENT_SHA256"
    echo ""
  fi
fi

# Remove skill directory
rm -rf "$SKILL_DIR"
echo "✓ Removed skill directory: $SKILL_DIR"

# Restore AGENTS.md backup if requested (local only)
if [[ "$UNINSTALL_MODE" == "local" && "$RESTORE_AGENTS" == "true" ]]; then
  AGENTS_FILE="${TARGET_PROJECT}/AGENTS.md"
  AGENTS_BACKUP="${AGENTS_FILE}.bak"

  if [[ -f "$AGENTS_BACKUP" ]]; then
    mv "$AGENTS_BACKUP" "$AGENTS_FILE"
    echo "✓ Restored AGENTS.md from backup"
  else
    echo "⚠ No AGENTS.md backup found at $AGENTS_BACKUP"
  fi
fi

# Clean up empty .agents/skills directory if local
if [[ "$UNINSTALL_MODE" == "local" ]]; then
  SKILLS_DIR="$TARGET_PROJECT/.agents/skills"
  if [[ -d "$SKILLS_DIR" ]] && [[ -z "$(ls -A "$SKILLS_DIR")" ]]; then
    rmdir "$SKILLS_DIR"
    echo "✓ Removed empty .agents/skills directory"
  fi

  AGENTS_DIR="$TARGET_PROJECT/.agents"
  if [[ -d "$AGENTS_DIR" ]] && [[ -z "$(ls -A "$AGENTS_DIR")" ]]; then
    rmdir "$AGENTS_DIR"
    echo "✓ Removed empty .agents directory"
  fi
fi

echo ""
echo "✓ Uninstall complete!"

if [[ "$UNINSTALL_MODE" == "global" ]]; then
  echo "  Removed global skill installation at: $HOME/.agents/skills/"
else
  echo "  Removed local skill installation at: $SKILL_DIR"
  if [[ "$RESTORE_AGENTS" == "false" ]]; then
    echo ""
    echo "To restore AGENTS.md from backup, run:"
    echo "  ./uninstall.sh --local --project $TARGET_PROJECT --restore-agents"
  fi
fi
