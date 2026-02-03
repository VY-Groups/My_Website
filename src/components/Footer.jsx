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
          </div>
          <p className="footer-copyright">&copy; {currentYear} Yash Kumar Dubey. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
