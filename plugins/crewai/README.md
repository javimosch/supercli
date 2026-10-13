# crewai Plugin for SuperCLI

[CrewAI](https://github.com/crewAIInc/crewAI) is the leading framework for
orchestrating role-playing, autonomous AI agents. The `crewai` CLI scaffolds
crew and flow projects, then runs, trains, tests, replays, and deploys them.

## Installation

```bash
# Install crewai binary
pip install crewai crewai-tools   # or: uv tool install crewai --with crewai-tools

# Install supercli plugin
supercli plugins install ./plugins/crewai
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli crewai self version` | Show CrewAI version |
| `supercli crewai crew create <name>` | Scaffold a crew project |
| `supercli crewai flow create <name>` | Scaffold a flow project |
| `supercli crewai crew run` | Run the current crew |
| `supercli crewai flow kickstart` | Run the current flow |
| `supercli crewai crew train` | Train the crew (n iterations) |
| `supercli crewai crew test` | Test the crew, score output |
| `supercli crewai crew replay` | Replay from a task id |
| `supercli crewai <any>` | Passthrough to crewai CLI |

## Usage

```bash
# New crew project, then run it
supercli crewai crew create research_crew
cd research_crew && supercli crewai crew run

# Quality loop
supercli crewai crew train -n 5 --filename trained.pkl
supercli crewai crew test -n 3 --model gpt-4o-mini

# Flows (event-driven)
supercli crewai flow create data_flow
supercli crewai flow kickstart
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
