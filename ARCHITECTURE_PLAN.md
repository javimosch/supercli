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

## 7. Session Plan: am-0e131c-tfxiu0 (Current)

### Context
- **Latest commit**: `da8c1761` (chore: regenerate plugins/catalog.json)
- **Total plugins**: 3,371
- **Short descriptions**: 923 plugins with <30 char descriptions remain (down from 1,176)
- **Description pipeline state**: `batch-enhance-descriptions.ts` has 548 known tools in its DESCRIPTIONS map. Many short descriptions are actually good quality but just slightly under 30 chars (e.g., "7-Zip archive utility" at 19 chars).
- **Working tree**: Clean
- **CI workflows**: test.yml ✅, catalog.yml ⚠️, sc-zig-release.yml ✅
- **Tools available**: bun 1.3.14, Node.js v24.15.0, Python 3

### State Assessment
| Metric | Current | Target | Gap |
|--------|---------|--------|-----|
| Plugin count | 3,371 | — | Stable |
| Short descriptions (<30 chars) | 923 | 0 | 923 |
| Known tools in DESCRIPTIONS map | 548 | 1,200+ | ~650 more needed |
| Avg description length | ~72 chars | 80+ chars | +8 chars |
| Working tree | Clean | Clean | ✅ |

### Key Insight
Many short descriptions are actual quality descriptions that just need minimal expansion (e.g., "Alpine email client" → "Alpine — lightweight email client"). The pipeline should expand these minimally rather than replace them entirely.

### Work Allocation

#### Dev (2 commits, highest impact first)
1. **Commit 1: Expand DESCRIPTIONS map + add smart expansion strategy**:
   - Add ~700 new tool-name→description mappings to DESCRIPTIONS map in `batch-enhance-descriptions.ts`
   - Add "expand short but good descriptions" strategy — when description is >10 chars and already useful, prepend tool name with em-dash
   - Run pipeline: `bun batch-enhance-descriptions.ts` → `bun apply-description-enhancements.ts` → `node scripts/apply-enhancements-and-install-guidance.js`
2. **Commit 2: Regenerate catalog + update ARCHITECTURE_PLAN.md**
   - `node scripts/generate-catalog.js`
   - Update ARCHITECTURE_PLAN.md metrics
   - `npm test` to verify

#### QA (in order as dev completes commits)
1. **After Commit 1**: Audit description quality — verify ≥30 chars, spot-check 20-30 enhanced descriptions for accuracy/relevance
2. **After Commit 2**: Verify catalog.json regenerated, run `npm test`, confirm all green

#### Architect (This Session)
- Analyze repo state, produce plan, update ARCHITECTURE_PLAN.md, communicate to dev/qa, mark done

### For Future Sessions:
1. Zig CLI: Add `--help-json` bootstrap command matching Node.js behavior
2. Zig CLI: Formalize `sc-zig` release process (auto-release via GitHub Actions)
3. Server testing: Add Jest coverage for server routes (currently 93 tests)
4. Plugin scoring: Implement community voting mechanism
5. **Description enhancement pipeline v2** — Overhaul with LLM-based or web-scraped descriptions instead of heuristic tool-name mappings
