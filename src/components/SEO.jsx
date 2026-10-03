import React, { useEffect } from 'react';
import { site, owner, socials, org, absUrl, pageTitle } from '../config/site';

const SITE_URL = site.url;
const DEFAULT_TITLE = site.title;
const DEFAULT_DESCRIPTION = site.description;
const DEFAULT_IMAGE = absUrl(owner.photo);

const sectionMeta = {
  about: {
    title: site.title,
    description: site.shortDescription,
  },
  experience: {
    title: pageTitle('Experience'),
    description: '3+ years of professional experience in DevOps, Cloud Architecture, and Infrastructure Automation. Work history with scalable systems and 99.99% uptime.',
  },
  skills: {
    title: pageTitle('Skills & Expertise'),
    description: 'Technical skills: AWS, Kubernetes, Docker, CI/CD, Terraform, Linux, Monitoring, GitLab CI, Jenkins, Prometheus, Grafana, Ansible, Python, Bash.',
  },
  certifications: {
    title: pageTitle('Certifications'),
    description: 'AWS Certified Cloud Practitioner (Sep 2024 - Sep 2027), Red Hat RHCSA Rapid Track RH199, Iraje PAM Online Masterclass, and Udemy certifications in AWS and Git - verifiable credentials.',
  },
  projects: {
    title: pageTitle('Projects'),
    description: 'Featured DevOps and Cloud projects: CI/CD pipelines, Kubernetes clusters, Infrastructure as Code, Monitoring solutions, Automation scripts.',
  },
  blog: {
    title: pageTitle('Blog'),
    description: 'Practical DevOps, Cloud, and Linux articles: Kubernetes, GitHub Actions CI/CD pipelines, server security hardening, and real-world automation tips.',
  },
  resources: {
    title: pageTitle('Student Resources'),
    description: 'Free downloadable learning materials for DevOps, Linux, Docker, Azure, Ansible, Networking, and DSA. Curated resources for students and professionals.',
  },
  'success-stories': {
    title: pageTitle('Success Stories'),
    description: 'Success stories and testimonials from students and professionals who benefited from the learning resources and mentorship.',
  },
  collaboration: {
    title: pageTitle('Collaborate'),
    description: 'Open for collaboration, consulting, freelance projects, and partnerships. DevOps, Cloud Architecture, and Infrastructure Automation services.',
  },
  contact: {
    title: pageTitle('Contact'),
    description: 'Get in touch for DevOps consulting, freelance projects, or just to say hello. Available for remote work and collaborations.',
  },
};

function updateMetaTags(meta) {
  // Update title
  document.title = meta.title;

  // Update standard meta tags
  updateMeta('name', 'title', meta.title);
  updateMeta('name', 'description', meta.description);
  updateMeta('property', 'og:title', meta.title);
  updateMeta('property', 'og:description', meta.description);
  updateMeta('property', 'og:url', `${SITE_URL}/#${Object.keys(sectionMeta).find(k => sectionMeta[k] === meta) || 'about'}`);
  updateMeta('name', 'twitter:title', meta.title);
  updateMeta('name', 'twitter:description', meta.description);
}

function updateMeta(attr, name, content) {
  let element = document.querySelector(`meta[${attr}="${name}"]`);
  if (element) {
    element.setAttribute('content', content);
  } else {
    element = document.createElement('meta');
    element.setAttribute(attr, name);
    element.setAttribute('content', content);
    document.head.appendChild(element);
  }
}

function updateStructuredData(section) {
  const script = document.getElementById('structured-data');
  if (!script) return;

  const baseData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: owner.name,
    url: SITE_URL,
    image: DEFAULT_IMAGE,
    sameAs: [
      socials.github,
      org.github,
      socials.linkedin,
    ],
    jobTitle: owner.role,
    founder: {
      '@type': 'Organization',
      name: org.name,
      url: org.url,
    },
    worksFor: {
      '@type': 'Organization',
      name: owner.worksFor,
    },
    knowsAbout: owner.knowsAbout,
    description: DEFAULT_DESCRIPTION,
  };

  // Add section-specific data
  if (section === 'projects') {
    baseData['@type'] = ['Person', 'CreativeWork'];
    baseData.creativeWork = {
      '@type': 'CreativeWork',
      name: 'DevOps Projects Portfolio',
      description: 'Collection of DevOps and Cloud infrastructure projects.',
    };
  }

  script.textContent = JSON.stringify(baseData, null, 2);
}

export function useSEO(section = 'about') {
  useEffect(() => {
    const meta = sectionMeta[section] || sectionMeta.about;
    updateMetaTags(meta);
    updateStructuredData(section);
  }, [section]);
}

// Component for rendering SEO in React tree (for SSR compatibility)
export default function SEO({ section = 'about' }) {
  useSEO(section);
  return null;
}

// Helper to generate sitemap entries
export function generateSitemap() {
  const baseUrl = SITE_URL;
  const sections = Object.keys(sectionMeta);

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  ${sections.map(section => `
  <url>
    <loc>${baseUrl}/#${section}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${section === 'about' ? '1.0' : '0.8'}</priority>
  </url>`).join('')}
</urlset>`;
}

export function generateRobotsTxt() {
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