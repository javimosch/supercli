# argo-rollouts Plugin for SuperCLI

[kubectl-argo-rollouts](https://github.com/argoproj/argo-rollouts) is the CLI for Argo Rollouts: watch canary and blue-green progress live, promote or abort a release, restart or retry a rollout, and launch the local dashboard.

## Installation

```bash
# Install as a kubectl plugin: kubectl krew install rollouts (binary lands as kubectl-argo-rollouts on PATH)
# Or download kubectl-argo-rollouts for your platform from https://github.com/argoproj/argo-rollouts/releases and move it to PATH
# Or: brew install argoproj/tap/kubectl-argo-rollouts
# Verify: kubectl-argo-rollouts version

# Install supercli plugin
supercli plugins install ./plugins/argo-rollouts
```

## Commands

- `argo-rollouts self version` — Print kubectl-argo-rollouts version
- `argo-rollouts rollouts list` — List rollouts in a namespace (kubectl-argo-rollouts list rollouts -n myns)
- `argo-rollouts rollouts get` — Inspect a rollout with live status (kubectl-argo-rollouts get rollout myapp --watch)
- `argo-rollouts rollouts status` — Wait for and print rollout status (kubectl-argo-rollouts status myapp --timeout 60s)
- `argo-rollouts rollouts promote` — Promote a paused rollout to the next step or fully (kubectl-argo-rollouts promote myapp --full)
- `argo-rollouts rollouts abort` — Abort a rollout and revert to the stable ReplicaSet (kubectl-argo-rollouts abort myapp)
- `argo-rollouts rollouts restart` — Restart a rollout's pods (kubectl-argo-rollouts restart myapp)
- `argo-rollouts dashboard open` — Launch the local rollouts dashboard on :3100 (kubectl-argo-rollouts dashboard -n myns)
- `argo-rollouts _ _` — Passthrough to kubectl-argo-rollouts (pause, retry, undo, set image, create, lint, and experiment/analysis subcommands)

All commands pass extra flags through to the underlying `kubectl-argo-rollouts` CLI.
