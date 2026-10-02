import React from 'react'
import { FiArrowRight, FiGithub, FiLinkedin, FiMail, FiGlobe, FiCheck } from 'react-icons/fi'
import './Hero.css'
import ParticleBackground from './ParticleBackground'
import ScrollReveal from './ScrollReveal'
import CountUp from './CountUp'
import { getExperience } from '../utils/experience'
import { owner, socials, org } from '../config/site'

export default function Hero() {
  const experience = getExperience()
  return (
    <section className="hero" id="hero">
      <ParticleBackground />
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            {/* Title paints with first paint — no JS-gated reveal (it is LCP) */}
            <h1 className="hero-title">
              Hi, I'm <span className="accent-text">{owner.name}</span>
            </h1>
            <ScrollReveal direction="up" delay={50}>
              <p className="hero-subtitle">
                {owner.role}
              </p>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={100}>
              <p className="hero-description">
                I specialize in designing and implementing scalable cloud infrastructure, automating CI/CD pipelines, and optimizing Linux environments. With {experience.label} years of expertise in AWS, Kubernetes, and modern DevOps practices, I help organizations streamline their deployment processes and achieve 99.99% system uptime.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={150}>
              <div className="hero-stats">
                <div className="stat-item">
                  <span className="stat-number"><CountUp value={experience.label} /></span>
                  <span className="stat-label">Years Experience</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number"><CountUp value="10" /></span>
                  <span className="stat-label">Projects</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number"><CountUp value="99.99%" /></span>
                  <span className="stat-label">Uptime</span>
                </div>
              </div>
            </ScrollReveal>
            
            <ScrollReveal direction="up" delay={175}>
              <div className="hero-principles" aria-label="Engineering principles">
                <span className="principle-chip"><FiCheck size={14} aria-hidden="true" /> GitOps-first</span>
                <span className="principle-chip"><FiCheck size={14} aria-hidden="true" /> Zero-trust by default</span>
                <span className="principle-chip"><FiCheck size={14} aria-hidden="true" /> Cost-optimized cloud</span>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={200}>
              <div className="hero-ctas">
              <button 
                onClick={() => {
                  window.location.hash = 'projects'
                  setTimeout(() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }), 100)
                }}
                className="btn btn-primary"
              >
                View My Work
                <FiArrowRight size={18} />
              </button>
              <button 
                onClick={() => {
                  window.location.hash = 'contact'
                  setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 100)
                }}
                className="btn btn-secondary"
              >
                Get in Touch
              </button>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={250}>
              <div className="hero-social">
                <a href={socials.github} aria-label="GitHub" className="social-link" target="_blank" rel="noopener noreferrer">
                  <FiGithub size={20} />
                </a>
                <a href={socials.linkedin} aria-label="LinkedIn" className="social-link" target="_blank" rel="noopener noreferrer">
                  <FiLinkedin size={20} />
                </a>
                <a href={org.github} aria-label={`${org.name} GitHub organization`} className="social-link" target="_blank" rel="noopener noreferrer">
                  <FiGlobe size={20} />
                </a>
                <button 
                  onClick={() => {
                    window.location.hash = 'contact';
                    setTimeout(() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }), 100);
                  }}
                  aria-label="Email" 
                  className="social-link"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  <FiMail size={20} />
                </button>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal direction="left" delay={150} className="hero-image">
            <img
              src={owner.photo}
              srcSet={`${owner.photo} 800w, ${owner.photoSmall} 400w`}
              sizes="400px"
              alt={owner.name}
              className="profile-image"
              width="400"
              height="400"
              loading="eager"
              decoding="async"
              fetchpriority="high"
            />
            <div className="hero-terminal" aria-label="Deployment status terminal">
              <div className="terminal-bar">
                <span className="terminal-dots" aria-hidden="true">
                  <i className="dot dot-red" />
                  <i className="dot dot-yellow" />
                  <i className="dot dot-green" />
                </span>
                <span className="terminal-title">yash@dubey-devops — bash</span>
              </div>
              <div className="terminal-body">
                <p><span className="t-prompt">$</span> deploy --status</p>
                <p><span className="t-ok">[OK]</span> patchmaster · production</p>
                <p><span className="t-ok">[OK]</span> hrms · production</p>
                <p><span className="t-ok">[OK]</span> portfolio · edge cd · 99.99%</p>
                <p><span className="t-prompt">$</span> <span className="t-cursor" aria-hidden="true" /></p>
              </div>
              <div className="terminal-status">
                <span className="status-led" aria-hidden="true" /> status: operational
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
