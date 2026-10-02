import React, { useState, useEffect } from 'react'
import { FiMail, FiMapPin, FiGithub, FiLinkedin, FiSend, FiUser, FiMessageSquare, FiClock, FiArrowRight, FiArrowUpRight } from 'react-icons/fi'
import './Contact.css'
import HCaptcha from './HCaptcha'
import { owner, socials } from '../config/site'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [captchaToken, setCaptchaToken] = useState(null)

  // Listen for prefill events (e.g., from Student Resources "Request a Resource")
  useEffect(() => {
    const handlePrefill = (e) => {
      if (e.detail) {
        setFormData(prev => ({ ...prev, message: e.detail }))
      }
    }
    window.addEventListener('prefill-contact-message', handlePrefill)
    return () => window.removeEventListener('prefill-contact-message', handlePrefill)
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          captchaToken: captchaToken || undefined
        })
      })

      if (response.ok) {
        setSubmitted(true)
        setFormData({ name: '', email: '', message: '' })
        setCaptchaToken(null)
        setTimeout(() => setSubmitted(false), 3000)
      } else {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to send')
      }
    } catch (error) {
      console.error('Error sending email:', error)
      alert(error.message || 'Error sending message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="contact" id="contact">
      <div className="container">
        <span className="contact-badge">Say Hello</span>
        <h2 className="section-title">Get In Touch</h2>
        <p className="section-subtitle contact-subtitle">
          Have a question or want to work together? Drop a message — I usually reply within 24 hours.
        </p>

        <div className="contact-content">
          <div className="contact-info">
            <div className="contact-intro">
              <h3>Let's connect</h3>
              <p>I'm always interested in hearing about new projects and opportunities. Feel free to reach out!</p>
            </div>

            <div className="contact-methods">
              <a href={`mailto:${owner.email}`} className="contact-method">
                <span className="method-icon"><FiMail size={18} aria-hidden="true" /></span>
                <span className="method-body">
                  <span className="method-label">Email</span>
                  <span className="method-value">{owner.email}</span>
                </span>
                <FiArrowUpRight className="method-arrow" size={15} aria-hidden="true" />
              </a>
              <div className="contact-method">
                <span className="method-icon"><FiMapPin size={18} aria-hidden="true" /></span>
                <span className="method-body">
                  <span className="method-label">Location</span>
                  <span className="method-value">{owner.location}</span>
                </span>
              </div>
              <a href={socials.github} className="contact-method" target="_blank" rel="noopener noreferrer">
                <span className="method-icon"><FiGithub size={18} aria-hidden="true" /></span>
                <span className="method-body">
                  <span className="method-label">GitHub</span>
                  <span className="method-value">{socials.github.replace('https://github.com/', '')}</span>
                </span>
                <FiArrowUpRight className="method-arrow" size={15} aria-hidden="true" />
              </a>
              <a href={socials.linkedin} className="contact-method" target="_blank" rel="noopener noreferrer">
                <span className="method-icon"><FiLinkedin size={18} aria-hidden="true" /></span>
                <span className="method-body">
                  <span className="method-label">LinkedIn</span>
                  <span className="method-value">{socials.linkedin.replace('https://www.linkedin.com/', '')}</span>
                </span>
                <FiArrowUpRight className="method-arrow" size={15} aria-hidden="true" />
              </a>
            </div>

            <div className="contact-chips">
              <span className="contact-chip">
                <span className="chip-dot" aria-hidden="true" />
                Open for opportunities
              </span>
              <span className="contact-chip">
                <FiClock size={13} aria-hidden="true" />
                Replies within 24h
              </span>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit} aria-label="Contact form">
            <div className="form-panel-head">
              <span className="form-panel-icon"><FiSend size={18} aria-hidden="true" /></span>
              <div className="form-panel-text">
                <h3>Send a message</h3>
                <p>Fill in the details below — I'll get back to you soon.</p>
              </div>
            </div>

            <div className="form-group with-icon">
              <label htmlFor="contact-name" className="sr-only">Your Name</label>
              <FiUser className="field-icon" size={16} aria-hidden="true" />
              <input
                id="contact-name"
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                required
              />
            </div>
            <div className="form-group with-icon">
              <label htmlFor="contact-email" className="sr-only">Your Email</label>
              <FiMail className="field-icon" size={16} aria-hidden="true" />
              <input
                id="contact-email"
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>
            <div className="form-group with-icon icon-top">
              <label htmlFor="contact-message" className="sr-only">Your Message</label>
              <FiMessageSquare className="field-icon" size={16} aria-hidden="true" />
              <textarea
                id="contact-message"
                name="message"
                placeholder="Your Message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <HCaptcha onChange={setCaptchaToken} />
            <button type="submit" className="btn btn-primary btn-shine" disabled={loading}>
              {loading ? 'Sending...' : submitted ? '✓ Message Sent!' : 'Send Message'}
              {!loading && !submitted && <FiArrowRight size={16} aria-hidden="true" />}
            </button>
            {submitted && <p role="status" className="sr-only">Message sent successfully</p>}
          </form>
        </div>
      </div>
    </section>
  )
}
