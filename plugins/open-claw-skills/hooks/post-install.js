#!/usr/bin/env node
/**
 * post-install.js — Registers the open-claw-skills remote_repo provider
 * after plugin installation. Called by supercli's post_install hook.
 *
 * Env vars set by supercli:
 *   SUPERCLI_PLUGIN_NAME — "open-claw-skills"
 *   SUPERCLI_PLUGIN_DIR  — path to this hook's directory
 */

const path = require("path");

// Resolve skills-catalog from the supercli project (3 levels up from hooks/)
const catalogPath = path.resolve(__dirname, "..", "..", "..", "cli", "skills-catalog");
const catalog = require(catalogPath);

const PROVIDER_NAME = "open-claw-skills";
const SOURCE_REPO = "https://github.com/javimosch/open-claw-skills";

// Check if provider already exists
const existing = catalog.getProvider(PROVIDER_NAME);
if (existing) {
  // Update to remote_repo type if it's currently local_fs
  if (existing.type !== "remote_repo") {
    catalog.addProvider({
      name: PROVIDER_NAME,
      type: "remote_repo",
      source_repo: SOURCE_REPO,
      root: "skills",
      ref: "main",
      enabled: true,
    });
    console.log(JSON.stringify({ ok: true, action: "updated", provider: PROVIDER_NAME }));
  } else {
    console.log(JSON.stringify({ ok: true, action: "already_configured", provider: PROVIDER_NAME }));
  }
} else {
  catalog.addProvider({
    name: PROVIDER_NAME,
    type: "remote_repo",
    source_repo: SOURCE_REPO,
    root: "skills",
    ref: "main",
    enabled: true,
  });
  console.log(JSON.stringify({ ok: true, action: "registered", provider: PROVIDER_NAME }));
}
