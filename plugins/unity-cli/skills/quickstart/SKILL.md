---
name: unity-cli
description: Use this skill when the user wants to control Unity Editor from the command line, run C# code in Unity, or automate Unity workflows.
---

# Unity CLI Plugin

Control Unity Editor from the command line. Built for AI agents, works with anything.

## What is unity-cli?

unity-cli is a single binary that talks directly to Unity via HTTP. No server to run, no config to write, no process to manage. Just type a command.

## Quick Start

```bash
# Check Unity connection
sc unity-cli editor status

# Enter play mode and wait
sc unity-cli editor play --wait

# Run C# code inside Unity
sc unity-cli exec code --code "return Application.dataPath;"

# Read console logs
sc unity-cli console read --type error
```

## Key Commands

### Editor Control
- `sc unity-cli editor play` - Enter play mode
- `sc unity-cli editor play --wait` - Enter play mode and wait for completion
- `sc unity-cli editor stop` - Stop play mode
- `sc unity-cli editor pause` - Toggle pause

### Console Logs
- `sc unity-cli console read` - Read error and warning logs
- `sc unity-cli console read --lines 20 --filter error,warning,log` - Read last 20 log entries
- `sc unity-cli console read --type error` - Read only errors
- `sc unity-cli console read --stacktrace user` - Include stack traces

### Execute C# Code
- `sc unity-cli exec code --code "return Application.dataPath;"` - Run C# code
- `sc unity-cli exec code --code "return World.All.Count;" --usings Unity.Entities` - With custom namespaces

### Menu Items
- `sc unity-cli menu execute --path "File/Save Project"` - Execute menu item by path

### Asset Reserialize
- `sc unity-cli reserialize assets` - Reserialize entire project
- `sc unity-cli reserialize assets --assets Assets/Prefabs/Player.prefab` - Reserialize specific asset

### Profiler
- `sc unity-cli profiler hierarchy` - Read profiler hierarchy
- `sc unity-cli profiler hierarchy --depth 3` - Recursive drill-down

## Unity Setup

Add the Unity Connector package via Package Manager → Add package from git URL:
```
https://github.com/youngwoocho02/unity-cli.git?path=unity-connector
```

## Installation

```bash
curl -fsSL https://raw.githubusercontent.com/youngwoocho02/unity-cli/master/install.sh | sh
```

## Use Cases

- Automate Unity Editor workflows from scripts
- Run C# code snippets without opening Unity
- Batch process Unity assets
- Integrate Unity into CI/CD pipelines
- Control Unity from AI agents