# podman Quickstart

podman is a daemonless container runtime compatible with Docker.

## Commands
- `podman <resource> <action>` — Execute podman commands
- `podman self version` — Print podman version
- `podman container run` — Run container
- `podman image pull` — Pull container image
- `podman _ _` — Passthrough to podman CLI

## Installation

```bash
brew install podman
```

## Basic Usage

```bash
podman run -it ubuntu:latest
podman images
podman ps
```

## Resources

- [GitHub](https://github.com/containers/podman)
- [Docs](https://docs.podman.io/)
