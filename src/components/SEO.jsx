import React, { useEffect } from 'react';

const SITE_URL = 'https://yashkumardubey.dev';
const DEFAULT_TITLE = 'Yash Kumar Dubey - DevOps Engineer & Cloud Architect';
const DEFAULT_DESCRIPTION = 'DevOps Engineer & Cloud Architect specializing in AWS, Kubernetes, CI/CD pipelines, Linux automation, and scalable cloud infrastructure. 3+ years delivering 99.99% uptime systems.';
const DEFAULT_IMAGE = `${SITE_URL}/pic.jpeg`;

const sectionMeta = {
  hero: {
    title: 'Yash Kumar Dubey - DevOps Engineer & Cloud Architect',
    description: 'DevOps Engineer & Cloud Architect specializing in AWS, Kubernetes, CI/CD pipelines, Linux automation, and scalable cloud infrastructure.',
  },
  experience: {
    title: 'Experience | Yash Kumar Dubey',
    description: '3+ years of professional experience in DevOps, Cloud Architecture, and Infrastructure Automation. Work history with scalable systems and 99.99% uptime.',
  },
  skills: {
    title: 'Skills & Expertise | Yash Kumar Dubey',
    description: 'Technical skills: AWS, Kubernetes, Docker, CI/CD, Terraform, Linux, Monitoring, GitLab CI, Jenkins, Prometheus, Grafana, Ansible, Python, Bash.',
  },
  projects: {
    title: 'Projects | Yash Kumar Dubey',
    description: 'Featured DevOps and Cloud projects: CI/CD pipelines, Kubernetes clusters, Infrastructure as Code, Monitoring solutions, Automation scripts.',
  },
  blog: {
    title: 'Blog | Yash Kumar Dubey',
    description: 'Practical DevOps, Cloud, and Linux articles: Kubernetes, GitHub Actions CI/CD pipelines, server security hardening, and real-world automation tips.',
  },
  resources: {
    title: 'Student Resources | Yash Kumar Dubey',
    description: 'Free downloadable learning materials for DevOps, Linux, Docker, Azure, Ansible, Networking, and DSA. Curated resources for students and professionals.',
  },
  'success-stories': {
    title: 'Success Stories | Yash Kumar Dubey',
    description: 'Success stories and testimonials from students and professionals who benefited from the learning resources and mentorship.',
  },
  collaboration: {
    title: 'Collaborate | Yash Kumar Dubey',
    description: 'Open for collaboration, consulting, freelance projects, and partnerships. DevOps, Cloud Architecture, and Infrastructure Automation services.',
  },
  contact: {
    title: 'Contact | Yash Kumar Dubey',
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
  updateMeta('property', 'og:url', `${SITE_URL}/#${Object.keys(sectionMeta).find(k => sectionMeta[k] === meta) || 'hero'}`);
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
    name: 'Yash Kumar Dubey',
    url: SITE_URL,
    image: DEFAULT_IMAGE,
    sameAs: [
      'https://github.com/yashkumardubey',
      'https://www.linkedin.com/in/yash-kumar-dubey-4b4926253',
    ],
    jobTitle: 'DevOps Engineer & Cloud Architect',
    worksFor: {
      '@type': 'Organization',
      name: 'Freelance / Consulting',
    },
    knowsAbout: [
      'Amazon Web Services (AWS)',
      'Kubernetes',
      'Docker',
      'CI/CD',
      'Linux Administration',
      'Infrastructure as Code',
      'Terraform',
      'Monitoring & Observability',
      'GitLab CI',
      'Jenkins',
      'Prometheus',
      'Grafana',
      'Ansible',
      'Python',
      'Bash Scripting',
    ],
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

export function useSEO(section = 'hero') {
  useEffect(() => {
    const meta = sectionMeta[section] || sectionMeta.hero;
    updateMetaTags(meta);
    updateStructuredData(section);
  }, [section]);
}

// Component for rendering SEO in React tree (for SSR compatibility)
export default function SEO({ section = 'hero' }) {
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
    <priority>${section === 'hero' ? '1.0' : '0.8'}</priority>
  </url>`).join('')}
</urlset>`;
}

export function generateRobotsTxt() {
  return `# Robots.txt for ${SITE_URL}
User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Disallow admin/api paths
Disallow: /api/
Disallow: /node_modules/
Disallow: /src/
Disallow: /*.json$
Disallow: /*.md$
Disallow: /.git/
`;
}