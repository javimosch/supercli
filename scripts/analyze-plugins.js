// Analyze all plugins and score them based on agent-friendly criteria
// Scoring criteria:
// - no_interactive: +3 (very important for agents)
// - go_rust_nodejs: +2 (preferred languages)
// - cli: +2 (must be a CLI)
// - tui: -3 (strong penalty for TUI)
// - auth_required: -1 (penalty but acceptable)
// - binary: +1 (bonus, not required)
// - json_support: +2 (bonus for agents)
// - complexity: low=+2, medium=+1, high=0
// Usage: node scripts/analyze-plugins.js
const f=require('fs'),p=require('path'),b='/home/jarancibia/ai/supercli/plugins';
const plugins=f.readdirSync(b).filter(x=>!x.startsWith('.'));
const results=[];

for(const name of plugins){
  const dir=p.join(b,name);
  const pj=p.join(dir,'plugin.json');
  const mj=p.join(dir,'meta.json');
  const ij=p.join(dir,'install-guidance.json');
  
  if(!f.existsSync(pj)) continue;
  
  try{
    const plugin=JSON.parse(f.readFileSync(pj));
    const meta=f.existsSync(mj)?JSON.parse(f.readFileSync(mj)):null;
    const guide=f.existsSync(ij)?JSON.parse(f.readFileSync(ij)):null;
    
    // Analyze criteria
    const source=plugin.source||'';
    const install=guide?.install_steps?.[0]||'';
    const binary=guide?.binary||plugin.checks?.[0]?.name||'';
    
    // Language detection from source URL
    const isGo=source.includes('github.com')&&install.includes('go install')||install.includes('curl')&&source.includes('/go');
    const isRust=source.includes('github.com')&&install.includes('cargo install')||install.includes('curl')&&source.includes('/rs');
    const isNode=install.includes('npm install')||install.includes('yarn')||install.includes('pnpm')||source.includes('/node')||source.includes('/js')||source.includes('/ts');
    
    // Binary detection (bonus, not requirement)
    const isBinary=install.includes('curl')||install.includes('wget')||install.includes('brew')||install.includes('apt')||install.includes('snap')||install.includes('go install')||install.includes('cargo install');
    
    // CLI detection (from description and commands)
    const desc=plugin.description||'';
    const isCLI=desc.toLowerCase().includes('cli')||desc.toLowerCase().includes('command line')||desc.toLowerCase().includes('command-line')||plugin.commands?.length>0;
    
    // TUI/interactive detection (strong penalty)
    const isTUI=desc.toLowerCase().includes('tui')||desc.toLowerCase().includes('interactive')||desc.toLowerCase().includes('terminal ui')||meta?.tags?.some(t=>t.toLowerCase().includes('tui')||t.toLowerCase().includes('interactive'));
    
    // Auth detection (penalty but acceptable)
    const isAuth=desc.toLowerCase().includes('auth')||desc.toLowerCase().includes('authentication')||desc.toLowerCase().includes('login')||desc.toLowerCase().includes('token')||desc.toLowerCase().includes('api key')||meta?.tags?.some(t=>t.toLowerCase().includes('auth')||t.toLowerCase().includes('oauth'));
    
    // Complexity (based on install steps count and description length)
    const complexityScore=(install.length/100)+(desc.length/50);
    let complexity='low';
    if(complexityScore>3) complexity='medium';
    if(complexityScore>6) complexity='high';
    
    // Non-interactive/JSON support (very important for agents)
    const hasJSON=plugin.commands?.some(c=>c.adapterConfig?.parseJson)||desc.toLowerCase().includes('json')||install.includes('json');
    const isNonInteractive=!isTUI;
    
    results.push({
      name,
      no_interactive: isNonInteractive ? 'yes' : 'no',
      go_rust_nodejs: (isGo||isRust||isNode) ? 'yes' : 'no',
      language: isGo?'go':isRust?'rust':isNode?'nodejs':'other',
      cli: isCLI ? 'yes' : 'no',
      tui: isTUI ? 'yes' : 'no',
      auth_required: isAuth ? 'yes' : 'no',
      complexity,
      binary: isBinary ? 'yes' : 'no',
      json_support: hasJSON ? 'yes' : 'no',
      description: desc.substring(0,100),
      install: install.substring(0,80)
    });
  }catch(e){
    console.error('Error parsing',name,e.message);
  }
}

// Improved scoring - more balanced, not requiring ALL criteria
results.forEach(r=>{
  let score=0;
  if(r.no_interactive==='yes') score+=3;  // Very important for agents
  if(r.go_rust_nodejs==='yes') score+=2; // Preferred languages
  if(r.cli==='yes') score+=2;              // Must be a CLI
  if(r.tui==='yes') score-=3;              // Strong penalty for TUI
  if(r.auth_required==='yes') score-=1;   // Penalty but acceptable
  if(r.binary==='yes') score+=1;           // Bonus, not required
  if(r.json_support==='yes') score+=2;     // Bonus for agents
  if(r.complexity==='low') score+=2;       // Prefer simple
  else if(r.complexity==='medium') score+=1;
  r.score=score;
});

// Sort by score descending
results.sort((a,b)=>b.score-a.score);

// Write CSV
const header='name,score,no_interactive,go_rust_nodejs,language,cli,tui,auth_required,complexity,binary,json_support,description,install\n';
const csv=header+results.map(r=>[
  r.name,
  r.score,
  r.no_interactive,
  r.go_rust_nodejs,
  r.language,
  r.cli,
  r.tui,
  r.auth_required,
  r.complexity,
  r.binary,
  r.json_support,
  `"${r.description.replace(/"/g,'""')}"`,
  `"${r.install.replace(/"/g,'""')}"`
].join(',')).join('\n');

f.writeFileSync('/tmp/plugin-scores-v2.csv',csv);
console.log('Analyzed',results.length,'plugins');
console.log('CSV written to /tmp/plugin-scores-v2.csv');
console.log('\nTop 50 plugins by score:');
results.slice(0,50).forEach(r=>console.log(`${r.name}: ${r.score} (${r.language}, tui=${r.tui}, auth=${r.auth_required}, binary=${r.binary})`));

// Count plugins by score ranges
const highScore=results.filter(r=>r.score>=8).length;
const medScore=results.filter(r=>r.score>=5&&r.score<8).length;
const lowScore=results.filter(r=>r.score<5).length;
console.log(`\nScore distribution:`);
console.log(`High score (8+): ${highScore}`);
console.log(`Medium score (5-7): ${medScore}`);
console.log(`Low score (<5): ${lowScore}`);
