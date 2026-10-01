import React from 'react'
import { FiArrowRight, FiGithub, FiLinkedin, FiMail, FiGlobe } from 'react-icons/fi'
import './Hero.css'
import ParticleBackground from './ParticleBackground'
import ScrollReveal from './ScrollReveal'
import { getExperience } from '../utils/experience'

export default function Hero() {
  const experience = getExperience()
  return (
    <section className="hero" id="hero">
      <ParticleBackground />
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <ScrollReveal direction="up" delay={0}>
              <h1 className="hero-title">
                Hi, I'm <span className="accent-text">Yash Kumar Dubey</span>
              </h1>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={100}>
              <p className="hero-subtitle">
                DevOps Engineer & Cloud Architect
              </p>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={200}>
              <p className="hero-description">
                I specialize in designing and implementing scalable cloud infrastructure, automating CI/CD pipelines, and optimizing Linux environments. With {experience.label} years of expertise in AWS, Kubernetes, and modern DevOps practices, I help organizations streamline their deployment processes and achieve 99.99% system uptime.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={300}>
              <div className="hero-stats">
                <div className="stat-item">
                  <span className="stat-number">{experience.label}</span>
                  <span className="stat-label">Years Experience</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">10</span>
                  <span className="stat-label">Projects</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">99.99%</span>
                  <span className="stat-label">Uptime</span>
                </div>
              </div>
            </ScrollReveal>
            
            <ScrollReveal direction="up" delay={400}>
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

            <ScrollReveal direction="up" delay={500}>
              <div className="hero-social">
                <a href="https://github.com/yashkumardubey" aria-label="GitHub" className="social-link" target="_blank" rel="noopener noreferrer">
                  <FiGithub size={20} />
                </a>
                <a href="https://www.linkedin.com/in/yash-kumar-dubey-4b4926253" aria-label="LinkedIn" className="social-link" target="_blank" rel="noopener noreferrer">
                  <FiLinkedin size={20} />
                </a>
                <a href="https://github.com/VY-Groups" aria-label="VY-Groups GitHub organization" className="social-link" target="_blank" rel="noopener noreferrer">
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

          <ScrollReveal direction="left" delay={300} className="hero-image">
            <img
              src="/pic.jpeg"
              alt="Yash Kumar Dubey"
              className="profile-image"
              width="400"
              height="400"
              loading="eager"
              decoding="async"
              fetchpriority="high"
            />
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
