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

## 7. Session Plan: am-0e131c-tfxr60 (Current)

### Context
- **Latest commit**: `e2b4adbf` (fix mcp-daemon exit codes + plugins-command stderr)
- **Total plugins**: 3,371
- **Short descriptions in meta.json**: 535 plugins with <30 char descriptions remain (avg length ~77 chars)
- **Short descriptions in plugin.json**: 632 plugins with <30 char descriptions remain (avg length ~59 chars)
- **Test status**: 5 pre-existing test failures (cline-skill, xurl, azd, docker, supercli-version)
- **Description pipeline state**: `description-enhancements.json` has 3,212 scored entries; DESCRIPTIONS map has ~750 known tools
- **Working tree**: Clean
- **CI workflows**: test.yml ✅ (despite 5 pre-existing failures), catalog.yml ⚠️, sc-zig-release.yml ✅
- **Tools available**: bun 1.3.14, Node.js v24.15.0, Python 3

### State Assessment
| Metric | Current | Target | Gap |
|--------|---------|--------|-----|
| Plugin count | 3,371 | — | Stable |
| Short descriptions (meta.json, <30 chars) | 535 | 0 | 535 |
| Short descriptions (plugin.json, <30 chars) | 632 | 0 | 632 |
| Avg description length (meta.json) | ~77 chars | 80+ chars | +3 chars |
| Avg description length (plugin.json) | ~59 chars | 80+ chars | +21 chars |
| Pre-existing test failures | 5 | 0 | 5 |
| Working tree | Clean | Clean | ✅ |

### Key Insight
Two sources of descriptions exist (meta.json and plugin.json) with different quality. The previous session plan's description enhancement work was not fully applied — the pipeline output (description-enhancements.json) exists but hasn't been propagated to plugin files. Focus should be on: (1) fixing the 5 test failures which are blocking CI green, (2) propagating the description pipeline to plugin files, and (3) expanding the DESCRIPTIONS map.

### Priority Assessment
1. **TEST FIXES (blocking CI)** — 5 tests fail, need diagnosis and fix before other work can be reliably verified
2. **Description pipeline propagation** — Apply high-confidence enhancements from description-enhancements.json to plugin files
3. **DESCRIPTIONS map expansion** — Add more tool→description mappings to increase suggestion confidence

### Work Allocation

#### Dev (in priority order)

1. **Commit 1: Fix 5 pre-existing test failures**
   - Diagnose failures in: cline-skill, xurl, azd, docker, supercli-version tests
   - Likely candidates: binary path assumptions, missing test binaries, env var configuration
   - **Expected impact**: CI goes fully green (597/601 → 601/601)

2. **Commit 2: Apply high-confidence description enhancements from pipeline**
   - Run: `bun batch-enhance-descriptions.ts` → `bun apply-description-enhancements.ts` → `node scripts/apply-enhancements-and-install-guidance.js`
   - Apply >=85% confidence suggestions to plugin files
   - Auto-create missing `install-guidance.json` files
   - **Expected impact**: Short descriptions in meta.json drop further toward 0

3. **Commit 3: Expand DESCRIPTIONS map + regenerate catalog**
   - Add new tool→description mappings to `batch-enhance-descriptions.ts`
   - Re-run pipeline to boost suggestion confidence scores
   - `node scripts/generate-catalog.js` — regenerates `plugins/catalog.json`
   - Update ARCHITECTURE_PLAN.md metrics

#### QA (in order as dev completes commits)
1. **After Commit 1**: Confirm all 601 tests pass, report any flaky tests, verify fix robustness
2. **After Commit 2**: Audit 20-30 applied descriptions for accuracy (PLUGIN_STANDARDS.md format), verify install-guidance.json creation, run `npm test`
3. **After Commit 3**: Verify catalog.json regenerated correctly, confirm all green, check ARCHITECTURE_PLAN.md numbers match reality

#### Architect (This Session)
- Analyze repo state, produced session plan at `ARCHITECTURE_PLAN.md:119`, communicated plan to dev/qa via a2a bus, committed updates

### For Future Sessions:
1. Zig CLI: Add `--help-json` bootstrap command matching Node.js behavior
2. Zig CLI: Formalize `sc-zig` release process (auto-release via GitHub Actions)
3. Server testing: Add Jest coverage for server routes (currently 93 tests)
4. Plugin scoring: Implement community voting mechanism
5. **Description enhancement pipeline v2** — Overhaul with LLM-based or web-scraped descriptions instead of heuristic tool-name mappings
