---
name: devops-tools
description: Use this skill when the user needs any of 80+ DevOps CLI tools for Docker, K8s, Elasticsearch, monitoring, and infrastructure.
---

# DevOps-Python-tools Plugin

Collection of 80+ DevOps CLI tools for cloud services, containers, monitoring, and infrastructure automation.

## Commands

### Tool Execution
- `devops-tools tool run` — Run a specific DevOps tool from the collection

## Available Tool Categories
- **Docker**: container management, image scanning, registry tools
- **Kubernetes**: pod management, service monitoring, config tools
- **Elasticsearch**: cluster health, index management, query tools
- **Splunk**: search, alerting, and monitoring tools
- **Prometheus**: metrics querying and alerting
- **Consul**: service discovery and configuration
- **Mesos/Marathon**: container orchestration tools
- **General**: SSL checks, URL monitoring, DNS tools

## Usage Examples
- "Check Elasticsearch cluster health"
- "List running Docker containers"
- "Query Prometheus metrics"
- "Monitor a URL for availability"

## Installation

```bash
pip install devops-python-tools
```

## Examples

```bash
# Elasticsearch
devops-tools elasticsearch-cluster-health.py --host localhost:9200
devops-tools elasticsearch-list-indices.py --host localhost:9200

# Docker
devops-tools docker-remove-old-images.py
devops-tools docker-image-check.py --image nginx:latest

# Kubernetes
devops-tools kubernetes-list-pods.py
devops-tools kubernetes-delete-evicted-pods.py

# URL monitoring
devops-tools check_url_available.py --url https://example.com
```

## Key Features
- 80+ ready-to-use CLI tools
- Multi-cloud support (AWS, GCP, Azure)
- Docker and Kubernetes integration
- Elasticsearch and Splunk utilities
- Prometheus and monitoring tools
- SSL certificate checking
- URL and DNS monitoring
