# litellm Plugin

## Overview
The `litellm` plugin wraps the LiteLLM CLI. LiteLLM is a lightweight LLM API proxy that provides an OpenAI-format API for calling 100+ LLM providers including OpenAI, Anthropic, Cohere, Together AI, Replicate, Hugging Face, and many more.

## What is litellm?
LiteLLM is a proxy server that translates your requests from OpenAI format to any LLM provider's format. It handles authentication, rate limiting, failover, and cost tracking across multiple providers.

## Quick Start

### 1. Install litellm
```bash
pip install litellm
```

### 2. Start the proxy server
```bash
litellm --model gpt-3.5-turbo --port 8000
```

### 3. Use with OpenAI-compatible clients
```bash
# The proxy exposes an OpenAI-compatible API at http://localhost:8000
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model": "gpt-3.5-turbo", "messages": [{"role": "user", "content": "Hello"}]}'
```

## Common Use Cases

### Proxy with multiple models
```bash
litellm --model gpt-4 --model claude-3-opus --port 8000
```

### Use with environment variables
```bash
export OPENAI_API_KEY=sk-...
export ANTHROPIC_API_KEY=sk-ant-...
litellm --model gpt-4 --port 8000
```

### Set model alias
```bash
litellm --model huggingface/codellama/CodeLlama-7b-Instruct-hf --alias codellama
```

### Run with debug logging
```bash
litellm --model gpt-4 --debug
```

### Custom API base
```bash
litellm --model gpt-4 --api_base https://my-custom-endpoint.com
```

## Key Flags
- `--host` - Host to bind the server to (default: 0.0.0.0)
- `--port` - Port to bind (default: 8000)
- `--model, -m` - Model name to pass to litellm
- `--alias` - User-friendly alias for the model
- `--api_base` - Custom API base URL
- `--api_version` - API version (for Azure)
- `--num_workers` - Number of workers
- `--add_key` - Additional API key
- `--headers` - Custom headers for API calls
- `--save` - Save model-specific config
- `--debug` - Enable debug logging

## Useful Commands
- `sc litellm _ _ --model gpt-4 --port 8000` - Start proxy server
- `sc litellm _ _ --model gpt-4 --debug` - Start proxy with debug logging

## Tips
- Set API keys as environment variables: OPENAI_API_KEY, ANTHROPIC_API_KEY, etc.
- Use `--alias` to give models friendly names
- The proxy supports load balancing across multiple instances of the same model

## Requirements
- Python 3.8+

## Resources
- GitHub: https://github.com/BerriAI/litellm
- Docs: https://docs.litellm.ai
