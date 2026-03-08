# Docker Manifest Reference

Namespace: `docker`

This plugin ships 20 commands.

## `container`

- `run` -> `docker run` (guarded interactive flags)
- `ps` -> `docker ps`
- `ls` -> `docker ps`
- `start` -> `docker start`
- `stop` -> `docker stop`
- `restart` -> `docker restart`
- `rm` -> `docker rm`
- `exec` -> `docker exec` (guarded interactive flags)
- `logs` -> `docker logs`
- `inspect` -> `docker inspect`

## `image`

- `build` -> `docker build`
- `images` -> `docker images`
- `ls` -> `docker images`
- `pull` -> `docker pull`
- `push` -> `docker push`
- `rmi` -> `docker rmi`
- `tag` -> `docker tag`

## `system`

- `info` -> `docker info`
- `version` -> `docker version`
- `df` -> `docker system df`

## Safety warnings

- Non-TTY contexts cannot execute guarded interactive flags (`-i`, `-t`, `--interactive`, `--tty`) for `container run` and `container exec`.
- Safety violations are rejected with code `91`.
