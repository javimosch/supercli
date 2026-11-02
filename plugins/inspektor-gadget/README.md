# inspektor-gadget Plugin for SuperCLI

[Inspektor Gadget](https://github.com/inspektor-gadget/inspektor-gadget) is an eBPF-powered debugging framework for Kubernetes and containers. It packages tracers as OCI gadget images — trace_exec, trace_dns, trace_tcpconnect, snapshot_process and more — deployed on demand into the cluster.

## Installation

```bash
# Download gadgetctl for your platform from https://github.com/inspektor-gadget/inspektor-gadget/releases and move it to PATH
# Or: go install github.com/inspektor-gadget/inspektor-gadget/cmd/gadgetctl@latest
# Or as a kubectl plugin: kubectl krew install gadget (invoked as kubectl gadget)
# Verify: gadgetctl version

# Install supercli plugin
supercli plugins install ./plugins/inspektor-gadget
```

## Commands

- `inspektor-gadget self version` — Print gadgetctl version
- `inspektor-gadget cluster deploy` — Deploy the Inspektor Gadget DaemonSet into the cluster (gadgetctl deploy). Required once before running gadgets
- `inspektor-gadget cluster undeploy` — Remove the Inspektor Gadget DaemonSet from the cluster (gadgetctl undeploy)
- `inspektor-gadget gadgets run` — Run a gadget image such as trace_exec, trace_dns or trace_tcpconnect (gadgetctl run trace_exec -n myns). Streams live events
- `inspektor-gadget images list` — List local gadget OCI images (gadgetctl image list)
- `inspektor-gadget _ _` — Passthrough to gadgetctl CLI (advise, audit, profile, top, snapshot, traceloop subcommands and image management)

All commands pass extra flags through to the underlying `gadgetctl` CLI.
