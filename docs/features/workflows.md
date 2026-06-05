# Multi-Step Workflows

supercli handles command chaining inherently via Workflow Commands without forcing agents or developers to write complicated shell orchestration.

## Key Features

- **Workflow Adapter Definition**: supercli represents compound multi-step processes as just another single command in its capability tree (`type: workflow`).
- **Data Piping (Context Mapping)**: When a workflow command executes, the `stdout` JSON result of step 1 can automatically be injected into the arguments of step 2. This creates clean API mapping layers (e.g., extract an ID from one endpoint, pass it to another).
- **Atomic Abstraction**: A complex graph of actions is compacted into one deterministic interface that agents discover seamlessly.

## Usage

A workflow is stored as a standard command in the registry, composed of references to other commands:

```json
{
  "namespace": "aws",
  "resource": "instances",
  "action": "restart_and_log",
  "type": "workflow",
  "adapterConfig": {
    "steps": [
      { "command": "aws.instances.restart", "args": { "instance_id": "{{args.id}}" } },
      { "command": "logging.events.publish", "args": { "message": "Instance {{step.0.data.status}} restarted." } }
    ]
  }
}
```

```bash
# Executing the workflow command feels completely standard
supercli aws instances restart_and_log --id i-0123456789
```
