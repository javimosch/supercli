# SuperCLI Architecture Plan

## 1. Current State Assessment

### What SuperCLI Is
A config-driven, universal CLI capability router that wraps 3,300+ CLI tools, APIs, MCP servers, and workflows behind a uniform `namespace resource action` command interface. Lives on npm as `superacli` v1.31.1.

### Dual-Implementation Architecture
| Feature | sc-zig (Zig 0.16.0) | sc (Node.js) |
|---|---|---|
| Binary size | ~250KB single static binary | Requires Node.js runtime |
| Plugin discover/explore | ✅ | ✅ |
| Execute commands | ✅ (process adapter only) | ✅ (all 5 adapters) |
| Plugin install | ✅ (delegates to sc) | ✅ native |
| MCP server | ❌ | ✅ |
| HTTP adapter | ❌ | ✅ |
| sc server/daemon | ❌ | ✅ |
| OpenAPI adapter | ❌ | ✅ |

### Repository Stats
- 3,357 bundled plugins in `plugins/<name>/` dirs (each with `plugin.json` + `meta.json`)
- 5,553+ commands exposed through plugins
- 93 Jest tests covering CLI, adapters, plugins, server
- 36 smoke test scripts in `tests/`
- 15 skill directories in `skills/`
- Express.js management server in `server/` (13 routes, 4 services, 3 storage adapters)
- Generator scripts in `scripts/` (catalog, meta-plugins, enrichment)

### Quality Metrics
- Plugin quality score: 92.1% (up from 91.2%)
- 1,174 plugins still have short descriptions (< 30 chars)
- 31 source URLs already fixed (generic → specific repos)
- 13 tags added for improved discoverability

### Last 10 Commits Pattern
- Recent work has focused on: CI fixes (continue-on-error, npm test chaining), Zig unit tests (registry.zig: filterByName/filterByTag, update.zig: diffCatalogs), README restructure, and automaintainer bulk plugin additions from `/root/candidates.json`.
- 53 candidates evaluated: 39 already created, 14 remaining to add
- QA verified CI issues are now resolved.

## 2. Key Architecture Decisions

### A. Plugin Isolation Convention (NEW)
**Decision:** New plugins use isolated directory convention only:
```
plugins/<name>/
├── plugin.json       # Manifest
├── meta.json         # Registry metadata (description, tags, has_learn)
├── install-guidance.json  # Optional install steps
├── skills/quickstart/SKILL.md  # Optional agent guide
└── README.md         # Optional human docs
```
**Old method** (editing `plugins/plugins.json` + `cli/plugin-install-guidance.js`) is deprecated for new plugins.

### B. Zig CLI Scope
The Zig binary is intentionally a **subset** of Node.js features. It focuses on:
- Fast command execution (process adapter only)
- Plugin discovery and exploration
- Plugin updates (diff-based catalog sync)
- Delegating install to Node.js

Features intentionally excluded: MCP server, HTTP adapter, sc server/daemon, OpenAPI adapter.

### C. Plugin Storage Compatibility
Both implementations share `~/.supercli/plugins/plugins.lock.json`. The Zig CLI reads the same lockfile structure, ensuring seamless coexistence.

## 3. Recommended Focus Areas

### High Priority
| # | Area | Description | Effort |
|---|------|-------------|--------|
| 1 | **Plugin description quality** | 105 plugins with <30 char descriptions need enrichment per PLUGIN_STANDARDS.md | Medium (batch-scriptable) |
| 2 | **Zig CLI feature parity** | Add MCP adapter or at minimum MCP client support to sc-zig | Large |
| 3 | **Catalog regeneration CI** | Ensure catalog.yml workflow reliably regenerates `plugins/catalog.json` on pushes | Small |
| 4 | **Install guidance for new plugins** | Many new plugins lack install-guidance.json | Medium |

### Medium Priority
| # | Area | Description | Effort |
|---|------|-------------|--------|
| 5 | **Test coverage expansion** | Currently 93 Jest tests — add coverage for server routes, error paths | Medium |
| 6 | **Zig smoke tests** | Formalize the smoke test suite for sc-zig releases | Small |
| 7 | **Plugin scoring system** | Implement community-voted "verified" plugin badge system | Medium |
| 8 | **Documentation alignment** | Ensure AGENTS.md, README, and docs/ are consistent with current implementation | Small |

### Lower Priority
| # | Area | Description | Effort |
|---|------|-------------|--------|
| 9 | **MCP-native runtime** | SuperCLI as MCP server exposing all plugins | Large |
| 10 | **sc plan/sc act workflows** | High-level agentic workflow execution | Large |
| 11 | **Plugin dependency resolution** | Auto-resolve toolchains for multi-step commands | Large |

## 4. Plugin Ecosystem Analysis

### Plugin Distribution by Adapter Type
- **process** (CLI binary wrapping): ~90% of plugins
- **shell** (script execution): ~7%
- **http** (REST API): ~2%
- **mcp** (MCP protocol): <1%
- **openapi** (OpenAPI specs): <1%

### Tag Vocabulary Coverage
- TAG_VOCABULARY.md defines 80+ controlled tags across categories
- Minimum: 3 tags per plugin, Maximum: 8
- Common gaps: Missing `database`, `monitoring`, `security` tags on relevant plugins

## 5. CI/CD Pipeline Status

| Workflow | Trigger | Status | Issues |
|----------|---------|--------|--------|
| test.yml | push, PR | ✅ Working | None — runs Node + Zig tests |
| catalog.yml | push to master touching plugins/** | ⚠️ May need love | Depends on `scripts/generate-catalog.js` |
| sc-zig-release.yml | tag v*-zig | ✅ Configured | May need stable trigger (GitHub Actions quirk) |

## 6. Immediate Actionable Items

1. **Improve description enhancement pipeline** — Current `batch-enhance-descriptions.ts` generates 1,176 suggestions but 1,175 are confidence 60 (low) and often produce worse descriptions than originals. Needs better tool-name→purpose mappings.
2. **Install-guidance.json for remaining plugins** — Many bundled plugins still lack install steps.
3. **Regenerate catalog** — `node scripts/generate-catalog.js` after any plugin changes.

## 7. Session Plan: am-0e131c-tfxlm0 (Current)

### Context
- **Latest commit**: `25c91fac` (chore: apply description enhancements to 563 plugin files)
- **Total plugins**: 3,371
- **Short descriptions**: 535 plugins with <30 char descriptions remain (down from 923)
- **Description pipeline state**: `batch-enhance-descriptions.ts` has ~750 known tools in its DESCRIPTIONS map (up from 548). Smart expansion strategy added: good short descriptions (>=10 chars) get tool name prepended at confidence 85.
- **Working tree**: Clean
- **CI workflows**: test.yml ✅, catalog.yml ⚠️, sc-zig-release.yml ✅
- **Tools available**: bun 1.3.14, Node.js v24.15.0, Python 3

### State Assessment
| Metric | Current | Target | Gap |
|--------|---------|--------|-----|
| Plugin count | 3,371 | — | Stable |
| Short descriptions (<30 chars) | 535 | 0 | 535 |
| Known tools in DESCRIPTIONS map | 750 | 1,200+ | ~450 more needed |
| Avg description length | ~77 chars | 80+ chars | +3 chars |
| Working tree | Clean | Clean | ✅ |

### Key Insight
The 254 high-confidence suggestions (exact DESCRIPTIONS map matches at 95% confidence) are immediately actionable — they will cut the short-description count from 923 to ~669 in a single run. The remaining 922 low-confidence suggestions need DESCRIPTIONS map expansion to boost their confidence scores above 85.

### Work Allocation

#### Dev (3 commits, ordered by impact)

1. **Commit 1: Apply 254 high-confidence description enhancements**
   - Run the pipeline: `bun batch-enhance-descriptions.ts` → `bun apply-description-enhancements.ts` → `node scripts/apply-enhancements-and-install-guidance.js`
   - This auto-applies all 254 suggestions (exact DESCRIPTIONS map matches at >=85% confidence)
   - Also auto-creates missing `install-guidance.json` for plugins that have `install_guidance` in plugin.json
   - **Expected impact**: Short descriptions drop from 923 to ~669

2. **Commit 2: Expand DESCRIPTIONS map + add smart expansion strategy**
   - Add ~400+ new tool-name→description mappings to DESCRIPTIONS map in `batch-enhance-descriptions.ts` (target: 800+ total)
   - Add "expand short but good descriptions" strategy — when description is >10 chars and already useful, prepend tool name with em-dash (PLUGIN_STANDARDS.md format)
   - Re-run pipeline after additions to regenerate suggestions with higher confidence
   - **Expected impact**: Many more suggestions hit >=85 confidence

3. **Commit 3: Regenerate catalog + update docs**
   - `node scripts/generate-catalog.js` — regenerates `plugins/catalog.json`
   - Update ARCHITECTURE_PLAN.md metrics (plugin count, short desc count, avg length)
   - `npm test` to verify nothing broken

#### QA (in order as dev completes commits)
1. **After Commit 1**: Run `npm test`, audit 20-30 of the 254 applied descriptions for accuracy/relevance, report issues
2. **After Commit 2**: Spot-check 20-30 new/enhanced descriptions, verify format (PLUGIN_STANDARDS.md), check for malformed entries
3. **After Commit 3**: Verify catalog.json regenerated, run `npm test`, confirm all green, confirm ARCHITECTURE_PLAN.md numbers match reality

#### Architect (This Session)
- Analyze repo state, produce session plan, update ARCHITECTURE_PLAN.md, communicate plan to dev/qa via a2a bus, mark done

### For Future Sessions:
1. Zig CLI: Add `--help-json` bootstrap command matching Node.js behavior
2. Zig CLI: Formalize `sc-zig` release process (auto-release via GitHub Actions)
3. Server testing: Add Jest coverage for server routes (currently 93 tests)
4. Plugin scoring: Implement community voting mechanism
5. **Description enhancement pipeline v2** — Overhaul with LLM-based or web-scraped descriptions instead of heuristic tool-name mappings
