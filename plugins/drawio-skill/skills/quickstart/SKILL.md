---
name: drawio-skill
description: Use this skill when the user wants to create diagrams, flowcharts, architecture drawings, ERDs, UML diagrams, or any visual from natural language descriptions.
---

# drawio-skill — Text to Professional Diagrams

Agent skill that generates draw.io diagrams from natural language and exports to PNG/SVG/PDF/JPG via the draw.io desktop CLI. Works with Claude Code, Cursor, Copilot, Codex, and any SKILL.md-compatible agent.

## Installation

```bash
# 1. Install draw.io desktop CLI
# 2. Clone the skill
git clone https://github.com/Agents365-ai/drawio-skill.git
# 3. Teach the skill
sc skills teach drawio-skill:quickstart
```

## How It Works

Describe a diagram in natural language → skill generates `.drawio` XML → exports to your chosen format → self-checks → iterative feedback loop (5 rounds).

## Supported Diagram Types

| Category | Examples | Features |
|----------|----------|----------|
| Architecture | microservices, cloud (AWS/GCP/Azure), network topology, deployment | Tier-based swimlanes, hub-center |
| ML / Deep Learning | Transformer, CNN, LSTM, GRU | Tensor annotations, layer color coding |
| Flowcharts | business processes, workflows, decision trees | Semantic shapes |
| UML | class diagrams, sequence diagrams | Inheritance/composition arrows |
| Data | ER diagrams, DFD | PK/FK notation, table containers |
| Other | org charts, mind maps, wireframes | — |

## Usage Prompts

- "Create a microservices e-commerce architecture with API Gateway, auth/user/order services, Kafka, separate databases"
- "Draw a UML class diagram for a payment system with Customer, Order, Payment, Invoice entities"
- "Generate an ER diagram for a blog platform with Users, Posts, Comments, Tags"
- "Make a flowchart for user authentication flow from login to dashboard"
- "Draw a network topology for a multi-region Kubernetes deployment"

## Style Presets

The skill can capture your visual style from a `.drawio` file or image, save it by name, and reapply on demand. Built-in presets are available for common use cases.

## Key Features

- Natural language → `.drawio` XML generation
- Multi-format export: PNG, SVG, PDF, JPG
- 6 built-in diagram presets
- Self-check + auto-fix (2 rounds) + iterative feedback (5 rounds)
- Style presets: learn from existing files or images
- Auto-triggers when diagrams would help explain complex systems
