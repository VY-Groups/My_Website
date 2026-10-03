import React, { useState } from 'react'
import { FiMenu, FiX, FiSun, FiMoon, FiCommand } from 'react-icons/fi'
import { owner } from '../config/site'
import { OPEN_COMMAND } from './CommandPalette'
import './Navigation.css'

const IS_MAC = typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent)

export default function Navigation({ isDark, setIsDark, activeSection }) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  const handleNameClick = () => {
    const link = document.createElement('a')
    link.href = owner.resume
    link.download = true
    link.click()
  }

  const handleNavClick = (target) => {
    // Close menu if open
    setIsOpen(false)
    
    // Update hash and scroll to section
    window.location.hash = target
    setTimeout(() => {
      const element = document.getElementById(target)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)
  }

  const navItems = [
    { id: 'hero', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'blog', label: 'Blog' },
    { id: 'resources', label: 'Resources' },
    { id: 'success-stories', label: 'Success Stories' },
    { id: 'collaboration', label: 'Collaborate' },
    { id: 'contact', label: 'Contact' }
  ]

  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="nav-container">
        <div className="nav-brand">
          <a href="#" className="logo" aria-label={`Go to top - ${owner.name}`} onClick={(e) => { e.preventDefault(); handleNavClick('hero'); }}>
            <img
              src="/pic-400.webp"
              alt={`${owner.name} profile photo`}
              className="logo-image"
              width="40"
              height="40"
              loading="lazy"
              decoding="async"
            />
          </a>
          <span className="brand-text" onClick={handleNameClick} style={{ cursor: 'pointer' }} title="Download Resume">{owner.name}</span>
        </div>

        <div className={`nav-menu ${isOpen ? 'active' : ''}`} id="nav-menu">
          {navItems.map(item => (
            <button 
              key={item.id}
              className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
              aria-current={activeSection === item.id ? 'page' : undefined}
              aria-label={`Go to ${item.label} section`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="nav-controls">
          <span className="nav-status" title="Available for new projects">
            <span className="nav-status-dot" aria-hidden="true"></span>
            <span>Open for opportunities</span>
          </span>
          <button
            className="cmd-trigger"
            onClick={() => window.dispatchEvent(new CustomEvent(OPEN_COMMAND))}
            aria-label="Open command palette"
            title={`Command palette (${IS_MAC ? '⌘' : 'Ctrl'}+K)`}
          >
            <FiCommand size={15} aria-hidden="true" />
            <span className="cmd-trigger-key" aria-hidden="true">
              {IS_MAC ? '⌘K' : 'Ctrl K'}
            </span>
          </button>
          <button 
            className="theme-toggle"
            onClick={() => setIsDark(!isDark)}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-pressed={isDark}
          >
            {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>
          <button
            className="menu-toggle"
            onClick={toggleMenu}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            aria-controls="nav-menu"
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  )
}
