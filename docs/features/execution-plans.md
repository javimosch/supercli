# Execution Plans (DAG)

Execution Plans allow supercli to decouple the intent to execute a command from the actual execution itself. This gives agents (and humans) the ability to dry-run commands, verify correctness, analyze side effects, and explicitly authorize actions.

## Key Features

- **4-Step Directed Acyclic Graph (DAG)**: Computes the precise chain of operations needed to run a command:
  1. `resolve`: Lookup the command spec and backend adapter configuration.
  2. `validate`: Run input schema validation.
  3. `adapter`: Prepare the external request (HTTP, MCP, OpenAPI) based on the input.
  4. `transform`: Process the raw response into the finalized output format.
- **Risk Assessment**: Automatically classifies execution intent based on the presence of side-effects (`safe` for reads, `medium` for mutations).
- **Stateful Short-Lived Plans**: The backend safely stores generated execution plans with unique IDs, locking the execution context so it cannot be tampered with between generation and execution.

## Usage

```bash
# 1. Generate an execution plan without running the command
supercli plan <namespace> <resource> <action> --arg1 value

# (Output returns a plan_id and a list of steps)

# 2. Execute the previously created plan
supercli execute <plan_id>
```
