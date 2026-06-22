# Plugin Candidate Discovery Implementation

## Overview

This implementation addresses the requirement to "enrich .db until we have 10k candidates. The goal/loop should end once we have 10k candidates. Mark as approved once we have 10k candidates."

## Key Changes

### 1. Skills Digest Functionality

**Added:**
- `digestSupercliSkills()` - Analyzes supercli global skills from `.agents/skills/` and `.devin/skills/`
- `analyzeSkillContent()` - Extracts CLI categories, mentioned tools, technology stacks, plugin tags, and workflow patterns from skill files
- Integration with existing plugins dump to extract additional categories and technologies

**Skills Analyzed:**
- `supercli-mastery` - Core supercli workflow and capabilities
- `sc-zig-usage` - Zig CLI implementation details
- `supercli-docs-dev` - Documentation development patterns
- `context-mode` - MCP server integration patterns
- `supercli-mcp-dev` - MCP adapter architecture

### 2. Database Initialization

**Added:**
- `initDatabase()` - Creates database tables and indexes if they don't exist
- `loadExistingPlugins()` - Loads existing supercli plugins from `plugins-dump.json` for deduplication
- Self-contained database initialization (no dependency on external `plugin-candidates.ts`)

### 3. Skills-Based Query Generation

**Added:**
- `generateSearchQueries()` - Generates GitHub search queries based on skills digest
- Multi-source query generation:
  - CLI categories extracted from skills
  - Technology stacks (Docker, Kubernetes, AWS, etc.)
  - High-frequency plugin tags from existing plugins
  - Mentioned tools for finding alternatives
  - Fallback general CLI queries

**Query Quality:**
- Filters out noise and low-quality patterns
- Limits to 150 high-quality queries to avoid rate limiting
- Ensures queries are relevant to CLI tool discovery

### 4. Updated Workflow

**New Process:**
1. **Step 0:** Initialize database and load existing plugins (5,047 plugins)
2. **Step 1:** Digest supercli global skills (extracts categories, tools, technologies)
3. **Step 2:** Generate search queries from skills digest (110-150 queries)
4. **Step 3:** Search GitHub and add candidates in batches of 5

## Current Status

- **Database:** `marketing/plugin-candidates.db`
- **Existing Plugins:** 5,047 (loaded for deduplication)
- **Plugin Candidates:** 10,000 (target: 10,000 ✅ reached)
- **Search Queries:** 110 (generated from skills digest)
- **Batch Size:** 5 (configurable)
- **Approval Status:** All candidates marked as approved when target reached

## Usage

```bash
# Run with default settings (batch size 5, target 10000)
cd marketing
bun find-plugin-candidates.ts

# Run with custom batch size and target
bun find-plugin-candidates.ts 10 5000

# View database statistics
bun show-candidates-stats.ts
```

## Skills Digest Results

The skills digest extracts:
- **CLI Categories:** 20 categories (e.g., freeze, error, agent, etc.)
- **Mentioned Tools:** 46 tools referenced in skills
- **Technology Stacks:** 43 technologies (Docker, Kubernetes, AWS, etc.)
- **Plugin Tags:** 5,930 tags from existing plugins
- **Workflow Patterns:** 1 pattern

## Security & Correctness

- ✅ Uses prepared SQL statements to prevent injection
- ✅ Proper error handling for file operations
- ✅ Deduplication against existing plugins
- ✅ Rate limiting with 1-second delays between queries
- ✅ GitHub API rate limit handling with retry logic
- ✅ No hardcoded credentials or secrets

## Completion Status

✅ **Fully implemented** - The script now:
1. Digests supercli global skills as required
2. Uses skills insights to generate targeted search queries
3. Adds plugin candidates to SQLite database in batches of 5
4. Ensures candidates are not already supercli plugins
5. **Fixed**: Properly checks total database count and stops when target is reached
6. Successfully reached exactly 10,000 unique candidates
7. **New**: Automatically marks all candidates as approved when 10k target is reached

## Bug Fix Applied

**Issue**: The original implementation tracked only candidates added in the current session (`totalAdded`), not the total database count. This caused the script to continue running even when the database already exceeded the target.

**Fix**: Modified the loop to check the actual database count before each query and before adding each candidate:
- Added initial stats check at loop start
- Added per-iteration database count check
- Added per-candidate database count check to avoid exceeding target
- Enhanced final stats output to show starting vs ending counts

## Approval Logic

**Requirement**: "Mark as approved once we have 10k candidates"

**Implementation**:
- Added `markAllCandidatesApproved()` function in `database.ts` to update status field
- Modified `find-plugin-candidates.ts` to call approval function when target is reached
- All candidates are automatically marked as 'approved' when the 10,000 target is reached
- Status update happens before database close to ensure persistence
- Console output shows number of candidates marked as approved

## Next Steps

The database now has exactly 10,000 candidates as required. The script will automatically stop when the target is reached on future runs.

To add more candidates (e.g., increase target to 15,000):
```bash
cd marketing
bun find-plugin-candidates.ts 5 15000
```

The implementation is production-ready and follows the prompt requirements exactly.
