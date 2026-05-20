# jar-skills Plugin

**Author:** Javier Arancibia  
**Version:** 1.0.0  
**Type:** supercli plugin for token-optimized codebase analysis and knowledge management

---

## Overview

The **jar-skills** plugin provides the **rtk-context-memory-graph** skill, a comprehensive system for efficient codebase analysis combining four complementary tools:

- **rtk** — CLI proxy (60-90% token reduction) for direct command usage
- **context-mode** — MCP server (98% token reduction) for programmatic workflows  
- **agentmemory-cli** — Persistent memory for AI agents, save/search/recall findings across sessions
- **graphify** — Knowledge graph builder for persistent structural analysis

## Installation

### Install the plugin

```bash
# Via supercli
sc plugins install jar-skills

# Or manually
git clone https://github.com/jarancibia/jar-skills ~/ai/supercli/plugins/jar-skills
cd ~/ai/supercli/plugins/jar-skills
./install.sh --global
```

### Install the skill

The plugin provides install/uninstall actions for flexible skill deployment.

#### SHA256 Change Detection

When you install the skill, a `.skill-sha256` checksum file is created. This enables:
- **Duplicate install detection** — Skip reinstalling if version hasn't changed
- **Local modification detection** — Warn if you've improved the skill locally
- **Developer feedback** — Alert you to update the plugin when you make improvements

If the installed SKILL.md differs from the plugin version:
```bash
⚠ WARNING: Installed skill differs from plugin version
  Plugin version SHA256:    4b82640...
  Installed version SHA256: 7ee219e...

This suggests you've improved the skill locally and should
consider updating the plugin SKILL.md with your changes.

To proceed anyway, use --force flag:
  ./install.sh --force
```

**Option 1: Global installation** (recommended for multi-project use)
```bash
cd ~/ai/supercli/plugins/jar-skills
./install.sh --global
```

This installs the skill at `~/.agents/skills/rtk-context-memory-graph/`, making it available system-wide to all agents.

**Option 2: Local installation** (recommended for project-specific setup)
```bash
cd ~/ai/supercli/plugins/jar-skills
./install.sh --local --project ~/path/to/project
```

This installs the skill at `~/path/to/project/.agents/skills/rtk-context-memory-graph/` and updates `AGENTS.md`.

**Option 3: Both** (maximum availability)
```bash
# Install globally first
./install.sh --global

# Then install locally in projects that need it
./install.sh --local --project ~/my-project-1
./install.sh --local --project ~/my-project-2
```

Agents will prefer the global installation if both exist.

## Usage

### Quick Start

```bash
# Explore project structure with rtk (token-efficient)
rtk find . -type f -name "*.js" | head -20
rtk ls -la
rtk git log -n 10

# Search codebase with SC utility plugins (via supercli)
sc ripgrep "function.*async" src/
sc gocloc . --not-match-d="node_modules|dist|build"
sc todo-scan src/
sc project-map . --all

# Save findings to persistent memory
sc agentmemory-cli memory save --text "Main entry points: src/index.ts, src/cli.ts" --project myapp --tags architecture

# Analyze structure with graphify
graphify . --no-viz

# Query your knowledge base
sc agentmemory-cli memory search --query "architecture" --project myapp --limit 5
```

### Installation Examples

#### Example 1: Install globally for team use
```bash
# Install skill globally (available to all agents/projects)
cd ~/ai/supercli/plugins/jar-skills
./install.sh --global

# Now any agent can find the skill at ~/.agents/skills/rtk-context-memory-graph
# Share this instruction with your team
```

#### Example 2: Install in specific project
```bash
# Install skill locally in a project
cd ~/ai/supercli/plugins/jar-skills
./install.sh --local --project ~/my-monorepo

# This updates ~/my-monorepo/AGENTS.md and creates ~/.agents/skills/rtk-context-memory-graph
```

#### Example 3: Mixed setup (global + local project overrides)
```bash
# Install globally first
./install.sh --global

# Then customize per-project with local installations
./install.sh --local --project ~/critical-project
./install.sh --local --project ~/experimental-project

# Agents prefer local if both exist
```

## Uninstallation

### Remove global installation
```bash
cd ~/ai/supercli/plugins/jar-skills
./uninstall.sh --global
```

### Remove local installation from a project
```bash
cd ~/ai/supercli/plugins/jar-skills
./uninstall.sh --local --project ~/path/to/project
```

### Remove local installation and restore AGENTS.md backup
```bash
cd ~/ai/supercli/plugins/jar-skills
./uninstall.sh --local --project ~/path/to/project --restore-agents
```

This restores the previous AGENTS.md if a backup exists (created during install).

## File Structure

```
~/ai/supercli/plugins/jar-skills/
├── plugin.json              # Plugin manifest
├── install.sh              # Installation script (flexible local/global)
├── uninstall.sh            # Uninstallation script
├── SKILL.md                # Full skill documentation
├── AGENTS.md.template      # Template for project AGENTS.md
├── README.md               # This file
```

## What Gets Installed

### Skill Directory
- **Location (global):** `~/.agents/skills/rtk-context-memory-graph/`
- **Location (local):** `./.agents/skills/rtk-context-memory-graph/`
- **Contents:** 
  - `SKILL.md` — Complete documentation with examples and decision matrices

### AGENTS.md Updates (local only)
- **Location:** `./AGENTS.md` (in the target project)
- **Backup:** `./AGENTS.md.bak` (created before update)
- **Content:** Guidance on when/how to use the skill in the project

## Developer Workflow: Improving the Skill

When working locally and improving the skill, the SHA256 detection helps you track updates:

### 1. Work on the skill locally
```bash
# Edit your installed skill
nano ~/.agents/skills/rtk-context-memory-graph/SKILL.md

# Test improvements in a project
cd ~/my-project
sc rtk ls -la  # Use the improved skill
```

### 2. Run install again (detects changes)
```bash
cd ~/ai/supercli/plugins/jar-skills
./install.sh --local
# → Detects SHA256 mismatch
# → Warns: "You've improved the skill locally!"
# → Suggests updating the plugin
```

### 3. Update the plugin with your improvements
```bash
# Copy your improvements back to the plugin
cp ~/.agents/skills/rtk-context-memory-graph/SKILL.md \
   ~/ai/supercli/plugins/jar-skills/SKILL.md

# Commit the improved version
cd ~/ai/supercli/plugins/jar-skills
git add SKILL.md
git commit -m "improve: enhance SKILL.md with better error handling"
```

### 4. Reinstall (now matches new plugin version)
```bash
./install.sh --local
# → SHA256 matches
# → "Skill already installed (SHA256 match)"
# → No changes needed
```

### Force Override (When Needed)
If you need to discard local improvements and use the plugin version:
```bash
./install.sh --local --force
# ⚠ Overwrites local improvements
# → Updates SKILL.md to match plugin version
# → Updates .skill-sha256 checksum
```

## Configuration

### Install Mode Arguments

| Argument | Description |
|----------|-------------|
| `--global` | Install skill globally at `~/.agents/skills/` |
| `--local` | Install skill locally at `./.agents/skills/` (default) |
| `--project <path>` | Specify target project directory |
| `--force` | Skip SHA256 check and force installation (overwrite local changes) |
| `--help` | Show help for install/uninstall |

### Uninstall Mode Arguments

| Argument | Description |
|----------|-------------|
| `--global` | Uninstall from global location |
| `--local` | Uninstall from local project (default) |
| `--project <path>` | Specify target project directory |
| `--restore-agents` | Restore AGENTS.md from backup (local only) |
| `--help` | Show help for uninstall |

## Integration with Agents

### Claude Code / OpenCode
Agents automatically detect the skill at:
- Local: `./.agents/skills/rtk-context-memory-graph/SKILL.md`
- Global: `~/.agents/skills/rtk-context-memory-graph/SKILL.md`

### Supercli Integration
Use the installed tools directly:

```bash
# Via rtk plugin (if installed)
sc rtk git log -n 10
sc rtk test pytest

# Via SC utility plugins (built-in)
sc ripgrep "pattern" src/
sc gocloc . --not-match-d="node_modules"
sc todo-scan src/

# Via agentmemory-cli plugin (if installed)
sc agentmemory-cli memory save --text "Finding" --project myapp --tags tag1

# Via graphify skill (if available)
sc graphify . --no-viz
```

### MCP Server Integration
If context-mode is configured as an MCP server in supercli:

```bash
sc mcp call --mcp-server context-mode --tool ctx_batch_execute \
  --input-json '{"commands":[{"label":"Git","command":"git log -n 10"}],"queries":["Recent commits"]}'
```

## Typical Workflow

### Phase 1: Exploration
```bash
# Quick structure overview with SC utility plugins
sc ripgrep "TODO\|FIXME" src/
sc project-map . --all | head -40

# Efficient directory listing with rtk
sc rtk find . -type f | wc -l
sc rtk ls -la src/
```

### Phase 2: Analysis
```bash
# Count lines by language
sc gocloc . --not-match-d="node_modules|dist"

# Find complexity hotspots
sc complexity src/ --json

# Build structural knowledge
graphify . --no-viz
```

### Phase 3: Persistence
```bash
# Save key findings
sc agentmemory-cli memory save --text "Main entry: src/index.ts" \
  --project myapp --tags architecture

# Save architectural insights
sc agentmemory-cli memory save --text "12 files depend on auth module" \
  --project myapp --tags refactoring
```

### Phase 4: Recall (next session)
```bash
# Search previous findings
sc agentmemory-cli memory search --query "architecture" --project myapp

# Verify with fresh data
sc rtk git log --oneline -20
```

## Troubleshooting

### "Skill directory not found" on uninstall
The skill was already removed or never installed. This is safe — uninstall will report success.

### AGENTS.md backup exists after uninstall
Use `--restore-agents` flag to restore the previous version:
```bash
./uninstall.sh --local --restore-agents
```

### Global skill not detected by agents
Ensure the skill is installed at the correct location:
```bash
ls ~/.agents/skills/rtk-context-memory-graph/SKILL.md
```

If missing, reinstall:
```bash
./install.sh --global
```

### Empty `.agents/` directory after uninstall
The uninstall script automatically removes empty parent directories. You can safely ignore these or clean up manually:
```bash
rm -rf .agents/
```

### Install fails with "WARNING: Installed skill differs from plugin version"

This means you've modified the skill locally and it differs from the plugin version.

**Option 1: Use the improved local version**
- Keep working with your improvements
- When done, copy improvements back to the plugin (see Developer Workflow section)
- Commit plugin update

**Option 2: Use the plugin version**
```bash
# Force install to discard local changes
./install.sh --force
```

**Option 3: Manually check differences**
```bash
# View both checksums
sha256sum ~/.agents/skills/rtk-context-memory-graph/SKILL.md
cat ~/.agents/skills/rtk-context-memory-graph/.skill-sha256

# If they differ, your local version has modifications
```

### Uninstall warns about local modifications
This is informational—the script is warning you before removing modified code:
```bash
⚠ The installed skill has local modifications that will be removed:
  Stored SHA256:  4b82640...
  Current SHA256: 7ee219e...
```

If you want to preserve your changes, back them up first:
```bash
cp ~/.agents/skills/rtk-context-memory-graph/SKILL.md ~/SKILL.md.backup
./uninstall.sh --local
```

## Requirements

- **supercli** ≥ 1.0.0 (for plugin installation)
- **bash** ≥ 4.0 (for install/uninstall scripts)
- Optional tools (install separately as needed):
  - **rtk** — For CLI token optimization
  - **context-mode** — For MCP integration
  - **agentmemory-cli** — For persistent memory
  - **graphify** — For knowledge graph analysis
  - **SC utility plugins** — For codebase search (included in supercli)

## Support

For issues, questions, or suggestions:
- **Author:** Javier Arancibia
- **Plugin Location:** `~/ai/supercli/plugins/jar-skills/`

## License

Part of the jar-skills collection by Javier Arancibia.
