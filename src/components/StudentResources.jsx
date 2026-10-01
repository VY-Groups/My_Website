import React, { useState, useMemo, useEffect, useRef } from 'react'
import { FiDownload, FiFile, FiFolder, FiAlertCircle, FiSearch, FiX, FiSend } from 'react-icons/fi'
import './StudentResources.css'
import { useResources } from '../hooks/useResources'
import { trackEvent } from './Analytics'

export default function StudentResources() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [requestText, setRequestText] = useState('')
  const [requestSent, setRequestSent] = useState(false)
  const searchInputRef = useRef(null)

  // CMS-backed resources (Notion/Airtable) with static fallback
  const { materials } = useResources()

  const categories = useMemo(() => {
    const cats = new Set(materials.map(m => m.category))
    return ['all', ...Array.from(cats)]
  }, [materials])

  // Debounce search input (250ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm)
      if (searchTerm) {
        trackEvent('resource_search', { query: searchTerm.slice(0, 50) })
      }
    }, 250)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const filteredMaterials = useMemo(() => {
    let results = selectedCategory === 'all'
      ? materials
      : materials.filter(m => m.category === selectedCategory)

    const query = debouncedSearch.trim().toLowerCase()
    if (query) {
      results = results.filter(m =>
        m.title.toLowerCase().includes(query) ||
        m.description.toLowerCase().includes(query) ||
        m.category.toLowerCase().includes(query)
      )
    }
    return results
  }, [materials, selectedCategory, debouncedSearch])

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    trackEvent('resource_filter', { category })
  }

  const handleDownload = (material) => {
    trackEvent('resource_download', {
      resource_id: material.id,
      resource_title: material.title,
      category: material.category,
    })
  }

  const clearSearch = () => {
    setSearchTerm('')
    setDebouncedSearch('')
    searchInputRef.current?.focus()
  }

  const handleRequestSubmit = (e) => {
    e.preventDefault()
    if (!requestText.trim()) return

    trackEvent('resource_request', { request: requestText.slice(0, 100) })

    // Open contact form with prefilled message
    const message = `Hi Yash,\n\nI'd like to request a learning resource:\n\n"${requestText}"\n\nThanks!`
    window.location.hash = 'contact'
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('prefill-contact-message', { detail: message }))
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
    }, 200)

    setRequestSent(true)
    setRequestText('')
    setShowRequestForm(false)
    setTimeout(() => setRequestSent(false), 5000)
  }

  return (
    <section className="student-resources" id="resources">
      <div className="container">
        <h2 className="section-title">Student Resources</h2>
        <p className="section-subtitle">Download curated learning materials and educational content</p>

        {/* Search Bar */}
        <div className="resource-search">
          <FiSearch className="search-icon" aria-hidden="true" />
          <input
            ref={searchInputRef}
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search resources (e.g., Docker, Linux, AWS)…"
            aria-label="Search student resources"
            className="search-input"
          />
          {searchTerm && (
            <button className="search-clear" onClick={clearSearch} aria-label="Clear search">
              <FiX size={16} />
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="category-filter" role="group" aria-label="Filter resources by category">
          {categories.map((category) => (
            <button
              key={category}
              className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => handleCategoryChange(category)}
              aria-pressed={selectedCategory === category}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Results count */}
        {(debouncedSearch || selectedCategory !== 'all') && (
          <p className="results-count" role="status" aria-live="polite">
            Showing {filteredMaterials.length} of {materials.length} resources
            {debouncedSearch && <> for "<strong>{debouncedSearch}</strong>"</>}
          </p>
        )}

        {/* Materials Grid */}
        <div className="materials-grid">
          {filteredMaterials.map((material) => (
            <div key={material.id} className="material-card">
              <div className="material-icon">
                <FiFile size={32} />
              </div>
              <h3 className="material-title">{material.title}</h3>
              <p className="material-category">{material.category}</p>
              <p className="material-description">{material.description}</p>
              <div className="material-meta">
                <span className="file-type">{material.fileType}</span>
                <span className="file-size">{material.fileSize}</span>
              </div>
              <a
                href={material.downloadLink}
                className="download-btn"
                download
                onClick={() => handleDownload(material)}
                aria-label={`Download ${material.title}`}
              >
                <FiDownload /> Download
              </a>
            </div>
          ))}
        </div>

        {filteredMaterials.length === 0 && (
          <div className="empty-state" role="status">
            <FiFolder size={48} />
            <h3>No Resources Found</h3>
            <p>No materials match your search. Try a different term or request one below.</p>
            <button className="filter-btn" onClick={() => setShowRequestForm(true)}>
              Request a Resource
            </button>
          </div>
        )}

        {/* Resource Request Form */}
        {showRequestForm && (
          <form className="resource-request-form" onSubmit={handleRequestSubmit}>
            <h4>
              <FiSend size={18} /> Request a Resource
            </h4>
            <textarea
              value={requestText}
              onChange={(e) => setRequestText(e.target.value)}
              placeholder="What topic or material would you like me to add? (e.g., Terraform notes, AWS Solutions Architect study guide)"
              aria-label="Resource request details"
              rows={3}
              required
            />
            <div className="request-actions">
              <button type="submit" className="filter-btn active" disabled={!requestText.trim()}>
                <FiSend size={14} /> Send Request
              </button>
              <button type="button" className="filter-btn" onClick={() => setShowRequestForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        )}

        {requestSent && (
          <div className="request-success" role="alert">
            ✓ Redirecting to contact form — your request has been pre-filled!
          </div>
        )}

        {/* Info Box */}
        <div className="resources-info">
          <FiFolder size={24} />
          <div>
            <h4>Free Learning Resources</h4>
            <p>All materials are available for free download. Click the download button on any resource to get started.</p>
            <button className="request-link" onClick={() => setShowRequestForm(!showRequestForm)}>
              <FiSend size={14} /> {showRequestForm ? 'Hide request form' : 'Request a missing resource'}
            </button>
          </div>
        </div>

        {/* Disclaimer Note */}
        <div className="resources-notification">
          <FiAlertCircle className="notification-icon" />
          <div className="notification-content">
            <h4>Disclaimer</h4>
            <p>These notes are not prepared by me. I have collected them from LinkedIn and other educational resources. However, I have thoroughly reviewed each document for validity and authenticity to ensure quality learning materials for students. <strong className="highlight">I would also like to thank the original authors and platforms for sharing these valuable resources.</strong></p>
          </div>
        </div>
      </div>
    </section>
  )
}