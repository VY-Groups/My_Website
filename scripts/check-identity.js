/**
 * check-identity.js — Audit the repository for identity strings.
 * ---------------------------------------------------------------------------
 * Usage:
 *   node scripts/check-identity.js                     audit current config values
 *   node scripts/check-identity.js "Old Name" old@x.com  also hunt legacy values
 *
 * After a future identity migration (site.config.js edits), run this with the
 * OLD values to find any file that still references the previous identity.
 *
 * Findings are classified:
 *   [managed]   rewritten by scripts/apply-identity.js or regenerated at build
 *   [manual]    environment files — update .env.example + Vercel dashboard
 *   [docs]      allowlisted documentation (expected to keep history)
 *   [REVIEW]    unexpected — must be updated manually   → exit code 1
 * ---------------------------------------------------------------------------
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import config from '../site.config.js';

const { site, owner, socials } = config;

const argvTerms = process.argv.slice(2).filter((a) => !a.startsWith('-'));

const terms = [
  ['site.title', site.title],
  ['site.name', site.name],
  ['site.shortName', site.shortName],
  ['site.url', site.url],
  ['site.repo', site.repo],
  ['owner.name', owner.name],
  ['owner.firstName', owner.firstName],
  ['owner.email', owner.email],
  ['owner.resume', owner.resume],
  ['socials.github', socials.github],
  ['socials.linkedin', socials.linkedin],
  ...argvTerms.map((t) => ['argv', t]),
];

const SKIP_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  '.vercel',
  '.opencode',
  '.vite',
]);
const SKIP_EXT = new Set([
  '.png', '.jpg', '.jpeg', '.webp', '.ico', '.gif', '.svg', '.pdf',
  '.woff', '.woff2', '.map', '.lock', '.zip', '.webp',
]);

const ALLOW = [
  'site.config.js', // the source of truth itself
  'scripts/check-identity.js',
  'docs/', // migration guide quotes old values on purpose
  'README.md',
  'LICENSE',
  'HOLOGRAPHIC_UPDATES.md', // historical changelog
  'FEATURES.md',
  'FOLDER_STRUCTURE_VERIFICATION.md', // historical verification notes
  'PROJECT_STRUCTURE.md', // historical structure notes
];
const APPLY_MANAGED = [
  'index.html',
  'public/manifest.webmanifest',
  'public/sw.js',
];
const BUILD_MANAGED = ['public/sitemap.xml', 'public/robots.txt'];
const MANUAL_MANAGED = ['.env.example', '.env', '.env.local', '.env.production'];

const classify = (rel) => {
  if (ALLOW.some((p) => rel === p || rel.startsWith(p))) return 'docs';
  if (APPLY_MANAGED.includes(rel)) return 'apply';
  if (BUILD_MANAGED.includes(rel)) return 'build';
  if (MANUAL_MANAGED.includes(rel)) return 'manual';
  return 'review';
};

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) yield* walk(path.join(dir, entry.name));
    } else {
      yield path.join(dir, entry.name);
    }
  }
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const findings = []; // { rel, cls, term, line }
let filesScanned = 0;

for (const name of walk(root)) {
  const rel = path.relative(root, name).replace(/\\/g, '/');
  if (SKIP_EXT.has(path.extname(name).toLowerCase())) continue;
  let content;
  try {
    const stat = fs.statSync(name);
    if (stat.size > 2 * 1024 * 1024) continue;
    content = fs.readFileSync(name, 'utf8');
  } catch {
    continue;
  }
  filesScanned += 1;
  for (const [label, term] of terms) {
    if (!term) continue;
    let idx = content.indexOf(term);
    while (idx !== -1) {
      const line = content.slice(0, idx).split('\n').length;
      findings.push({ rel, cls: classify(rel), term: label, line, sample: term });
      idx = content.indexOf(term, idx + term.length);
    }
  }
}

const grouped = {};
for (const f of findings) {
  (grouped[`${f.cls}|${f.rel}`] ||= { cls: f.cls, rel: f.rel, hits: [] }).hits.push(
    `${f.line}:${f.term}`
  );
}

console.log(`Identity audit — ${terms.length} values, ${filesScanned} files scanned\n`);

const order = { docs: 0, manual: 1, build: 2, apply: 3, review: 4 };
const badge = {
  docs: '[docs]   ',
  manual: '[manual] ',
  build: '[build]  ',
  apply: '[apply]  ',
  review: '[REVIEW] ',
};
let reviewCount = 0;
for (const key of Object.keys(grouped).sort(
  (a, b) => order[grouped[a].cls] - order[grouped[b].cls] || a.localeCompare(b)
)) {
  const g = grouped[key];
  const note = {
    docs: 'allowlisted',
    manual: 'update .env.example + Vercel env vars',
    build: 'regenerated from config at build',
    apply: 'run: node scripts/apply-identity.js',
    review: 'UNEXPECTED — update manually',
  }[g.cls];
  if (g.cls === 'review') reviewCount += g.hits.length;
  console.log(`${badge[g.cls]}${g.rel} (${g.hits.length}) — ${note}`);
  const preview = g.hits.slice(0, 6).join(', ');
  console.log(`            ${preview}${g.hits.length > 6 ? ', …' : ''}`);
}

console.log('');
if (reviewCount > 0) {
  console.log(`✗ FAIL — ${reviewCount} unexpected identity reference(s)`);
  process.exit(1);
}
console.log('✓ PASS — no unexpected identity references');
