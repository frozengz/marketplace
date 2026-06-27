import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
const root = new URL('../src', import.meta.url).pathname;
const forbidden = '@/';
const extensions = new Set(['.ts', '.tsx']);
function walk(directory) { return readdirSync(directory).flatMap((entry) => { const path = join(directory, entry); const stat = statSync(path); if (stat.isDirectory()) { return walk(path); } const extension = path.slice(path.lastIndexOf('.')); return extensions.has(extension) ? [path] : []; }); }
const matches = walk(root).flatMap((path) => { const text = readFileSync(path, 'utf8'); return text.includes(forbidden) ? [path] : []; });
if (matches.length > 0) { console.error(matches.join('\n')); process.exit(1); }
