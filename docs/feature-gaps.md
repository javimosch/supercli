# Feature Gaps

Comparison of the current release versus the broader capability-mesh vision from the latest brainstorming notes. For committed roadmap items, see [ROADMAP.md](ROADMAP.md).

## Current Capabilities (Shipping)

| Capability | Status | Notes |
|------------|--------|-------|
| Plugin discovery & execution | ✅ Shipping | 5,000+ plugins, 8,000+ commands |
| MCP server integration | ✅ Shipping | HTTP/SSE and stdio transports |
| HTTP/OpenAPI adapters | ✅ Shipping | Direct API and spec-based commands |
| CLI binary wrapping | ✅ Shipping | Process adapter (~90% of plugins) |
| Custom adapters (JavaScript) | ✅ Shipping | Sandboxed vm2 execution |
| Server plugin sync | ✅ Shipping | JSON and ZIP plugin flows |
| Skill document catalog | ✅ Shipping | Local and remote providers |

## Feature Gaps vs. Capability-Mesh Vision

| Feature name | Description | Why it matters | Roadmap Phase |
| --- | --- | --- | --- |
| Unified capability registry service | Dedicated registry service that persists capability metadata, ownership, and lifecycle events outside the CLI runtime. | Enables organization-wide discovery, policy management, and sharing without relying on a single CLI process or local cache. | Phase I (Q3 2026) |
| Capability graph traversal API | Graph-native search endpoints ("related capabilities", capability clustering, semantic tags). | Agents can explore neighboring capabilities, infer dependencies, and auto-complete workflows instead of executing isolated commands. | Phase I (Q4 2026) |
| Mesh-wide governance & policy | Central rules for authentication, rate limits, approvals, and auditing across every harness/adapter. | Provides enterprise-grade controls so teams can safely expose sensitive CLIs/APIs without bespoke wrappers. | Phase III (Q3 2027) |
| Execution DAG orchestration | First-class scheduler for multi-capability plans with retries, checkpoints, and observability hooks. | Bridges `plan/execute` concepts with reliable automation, turning plans into production-grade workflows. | Phase I (Q4 2026) |
| Agent-facing HTTP interface | Stable HTTP/WebSocket endpoints that mirror CLI capabilities for direct agent/automation consumption. | Lets agents integrate via simple API calls rather than shelling out to the CLI, unlocking server-side agents and SaaS integrations. | Phase I (Q4 2026) |
| Capability composition toolkit | Declarative way to package multiple capabilities into composites or workflows that publish as new capabilities. | Encourages reuse, accelerates plugin development, and aligns with the capability mesh abstraction where every composite is also a capability. | Phase I (Q4 2026) |
| Telemetry & lineage for capabilities | Built-in tracing, metrics, and history for each capability invocation and plan. | Makes it possible to reason about reliability, enforce governance, and debug agent runs across heterogeneous tools. | Phase II (Q2 2027) |
| Plugin certification & discovery UX | Registry UX for tagging, ranking, and validating community plugins directly in `supercli plugins explore`. | Reduces trust friction for third-party harnesses and makes the discovery narrative match the README's emphasis on capabilities-first exploration. | Phase I (Q3 2026) |

## Gap Analysis by Priority

### High Priority (Next 6 Months)

| Gap | Current State | Target State | Effort |
|-----|---------------|--------------|--------|
| Plugin description quality | 807 short descriptions (<30 chars) | All descriptions 30-150 chars | Medium (batch-scriptable) |
| Plugin certification | No quality badges | Community-voted "verified" badges | Medium |
| Agent SDK | CLI-only integration | Node/Python/Rust SDK | Large |

### Medium Priority (6-12 Months)

| Gap | Current State | Target State | Effort |
|-----|---------------|--------------|--------|
| Capability composition | Manual `ask` chaining | Declarative workflow definitions | Large |
| Telemetry & lineage | Basic logging | Full tracing with metrics | Medium |
| Governance & policy | No central rules | Per-team policy engine | Large |

### Lower Priority (12+ Months)

| Gap | Current State | Target State | Effort |
|-----|---------------|--------------|--------|
| Unified registry | Local plugin storage | Distributed registry service | Large |
| Graph traversal | Flat plugin search | Semantic capability graph | Large |
| Web dashboard | CLI-only interface | Web UI for management | Large |

## Relationship to Roadmap

These gaps map directly to the [ROADMAP.md](ROADMAP.md) phases:

- **Phase I (OSS Supernova)**: Agent SDK, plugin scoring, telemetry
- **Phase II (Cloud Layer)**: Agent memory, marketplace, execution history
- **Phase III (Platform)**: Governance, web dashboard, policy engine
- **Phase IV (Unicorn)**: Full capability mesh, graph traversal, unified registry

These gaps represent future-facing opportunities rather than committed roadmap items; they document the delta between today's shipping features and the aspirational capability-mesh direction.
