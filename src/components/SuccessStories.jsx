import React, { useState } from 'react'
import { FiChevronLeft, FiChevronRight, FiStar } from 'react-icons/fi'
import './SuccessStories.css'

export default function SuccessStories() {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Success stories data - will be updated by admin
  const stories = []

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % stories.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length)
  }

  const currentStory = stories.length > 0 ? stories[currentIndex] : null

  // If no stories available
  if (stories.length === 0) {
    return (
      <section className="success-stories" id="success-stories">
        <div className="container">
          <h2 className="section-title">Success Stories</h2>
          <p className="section-subtitle">Meet our students who transformed their careers</p>
          
          <div className="empty-stories-message">
            <div className="message-content">
              <h3>Coming Soon</h3>
              <p>Success stories will be shared here. Stay tuned!</p>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="success-stories" id="success-stories">
      <div className="container">
        <h2 className="section-title">Success Stories</h2>
        <p className="section-subtitle">Meet our students who transformed their careers</p>

        <div className="stories-carousel">
          <button 
            className="carousel-btn prev-btn" 
            onClick={prevSlide}
            aria-label="Previous story"
          >
            <FiChevronLeft size={24} />
          </button>

          <div className="story-card">
            <div className="story-header">
              <div className="story-avatar">{currentStory.image}</div>
              <div className="story-meta">
                <h3 className="story-name">{currentStory.name}</h3>
                <p className="story-role">{currentStory.role}</p>
                <p className="story-company">{currentStory.company}</p>
              </div>
            </div>

            <div className="story-rating">
              {[...Array(currentStory.rating)].map((_, i) => (
                <FiStar key={i} size={18} className="star" />
              ))}
            </div>

            <p className="story-text">"{currentStory.story}"</p>

            <div className="carousel-indicators">
              {stories.map((_, index) => (
                <button
                  key={index}
                  className={`indicator ${index === currentIndex ? 'active' : ''}`}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Go to story ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <button 
            className="carousel-btn next-btn" 
            onClick={nextSlide}
            aria-label="Next story"
          >
            <FiChevronRight size={24} />
          </button>
        </div>

        {/* Stats Section */}
        <div className="success-stats">
          <div className="stat">
            <h4 className="stat-number">{stories.length}+</h4>
            <p className="stat-label">Success Stories</p>
          </div>
          <div className="stat">
            <h4 className="stat-number">95%</h4>
            <p className="stat-label">Career Growth</p>
          </div>
          <div className="stat">
            <h4 className="stat-number">5★</h4>
            <p className="stat-label">Average Rating</p>
          </div>
        </div>
      </div>
    </section>
  )
}
