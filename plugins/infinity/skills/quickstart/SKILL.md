---
name: infinity
description: Use this skill when the user wants a local OpenAI-compatible embeddings, reranking, or CLIP image-embedding server for RAG and vector search.
---

# infinity Plugin

Infinity (`infinity_emb` binary) serves embedding and reranker models at high throughput. One command starts an OpenAI-compatible API — `/v1/embeddings`, `/rerank`, `/v1/classify`, CLIP image embeddings — making it a drop-in local replacement for hosted embedding APIs.

## Commands

- `infinity self version` — Print version
- `infinity server run --model-id <hf>` — `infinity_emb v2`; repeat `--model-id`/`--batch-size` for multi-model serving (`--port`, `--engine`, `--dtype`, `--device`, `--compile`, `--served-model-name`, `--embedding-dtype`)
- `infinity _ _` — Passthrough to infinity_emb CLI

## Usage Examples

- "Serve bge-small embeddings locally on port 7997"
- "Run an embedder and a reranker in one server"
- "Give me an OpenAI-compatible embeddings endpoint with no API key"

## Installation

```bash
pip install "infinity-emb[all]"    # Python 3.9+; pipx also works
```

CPU works out of the box (`--engine optimum` or `ctranslate2`); CUDA via `--engine torch`. Docker: `docker run -p 7997:7997 michaelf34/infinity:latest v2 --model-id <hf>`.

## Examples

```bash
# Single embedding model
infinity_emb v2 --model-id BAAI/bge-small-en-v1.5 --port 7997

# Embedder + reranker, int8 quantized weights
infinity_emb v2 \
  --model-id BAAI/bge-small-en-v1.5 --model-id mixedbread-ai/mxbai-rerank-xsmall-v1 \
  --batch-size 32 --batch-size 8 --dtype int8

# Test the endpoint
curl localhost:7997/v1/embeddings -d '{"model":"bge-small-en-v1.5","input":"hi"}'
```

## Key Features

- OpenAI-compatible `/v1/embeddings` + `/rerank` + `/v1/classify` + CLIP images
- Multi-model in one process: repeat `--model-id`, options broadcast
- Engines: torch, optimum (ONNX), ctranslate2, neuron; dtype/quantization control
- Dynamic batching → high throughput; `INFINITY_*` env vars mirror every flag
