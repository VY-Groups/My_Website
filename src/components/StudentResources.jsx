import React, { useState } from 'react'
import { FiDownload, FiFile, FiFolder, FiAlertCircle } from 'react-icons/fi'
import './StudentResources.css'

export default function StudentResources() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Sample data - you can replace this with API calls to fetch from your server
  const materials = [
    {
      id: 1,
      title: 'Introduction to DevOps',
      category: 'DevOps',
      description: 'Comprehensive guide covering DevOps principles, tools, and best practices.',
      fileSize: '2.5 MB',
      fileType: 'PDF',
      downloadLink: '#'
    },
    {
      id: 2,
      title: 'Kubernetes Deep Dive',
      category: 'Kubernetes',
      description: 'Advanced Kubernetes concepts including networking, storage, and security.',
      fileSize: '3.1 MB',
      fileType: 'PDF',
      downloadLink: '#'
    },
    {
      id: 3,
      title: 'CI/CD Pipeline Best Practices',
      category: 'DevOps',
      description: 'Learn how to design and implement efficient CI/CD pipelines.',
      fileSize: '1.8 MB',
      fileType: 'PDF',
      downloadLink: '#'
    },
    {
      id: 4,
      title: 'Cloud Architecture Patterns',
      category: 'Cloud',
      description: 'Design patterns for scalable and resilient cloud applications.',
      fileSize: '2.2 MB',
      fileType: 'PDF',
      downloadLink: '#'
    },
    {
      id: 5,
      title: 'Python for DevOps Engineers',
      category: 'Programming',
      description: 'Essential Python skills for DevOps automation and scripting.',
      fileSize: '1.9 MB',
      fileType: 'PDF',
      downloadLink: '#'
    },
    {
      id: 6,
      title: 'Docker & Containerization',
      category: 'DevOps',
      description: 'Complete guide to Docker, containerization, and container orchestration.',
      fileSize: '2.4 MB',
      fileType: 'PDF',
      downloadLink: '#'
    }
  ]

  const categories = ['all', 'DevOps', 'Kubernetes', 'Cloud', 'Programming']

  const filteredMaterials = selectedCategory === 'all' 
    ? materials 
    : materials.filter(m => m.category === selectedCategory)

  return (
    <section className="student-resources" id="resources">
      <div className="container">
        <h2 className="section-title">Student Resources</h2>
        <p className="section-subtitle">Download curated learning materials and educational content</p>

        {/* Coming Soon Notification */}
        <div className="resources-notification">
          <FiAlertCircle className="notification-icon" />
          <div className="notification-content">
            <h4>Upcoming Feature</h4>
            <p>Student resources will be added as a future feature. Stay tuned!</p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="category-filter">
          {categories.map((category) => (
            <button
              key={category}
              className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
              disabled
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Materials Grid - Placeholder */}
        <div className="materials-grid-empty">
          <div className="empty-state">
            <FiFolder size={48} />
            <h3>Feature Coming Later</h3>
            <p>Student resources will be added in a future update</p>
          </div>
        </div>

        {/* Info Box */}
        <div className="resources-info">
          <FiFolder size={24} />
          <div>
            <h4>Future Feature</h4>
            <p>Student resources will be added as a future enhancement to the platform.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
