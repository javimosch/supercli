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

## 7. Session Plan: am-0e131c-tfxai0 (Current)

### Context
- Candidates file at `/root/candidates.json` contains 53 tools to add as bundled plugins
- 39 already created (gum, bottom, television, httpstat, python-fire, taze, sampler, shiori, readme-ai, doit, auto-cpufreq, autojump, fasd, viu, khal, vdirsyncer, timetrap, tflint, tfenv, snyk, decktape, caniuse-cmd, rebound, bcal, is-up-cli, doctoc, mdlt, qalculate, papis, oh-my-posh, xxh, acmetool, prospector, pip-check, interrogate, watchtower, webhook, atlantis, certimate, mosint, goaccess, s-tui, dockle, sonobuoy, cloudfox)
- 14 still missing: gitui, helix, termscp, mangal, http-prompt, weechat, mdv, carbonyl, tmate, patator, cointop, rtop, pg_activity, pacu

### Work Allocation

#### Dev
1. **Add 14 missing bundled plugins** following isolated directory convention
2. **Run description enhancement pipeline** for 1,174 short-description plugins:
   - `bun batch-enhance-descriptions.ts` → generate suggestions
   - `bun apply-description-enhancements.ts` → apply high-confidence
   - `node scripts/apply-enhancements-and-install-guidance.js` → propagate to files
3. **Regenerate catalog.json**: `node scripts/generate-catalog.js`
4. **README restructure** per `plan.txt` (306 LOC → 430-600 LOC)

#### QA
1. **Review plugin.json** for each new plugin before finalization
2. **Audit description quality** after enhancement pipeline
3. **Verify catalog.json** regenerates correctly
4. **Confirm test.yml and catalog.yml** are green

#### Architect (This Session)
- Produce this plan and hand off to dev

### For Future Sessions:
1. Zig CLI: Add `--help-json` bootstrap command matching Node.js behavior
2. Zig CLI: Formalize `sc-zig` release process (auto-release via GitHub Actions)
3. Server testing: Add Jest coverage for server routes
4. Plugin scoring: Implement community voting mechanism
