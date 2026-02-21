import React, { useState } from 'react'
import { FiDownload, FiFile, FiFolder, FiAlertCircle } from 'react-icons/fi'
import './StudentResources.css'
import { studentMaterials } from '../../api/data/materials'

export default function StudentResources() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const materials = studentMaterials

  const categories = ['all', 'DevOps', 'Linux', 'Docker', 'Azure', 'Ansible', 'Networking', 'General']

  const filteredMaterials = selectedCategory === 'all' 
    ? materials 
    : materials.filter(m => m.category === selectedCategory)

  return (
    <section className="student-resources" id="resources">
      <div className="container">
        <h2 className="section-title">Student Resources</h2>
        <p className="section-subtitle">Download curated learning materials and educational content</p>

        {/* Category Filter */}
        <div className="category-filter">
          {categories.map((category) => (
            <button
              key={category}
              className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

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
              >
                <FiDownload /> Download
              </a>
            </div>
          ))}
        </div>

        {filteredMaterials.length === 0 && (
          <div className="empty-state">
            <FiFolder size={48} />
            <h3>No Resources Found</h3>
            <p>No materials available in this category.</p>
          </div>
        )}

        {/* Info Box */}
        <div className="resources-info">
          <FiFolder size={24} />
          <div>
            <h4>Free Learning Resources</h4>
            <p>All materials are available for free download. Click the download button on any resource to get started.</p>
          </div>
        </div>

        {/* Disclaimer Note */}
        <div className="resources-notification">
          <FiAlertCircle className="notification-icon" />
          <div className="notification-content">
            <h4>Disclaimer</h4>
            <p>These notes are not prepared by me. I have collected them from LinkedIn and other educational resources. However, I have thoroughly reviewed each document for validity and authenticity to ensure quality learning materials for students.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
