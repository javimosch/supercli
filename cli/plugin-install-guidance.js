const PLUGIN_INSTALL_GUIDANCE = {
  beads: {
    plugin: "beads",
    binary: "br",
    check: "br --version",
    install_steps: [
      "curl -fsSL \"https://raw.githubusercontent.com/Dicklesworthstone/beads_rust/main/install.sh?$(date +%s)\" | bash",
      "br --version"
    ],
    note: "Installation is intentionally delegated to your LLM/automation flow (dcli/scli/supercli)."
  },
  gwc: {
    plugin: "gwc",
    binary: "gws",
    check: "gws --version",
    install_steps: [
      "npm install -g @googleworkspace/cli",
      "gws --version"
    ],
    note: "Installation is intentionally delegated to your LLM/automation flow (dcli/scli/supercli)."
  },
  commiat: {
    plugin: "commiat",
    binary: "commiat",
    check: "commiat --version",
    install_steps: [
      "npm install -g commiat",
      "commiat --version"
    ],
    note: "Installation is intentionally delegated to your LLM/automation flow (dcli/scli/supercli)."
  },
  docker: {
    plugin: "docker",
    binary: "docker",
    check: "docker --version",
    install_steps: [
      "docker --version"
    ],
    note: "Install Docker Engine/Desktop using your OS package manager, then verify with docker --version."
  },
  stripe: {
    plugin: "stripe",
    binary: "stripe",
    check: "stripe --version",
    install_steps: [
      "brew install stripe/stripe-cli/stripe",
      "stripe --version",
      "stripe login"
    ],
    note: "Install Stripe CLI and authenticate with stripe login before running API commands."
  },
  vercel: {
    plugin: "vercel",
    binary: "vercel",
    check: "vercel --version",
    install_steps: [
      "npm install -g vercel",
      "vercel --version",
      "vercel login"
    ],
    note: "Install Vercel CLI and authenticate with vercel login before running account or project commands."
  },
  linear: {
    plugin: "linear",
    binary: "linear",
    check: "linear --version",
    install_steps: [
      "npm install -g @schpet/linear-cli",
      "npm install -D @schpet/linear-cli",
      "linear --version",
      "linear auth login"
    ],
    note: "Targets community package @schpet/linear-cli; if installed locally, invoke via npx --no-install linear."
  },
  railway: {
    plugin: "railway",
    binary: "railway",
    check: "railway --version",
    install_steps: [
      "npm install -g @railway/cli",
      "npm install -D @railway/cli",
      "railway --version",
      "railway login"
    ],
    note: "If installed locally, use npx --no-install railway and ensure node_modules/.bin is in PATH for dcli plugin execution."
  },
  supabase: {
    plugin: "supabase",
    binary: "supabase",
    check: "supabase --version",
    install_steps: [
      "npm install -g supabase",
      "npm install -D supabase",
      "supabase --version",
      "supabase login"
    ],
    note: "If installed locally, use npx --no-install supabase and ensure node_modules/.bin is in PATH for dcli plugin execution."
  },
  gh: {
    plugin: "gh",
    binary: "gh",
    check: "gh --version",
    install_steps: [
      "gh --version",
      "gh auth login"
    ],
    note: "Install GitHub CLI with your platform package manager and authenticate with gh auth login before using account or repo commands."
  },
  kubectl: {
    plugin: "kubectl",
    binary: "kubectl",
    check: "kubectl version --client",
    install_steps: [
      "kubectl version --client",
      "kubectl config current-context"
    ],
    note: "Install kubectl with your platform package manager and ensure your kubeconfig is already configured before using cluster commands."
  },
  terraform: {
    plugin: "terraform",
    binary: "terraform",
    check: "terraform version -json",
    install_steps: [
      "terraform version -json",
      "terraform init"
    ],
    note: "Install Terraform with your platform package manager. For state-dependent commands, run inside an initialized Terraform working directory."
  },
  aws: {
    plugin: "aws",
    binary: "aws",
    check: "aws --version",
    install_steps: [
      "aws --version",
      "aws configure"
    ],
    note: "Install AWS CLI with your platform package manager and configure credentials before using account or service commands."
  },
  gcloud: {
    plugin: "gcloud",
    binary: "gcloud",
    check: "gcloud --version",
    install_steps: [
      "gcloud --version",
      "gcloud auth login"
    ],
    note: "Install Google Cloud CLI with your platform package manager and authenticate with gcloud auth login before using account or project commands."
  },
  az: {
    plugin: "az",
    binary: "az",
    check: "az version",
    install_steps: [
      "az version",
      "az login"
    ],
    note: "Install Azure CLI with your platform package manager and authenticate with az login before using account or resource commands."
  },
  helm: {
    plugin: "helm",
    binary: "helm",
    check: "helm version --short",
    install_steps: [
      "helm version --short",
      "kubectl config current-context"
    ],
    note: "Install Helm with your platform package manager. For release and cluster-backed commands, ensure your Kubernetes context is already configured."
  },
  npm: {
    plugin: "npm",
    binary: "npm",
    check: "npm --version",
    install_steps: [
      "npm --version",
      "npm login"
    ],
    note: "npm is usually installed with Node.js. Run npm login only if you need authenticated registry operations."
  },
  pulumi: {
    plugin: "pulumi",
    binary: "pulumi",
    check: "pulumi version",
    install_steps: [
      "pulumi version",
      "pulumi login"
    ],
    note: "Install Pulumi with your platform package manager and authenticate with pulumi login before using stack or cloud-backed commands."
  },
  pnpm: {
    plugin: "pnpm",
    binary: "pnpm",
    check: "pnpm --version",
    install_steps: [
      "pnpm --version",
      "pnpm login"
    ],
    note: "Install pnpm with your platform package manager or via corepack. Run pnpm login only if you need authenticated registry operations."
  },
  uv: {
    plugin: "uv",
    binary: "uv",
    check: "uv --version",
    install_steps: [
      "curl -LsSf https://astral.sh/uv/install.sh | sh",
      "uv --version"
    ],
    note: "Install uv with the official installer or your platform package manager. Run uv auth login only if you need private index authentication."
  },
  poetry: {
    plugin: "poetry",
    binary: "poetry",
    check: "poetry --version",
    install_steps: [
      "curl -sSL https://install.python-poetry.org | python3 -",
      "poetry --version"
    ],
    note: "Install Poetry with the official installer or pipx. Configure repository credentials only if you need private package publishing or installs."
  },
  eza: {
    plugin: "eza",
    binary: "eza",
    check: "eza --version",
    install_steps: [
      "cargo install eza",
      "eza --version"
    ],
    note: "Install eza with your platform package manager or cargo. It is a non-interactive ls replacement, so no login or account setup is required."
  },
  just: {
    plugin: "just",
    binary: "just",
    check: "just --version",
    install_steps: [
      "cargo install just",
      "just --version"
    ],
    note: "Install just with your platform package manager or cargo. Most useful commands operate on a nearby justfile, but help and version commands work anywhere."
  },
  watchexec: {
    plugin: "watchexec",
    binary: "watchexec",
    check: "watchexec --version",
    install_steps: [
      "cargo install --locked watchexec-cli",
      "watchexec --version"
    ],
    note: "Install watchexec with your platform package manager, cargo binstall, or cargo. It is non-interactive and works well for scripted file-watching workflows."
  },
  nextest: {
    plugin: "nextest",
    binary: "cargo-nextest",
    check: "cargo-nextest --version",
    install_steps: [
      "cargo install cargo-nextest --locked",
      "cargo-nextest --version"
    ],
    note: "Install cargo-nextest with prebuilt binaries or cargo. Most commands are intended for Rust workspaces, but version and help commands work anywhere."
  },
  mysql: {
    plugin: "mysql",
    binary: "mysql",
    check: "mysql --version",
    install_steps: [
      "mysql --version",
      "supercli plugins install mysql",
      "supercli mysql cli version --json",
      "supercli mysql query execute --execute \"select 1\" --host 127.0.0.1 --user root --database mysql --json"
    ],
    note: "Install the MySQL client with your platform package manager. The wrapped query command is tuned for batch output and works best when connection settings come from flags or standard MySQL environment variables like MYSQL_HOST, MYSQL_USER, MYSQL_DATABASE, and MYSQL_PWD."
  },
  mongosh: {
    plugin: "mongosh",
    binary: "mongosh",
    check: "mongosh --version",
    install_steps: [
      "mongosh --version",
      "supercli plugins install mongosh",
      "supercli mongosh cli version --json",
      "supercli mongosh server ping --host 127.0.0.1 --port 27017 --json",
      "supercli mongosh eval run --javascript \"db.adminCommand({ ping: 1 })\" --json"
    ],
    note: "This plugin targets the current mongosh shell rather than the legacy mongo shell. Wrapped commands prefer relaxed JSON output for automation, while raw passthrough remains available for connection-string-based flows."
  },
  blogwatcher: {
    plugin: "blogwatcher",
    binary: "blogwatcher",
    check: "blogwatcher --version",
    install_steps: [
      "brew install Hyaxia/tap/blogwatcher",
      "go install github.com/Hyaxia/blogwatcher/cmd/blogwatcher@latest",
      "blogwatcher --version",
      "supercli plugins install blogwatcher",
      "supercli skills list --catalog --provider blogwatcher --json",
      "supercli skills get blogwatcher:root.skill",
      "supercli blogwatcher blogs list --json"
    ],
    note: "This hybrid plugin indexes the upstream BlogWatcher README and SKILL documents into the skills catalog and exposes non-interactive wrappers for the local CLI. BlogWatcher stores data under ~/.blogwatcher, so use an isolated HOME when you want disposable test data."
  },
  himalaya: {
    plugin: "himalaya",
    binary: "himalaya",
    check: "himalaya --version",
    install_steps: [
      "brew install himalaya",
      "cargo install himalaya --locked",
      "himalaya --version",
      "supercli plugins install himalaya",
      "supercli himalaya account list --json",
      "supercli himalaya folder list --account personal --json",
      "supercli himalaya envelope list --account personal --folder INBOX --page 1 --json"
    ],
    note: "Prefer the wrapped read-only commands for automation. Himalaya itself uses --output json rather than --json, and interactive or write-side flows like account configure, message send, and mailbox mutation are intentionally left out of wrapped v1."
  },
  wacli: {
    plugin: "wacli",
    binary: "wacli",
    check: "wacli --version",
    install_steps: [
      "brew install steipete/tap/wacli",
      "go build -tags sqlite_fts5 -o ./dist/wacli ./cmd/wacli",
      "wacli --version",
      "supercli plugins install wacli",
      "supercli wacli doctor run --json",
      "supercli wacli auth status --json",
      "supercli wacli chats list --store ~/.wacli --json"
    ],
    note: "This plugin intentionally wraps only read-only diagnostics and local-store inspection commands. Use the upstream wacli CLI directly for QR auth, sync loops, sending messages, media download, and group/contact mutations."
  },
  xurl: {
    plugin: "xurl",
    binary: "xurl",
    check: "xurl version",
    install_steps: [
      "brew install --cask xdevplatform/tap/xurl",
      "npm install -g @xdevplatform/xurl",
      "go install github.com/xdevplatform/xurl@latest",
      "xurl version",
      "supercli plugins install xurl",
      "supercli skills list --catalog --provider xurl --json",
      "supercli xurl auth status --json",
      "supercli xurl account whoami --json"
    ],
    note: "This hybrid plugin indexes upstream xurl docs and exposes a curated set of read-only wrappers. Use the upstream xurl CLI directly for auth setup, posting, likes, follows, raw requests, streams, webhooks, and any command that can mutate X state."
  },
  clix: {
    plugin: "clix",
    binary: "clix",
    check: "clix auth status --json",
    install_steps: [
      "uv pip install clix0",
      "clix auth",
      "supercli plugins install clix",
      "supercli skills list --catalog --provider clix --json",
      "supercli clix auth status --json",
      "supercli clix timeline list --count 10 --json"
    ],
    note: "This hybrid plugin indexes upstream clix docs and exposes curated read-only wrappers. Use upstream clix directly for cookie login, account switching, posting, deleting, likes, retweets, and bookmark mutations."
  },
  monty: {
    plugin: "monty",
    binary: "node",
    check: "supercli monty cli version --json",
    install_steps: [
      "supercli plugins install monty",
      "supercli monty cli setup",
      "supercli skills list --catalog --provider monty --json",
      "supercli monty python run \"1 + 2\" --json"
    ],
    note: "This hybrid plugin indexes the upstream Monty README and CLAUDE (skills) documents and provides a sandboxed Python execution environment. It manages its own @pydantic/monty dependency globally."
  },
  cline: {
    plugin: "cline",
    binary: "cline",
    check: "cline --version",
    install_steps: [
      "npm install -g cline",
      "cline --version",
      "supercli plugins install cline",
      "supercli cline cli version --json",
      "supercli cline task run --prompt \"List files with more LOC in cwd\" --cwd . --timeout 30 --json",
      "supercli skills sync --json",
      "supercli skills get repo:cline-non-interactive"
    ],
    note: "Prefer the wrapped cline task run/plan commands for unattended automation. They bake in documented non-interactive defaults with JSON streaming support and are easier for agents to parse than raw passthrough."
  },
  nullclaw: {
    plugin: "nullclaw",
    binary: "nullclaw",
    check: "nullclaw --version",
    install_steps: [
      "supercli plugins install nullclaw",
      "curl --version",
      "brew install nullclaw",
      "nullclaw --version",
      "supercli skills list --catalog --provider nullclaw --json",
      "supercli skills get nullclaw:root.agents",
      "supercli nullclaw cli version --json",
      "supercli nullclaw system status --json"
    ],
    note: "This hybrid plugin indexes remote NullClaw docs into the local skills catalog and exposes the local nullclaw binary through wrapped commands plus passthrough. curl is required for remote doc retrieval."
  },
  "agency-agents": {
    plugin: "agency-agents",
    binary: "curl",
    check: "curl --version",
    install_steps: [
      "supercli plugins install agency-agents",
      "supercli skills list --catalog --provider agency-agents --json",
      "supercli skills get agency-agents:engineering.engineering-frontend-developer"
    ],
    note: "Install indexes remote markdown skills from https://github.com/msitarzewski/agency-agents (best effort, upstream paths may change)."
  },
  "visual-explainer": {
    plugin: "visual-explainer",
    binary: "curl",
    check: "curl --version",
    install_steps: [
      "supercli plugins install visual-explainer",
      "supercli skills list --catalog --provider visual-explainer --json",
      "supercli skills get visual-explainer:visual-explainer.skill"
    ],
    note: "Install indexes normalized markdown skills from https://github.com/javimosch/visual-explainer (plugins/visual-explainer-normalized)."
  }
}

function getPluginInstallGuidance(name) {
  return PLUGIN_INSTALL_GUIDANCE[name] || null
}

module.exports = {
  getPluginInstallGuidance
}
