#!/bin/bash
export GITLAB_TOKEN=$(grep GITLAB_TOKEN /home/jarancibia/ai/gitlab-mr-review/.env | cut -d= -f2-)
export GITHUB_TOKEN=$(grep GITHUB_TOKEN /home/jarancibia/ai/gitlab-mr-review/.env | cut -d= -f2-)
export OPENROUTER_API_KEY=$(grep OPENROUTER_API_KEY /home/jarancibia/ai/gitlab-mr-review/.env | cut -d= -f2-)
export GITLAB_DEFAULT_PROJECT=$(grep GITLAB_DEFAULT_PROJECT /home/jarancibia/ai/gitlab-mr-review/.env | cut -d= -f2-)

cd /home/jarancibia/ai/gitlab-mr-review

args=()
[ -n "{{mr}}" ] && args+=("{{mr}}")
[ -n "{{platform}}" ] && args+=("--platform" "{{platform}}")
[ -n "{{project}}" ] && args+=("--project" "{{project}}")
[ -n "{{input-file}}" ] && args+=("--input-file" "{{input-file}}")
[ -n "{{guidelines-file}}" ] && args+=("--guidelines-file" "{{guidelines-file}}")
[ -n "{{max-diff-chars}}" ] && args+=("--max-diff-chars" "{{max-diff-chars}}")
[ "{{debug}}" = "true" ] && args+=("--debug")
[ "{{fail-on-truncate}}" = "true" ] && args+=("--fail-on-truncate")

echo "DEBUG: Executing with args: ${args[*]}" >&2
exec /home/jarancibia/.nvm/versions/node/v24.3.0/bin/mr-pilot "${args[@]}"