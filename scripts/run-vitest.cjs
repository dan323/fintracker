// Script wrapper to run vitest while filtering unsupported flags like --watchAll
// This is CommonJS (.cjs) so it runs regardless of package.json "type".
const { spawnSync } = require('child_process');
const path = require('path');

// collect args passed through npm (after 'npm test --')
const rawArgs = process.argv.slice(2) || [];

// filter out unknown/unsupported flags that some CI or callers may pass
const filtered = rawArgs.filter(a => {
  // remove any --watch* (like --watchAll, --watchAll=false)
  if (/^--watch(?:All)?(?:=.*)?$/i.test(a)) return false;
  // keep everything else
  return true;
});

// ensure default flags are present unless caller provided them
const ensure = [];
if (!filtered.includes('--run')) ensure.push('--run');
if (!filtered.includes('--globals')) ensure.push('--globals');
if (!filtered.some(a => a.startsWith('--environment'))) {
  ensure.push('--environment', 'jsdom');
}

const finalArgs = [...ensure, ...filtered];

// Resolve local vitest binary in node_modules/.bin
let vitestCmd = path.join(__dirname, '..', 'node_modules', '.bin', 'vitest');
// On Windows, the .cmd should be used automatically when invoked via shell
// Use spawnSync with shell to let the OS resolve the binary wrappers
const res = spawnSync(`"${vitestCmd}" ${finalArgs.map(a => (a.includes(' ') ? `"${a}"` : a)).join(' ')}`, {
  stdio: 'inherit',
  shell: true,
});

process.exit(res.status || 0);

