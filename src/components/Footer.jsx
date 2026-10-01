import React from 'react'
import './Footer.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-left">
            <h3 className="footer-name">Yash Kumar Dubey</h3>
            <p className="footer-location">New Delhi, India</p>
            <div className="footer-links">
              <a href="https://github.com/VY-Groups" target="_blank" rel="noopener noreferrer">
                Founder of VY-Groups
              </a>
              <a href="https://vygroups.co.in/" target="_blank" rel="noopener noreferrer">
                vygroups.co.in
              </a>
            </div>
          </div>
          <p className="footer-copyright">&copy; {currentYear} Yash Kumar Dubey. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
