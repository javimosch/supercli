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
