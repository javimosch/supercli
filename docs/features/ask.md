# Natural Language execution ("ask")

supercli seamlessly translates natural language intents into execution steps in your infrastructure by mapping user queries directly to your established command capability graph.

## Key Features

- **Decentralized Execution (`SUPERCLI_SERVER` vs Local)**: supercli can generate natural language execution workflows on the backend server to share API keys across teams, or directly on the individual developer's machine locally using `OPENAI_BASE_URL`.
- **Automatic Fallback Execution**: The translation produces a DAG workflow JSON. supercli takes this JSON and runs it sequentially via the standard workflow planner mechanism.
- **Dynamic Context**: The LLM context is strictly limited to the definitions and JSON schemas of the actual configured commands.

## Setup

Set environment variables on either the local machine (for purely local mode) or the backend server (`server/app.js`):

```bash
export OPENAI_BASE_URL=https://api.openai.com/v1
export OPENAI_MODEL=gpt-4
export OPENAI_API_KEY=sk-...
```

## Usage

If the feature is enabled (either server-side or locally), it becomes visible in `supercli help`.

```bash
# Query the system to build and execute a workflow
supercli ask "list the posts and summarize them"

# Output will stream the execution steps
# 1. jsonplaceholder posts list 
# 2. ai text summarize --text="{{step.0.data.summary}}"
```
