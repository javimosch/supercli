# oc Plugin for SuperCLI

[oc](https://github.com/openshift/oc) is the OpenShift command-line client — a kubectl
superset that adds OpenShift resources (projects, routes, builds, image streams) plus
developer workflows (`oc new-app`) and cluster-admin tooling (`oc adm`).

## Installation

```bash
# Install oc binary (pick one)
curl -LO https://mirror.openshift.com/pub/openshift-v4/clients/ocp/stable/openshift-client-linux.tar.gz
tar xzf openshift-client-linux.tar.gz oc
mv oc ~/.local/bin/
# or: brew install openshift-cli

# Install supercli plugin
supercli plugins install ./plugins/oc
```

## Commands

| Command | Description |
|---------|-------------|
| `supercli oc self version` | Show oc client version |
| `supercli oc auth login` | Log in to a cluster |
| `supercli oc auth whoami` | Show current user/server/token |
| `supercli oc project list` | List accessible projects |
| `supercli oc project switch` | Switch project |
| `supercli oc app new` | Deploy from source/image/template |
| `supercli oc status get` | Project overview |
| `supercli oc resource get` | Get any resource |
| `supercli oc <any>` | Passthrough to oc CLI |

## Usage

```bash
supercli oc auth login https://api.cluster:6443 -- --token=sha256~xxx
supercli oc app new https://github.com/org/repo -- --name=myapp
supercli oc resource get pods -- -o wide
```

## Learn More

See `skills/quickstart/SKILL.md` for detailed usage guide.
