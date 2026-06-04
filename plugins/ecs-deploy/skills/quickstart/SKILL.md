---
name: ecs-deploy
description: Use this skill when the user wants to deploy to Amazon ECS with zero-downtime deployment strategies.
---

# ecs-deploy Plugin

CLI tool for zero-downtime Amazon ECS service deployments with support for various deployment strategies.

## Commands

### Service Deployment
- `ecs-deploy service deploy` — Deploy new task definition to an ECS service

## Usage Examples
- "Deploy to my ECS service"
- "Update the ECS service with a new container image"
- "Roll out changes to ECS"

## Installation

```bash
pip install ecs-deploy
```

## Examples

```bash
ecs-deploy --cluster my-cluster --service-name my-service --image myrepo:latest
ecs-deploy --cluster my-cluster --service-name my-service --tag v1.2.3
ecs-deploy --cluster my-cluster --service-name my-service --image myrepo:latest --timeout 600
```

## Key Features
- Zero-downtime rolling deployments
- Container image and tag updates
- Deployment timeout and rollback
- AWS ECS API integration
- Cluster and service targeting
- Python-based, easy to extend
