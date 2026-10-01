import React, { useState, useEffect } from 'react'
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi'
import './Contact.css'
import HCaptcha from './HCaptcha'

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
        <h2 className="section-title">Get In Touch</h2>
        
        <div className="contact-content">
          <div className="contact-info">
            <h3>Let's connect</h3>
            <p>I'm always interested in hearing about new projects and opportunities. Feel free to reach out!</p>
            
            <div className="contact-methods">
              <a href="mailto:ydubey020@gmail.com" className="contact-method">
                <FiMail size={20} />
                <span>ydubey020@gmail.com</span>
              </a>
              <div className="contact-method">
                <FiMapPin size={20} />
                <span>New Delhi, India</span>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit} aria-label="Contact form">
            <div className="form-group">
              <label htmlFor="contact-name" className="sr-only">Your Name</label>
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
            <div className="form-group">
              <label htmlFor="contact-email" className="sr-only">Your Email</label>
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
            <div className="form-group">
              <label htmlFor="contact-message" className="sr-only">Your Message</label>
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
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Sending...' : submitted ? '✓ Message Sent!' : 'Send Message'}
            </button>
            {submitted && <p role="status" className="sr-only">Message sent successfully</p>}
          </form>
        </div>
      </div>
    </section>
  )
}
