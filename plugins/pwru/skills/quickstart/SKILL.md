---
name: pwru
description: Use this skill when the user needs to find out where and why packets are being dropped inside the Linux kernel — firewall rules, routing, XDP, or socket delivery — using Cilium's eBPF packet tracer.
---

# pwru Plugin

pwru ("packet, where are you") attaches eBPF kprobes across the kernel's networking stack and prints every function a matching packet traverses — including the exact spot where it gets dropped. Replaces hours of iptables/tcpdump guesswork when debugging "connection refused/dropped" mysteries.

## Commands

- `pwru trace run` — Live trace with filters (Ctrl-C to stop)
- `pwru self help` — All filter/output flags
- `pwru _ _` — Passthrough to pwru CLI

## Usage Examples

- "Why are packets to port 443 being dropped on this host?"
- "Trace which netfilter hook rejects my pod's traffic"
- "Follow a DNS packet through the kernel stack"

## Installation

```bash
go install github.com/cilium/pwru/cmd/pwru@latest
# or download from https://github.com/cilium/pwru/releases
# Linux >= 5.4 with BTF, run as root
```

## Examples

```bash
# Where are packets to :443 dropped?
sudo pwru --filter-dst-port 443

# Narrow to TCP between specific hosts, print 5-tuple summary
sudo pwru --filter-proto tcp --filter-dst-ip 10.1.2.3 --output-tuple

# Include skb metadata + function call graph
sudo pwru --output-skb --filter-dst-port 53

# Trace only drops (sk_kfree_skb sites)
sudo pwru --filter-func sk_kfree_skb --output-stack
```

## Key Features

- Filters: proto, src/dst IP, ports, interface, netns, cgroup, process
- Output modes: tuple, skb, stack traces, JSON lines, relative timestamps
- Sees netfilter hooks, routing decisions, XDP, conntrack, socket delivery
- No kernel module or config — single static binary, attach and go
- Requires root + kernel BTF (/sys/kernel/btf/vmlinux)
