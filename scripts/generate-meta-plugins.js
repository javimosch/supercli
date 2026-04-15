const fs = require('fs');
const path = require('path');

const PLUGINS_DIR = path.join(__dirname, '..', 'plugins');
const PLUGINS_JSON = path.join(PLUGINS_DIR, 'plugins.json');
const OUTPUT_FILE = path.join(__dirname, '..', 'docs', 'meta-plugins.json');

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function getPluginMeta(pluginDir) {
  const metaPath = path.join(pluginDir, 'meta.json');
  const meta = readJson(metaPath);
  if (!meta) return null;
  
  const name = path.basename(pluginDir);
  const hasLearn = fs.existsSync(path.join(pluginDir, 'skills', 'quickstart', 'SKILL.md'));
  
  return {
    name,
    description: meta.description || '',
    tags: meta.tags || [],
    has_learn: meta.has_learn || hasLearn
  };
}

function collectFromPluginsJson() {
  const data = readJson(PLUGINS_JSON);
  if (!data || !data.plugins) return [];
  
  return data.plugins.map(plugin => {
    const sourcePath = plugin.source?.manifest_path || '';
    const name = plugin.name;
    const pluginDir = path.join(PLUGINS_DIR, name);
    
    const metaPath = path.join(pluginDir, 'meta.json');
    if (fs.existsSync(metaPath)) {
      return null;
    }
    
    return {
      name,
      description: plugin.description || '',
      tags: plugin.tags || [],
      has_learn: plugin.has_learn || false,
      source: sourcePath
    };
  }).filter(Boolean);
}

function main() {
  const plugins = [];
  const seen = new Set();
  
  const metaDirs = fs.readdirSync(PLUGINS_DIR, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => path.join(PLUGINS_DIR, entry.name));
  
  for (const dir of metaDirs) {
    const meta = getPluginMeta(dir);
    if (meta) {
      plugins.push(meta);
      seen.add(meta.name);
    }
  }
  
  const legacyPlugins = collectFromPluginsJson();
  for (const plugin of legacyPlugins) {
    if (!seen.has(plugin.name)) {
      plugins.push(plugin);
      seen.add(plugin.name);
    }
  }
  
  plugins.sort((a, b) => a.name.localeCompare(b.name));
  
  const output = {
    generated: new Date().toISOString(),
    count: plugins.length,
    plugins
  };
  
  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
  console.log(`Generated ${OUTPUT_FILE} with ${plugins.length} plugins`);
}

main();
