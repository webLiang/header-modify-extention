#!/usr/bin/env node
/**
 * Pack dist/ into releases/header-modify-extention_v{version}.zip for Chrome Web Store upload.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');
const releasesDir = path.join(root, 'releases');
const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const version = packageJson.version;
const zipName = `${packageJson.name}_v${version}.zip`;
const zipPath = path.join(releasesDir, zipName);

if (!fs.existsSync(distDir) || !fs.existsSync(path.join(distDir, 'manifest.json'))) {
  console.error('dist/ is missing or incomplete. Run `pnpm build` first.');
  process.exit(1);
}

fs.mkdirSync(releasesDir, { recursive: true });
if (fs.existsSync(zipPath)) {
  fs.unlinkSync(zipPath);
}

execFileSync('zip', ['-r', '-q', zipPath, '.'], { cwd: distDir, stdio: 'inherit' });

const stat = fs.statSync(zipPath);
console.log(`Created ${zipPath} (${Math.round(stat.size / 1024)} KB)`);
