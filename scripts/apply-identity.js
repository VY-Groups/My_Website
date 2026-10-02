/**
 * apply-identity.js — Sync site.config.js into the static files that cannot
 * import JavaScript: index.html (meta/JSON-LD regions) and the PWA manifest.
 * ---------------------------------------------------------------------------
 * Usage:
 *   node scripts/apply-identity.js           rewrite files from config
 *   node scripts/apply-identity.js --check   verify files match config (CI)
 *
 * Identity regions in index.html are delimited by comments:
 *   <!-- identity:preload:start/end -->   photo preload
 *   <!-- identity:meta:start/end -->      <title> + meta/OG/Twitter tags
 *   <!-- identity:jsonld:start/end -->    Person + Organization JSON-LD
 *
 * sitemap.xml and robots.txt are NOT handled here — scripts/generate-seo.js
 * regenerates them from the same config on every build.
 * ---------------------------------------------------------------------------
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import config from '../site.config.js';

const { site, owner, socials, org, colors } = config;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const checkMode = process.argv.includes('--check');

/** Escape double quotes for HTML attribute values (raw & kept as-is, as authored). */
const attr = (v) => String(v).replace(/"/g, '&quot;');

/** Build the <head> identity block (title + meta/OG/Twitter tags). */
function buildMetaBlock() {
  return [
    '    <!-- Primary Meta Tags -->',
    `    <title>${attr(site.title)}</title>`,
    `    <meta name="title" content="${attr(site.title)}" />`,
    `    <meta name="description" content="${attr(site.description)}" />`,
    `    <meta name="keywords" content="${attr(site.keywords)}" />`,
    `    <meta name="author" content="${attr(owner.name)}" />`,
    '    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />',
    `    <link rel="canonical" href="${attr(`${site.url}/`)}" />`,
    '',
    '    <!-- Open Graph / Facebook -->',
    '    <meta property="og:type" content="website" />',
    `    <meta property="og:url" content="${attr(`${site.url}/`)}" />`,
    `    <meta property="og:title" content="${attr(site.title)}" />`,
    `    <meta property="og:description" content="${attr(site.shortDescription)}" />`,
    `    <meta property="og:image" content="${attr(`${site.url}${owner.photo}`)}" />`,
    '    <meta property="og:image:width" content="400" />',
    '    <meta property="og:image:height" content="400" />',
    `    <meta property="og:image:alt" content="${attr(site.ogImageAlt)}" />`,
    `    <meta property="og:site_name" content="${attr(site.name)}" />`,
    '    <meta property="og:locale" content="en_US" />',
    '',
    '    <!-- Twitter -->',
    '    <meta name="twitter:card" content="summary_large_image" />',
    `    <meta name="twitter:url" content="${attr(`${site.url}/`)}" />`,
    `    <meta name="twitter:title" content="${attr(site.title)}" />`,
    `    <meta name="twitter:description" content="${attr(site.shortDescription)}" />`,
    `    <meta name="twitter:image" content="${attr(`${site.url}${owner.photo}`)}" />`,
    `    <meta name="twitter:image:alt" content="${attr(site.ogImageAlt)}" />`,
    '',
    '    <!-- Additional Meta Tags -->',
    '    <meta name="mobile-web-app-capable" content="yes" />',
    '    <meta name="apple-mobile-web-app-capable" content="yes" />',
    '    <meta name="apple-mobile-web-app-status-bar-style" content="default" />',
    `    <meta name="apple-mobile-web-app-title" content="${attr(site.shortName)}" />`,
    `    <meta name="application-name" content="${attr(site.name)}" />`,
  ].join('\n');
}

/** JSON-LD objects — key order matches the original hand-authored blocks. */
function personJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: owner.name,
    url: `${site.url}/`,
    image: `${site.url}${owner.photo}`,
    sameAs: [socials.github, org.github, socials.linkedin],
    jobTitle: owner.role,
    founder: {
      '@type': 'Organization',
      name: org.name,
      url: org.url,
      sameAs: [org.github],
    },
    worksFor: {
      '@type': 'Organization',
      name: owner.worksFor,
    },
    knowsAbout: owner.knowsAbout,
    description: owner.bio,
  };
}

function orgJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: org.name,
    url: org.url,
    description: org.description,
    founder: {
      '@type': 'Person',
      name: owner.name,
      url: `${site.url}/`,
    },
    sameAs: [org.github],
  };
}

const indentJson = (obj) =>
  JSON.stringify(obj, null, 2)
    .split('\n')
    .map((line) => `    ${line}`)
    .join('\n');

function buildJsonLdBlock() {
  return [
    '    <!-- Structured Data (JSON-LD) -->',
    '    <script type="application/ld+json" id="structured-data">',
    indentJson(personJsonLd()),
    '    </script>',
    '',
    '    <script type="application/ld+json">',
    indentJson(orgJsonLd()),
    '    </script>',
  ].join('\n');
}

function buildPreloadBlock() {
  return `    <link rel="preload" as="image" href="${owner.photo}" />`;
}

/** Service-worker precache list (JS comment markers). */
function buildPrecacheBlock() {
  return [
    'const PRECACHE_URLS = [',
    "  '/',",
    "  '/manifest.webmanifest',",
    "  '/favicon.png',",
    `  '${owner.photo}',`,
    `  '${owner.resume}',`,
    '];',
  ].join('\n');
}

/** Replace the region between identity:NAME start/end markers.
 *  style: 'html' → <!-- identity:x:start -->   |   'js' → // identity:x:start */
function replaceRegion(content, name, block, eol, style = 'html') {
  const wrap =
    style === 'js'
      ? (t) => `// ${t}`
      : (t) => `<!-- ${t} -->`;
  const startTag = wrap(`identity:${name}:start`);
  const endTag = wrap(`identity:${name}:end`);
  const s = content.indexOf(startTag);
  const e = content.indexOf(endTag);
  if (s === -1 || e === -1 || e < s) {
    throw new Error(`Markers for "${name}" not found`);
  }
  // Preserve the indentation of the end-marker line.
  const prevEol = content.lastIndexOf(eol, e);
  const endIndent =
    e > prevEol + eol.length ? content.slice(prevEol + eol.length, e) : '';
  const normalizedBlock = block.replace(/\n/g, eol);
  return (
    content.slice(0, s + startTag.length) +
    eol +
    normalizedBlock +
    eol +
    endIndent +
    content.slice(e)
  );
}

/** PWA manifest — literal template with identity fields interpolated. */
function buildManifest() {
  return `{
  "name": "${site.title}",
  "short_name": "${site.shortName}",
  "description": "${site.manifestDescription}",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait-primary",
  "background_color": "${colors.background}",
  "theme_color": "${colors.brand}",
  "lang": "en",
  "dir": "ltr",
  "categories": ["portfolio", "technology", "business"],
  "icons": [
    {
      "src": "/favicon.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/favicon.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/favicon.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ],
  "shortcuts": [
    {
      "name": "Contact",
      "short_name": "Contact",
      "url": "/#contact",
      "description": "Get in touch"
    },
    {
      "name": "Projects",
      "short_name": "Projects",
      "url": "/#projects",
      "description": "View featured projects"
    },
    {
      "name": "Blog",
      "short_name": "Blog",
      "url": "/#blog",
      "description": "Read DevOps articles"
    }
  ]
}
`;
}

function processFile(relPath, transform) {
  const filePath = path.join(projectRoot, relPath);
  const original = fs.readFileSync(filePath, 'utf8');
  const eol = original.includes('\r\n') ? '\r\n' : '\n';
  const next = transform(original, eol);
  const changed = next !== original;

  if (checkMode) {
    if (changed) {
      console.error(`✗ ${relPath} is OUT OF SYNC with site.config.js`);
      return false;
    }
    console.log(`✓ ${relPath} in sync`);
    return true;
  }

  if (changed) {
    fs.writeFileSync(filePath, next);
    console.log(`✓ Updated ${relPath}`);
  } else {
    console.log(`✓ ${relPath} already in sync`);
  }
  return true;
}

let ok = true;

ok =
  processFile('index.html', (html, eol) => {
    let out = html;
    out = replaceRegion(out, 'preload', buildPreloadBlock(), eol);
    out = replaceRegion(out, 'meta', buildMetaBlock(), eol);
    out = replaceRegion(out, 'jsonld', buildJsonLdBlock(), eol);
    return out;
  }) && ok;

ok =
  processFile('public/manifest.webmanifest', () => buildManifest()) && ok;

ok =
  processFile('public/sw.js', (sw, eol) =>
    replaceRegion(sw, 'precachelist', buildPrecacheBlock(), eol, 'js')
  ) && ok;

if (checkMode && !ok) {
  console.error('\nRun: node scripts/apply-identity.js');
  process.exit(1);
}

if (!checkMode) {
  console.log(
    `\nIdentity synced from site.config.js → ${site.title} (${site.url})`
  );
}
