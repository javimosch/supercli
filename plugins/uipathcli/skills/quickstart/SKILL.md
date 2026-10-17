# UiPath CLI Quickstart

Use this plugin for CI/CD automation tasks with UiPath CLI.

## Commands
- `uipathcli <resource> <action>` — Execute uipathcli commands
- `uipath self version` — Show UiPath CLI version
- `uipath project pack` — Pack a UiPath project into a package
- `uipath project analyze` — Run static analysis for a UiPath project
- `uipath project deploy` — Deploy a UiPath package to Orchestrator
- `uipath _ _` — Passthrough command to execute any UiPath CLI command

## Prerequisites

- Install UiPath CLI package for your OS.
- Make `uipcli` available on PATH, or set `UIPCLI_DLL` and install `dotnet` runtime.
- Install plugin: `supercli plugins install uipathcli`

## Common Commands

- Version: `supercli uipath self version`
- Pack: `supercli uipath project pack --project-path .`
- Analyze: `supercli uipath project analyze --project-path .`
- Deploy: `supercli uipath project deploy --orchestrator-url https://...`

## Passthrough

Use passthrough for any command not wrapped in this plugin:

`supercli uipath <raw uipcli args>`
