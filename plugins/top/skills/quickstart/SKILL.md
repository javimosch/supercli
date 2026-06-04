---
name: top
description: top — display Linux processes in real-time
---

# top Plugin

Display and manage Linux processes in real-time.

## Commands

- `top self version` — Print top version
- `top _ _ ` — Passthrough to top

## Usage Examples

- Show processes sorted by CPU: `top`
- Show processes sorted by memory: `top -o %MEM`
- Show only processes for a user: `top -u <username>`
- Batch mode (one-shot): `top -bn1`

## Installation

Standard procps-ng utility, pre-installed on most Linux systems.
