import { spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const result = spawnSync('cargo', ['run', '--quiet', '--', 'demo'], { encoding: 'utf8' });
if (result.status !== 0) {
  process.stderr.write(result.stderr);
  process.exit(result.status || 1);
}
const clean = result.stdout.replace(/Manifest: .*preservation-manifest\.json/, 'Manifest: …/preservation-manifest.json');
const lines = clean.match(/.*(?:\n|$)/g).filter(Boolean);
const header = { version: 2, width: 92, height: 18, timestamp: 1787932800, env: { SHELL: '/bin/sh', TERM: 'xterm-256color' } };
const frames = lines.map((line, index) => JSON.stringify([Number((0.35 + index * 0.34).toFixed(2)), 'o', line]));
writeFileSync('site/public/demo.cast', `${JSON.stringify(header)}\n${frames.join('\n')}\n`);
console.log(`Recorded ${frames.length} frames from rescue demo.`);
