function execute(cmd) {
  const cfg = cmd.adapterConfig || {}
  if (cfg.builtin === "beads_install_steps") {
    return {
      plugin: "beads",
      binary: "br",
      install_steps: [
        "curl -fsSL \"https://raw.githubusercontent.com/Dicklesworthstone/beads_rust/main/install.sh?$(date +%s)\" | bash",
        "br --version"
      ],
      note: "Install execution is delegated to your LLM automation (dcli/scli/supercli)."
    }
  }
  if (cfg.builtin === "gwc_install_steps") {
    return {
      plugin: "gwc",
      binary: "gws",
      install_steps: [
        "npm install -g @googleworkspace/cli",
        "gws --version"
      ],
      note: "Install execution is delegated to your LLM automation (dcli/scli/supercli)."
    }
  }
  throw Object.assign(new Error(`Unknown builtin action: ${cfg.builtin || "(missing)"}`), {
    code: 85,
    type: "invalid_argument",
    recoverable: false
  })
}

module.exports = { execute }
