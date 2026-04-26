const fs = require('fs');
const path = require('path');

const SCORES_CSV = path.join(__dirname, '..', 'plugin-scores.csv');
const META_PLUGINS = path.join(__dirname, '..', 'docs', 'meta-plugins.json');

function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  
  const scores = {};
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index];
    });
    scores[row.name] = row;
  }
  
  return scores;
}

function enrichMetaPlugins() {
  const scores = parseCSV(SCORES_CSV);
  const metaPlugins = JSON.parse(fs.readFileSync(META_PLUGINS, 'utf8'));
  
  const enrichedPlugins = metaPlugins.plugins.map(plugin => {
    const scoreData = scores[plugin.name];
    
    if (scoreData) {
      return {
        ...plugin,
        score: {
          value: parseInt(scoreData.score, 10),
          no_interactive: scoreData.no_interactive === 'yes',
          go_rust_nodejs: scoreData.go_rust_nodejs === 'yes',
          language: scoreData.language,
          cli: scoreData.cli === 'yes',
          tui: scoreData.tui === 'yes',
          auth_required: scoreData.auth_required === 'yes',
          complexity: scoreData.complexity,
          binary: scoreData.binary === 'yes',
          json_support: scoreData.json_support === 'yes',
          install: scoreData.install
        }
      };
    }
    
    return plugin;
  });
  
  const output = {
    generated: new Date().toISOString(),
    count: enrichedPlugins.length,
    plugins: enrichedPlugins
  };
  
  fs.writeFileSync(META_PLUGINS, JSON.stringify(output, null, 2));
  console.log(`Enriched ${META_PLUGINS} with score metadata`);
  const pluginsWithScores = enrichedPlugins.filter(p => p.score).length;
  console.log(`Added scores to ${pluginsWithScores} plugins`);
}

enrichMetaPlugins();
