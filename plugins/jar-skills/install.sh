#!/bin/bash

set -e

# jar-skills plugin installer
# Installs rtk-context-memory-graph skill and updates AGENTS.md

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLUGIN_NAME="jar-skills"

# Parse arguments
INSTALL_MODE="local"  # default to local
TARGET_PROJECT=""
FORCE_INSTALL=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --global)
      INSTALL_MODE="global"
      shift
      ;;
    --local)
      INSTALL_MODE="local"
      shift
      ;;
    --project)
      TARGET_PROJECT="$2"
      shift 2
      ;;
    --force)
      FORCE_INSTALL=true
      shift
      ;;
    --help)
      cat << 'EOF'
jar-skills installer

Usage: ./install.sh [OPTIONS]

Options:
  --global          Install skill globally at ~/.agents/skills/ (default: local to project)
  --local           Install skill locally at ./.agents/skills/ (default)
  --project <path>  Update AGENTS.md in target project (optional)
  --force           Skip SHA256 check and force installation (overwrite local changes)
  --help            Show this help message

Examples:
  # Install globally
  ./install.sh --global

  # Install locally in current project
  ./install.sh --local

  # Force install (overwrite local modifications)
  ./install.sh --global --force

  # Install globally and update AGENTS.md in specific project
  ./install.sh --global --project ~/myproject

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

# Determine installation paths
if [[ "$INSTALL_MODE" == "global" ]]; then
  SKILL_DIR="$HOME/.agents/skills/rtk-context-memory-graph"
  echo "Installing rtk-context-memory-graph skill globally..."
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
  echo "Installing rtk-context-memory-graph skill locally at: $SKILL_DIR"
fi

# Calculate SHA256 of new SKILL.md
NEW_SHA256=$(sha256sum "$SCRIPT_DIR/SKILL.md" | awk '{print $1}')
SHA256_FILE="$SKILL_DIR/.skill-sha256"

# Check if skill is already installed
if [[ -f "$SKILL_DIR/SKILL.md" ]]; then
  CURRENT_SHA256=$(sha256sum "$SKILL_DIR/SKILL.md" | awk '{print $1}')

  if [[ "$NEW_SHA256" == "$CURRENT_SHA256" ]]; then
    echo "ℹ Skill already installed (SHA256 match)"
    echo "✓ Installation complete (no changes needed)"
    exit 0
  else
    # SHA mismatch - local version differs from plugin version
    if [[ "$FORCE_INSTALL" != "true" ]]; then
      echo ""
      echo "⚠ WARNING: Installed skill differs from plugin version"
      echo ""
      echo "The installed SKILL.md has been modified locally:"
      echo "  Plugin version SHA256:    $NEW_SHA256"
      echo "  Installed version SHA256: $CURRENT_SHA256"
      echo ""
      echo "This suggests you've improved the skill locally and should"
      echo "consider updating the plugin SKILL.md with your changes."
      echo ""
      echo "To proceed anyway, use --force flag:"
      echo "  ./install.sh --force"
      echo ""
      exit 1
    else
      echo "⚠ SHA256 mismatch detected, but forcing installation..."
    fi
  fi
fi

# Create skill directory
mkdir -p "$SKILL_DIR"

# Copy SKILL.md file
cp "$SCRIPT_DIR/SKILL.md" "$SKILL_DIR/SKILL.md"
echo "✓ Copied SKILL.md to $SKILL_DIR/"

# Store SHA256 for future checks
echo "$NEW_SHA256" > "$SHA256_FILE"
echo "✓ Recorded SKILL.md SHA256 checksum"

# Update AGENTS.md if project is specified or local mode detected
if [[ "$INSTALL_MODE" == "local" && -n "$TARGET_PROJECT" ]] || [[ "$INSTALL_MODE" == "local" ]]; then
  AGENTS_FILE="${TARGET_PROJECT}/AGENTS.md"

  if [[ -f "$AGENTS_FILE" ]]; then
    # Backup existing AGENTS.md
    cp "$AGENTS_FILE" "${AGENTS_FILE}.bak"
    echo "✓ Backed up existing AGENTS.md to ${AGENTS_FILE}.bak"
  fi

  # Create/update AGENTS.md from template
  sed "s|LOCAL_SKILL_PATH|./.agents/skills/rtk-context-memory-graph|g; s|GLOBAL_SKILL_PATH|~/.agents/skills/rtk-context-memory-graph|g" \
    "$SCRIPT_DIR/AGENTS.md.template" > "$AGENTS_FILE"
  echo "✓ Updated AGENTS.md at $AGENTS_FILE"
fi

if [[ "$INSTALL_MODE" == "global" ]]; then
  echo ""
  echo "✓ Installation complete!"
  echo "  Skill installed globally at: $SKILL_DIR"
  echo ""
  echo "To use this skill in your projects, either:"
  echo "  1. Run 'jar-skills --local --project /path/to/project' to copy locally"
  echo "  2. Let agents find the global installation at ~/.agents/skills/"
  echo ""
  echo "View the skill documentation:"
  echo "  cat $SKILL_DIR/SKILL.md"
else
  echo ""
  echo "✓ Installation complete!"
  echo "  Skill installed locally at: $SKILL_DIR"
  echo "  AGENTS.md updated at: $AGENTS_FILE"
  echo ""
  echo "View the skill documentation:"
  echo "  cat $SKILL_DIR/SKILL.md"
fi
