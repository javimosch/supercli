---
name: vllm
description: Use this skill when the user wants to serve a local LLM behind an OpenAI-compatible API or benchmark model throughput/latency with vLLM.
---

# vllm Plugin

vLLM is the reference high-throughput LLM inference/serving engine (PagedAttention, continuous batching, tensor parallelism). Its CLI serves models behind an OpenAI-compatible API and includes chat/complete clients and benchmarks.

## Commands

### Serving
- `vllm model serve <model>` — Start an OpenAI-compatible server (long-running; pass `--port`, `--dtype`, `--gpu-memory-utilization`, etc.)
- `vllm model chat` — Interactive chat client against a running server
- `vllm model complete` — One-shot completion client

### Benchmarks
- `vllm bench throughput` — Offline throughput benchmark
- `vllm bench latency` — Latency benchmark

### Diagnostics
- `vllm env collect` — Environment report for bug reports
- `vllm _ _` — Passthrough (`run-batch`, `bench serve`, ...)

## Usage Examples

- "Serve Qwen2.5-1.5B as an OpenAI API on port 8000"
- "Benchmark throughput of this model with 256-token inputs"
- "Collect my environment for a vLLM bug report"

## Installation

```bash
pip install vllm      # or: uv pip install vllm
```

CUDA GPU strongly recommended; ~2GB install (bundles PyTorch).

## Examples

```bash
# Serve with quantization + memory tuning
vllm serve Qwen/Qwen2.5-1.5B-Instruct --port 8000 --dtype auto --gpu-memory-utilization 0.85

# One-shot client calls
vllm chat --url http://localhost:8000
vllm complete --url http://localhost:8000

# Benchmarks
vllm bench throughput --model Qwen/Qwen2.5-1.5B-Instruct --input-len 256 --output-len 128
vllm bench latency --model Qwen/Qwen2.5-1.5B-Instruct --batch-size 8
```

## Key Features

- OpenAI-compatible `/v1/chat/completions`, `/v1/completions`, `/v1/embeddings`
- PagedAttention KV-cache management → high throughput, low latency
- Continuous batching + tensor/pipeline parallelism across GPUs
- Built-in `bench` suite (throughput, latency, and `bench serve` for online load)
