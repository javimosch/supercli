---
name: sick-memory
description: Use this skill when the user wants to manage persistent memory for AI coding agents with centralized storage, git-based scoping, and worktree support, or integrate memory systems with Claude Code, OpenCode, or other AI agents. Agents should learn this skill to understand how to use sick-memory for context persistence across sessions.
---

# Sick-Memory Plugin

File-based memory system for AI coding agents with centralized storage, git-based scoping, and worktree support - persistent knowledge storage across sessions using markdown files with YAML frontmatter, inspired by Claude Code's memory system.

## Agent Usage Instructions

As an AI agent, use sick-memory to maintain context across sessions and remember important project information:

### When to Use Sick-Memory
- **Session Start**: Recall relevant project context before starting work
- **Important Discoveries**: Remember key findings, decisions, or technical insights
- **Project Patterns**: Store architectural decisions, coding patterns, or conventions
- **Troubleshooting**: Remember solutions to problems for future reference
- **Context Switching**: Quickly recall project context when returning to work

### Core Workflow
1. **At session start**: `sc sick-memory memory recall "project context" --json`
2. **During work**: `sc sick-memory memory remember "Key finding: X requires Y approach" --type project`
3. **When stuck**: `sc sick-memory memory recall "previous solutions" --json`
4. **Before completion**: `sc sick-memory memory remember "Implementation completed: feature X" --type project`

## Commands

### SuperCLI Plugin Commands (Recommended)
- `sc sick-memory init` — Initialize memory system for current project
- `sc sick-memory memory remember "<content>"` — Add a memory to the project (CORRECT SYNTAX)
- `sc sick-memory memory recall [query]` — Retrieve relevant memories
- `sc sick-memory memory list` — List all memories in the project
- `sc sick-memory memory status` — Show memory system status
- `sc sick-memory config show` — Show configuration and storage location
- `sc sick-memory bridge generate <agent>` — Generate agent-specific integration (claude-code, opencode, copilot)
- `sc sick-memory edit run <id> <content>` — Edit a memory by ID (non-interactive)
- `sc sick-memory delete run <id>` — Delete a memory by ID

**CRITICAL**: The correct command structure is `sc <namespace> <resource> <action>`, not `sc <namespace> <action>`. For example:
- **Correct**: `sc sick-memory memory remember "content"`
- **Incorrect**: `sc sick-memory remember "content"`

### Quick Access via /sm Shorthand
- `/sm init` — Initialize memory system
- `/sm remember "<content>"` — Add a memory
- `/sm recall [query]` — Retrieve memories
- `/sm list` — List all memories
- `/sm status` — Show system status
- `/sm config show` — Show configuration

### Direct CLI Commands (Fallback)
- `sick-memory init` — Initialize memory system
- `sick-memory remember "<content>"` — Add a memory
- `sick-memory recall [query]` — Retrieve memories
- `sick-memory list` — List all memories
- `sick-memory status` — Show system status
- `sick-memory config` — Show configuration
- `sick-memory edit <id> <content>` — Edit a memory (non-interactive)
- `sick-memory delete <id>` — Delete a memory

### JSON Output (For Programmatic Use)
Add `--json` flag to any command for structured output:
- `sc sick-memory recall "query" --json` — Returns structured memory data
- `sc sick-memory status --json` — Returns system status in JSON
- `sc sick-memory list --json` — Returns memory list in JSON
- `sc sick-memory edit run <id> <content> --json` — Returns edit confirmation in JSON
- `sc sick-memory delete run <id> --json` — Returns delete confirmation in JSON

## Usage Examples

### Agent-Focused Examples
- "Initialize memory for this project" → `sc sick-memory init`
- "Remember that we use real database instances in tests" → `sc sick-memory memory remember "Use real database instances in tests, not mocks" --type project`
- "Recall memories about database testing" → `sc sick-memory memory recall "database testing" --json`
- "List all project memories" → `sc sick-memory memory list --json`
- "Show configuration and storage location" → `sc sick-memory config show`
- "Generate Claude Code bridge for this project" → `sc sick-memory bridge generate claude-code`
- "Check memory system status" → `sc sick-memory memory status --json`
- "Update memory 1779456013 with new content" → `sc sick-memory edit run 1779456013 "Updated content here" --json`
- "Delete memory 1779456013" → `sc sick-memory delete run 1779456013 --json`

### Quick Examples
```bash
# Session start - recall context
sc sick-memory memory recall "project context" --json

# Remember important finding
sc sick-memory memory remember "Authentication uses JWT tokens with 24h expiration" --type project

# Get system status
sc sick-memory memory status --json

# List all memories
sc sick-memory memory list --json

# Update existing memory (non-interactive)
sc sick-memory edit run 1779456013 "Updated content here" --json

# Delete memory
sc sick-memory delete run 1779456013 --json

# Using shorthand
/sm remember "API rate limit: 1000 requests per minute"
/sm recall "rate limit"
```

## Installation

```bash
cd ~/ai/sick-memory
go build -o sick-memory .
cp sick-memory ~/.local/bin/
```

The supercli plugin handles installation automatically when using `sc plugins install`.

## Centralized Storage

Sick-memory uses centralized storage with git-based scoping:
- **Storage Location**: `~/.sick-memory/projects/<sanitized-git-root>/memory/`
- **Git-based Scoping**: Memory is scoped to git repository root
- **Worktree Support**: All git worktrees share the same memory directory
- **Fallback**: Uses local `.sick-memory/` directory if not in a git repository

## Global Configuration

Global configuration is stored in `~/.sick-memory/config.json`:
- **Default Memory Type**: Default memory type (user, feedback, project, reference)
- **Max Memory Size**: Maximum memory file size in bytes
- **Auto Index**: Whether to automatically update memory index

## Examples

```bash
# Show configuration and storage location
sc sick-memory config show

# Initialize memory system (uses centralized storage if in git repo)
sc sick-memory init

# Add a memory
sc sick-memory memory remember "Use real database instances in tests, not mocks"

# Using shorthand
/sm remember "Integration tests must hit real DB"

# Recall memories
sc sick-memory memory recall "database" --json

# List all memories
sc sick-memory memory list --json

# Check status
sc sick-memory memory status --json

# Generate Claude Code integration
sc sick-memory bridge generate claude-code
```

## Key Features

- **Centralized storage**: All memories stored in `~/.sick-memory/` with git-based project scoping
- **Git-based scoping**: Memory automatically scoped to git repository root
- **Worktree support**: All git worktrees of the same repository share memory directory
- **Global configuration**: Centralized config file for user preferences
- **File-based storage**: Markdown files with YAML frontmatter for human readability
- **Agent-agnostic**: Works with Claude Code, OpenCode, Copilot, and other AI agents
- **JSON output**: Machine-readable output for agent integration
- **Bridge commands**: Generate agent-specific configurations automatically
- **Zero infrastructure**: No database or server required, works offline

## Memory Types

The system supports four memory types (following Claude Code's taxonomy):
- **user**: Information about the person (role, goals, expertise)
- **feedback**: Corrections and confirmations about work approach
- **project**: Ongoing work context (who, what, why, when)
- **reference**: External system pointers (URLs, dashboard links)

## Integration with AI Agents

### Claude Code
```bash
sc sick-memory bridge generate claude-code
```
Creates `.claude/CLAUDE.md` with memory loading instructions and centralized storage information.

### OpenCode
```bash
sc sick-memory bridge generate opencode
```
Creates `.opencode/memory.json` with OpenCode configuration.

### Copilot
```bash
sc sick-memory bridge generate copilot
```
Creates `.copilot/settings.json` with Copilot configuration.

## Caveats & Pitfalls

### Plan Content Before Saving
There is **no append or patch** — edit replaces the entire content. If you save incomplete content, you must re-supply the full corrected text. Always construct the full content string before calling `remember`.

### Always Use `sc sick-memory` Over Raw Binary
The raw `sick-memory` binary may open `vim` interactively for edit commands. The supercli plugin (`sc sick-memory edit run`) handles argument passing correctly and stays non-interactive.

### Edit/Delete May Not Be Available in Older Binaries
Check the binary version (`sick-memory --version`). Edit/delete support was added later — verify with `sick-memory --help` before relying on them.

### Delete May Fail Silently for Some IDs
`sick-memory list` reports a cached index. A memory shown in the list may already be deleted from disk. If `sc sick-memory delete run <id>` returns an integration error, check the filesystem directly at `~/.sick-memory/projects/<sanitized-git-root>/memory/`.

### `sc` Command Structure for Edit/Delete
- Edit: `sc sick-memory edit run <id> "<content>"` — content is a positional arg, not a flag
- Delete: `sc sick-memory delete run <id>` — requires the `run` action subcommand
- Use `--json` flag for machine-readable confirmation

### Correct SuperCLI Command Structure
The supercli plugin follows the pattern `sc <namespace> <resource> <action>`:
- **Remember**: `sc sick-memory memory remember "content"` (NOT `sc sick-memory remember "content"`)
- **Recall**: `sc sick-memory memory recall "query"` (NOT `sc sick-memory recall "query"`)
- **List**: `sc sick-memory memory list` (NOT `sc sick-memory list`)
- **Status**: `sc sick-memory memory status` (NOT `sc sick-memory status`)

This is because the plugin.json defines namespace=`sick-memory`, resource=`memory`, action=`remember/recall/list/status`.

### No Multi-Line Content from CLI
Content must be passed as a single CLI argument. For long content, construct it in a script or use `sc sick-memory edit run` with a heredoc-style content string. Escaping special characters (quotes, newlines) is the caller's responsibility.

### YAML Frontmatter Is Auto-Generated
You cannot independently set `name`, `description`, `type`, or `created` fields. These are inferred from the content string and the `--type` option. The first line of content becomes the `description` field.

### `sick-memory list` May Return Stale Index
The list command returns cached filenames. If a file was removed from disk externally (e.g., `rm` or a crash), it may still appear in `list` output. Always cross-reference with the filesystem if unsure.

### Search Bugs (Fixed in v0.1.0)

The following bugs were identified and fixed in the binary (source at `~/ai/sick-memory/`):

- **TF-IDF negative scores for common terms**: `DocFreq` was counting total occurrences instead of unique documents, making IDF negative when `df > DocCount`. Fixed by tracking per-document deduplication with a `seen` set.
- **`--json` flag leaked into query**: `sick-memory recall <query> --json` included `--json` in the search string. Fixed by filtering flags from `os.Args[2:]` in `handleRecall`.
- **Search index not cached on recall**: `loadSearchIndex` built the index from scratch every time but never saved it. Fixed by calling `saveSearchIndex` after building in `loadSearchIndex`.
- **Multi-word queries failed for non-exact substrings**: Queries like `"UI design"` didn't match content containing `"UI/Design"`. Fixed by adding a word-overlap fallback that scores by individual keyword substring presence.

### Command Structure
- `sc sick-memory memory recall <query> --json` — via sc plugin, query as positional arg (CORRECT)
- `sc sick-memory memory recall --query <query> --json` — via sc plugin, query as named flag (CORRECT)
- `sick-memory recall <query>` — direct binary call
- `sick-memory recall` (no query) — returns all memories, works with `--json`
- If search index is stale, delete `search_index.json` manually to force rebuild

**IMPORTANT**: The correct supercli pattern is `sc <namespace> <resource> <action>`, not `sc <namespace> <action>`. Always include the `memory` resource when using memory commands.

## Learning This Skill

Agents can learn this skill by using:
```bash
sc skills teach sick-memory:quickstart
```

Or simply:
```bash
sc skills get sick-memory
```

This provides complete guidance for using sick-memory in any agent session.