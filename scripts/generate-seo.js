/**
 * Generate sitemap.xml and robots.txt for production build
 * Run with: node scripts/generate-seo.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import config from '../site.config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');
const publicDir = path.join(projectRoot, 'public');

const SITE_URL = config.site.url;
const pageTitle = (page) => `${page} | ${config.owner.name}`;

const sectionMeta = {
  about: {
    title: config.site.title,
    description: 'DevOps Engineer & Cloud Architect specializing in AWS, Kubernetes, CI/CD pipelines, Linux automation, and scalable cloud infrastructure.',
  },
  experience: {
    title: pageTitle('Experience'),
    description: '3+ years of professional experience in DevOps, Cloud Architecture, and Infrastructure Automation.',
  },
  skills: {
    title: pageTitle('Skills & Expertise'),
    description: 'Technical skills: AWS, Kubernetes, Docker, CI/CD, Terraform, Linux, Monitoring, GitLab CI, Jenkins, Prometheus, Grafana, Ansible, Python, Bash.',
  },
  projects: {
    title: pageTitle('Projects'),
    description: 'Featured DevOps and Cloud projects: CI/CD pipelines, Kubernetes clusters, Infrastructure as Code, Monitoring solutions.',
  },
  resources: {
    title: pageTitle('Student Resources'),
    description: 'Free downloadable learning materials for DevOps, Linux, Docker, Azure, Ansible, Networking, and DSA.',
  },
  'success-stories': {
    title: pageTitle('Success Stories'),
    description: 'Success stories and testimonials from students and professionals.',
  },
  collaboration: {
    title: pageTitle('Collaborate'),
    description: 'Open for collaboration, consulting, freelance projects, and partnerships.',
  },
  contact: {
    title: pageTitle('Contact'),
    description: 'Get in touch for DevOps consulting, freelance projects, or just to say hello.',
  },
};

function generateSitemap() {
  const baseUrl = SITE_URL;
  const sections = Object.keys(sectionMeta);
  const today = new Date().toISOString().split('T')[0];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  ${sections.map(section => `
  <url>
    <loc>${baseUrl}/#${section}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${section === 'about' ? '1.0' : '0.8'}</priority>
  </url>`).join('')}
</urlset>`;
}

function generateRobotsTxt() {
  return `# Robots.txt for ${SITE_URL}
User-agent: *
Allow: /

# Sitemap
Sitemap: ${SITE_URL}/sitemap.xml

# Disallow admin/api paths
Disallow: /api/
Disallow: /node_modules/
Disallow: /src/
Disallow: /*.json$
Disallow: /*.md$
Disallow: /.git/
`;
}

const xmlEsc = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

/** Parse `export const meta = { ... }` frontmatter from every blog MDX post. */
function loadBlogPosts() {
  const blogDir = path.join(projectRoot, 'src', 'blog');
  if (!fs.existsSync(blogDir)) return [];
  return fs
    .readdirSync(blogDir)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const src = fs.readFileSync(path.join(blogDir, file), 'utf8');
      const m = src.match(/export const meta = \{([\s\S]*?)\n\}/);
      if (!m) {
        console.warn(`! no meta block in ${file}, skipping from RSS`);
        return null;
      }
      try {
        // Own source files only — object literal evaluated as-is
        return new Function(`return {${m[1]}}`)();
      } catch (err) {
        console.warn(`! could not parse meta from ${file}: ${err.message}`);
        return null;
      }
    })
    .filter((meta) => meta && meta.slug && meta.title)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

function generateRss() {
  const posts = loadBlogPosts();
  const items = posts
    .map((p) => {
      const link = `${SITE_URL}/#blog-${p.slug}`;
      const parsed = new Date(p.date);
      const pubDate = Number.isNaN(parsed.getTime()) ? new Date().toUTCString() : parsed.toUTCString();
      const tags = p.tags && p.tags.length ? p.tags : p.category ? [p.category] : [];
      const categories = tags.map((t) => `    <category>${xmlEsc(t)}</category>`).join('\n');
      return `  <item>
    <title>${xmlEsc(p.title)}</title>
    <link>${link}</link>
    <guid isPermaLink="true">${link}</guid>
    <pubDate>${pubDate}</pubDate>
    <description>${xmlEsc(p.excerpt || '')}</description>
${categories}
  </item>`;
    })
    .join('\n');

  const newest = posts.length ? new Date(posts[0].date) : new Date();

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${xmlEsc(config.site.title)}</title>
  <link>${SITE_URL}/</link>
  <description>${xmlEsc(config.site.shortDescription || '')}</description>
  <language>en</language>
  <lastBuildDate>${newest.toUTCString()}</lastBuildDate>
  <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
</channel>
</rss>
`;
}

function main() {
  // Ensure dist directory exists
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Generate sitemap.xml
  const sitemap = generateSitemap();
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap);
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
  console.log('✓ Generated sitemap.xml');

  // Generate robots.txt
  const robots = generateRobotsTxt();
  fs.writeFileSync(path.join(distDir, 'robots.txt'), robots);
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robots);
  console.log('✓ Generated robots.txt');

  // Generate RSS feed from blog frontmatter
  const rss = generateRss();
  fs.writeFileSync(path.join(distDir, 'rss.xml'), rss);
  fs.writeFileSync(path.join(publicDir, 'rss.xml'), rss);
  console.log(`✓ Generated rss.xml (${loadBlogPosts().length} posts)`);

  console.log('\nSEO files generated successfully!');
  console.log(`  - ${distDir}/sitemap.xml`);
  console.log(`  - ${distDir}/robots.txt`);
  console.log(`  - ${distDir}/rss.xml`);
}

main();