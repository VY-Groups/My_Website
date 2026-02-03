import React, { useState } from 'react'
import { FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi'
import './Navigation.css'

export default function Navigation({ isDark, setIsDark }) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  const handleNameClick = () => {
    const link = document.createElement('a')
    link.href = '/Yash_Kumar_Dubey_Resume.pdf'
    link.download = true
    link.click()
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <a href="#" className="logo">
            <img src="/pic.jpeg" alt="YD" className="logo-image" />
          </a>
          <span className="brand-text" onClick={handleNameClick} style={{ cursor: 'pointer' }} title="Download Resume">Yash Kumar Dubey</span>
        </div>

        <div className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <a href="#about" className="nav-link">About</a>
          <a href="#experience" className="nav-link">Experience</a>
          <a href="#skills" className="nav-link">Skills</a>
          <a href="#projects" className="nav-link">Projects</a>
          <a href="#resources" className="nav-link">Resources</a>
          <a href="#success-stories" className="nav-link">Success Stories</a>
          <a href="#collaboration" className="nav-link">Collaborate</a>
          <a href="#contact" className="nav-link">Contact</a>
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
