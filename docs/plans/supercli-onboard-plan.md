# SuperCLI Onboard - Harness Skill Installer

## Goal

Add a `supercli onboard` command that installs a supercli cheatsheet skill into external projects so non-human agents can discover and use supercli commands without trial-and-error exploration.

## Problem

When AI agents (Claude, OpenCode, Windsurf, Cursor, etc.) enter a new project that uses supercli, they:
1. Don't know supercli is available
2. Run raw CLI commands before discovering supercli wrappers
3. Miss proper flags and patterns

## Solution

A top-level `supercli onboard` command that:
1. Creates a skill document in the target project's AI harness directory
2. Supports multiple AI tools via `--harness` flag
3. Defaults to auto-detecting installed AI tools

## Target Locations by Harness

| Harness | Path | Format |
|---------|------|--------|
| claude | `.claude/skills/supercli/SKILL.md` | SKILL.md |
| opencode | `.opencode/skills/supercli/SKILL.md` | SKILL.md |
| cursor | `.cursor/rules/supercli.mdc` | .mdc (metadata + markdown) |
| windsurf | `.windsurfrules` | Flat markdown |
| agents (universal) | `.agents/skills/supercli/SKILL.md` | SKILL.md |

## Files to Create

### `cli/harness-onboard.js` (new)

Main handler for the onboard command. Responsibilities:
- Parse `--harness` flag (comma-separated: `claude,windsurf,opencode`)
- Auto-detect installed harnesses if none specified
- Create directory structure
- Compile skill content to appropriate format
- Output onboard status

### `skills/supercli/SKILL.md` (source of truth)

The canonical skill document that gets compiled to harness-specific formats.

### `skills/supercli/compile.js` (new)

Transforms SKILL.md to harness-specific formats:
- Raw copy for `claude`, `opencode`, `agents`
- `.mdc` wrapper for `cursor`
- Flattened for `windsurf`

## Command Interface

```bash
# Onboard for all detected harnesses
supercli onboard

# Onboard for specific harnesses
supercli onboard --harness claude,opencode

# Onboard to specific directory (for CI/monorepo)
supercli onboard --target ./frontend --harness claude

# Dry run
supercli onboard --dry-run --harness claude

# List detected harnesses
supercli onboard --detect

# Remove installed skill
supercli offboard
```

## Implementation Steps

1. Create `cli/harness-onboard.js` with handler function
2. Create `skills/supercli/SKILL.md` source document
3. Create `skills/supercli/compile.js` format transformer
4. Add `supercli onboard` routing in `cli/supercli.js`
5. Add `supercli offboard` routing in `cli/supercli.js`
6. Add tests in `__tests__/harness-onboard.test.js`

## CLI Routing Changes

In `cli/supercli.js`, add after the `plugins` handler:

```javascript
if (positional[0] === "onboard") {
  const { handleHarnessOnboard } = require("./harness-onboard");
  await handleHarnessOnboard({
    positional, flags, humanMode, output, outputError,
  });
  return;
}

if (positional[0] === "offboard") {
  const { handleHarnessOffboard } = require("./harness-onboard");
  await handleHarnessOffboard({
    positional, flags, humanMode, output, outputError,
  });
  return;
}
```

## Auto-Detection Logic

Detect harnesses by checking for existence of:
- `.claude/` directory → Claude Desktop
- `.opencode/` directory → OpenCode
- `.cursor/` directory → Cursor
- `.windsurfrules` or `.windsurf/` → Windsurf

## Decisions

1. **Command name**: `supercli onboard` (user preference)
2. **Overwrite behavior**: Default to overwrite with `--force` flag to override
3. **Scope**: Project-level only (no global) - keeps skills tied to project-specific supercli versions
4. **Updates**: No auto-update - running `supercli onboard` again refreshes the skill
5. **Offboard command**: Added for symmetry to remove installed skills
