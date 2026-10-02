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
  hero: {
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
    <priority>${section === 'hero' ? '1.0' : '0.8'}</priority>
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

  console.log('\nSEO files generated successfully!');
  console.log(`  - ${distDir}/sitemap.xml`);
  console.log(`  - ${distDir}/robots.txt`);
}

main();