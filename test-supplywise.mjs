import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const entrypoint = require.resolve('supplywise');
const packageJson = JSON.parse(await readFile(join(dirname(entrypoint), '..', 'package.json'), 'utf8'));
assert.equal(packageJson.name, 'supplywise');
assert.ok(packageJson.version);

const cli = execFileSync('node', [join(dirname(entrypoint), 'cli.js'), '--help'], { encoding: 'utf8' });
assert.match(cli, /scan/);
const version = execFileSync('node', [join(dirname(entrypoint), 'cli.js'), '--version'], { encoding: 'utf8' }).trim();
assert.equal(version, packageJson.version);

const api = await import('supplywise');
assert.ok(api);
await access(entrypoint);
console.log(`supplywise ${packageJson.version}: CLI and module import passed`);
