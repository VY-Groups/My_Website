import React, { useState, useMemo } from 'react'
import { FiGithub, FiExternalLink } from 'react-icons/fi'
import TechInfo from './TechInfo'
import CountUp from './CountUp'
import { site } from '../config/site'
import './Projects.css'

const FILTERS = ['All', 'DevOps & Automation', 'Enterprise Apps', 'Web Apps']

export default function Projects() {
  const [selectedTech, setSelectedTech] = useState(null)
  const [activeFilter, setActiveFilter] = useState('All')

  const projects = [
    {
      title: 'PatchMaster Enterprise',
      description: 'High-availability patch management & infrastructure telemetry platform — real-time WebSocket fleet monitoring, canary & ring rollouts, CVE compliance and air-gapped deployment support.',
      tech: ['FastAPI', 'React', 'PostgreSQL', 'WebSocket', 'Prometheus'],
      github: 'https://github.com/VY-Groups/patchmaster',
      link: 'https://github.com/VY-Groups/patchmaster',
      status: 'Production',
      statusKind: 'production',
      category: 'DevOps & Automation'
    },
    {
      title: 'HRMS Professional Edition',
      description: 'Enterprise-grade HR management system for Indian organizations — payroll (PF/ESI/TDS), geo-location attendance, IT ticketing with SLA, and 20+ PDF document templates. Tested with 150+ concurrent users.',
      tech: ['Node.js', 'Express', 'PostgreSQL', 'Docker', 'Kubernetes'],
      github: 'https://github.com/VY-Groups/HRMS-VYGROUP',
      link: 'https://github.com/VY-Groups/HRMS-VYGROUP',
      status: 'Production',
      statusKind: 'production',
      category: 'Enterprise Apps'
    },
    {
      title: 'Portfolio & Student Platform',
      description: 'Full-stack portfolio with SEO, analytics, MDX blog, PWA, accessibility audit and a CMS-backed student resources platform — served by Express with a secure form backend.',
      tech: ['React', 'Vite', 'Node.js', 'PWA', 'Vercel'],
      github: site.repo,
      link: site.url,
      status: 'Live',
      statusKind: 'live',
      category: 'Web Apps'
    },
    {
      title: 'PatchOps Tool',
      description: 'The next evolution of PatchMaster — a unified patch operations platform, currently in development at VY-Groups. Launching soon.',
      tech: ['DevOps', 'Automation', 'Python', 'Patch Management'],
      github: 'https://github.com/VY-Groups/patchmaster',
      link: 'https://github.com/VY-Groups',
      status: 'In Dev',
      statusKind: 'dev',
      category: 'DevOps & Automation'
    }
  ]

  const visibleProjects = useMemo(
    () =>
      activeFilter === 'All'
        ? projects
        : projects.filter((project) => project.category === activeFilter),
    [activeFilter]
  )

  return (
    <>
      <section className="projects" id="projects">
        <div className="container">
          <h2 className="section-title">Featured Projects</h2>

          <div className="projects-kpis" aria-label="Project metrics">
            <div className="kpi-item">
              <span className="kpi-number"><CountUp value="99.99%" /></span>
              <span className="kpi-label">Uptime Engineered</span>
            </div>
            <div className="kpi-item">
              <span className="kpi-number"><CountUp value="150+" /></span>
              <span className="kpi-label">Peak Concurrent Users</span>
            </div>
            <div className="kpi-item">
              <span className="kpi-number"><CountUp value="10+" /></span>
              <span className="kpi-label">Projects Shipped</span>
            </div>
            <div className="kpi-item">
              <span className="kpi-number">24/7</span>
              <span className="kpi-label">Telemetry Coverage</span>
            </div>
          </div>

          <div className="projects-filter">
            <div className="filter-tabs" role="group" aria-label="Filter projects by category">
              {FILTERS.map((filter) => (
                <button
                  key={filter}
                  className={`filter-tab${activeFilter === filter ? ' active' : ''}`}
                  aria-pressed={activeFilter === filter}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
            <span className="filter-count" aria-live="polite">
              Showing {visibleProjects.length} {visibleProjects.length === 1 ? 'project' : 'projects'}
            </span>
          </div>

          <div className="projects-grid">
            {visibleProjects.map((project, index) => (
              <div key={`${activeFilter}-${index}`} className="project-card">
                <div className="project-header">
                  <h3>{project.title}</h3>
                  <span className={`project-status status-${project.statusKind}`}>
                    {project.status}
                  </span>
                </div>
                <p className="project-description">{project.description}</p>
                <div className="project-tech">
                  {project.tech.map((tech, i) => (
                    <button
                      key={i}
                      className="tech-badge"
                      onClick={() => setSelectedTech(tech)}
                      title="Click to learn more"
                    >
                      {tech}
                    </button>
                  ))}
                </div>
                <div className="project-links">
                  <a href={project.github} className="project-link" title="GitHub" target="_blank" rel="noopener noreferrer">
                    <FiGithub size={18} />
                  </a>
                  <a href={project.link} className="project-link" title="View Project" target="_blank" rel="noopener noreferrer">
                    <FiExternalLink size={18} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {selectedTech && <TechInfo tech={selectedTech} onClose={() => setSelectedTech(null)} />}
    </>
  )
}
