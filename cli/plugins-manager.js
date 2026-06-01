"use strict";

const { installPlugin, removePlugin, getPlugin, listInstalledPlugins } = require("./plugins-install");
const { doctorPlugin, doctorAllPlugins } = require("./plugins-doctor");
const { getPluginInstallGuidance } = require("./plugin-install-guidance");

module.exports = {
  installPlugin,
  removePlugin,
  getPlugin,
  listInstalledPlugins,
  getPluginInstallGuidance,
  doctorPlugin,
  doctorAllPlugins,
};
