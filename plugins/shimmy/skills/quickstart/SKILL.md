---
name: shimmy
description: Use this skill when the user wants to run local LLM inference with an OpenAI-compatible API.
---

# Shimmy Plugin

Lightweight OpenAI-compatible local inference server for GGUF models. Single binary, no dependencies.

## Commands

### Server
- `shimmy server start` — Start the OpenAI-compatible inference server

## Usage Examples
- "Start a local LLM server"
- "Run GGUF model with OpenAI API"
- "Serve a local model on port 8080"

## Installation

```bash
cargo install shimmy
```

## Examples

```bash
# Basic usage
SHIMMY_BASE_GGUF=/path/to/model.gguf shimmy serve

# With INT4 KV cache compression
shimmy serve --kv-quant int4

# Custom port
shimmy serve --port 9000
```

## Key Features
- 100% OpenAI-compatible API endpoints
- Pure-Rust WebGPU (WGSL) inference engine
- TurboShimmy INT4 KV for ~7x less VRAM
- Hot model swap, auto-discovery
- Single binary, no C++ toolchain needed
- Free forever
