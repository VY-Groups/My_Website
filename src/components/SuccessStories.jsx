import React, { useState } from 'react'
import { FiChevronLeft, FiChevronRight, FiStar, FiGithub, FiExternalLink, FiUsers, FiServer, FiMapPin } from 'react-icons/fi'
import './SuccessStories.css'

// VY-Groups company + product showcase (founded & led by Yash Kumar Dubey)
const vyCompany = {
  name: 'VY-Groups',
  tagline: 'Technology company founded & led by Yash Kumar Dubey',
  description:
    'VY-Groups builds scalable software, cloud, automation and AI-driven solutions — along with tools that simplify business and IT operations. From enterprise HR platforms to infrastructure patch management, every product is designed, deployed and maintained end-to-end.',
  areas: [
    'Software Development',
    'DevOps & Automation',
    'Cloud Infrastructure',
    'CI/CD',
    'Infrastructure as Code',
    'Monitoring & Observability',
    'IT Operations',
    'Business Management Tools',
  ],
  github: 'https://github.com/VY-Groups',
  website: 'https://vygroups.co.in/',
}

const products = [
  {
    id: 'hrms',
    icon: 'hrms',
    name: 'HRMS Professional Edition',
    repo: 'HRMS-VYGROUP',
    status: 'In Development',
    link: 'https://github.com/VY-Groups/HRMS-VYGROUP',
    description:
      'Enterprise-grade Human Resource Management System for Indian organizations — built on Node.js + PostgreSQL with a full single-page web application.',
    highlights: [
      'Employee lifecycle, attendance with geo-location & org chart',
      'Payroll with PF, ESI, TDS compliance + 20+ PDF document templates',
      'IT ticketing with SLA, leave management & performance KPIs',
      'JWT + LDAP/AD security with 7-role RBAC',
    ],
    stats: [
      { value: '150+', label: 'concurrent users tested' },
      { value: '0.8s', label: 'avg response time' },
      { value: '99.8%', label: 'uptime in POC' },
    ],
    tags: ['Node.js', 'PostgreSQL', 'Express', 'Docker', 'Kubernetes'],
  },
  {
    id: 'patchmaster',
    icon: 'patchmaster',
    name: 'PatchMaster Enterprise',
    repo: 'patchmaster',
    status: 'Production Ready',
    link: 'https://github.com/VY-Groups/patchmaster',
    description:
      'Next-generation, high-availability patch management & infrastructure telemetry platform — a zero-trust command center for heterogeneous enterprise server fleets.',
    highlights: [
      'Real-time WebSocket telemetry across Linux, UNIX & Windows fleets',
      'Canary testing & ring-based rollout with CVE compliance tracking',
      'Full CI/CD pipeline builder + Prometheus/Grafana observability',
      'SSO (LDAP/OIDC) and air-gapped, offline deployment support',
    ],
    stats: [
      { value: '40+', label: 'API routers' },
      { value: '30s', label: 'agent heartbeat' },
      { value: 'v2.0.17', label: 'current release' },
    ],
    tags: ['FastAPI', 'React', 'PostgreSQL', 'WebSocket', 'Prometheus'],
  },
]

export default function SuccessStories() {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Testimonials - will be updated by admin
  const stories = []

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % stories.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length)
  }

  const currentStory = stories.length > 0 ? stories[currentIndex] : null

  return (
    <section className="success-stories" id="success-stories">
      <div className="container">
        <h2 className="section-title">Success Stories</h2>
        <p className="section-subtitle">
          From founding VY-Groups to shipping enterprise products — the journey so far
        </p>

        {/* Company Spotlight */}
        <article className="vy-spotlight">
          <div className="vy-spotlight-main">
            <span className="vy-badge">Founder-Led Technology Company</span>
            <h3 className="vy-name">{vyCompany.name}</h3>
            <p className="vy-tagline">{vyCompany.tagline}</p>
            <p className="vy-description">{vyCompany.description}</p>
            <div className="vy-links">
              <a
                className="vy-link-btn"
                href={vyCompany.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FiGithub size={16} aria-hidden="true" /> GitHub Organization
              </a>
              <a
                className="vy-link-btn vy-link-secondary"
                href={vyCompany.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FiExternalLink size={16} aria-hidden="true" /> vygroups.co.in
              </a>
            </div>
          </div>
          <div className="vy-areas" aria-label="Areas VY-Groups works in">
            {vyCompany.areas.map((area) => (
              <span className="vy-area-chip" key={area}>
                {area}
              </span>
            ))}
          </div>
        </article>

        {/* Product Stories */}
        <div className="product-showcase">
          {products.map((product) => (
            <article className="product-card" key={product.id}>
              <header className="product-header">
                <span className="product-icon" aria-hidden="true">
                  {product.icon === 'hrms' ? <FiUsers size={22} /> : <FiServer size={22} />}
                </span>
                <div>
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-repo">
                    <FiMapPin size={13} aria-hidden="true" /> VY-Groups/{product.repo}
                  </p>
                </div>
                <span
                  className={`product-status ${product.status === 'Production Ready' ? 'status-live' : ''}`}
                >
                  {product.status}
                </span>
              </header>

              <p className="product-description">{product.description}</p>

              <ul className="product-highlights">
                {product.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <div className="product-stats">
                {product.stats.map((stat) => (
                  <div className="product-stat" key={stat.label}>
                    <span className="product-stat-value">{stat.value}</span>
                    <span className="product-stat-label">{stat.label}</span>
                  </div>
                ))}
              </div>

              <div className="product-tags" aria-label="Tech stack">
                {product.tags.map((tag) => (
                  <span className="product-tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>

              <a
                className="product-link"
                href={product.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FiGithub size={15} aria-hidden="true" /> View on GitHub
              </a>
            </article>
          ))}
        </div>

        {/* Testimonials (when available) */}
        {stories.length > 0 && (
          <div className="stories-carousel">
            <button
              className="carousel-btn prev-btn"
              onClick={prevSlide}
              aria-label="Previous story"
            >
              <FiChevronLeft size={24} />
            </button>

            <div className="story-card">
              <div className="story-header">
                <div className="story-avatar">{currentStory.image}</div>
                <div className="story-meta">
                  <h3 className="story-name">{currentStory.name}</h3>
                  <p className="story-role">{currentStory.role}</p>
                  <p className="story-company">{currentStory.company}</p>
                </div>
              </div>

              <div className="story-rating">
                {[...Array(currentStory.rating)].map((_, i) => (
                  <FiStar key={i} size={18} className="star" />
                ))}
              </div>

              <p className="story-text">"{currentStory.story}"</p>

              <div className="carousel-indicators">
                {stories.map((_, index) => (
                  <button
                    key={index}
                    className={`indicator ${index === currentIndex ? 'active' : ''}`}
                    onClick={() => setCurrentIndex(index)}
                    aria-label={`Go to story ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <button className="carousel-btn next-btn" onClick={nextSlide} aria-label="Next story">
              <FiChevronRight size={24} />
            </button>
          </div>
        )}

        {/* Coming Soon */}
        <div className="empty-stories-message" role="status" aria-live="polite">
          <div className="message-content">
            <span className="coming-soon-badge">Coming Soon</span>
            <h3>PatchOps will be available soon</h3>
            <p>
              PatchMaster's next evolution — a unified patch operations tool. Plus more
              VY-Groups tools (PAM, DAM) on the way. Success stories will be shared here.
              Stay tuned!
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
