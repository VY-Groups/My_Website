import React, { useState, useEffect } from 'react'
import { FiClock } from 'react-icons/fi'
import { owner, org } from '../config/site'
import './Footer.css'

const formatTime = () =>
  new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }).format(new Date())

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const [time, setTime] = useState(formatTime)

  useEffect(() => {
    const id = setInterval(() => setTime(formatTime()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-left">
            <h3 className="footer-name">{owner.name}</h3>
            <p className="footer-location">{owner.location}</p>
            <p className="footer-time" aria-hidden="true">
              <FiClock size={13} />
              {time} IST
            </p>
            <div className="footer-links">
              <a href={org.github} target="_blank" rel="noopener noreferrer">
                Founder of {org.name}
              </a>
              <a href={org.url} target="_blank" rel="noopener noreferrer">
                {org.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
              </a>
            </div>
          </div>
          <p className="footer-copyright">&copy; {currentYear} {owner.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
