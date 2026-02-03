import React, { useState } from 'react'
import { FiSend, FiCheckCircle } from 'react-icons/fi'
import './Collaboration.css'

export default function Collaboration() {
  const [formData, setFormData] = useState({
    companyName: '',
    name: '',
    email: '',
    requestType: 'collaboration',
    briefDetail: '',
    services: [],
    budget: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const serviceOptions = [
    { id: 'cloud-architecture', label: 'Cloud Architecture & AWS' },
    { id: 'kubernetes', label: 'Kubernetes & Container Orchestration' },
    { id: 'cicd', label: 'CI/CD Pipeline Design & Implementation' },
    { id: 'devops', label: 'DevOps Engineering & Automation' },
    { id: 'infrastructure', label: 'Infrastructure as Code (Terraform, Ansible)' },
    { id: 'monitoring', label: 'Monitoring & Observability Setup' },
    { id: 'security', label: 'DevSecOps & Security Implementation' },
    { id: 'migration', label: 'Cloud Migration & Optimization' },
    { id: 'performance', label: 'Performance Tuning & Optimization' },
    { id: 'backup', label: 'Backup & Disaster Recovery' },
    { id: 'consultation', label: 'Technical Consultation' },
    { id: 'training', label: 'Team Training & Knowledge Transfer' }
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleServiceChange = (serviceId) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(id => id !== serviceId)
        : [...prev.services, serviceId]
    }))
  }

  const buildMailtoLink = () => {
    const subject = `Collaboration Request - ${formData.companyName || 'Company'} (${formData.requestType})`
    const servicesText = formData.services.length
      ? formData.services.map(id => serviceOptions.find(s => s.id === id)?.label || id).join(', ')
      : 'N/A'

    const body = [
      `Company Name: ${formData.companyName}`,
      `Name: ${formData.name}`,
      `Email: ${formData.email}`,
      `Request Type: ${formData.requestType}`,
      `Services Interested In: ${servicesText}`,
      `Budget Range: ${formData.budget || 'N/A'}`,
      '',
      'Brief Details:',
      formData.briefDetail
    ].join('\n')

    return `mailto:ydubey020@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.services.length === 0) {
      alert('Please select at least one service')
      return
    }

    setLoading(true)

    try {
      const requestPayload = {
        type: 'collaboration',
        companyName: formData.companyName,
        name: formData.name,
        email: formData.email,
        requestType: formData.requestType,
        briefDetail: formData.briefDetail,
        services: formData.services,
        budget: formData.budget
      }

      console.log('Sending collaboration request:', requestPayload)

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000)

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestPayload),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      const responseData = await response.json()
      console.log('Response:', responseData)

      if (response.ok) {
        setSubmitted(true)
        setFormData({
          companyName: '',
          name: '',
          email: '',
          requestType: 'collaboration',
          briefDetail: '',
          services: [],
          budget: ''
        })
        setTimeout(() => setSubmitted(false), 3000)
      } else {
        throw new Error(responseData.error || 'Failed to send')
      }
    } catch (error) {
      const message = error.name === 'AbortError'
        ? 'Request timed out. Opening your email client instead.'
        : 'Unable to send from server. Opening your email client instead.'
      console.error('Error sending collaboration request:', error)
      window.location.href = buildMailtoLink()
      alert(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="collaboration" id="collaboration">
      <div className="container">
        <h2 className="section-title">Let's Collaborate</h2>
        <p className="section-subtitle">Have a project, issue to solve, or want to collaborate? I'm here to help!</p>
        <div className="collaboration-notice" role="status" aria-live="polite">
          <span className="notice-icon">📢</span>
          <div className="notice-text">
            <strong>Updates coming soon:</strong> We’ll be adding new features and expanding services for all kinds of development.
          </div>
        </div>

        <div className="collaboration-content">
          <div className="collab-info">
            <div className="info-card">
              <div className="info-icon">🚀</div>
              <h3>New Projects</h3>
              <p>Looking to build or scale your infrastructure? I can help you design and implement scalable solutions.</p>
            </div>

            <div className="info-card">
              <div className="info-icon">🔧</div>
              <h3>Issue Resolution</h3>
              <p>Facing DevOps or infrastructure challenges? Share the details and I'll help you find the right solution.</p>
            </div>

            <div className="info-card">
              <div className="info-icon">🤝</div>
              <h3>Partnership</h3>
              <p>Interested in long-term collaboration? Let's discuss how we can work together to achieve your goals.</p>
            </div>
          </div>

          <form className="collaboration-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group full">
                <label htmlFor="requestType">What brings you here?</label>
                <select
                  id="requestType"
                  name="requestType"
                  value={formData.requestType}
                  onChange={handleChange}
                  required
                >
                  <option value="collaboration">Looking for Collaboration</option>
                  <option value="project">New Project Opportunity</option>
                  <option value="issue">Need Help with an Issue</option>
                  <option value="consultation">Technical Consultation</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="companyName">Company Name</label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  placeholder="Your Company Name"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="name">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Your Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="your.email@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full">
                <label htmlFor="briefDetail">Brief Details</label>
                <textarea
                  id="briefDetail"
                  name="briefDetail"
                  placeholder="Describe your project, issue, or collaboration idea in detail..."
                  rows="4"
                  value={formData.briefDetail}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full">
                <label>What services are you interested in?</label>
                <div className="services-grid">
                  {serviceOptions.map(service => (
                    <label key={service.id} className="service-checkbox">
                      <input
                        type="checkbox"
                        checked={formData.services.includes(service.id)}
                        onChange={() => handleServiceChange(service.id)}
                      />
                      <span>{service.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full">
                <label htmlFor="budget">Budget Range (Optional)</label>
                <input
                  type="text"
                  id="budget"
                  name="budget"
                  placeholder="e.g., $10,000 - $50,000"
                  value={formData.budget}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-submit" disabled={loading}>
              {loading ? (
                'Sending...'
              ) : submitted ? (
                <>
                  <FiCheckCircle size={18} />
                  Request Sent Successfully!
                </>
              ) : (
                <>
                  <FiSend size={18} />
                  Send Collaboration Request
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
