---
name: oc
description: Use this skill when the user wants to log in to, inspect, or deploy applications on Red Hat OpenShift clusters with the oc CLI.
---

# OpenShift CLI (oc) Plugin

`oc` is the OpenShift command-line client — a superset of kubectl adding OpenShift resources (projects, routes, build configs, image streams, deployment configs) plus developer workflows (`oc new-app`) and cluster-admin tools (`oc adm`).

## Commands

### Auth & projects
- `oc auth login` — `oc login <server> --token=...` or with `--username/--password`
- `oc auth whoami` — Current user (`--show-server`, `--show-token`)
- `oc project list` — List accessible projects
- `oc project switch <name>` — Switch project (`oc new-project <name>` to create)

### Apps & resources
- `oc app new` — Deploy from source, image, or template
- `oc status get` — Project overview
- `oc resource get` — `oc get <type> [name]` for any resource
- `oc _ _` — Passthrough (`oc logs`, `oc exec`, `oc start-build`, `oc rollout`, `oc adm`)

## Usage Examples

- "Log in to the OpenShift cluster with this token"
- "Deploy a new app from this Git repo"
- "Show project status and running pods"
- "Switch to the staging project"

## Installation

```bash
curl -LO https://mirror.openshift.com/pub/openshift-v4/clients/ocp/stable/openshift-client-linux.tar.gz
tar xzf openshift-client-linux.tar.gz oc
mv oc ~/.local/bin/
# or: brew install openshift-cli
```

## Examples

```bash
oc login https://api.cluster.example.com:6443 --token=sha256~xxx
oc new-app https://github.com/org/repo --name=myapp
oc get pods,routes -o wide
oc start-build myapp --follow
oc rollout status deployment/myapp
oc adm top nodes
```

## Key Features

- Everything kubectl does (`oc` embeds it), plus OpenShift types
- `new-app`/`new-build` source-to-image workflows
- `oc adm` cluster administration (must-gather, top, cordon, policy)
- `--as`/`--as-group` impersonation for ops debugging
