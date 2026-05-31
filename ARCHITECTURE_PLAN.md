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

## 7. Session Plan: am-0e131c-tfxda0 (Current)

### Context
- **Latest commit**: `bf9b2ffd` (chore: regenerate plugins/catalog.json)
- **Total plugins**: 3,371 (53/53 candidates from `/root/candidates.json` added ✅)
- **Short descriptions**: 1,176 plugins with <30 char descriptions remain (per QUALITY_REPORT.md)
- **README**: Restructured to new format, currently **306 LOC** (plan target: 430-600)
- **Working tree**: Clean — all previous session work committed
- **CI workflows**: test.yml ✅, catalog.yml ⚠️, sc-zig-release.yml ✅
- **Tools available**: bun 1.3.14, Node.js v24.15.0, Python 3

### State Assessment
| Metric | Current | Target | Gap |
|--------|---------|--------|-----|
| Plugins from candidates.json | 53/53 | 53 | ✅ |
| Short descriptions (<30 chars) | ~1,176 | 0 | 1,176 |
| README LOC | 306 | 430-600 | +124-294 |
| Avg description length | ~72 chars | 80+ chars | +8 chars |
| Working tree dirtiness | Clean | — | ✅ |

### Work Allocation

#### Dev (3 commits, highest impact first)
1. **Commit 1: Run description enhancement pipeline** for ~1,176 short-description plugins:
   - `bun batch-enhance-descriptions.ts` → generate scored suggestions
   - `bun apply-description-enhancements.ts` → auto-apply high-confidence (>=85%)
   - `node scripts/apply-enhancements-and-install-guidance.js` → propagate to plugin files
2. **Commit 2: Expand README** from 306 → 430-600 LOC per `plan.txt`:
   - Expand 'For Humans / For Agents' compressed benefits table (~40 LOC)
   - Lengthen CLI Usage Examples section (~55 LOC, add inspection category)
   - Keep Architecture text-only (~55 LOC, no diagram)
   - Add Tech Stack + Social + Contributors section (~40 LOC)
3. **Commit 3: Regenerate catalog + verify CI**
   - `node scripts/generate-catalog.js`
   - `npm test` to verify test.yml green
   - `git add + git commit -m "chore: regenerate plugins/catalog.json"`

#### QA (in order as dev completes commits)
1. **After Commit 1**: Audit description quality — verify ≥30 chars, spot-check 5-10 descriptions, confirm install-guidance.json coverage
2. **After Commit 2**: Validate README matches plan.txt checklist — LOC target, npx consistency, no ASCII diagrams
3. **After Commit 3**: Verify catalog.json regenerated, run `npm test`, confirm all green

#### Architect (This Session)
- Analyze repo state, produce this plan, communicate to dev/qa, mark done

### For Future Sessions:
1. Zig CLI: Add `--help-json` bootstrap command matching Node.js behavior
2. Zig CLI: Formalize `sc-zig` release process (auto-release via GitHub Actions)
3. Server testing: Add Jest coverage for server routes (currently 93 tests)
4. Plugin scoring: Implement community voting mechanism
