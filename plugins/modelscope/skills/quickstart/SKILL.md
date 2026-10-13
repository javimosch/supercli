---
name: modelscope
description: Use this skill when the user wants to download, upload, or manage AI models and datasets from the ModelScope hub (Qwen and friends).
---

# modelscope Plugin

ModelScope is Alibaba's open model hub. The `modelscope` CLI (alias `ms`) fetches models/datasets with revision and glob control, uploads to repos, and handles hub auth — the standard way to grab Qwen weights for local runs.

## Commands

### Models & Datasets
- `modelscope model download --model <id>` — Download a model (`--local_dir`, `--revision`, `--include`, `--exclude`, or positional file paths)
- `modelscope dataset download --dataset <id>` — Download a dataset

### Hub
- `modelscope hub login` — `modelscope login --token <sdk-token>` (only needed for private/gated repos)
- `modelscope hub upload` — `modelscope upload <repo_id> <local_path>`
- `modelscope _ _` — Passthrough (`create`, `pipeline`, ...)

## Usage Examples

- "Download Qwen3-0.6B into ./models"
- "Grab just the *.safetensors files of this model"
- "Download a specific revision of a dataset"

## Installation

```bash
pip install modelscope    # or: pipx install modelscope
```

## Examples

```bash
# Full model to the cache
modelscope download --model Qwen/Qwen3-0.6B

# Plain directory, filtered files
modelscope download --model Qwen/Qwen3-0.6B --local_dir ./qwen3 --include '*.json' '*.safetensors'

# Single file by positional path
modelscope download --model Qwen/Qwen3-0.6B config.json
```

## Key Features

- No auth needed for public models/datasets
- Glob `--include`/`--exclude`, `--revision`, `--cache_dir`, `--local_dir`
- `upload`, `login`, `create` for publishing your own repos
- Pairs well with vllm/llama.cpp plugins — download weights, then serve
