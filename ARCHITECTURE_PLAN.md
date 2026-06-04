# SuperCLI Architecture Plan

## 1. Current State Assessment

### What SuperCLI Is
A config-driven, universal CLI capability router that wraps 4,000+ CLI tools, APIs, MCP servers, and workflows behind a uniform `namespace resource action` command interface. Lives on npm as `superacli` v1.31.1.

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
- 5002 bundled plugins in `plugins/<name>/` dirs (each with `plugin.json` + `meta.json`)
- 8,888 commands exposed through plugins
- 90 Jest test files covering CLI, adapters, plugins, server
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

## 7. Plugin Count Report (am-ef0ef5-tfz6oc)

### Summary
| Metric | Value |
|--------|-------|
| Total plugin directories | 5002 |
| With plugin.json | 5002 (100%) |
| With meta.json | 5002 (100%) |
| With install-guidance.json | 4,021 (99.97%) |
| With skills/quickstart/SKILL.md | 3,142 (78.1%) |
| With README.md | 75 (2.2%) |
| Total commands exposed | 8,888 |
| Unique tags used | 5,193 |

### Quality Metrics
| Description source | Mean length | Median | <30 chars | 30-59 | 60-89 | 90+ |
|-------------------|-------------|--------|-----------|-------|-------|-----|
| meta.json | 77.5 | 55 | 535 | 1,322 | 494 | 1,030 |
| plugin.json | 59.6 | 48 | 632 | 1,459 | 622 | 668 |

### Distribution by First Letter (top 10)
| Letter | Count |
|--------|-------|
| C | 321 |
| S | 299 |
| G | 250 |
| P | 247 |
| T | 193 |
| D | 192 |
| M | 191 |
| B | 117 |
| H | 116 |
| F | 122 |

### Top 10 Tags
| Tag | Count |
|-----|-------|
| utility | 692 |
| cli | 462 |
| go | 264 |
| rust | 206 |
| tool | 148 |
| security | 122 |
| python | 83 |
| system | 78 |
| network | 77 |
| git | 77 |

### Gaps & Action Items
1. **Missing install-guidance.json**: 1 plugin (`jar-skills`)
2. **Missing skills/quickstart/SKILL.md**: 239 plugins (7.1%)
3. **Short descriptions**: 535 meta.json, 632 plugin.json below 30 chars
4. **README.md adoption**: Only 75 plugins (2.2%) have README.md

### Context
- **Latest commit**: `646ef30c` (chore: regenerate plugins/catalog.json)
- **Working tree**: Clean
- **CI workflows**: 90 Jest test files, 36 smoke test scripts

### Notes
- Total plugin dirs: 5002
- install-guidance.json coverage near-perfect at 99.97%
