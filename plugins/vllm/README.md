# vllm Plugin for SuperCLI

[vLLM](https://github.com/vllm-project/vllm) is the de-facto standard
high-throughput LLM inference engine. The `vllm` CLI serves HuggingFace models
behind an OpenAI-compatible API, provides built-in chat/complete clients, and
runs offline throughput/latency benchmarks.

## Installation

```bash
# Install vllm binary
pip install vllm               # or: uv pip install vllm

# Install supercli plugin
supercli plugins install ./plugins/vllm
```

A CUDA GPU is strongly recommended.

## Commands

| Command | Description |
|---------|-------------|
| `supercli vllm self version` | Show vLLM version |
| `supercli vllm model serve <model>` | OpenAI-compatible API server |
| `supercli vllm model chat` | Chat client for a running server |
| `supercli vllm model complete` | One-shot completion client |
| `supercli vllm bench throughput` | Offline throughput benchmark |
| `supercli vllm bench latency` | Latency benchmark |
| `supercli vllm env collect` | Collect env info for bug reports |
| `supercli vllm <any>` | Passthrough to vllm CLI |

## Usage

```bash
# Serve a small model on port 8000
supercli vllm model serve Qwen/Qwen2.5-1.5B-Instruct --port 8000

# Then chat / complete against it (in another shell)
supercli vllm model chat --url http://localhost:8000
supercli vllm model complete --url http://localhost:8000

# Benchmark
supercli vllm bench throughput --model Qwen/Qwen2.5-1.5B-Instruct --input-len 256 --output-len 128
supercli vllm bench latency --model Qwen/Qwen2.5-1.5B-Instruct --batch-size 8

# Debug env for issues
supercli vllm env collect
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
