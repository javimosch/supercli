# infinity Plugin for SuperCLI

[Infinity](https://github.com/michaelfeil/infinity) is a high-throughput
inference server for embeddings and reranking. The `infinity_emb` CLI serves
one or many HuggingFace models behind an OpenAI-compatible API —
`/v1/embeddings`, `/rerank`, `/v1/classify`, and CLIP image embeddings —
making it the drop-in local backend for RAG and vector search.

## Installation

```bash
# Install infinity_emb binary
pip install "infinity-emb[all]"   # or: pipx install "infinity-emb[all]"

# Install supercli plugin
supercli plugins install ./plugins/infinity
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli infinity self version` | Show Infinity version |
| `supercli infinity server run --model-id <hf>` | Serve embedding/rerank model(s) |
| `supercli infinity <any>` | Passthrough to infinity_emb CLI |

## Usage

```bash
# Serve a small embedding model on CPU-friendly optimum engine
supercli infinity server run --model-id BAAI/bge-small-en-v1.5 --port 7997 --engine optimum

# Multi-model: embeddings + reranker in one server
supercli infinity server run \
  --model-id BAAI/bge-small-en-v1.5 --model-id mixedbread-ai/mxbai-rerank-xsmall-v1 \
  --batch-size 8 --batch-size 4

# Then hit it with any OpenAI client
curl http://localhost:7997/v1/embeddings \
  -d '{"model":"bge-small-en-v1.5","input":"hello world"}'
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
