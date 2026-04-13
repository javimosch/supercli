---
name: uipath.quickstart
description: Agent workflow for UiPath CLI package deployment with non-interactive credentials.
tags: uipath,uipcli,rpa,cicd,automation
---

# uipath Quickstart

Use this skill when automating UiPath package deployment tasks in CI/CD.

## 1) Learn and install

```bash
supercli plugins learn uipath
supercli plugins install ./plugins/uipath --json
```

## 2) Validate setup

```bash
supercli uipath cli version
```

## 3) Deploy with wrapper command

```bash
supercli uipath package deploy \
  --path ./dist/my-automation \
  --application-id "$UIPATH_APP_ID" \
  --application-secret "$UIPATH_APP_SECRET" \
  --account-for-app "$UIPATH_ORG" \
  --organization "$UIPATH_ORG" \
  --tenant "$UIPATH_TENANT" \
  --uri "$UIPATH_URI"
```

## 4) Use passthrough for full CLI coverage

```bash
supercli uipath package pack ./project
supercli uipath orchestrator folders list
```

## 5) Caveats

- Prefer environment-injected secrets in automation contexts.
- Use passthrough whenever a command or flag is not wrapped.
