import React, { useState } from 'react'
import { FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi'
import './Navigation.css'

export default function Navigation({ isDark, setIsDark, activeSection }) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  const handleNameClick = () => {
    const link = document.createElement('a')
    link.href = '/Yash_Kumar_Dubey_Resume.pdf'
    link.download = true
    link.click()
  }

  const handleNavClick = (target) => {
    // Open in new tab
    window.open(`${window.location.origin}#${target}`, '_blank')
  }

  const navItems = [
    { id: 'hero', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'resources', label: 'Resources' },
    { id: 'success-stories', label: 'Success Stories' },
    { id: 'collaboration', label: 'Collaborate' },
    { id: 'contact', label: 'Contact' }
  ]

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <a href="#" className="logo" onClick={(e) => { e.preventDefault(); handleNavClick('hero'); }}>
            <img src="/pic.jpeg" alt="YD" className="logo-image" />
          </a>
          <span className="brand-text" onClick={handleNameClick} style={{ cursor: 'pointer' }} title="Download Resume">Yash Kumar Dubey</span>
        </div>

        <div className={`nav-menu ${isOpen ? 'active' : ''}`}>
          {navItems.map(item => (
            <button 
              key={item.id}
              className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="nav-controls">
          <button 
            className="theme-toggle"
            onClick={() => setIsDark(!isDark)}
            aria-label="Toggle theme"
          >
            {isDark ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>
          <button className="menu-toggle" onClick={toggleMenu}>
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  )
}
