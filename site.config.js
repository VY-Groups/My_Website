/**
 * site.config.js — Single source of truth for the site's identity.
 * ---------------------------------------------------------------------------
 * Every consumer reads from here:
 *   - src/config/site.js         React app (UI copy, links, SEO component)
 *   - scripts/generate-seo.js    sitemap.xml + robots.txt (build time)
 *   - scripts/apply-identity.js  rewrites index.html + manifest.webmanifest
 *   - scripts/check-identity.js  audits for leftover identity strings
 *   - api/*.js                   transactional email templates
 *
 * FUTURE — when this site becomes the official VY-Groups company page:
 *   1. Edit the values below (see docs/VYGROUPS_MIGRATION.md for the field map)
 *   2. Run:  node scripts/apply-identity.js     (syncs index.html + manifest)
 *   3. Build (regenerates sitemap/robots from this config automatically)
 *   4. Audit leftovers:  node scripts/check-identity.js "<old values...>"
 * ---------------------------------------------------------------------------
 */

export const site = {
  name: 'Yash Kumar Dubey Portfolio',
  shortName: 'Yash Kumar Dubey',
  title: 'Yash Kumar Dubey - DevOps Engineer & Cloud Architect',
  url: 'https://yashkumardubey.dev',
  repo: 'https://github.com/yashkumardubey/My_Website',
  description:
    'DevOps Engineer & Cloud Architect specializing in AWS, Kubernetes, CI/CD pipelines, Linux automation, and scalable cloud infrastructure. 3+ years delivering 99.99% uptime systems.',
  shortDescription:
    'DevOps Engineer & Cloud Architect specializing in AWS, Kubernetes, CI/CD pipelines, Linux automation, and scalable cloud infrastructure.',
  manifestDescription:
    'Portfolio of Yash Kumar Dubey - DevOps Engineer & Cloud Architect specializing in AWS, Kubernetes, and CI/CD pipelines.',
  keywords:
    'DevOps, AWS, Kubernetes, CI/CD, Linux, Cloud Architect, Infrastructure as Code, Terraform, Docker, Jenkins, GitLab CI, Monitoring, Observability',
  ogImageAlt: 'Yash Kumar Dubey - DevOps Engineer',
};

export const owner = {
  name: 'Yash Kumar Dubey',
  firstName: 'Yash',
  role: 'DevOps Engineer & Cloud Architect',
  location: 'New Delhi, India',
  email: 'ydubey020@gmail.com',
  photo: '/pic-800.webp',
  photoSmall: '/pic-400.webp',
  resume: '/Yash_Kumar_Dubey_Resume.pdf',
  worksFor: 'Freelance / Consulting',
  bio: 'DevOps Engineer & Cloud Architect with 3+ years of experience designing and implementing scalable cloud infrastructure, automating CI/CD pipelines, and optimizing Linux environments.',
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
};

export const socials = {
  github: 'https://github.com/yashkumardubey',
  linkedin: 'https://www.linkedin.com/in/yash-kumar-dubey-4b4926253',
};

export const org = {
  name: 'VY-Groups',
  url: 'https://vygroups.co.in/',
  github: 'https://github.com/VY-Groups',
  description:
    'Technology company founded and led by Yash Kumar Dubey, building scalable software, cloud, automation and AI-driven solutions.',
};

export const colors = {
  brand: '#0071e3',
  accent: '#00d4ff',
  themeLight: '#0071e3',
  themeDark: '#0a0e27',
  background: '#0a0e27',
};

export default { site, owner, socials, org, colors };
