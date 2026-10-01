import React, { useState } from 'react'
import { FiGithub, FiExternalLink } from 'react-icons/fi'
import TechInfo from './TechInfo'
import './Projects.css'

export default function Projects() {
  const [selectedTech, setSelectedTech] = useState(null)

  const projects = [
    {
      title: 'PatchMaster Enterprise',
      description: 'High-availability patch management & infrastructure telemetry platform — real-time WebSocket fleet monitoring, canary & ring rollouts, CVE compliance and air-gapped deployment support.',
      tech: ['FastAPI', 'React', 'PostgreSQL', 'WebSocket', 'Prometheus'],
      github: 'https://github.com/VY-Groups/patchmaster',
      link: 'https://github.com/VY-Groups/patchmaster'
    },
    {
      title: 'HRMS Professional Edition',
      description: 'Enterprise-grade HR management system for Indian organizations — payroll (PF/ESI/TDS), geo-location attendance, IT ticketing with SLA, and 20+ PDF document templates. Tested with 150+ concurrent users.',
      tech: ['Node.js', 'Express', 'PostgreSQL', 'Docker', 'Kubernetes'],
      github: 'https://github.com/VY-Groups/HRMS-VYGROUP',
      link: 'https://github.com/VY-Groups/HRMS-VYGROUP'
    },
    {
      title: 'Portfolio & Student Platform',
      description: 'Full-stack portfolio with SEO, analytics, MDX blog, PWA, accessibility audit and a CMS-backed student resources platform — served by Express with a secure form backend.',
      tech: ['React', 'Vite', 'Node.js', 'PWA', 'Vercel'],
      github: 'https://github.com/yashkumardubey/My_Website',
      link: 'https://yashkumardubey.dev/'
    },
    {
      title: 'PatchOps Tool',
      description: 'The next evolution of PatchMaster — a unified patch operations platform, currently in development at VY-Groups. Launching soon.',
      tech: ['DevOps', 'Automation', 'Python', 'Patch Management'],
      github: 'https://github.com/VY-Groups/patchmaster',
      link: 'https://github.com/VY-Groups'
    }
  ]

  return (
    <>
      <section className="projects" id="projects">
        <div className="container">
          <h2 className="section-title">Featured Projects</h2>
          <div className="projects-grid">
            {projects.map((project, index) => (
              <div key={index} className="project-card">
                <div className="project-header">
                  <h3>{project.title}</h3>
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
