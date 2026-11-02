---
name: ksniff
description: Use this skill when the user needs to capture network traffic from a Kubernetes pod — tcpdump on a pod, stream to Wireshark, or write a pcap file for analysis.
---

# ksniff Plugin

[ksniff](https://github.com/eldadru/ksniff) captures network traffic from Kubernetes pods: it uploads a static tcpdump into the target pod and streams the packets to your machine — straight into Wireshark or a pcap file.

## Commands

- `ksniff self usage` — Print kubectl-sniff usage and flags
- `ksniff pods capture` — Capture traffic from a pod (kubectl-sniff mypod -n myns -o capture.pcap). Add -f for a BPF filter, -i for interface, -v to stream to Wireshark
- `ksniff _ _` — Passthrough to kubectl-sniff (same as kubectl sniff) — pod arg plus tcpdump/filter flags

## Installation

```bash
# Install as a kubectl plugin: kubectl krew install sniff (binary lands as kubectl-sniff on PATH)
# Or download kubectl-sniff from https://github.com/eldadru/ksniff/releases and move it to PATH
# Verify: kubectl-sniff --help
```

Invoked either as 'kubectl sniff' via krew or directly as kubectl-sniff. It uploads a static tcpdump into the pod and streams the capture back — pipe straight into Wireshark or save with -o capture.pcap.
