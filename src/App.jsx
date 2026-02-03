import React, { useState, useEffect, Suspense, lazy } from 'react'
import './App.css'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
const Experience = lazy(() => import('./components/Experience'))
const Skills = lazy(() => import('./components/Skills'))
const Projects = lazy(() => import('./components/Projects'))
const StudentResources = lazy(() => import('./components/StudentResources'))
const SuccessStories = lazy(() => import('./components/SuccessStories'))
const Collaboration = lazy(() => import('./components/Collaboration'))
const Contact = lazy(() => import('./components/Contact'))
const Footer = lazy(() => import('./components/Footer'))

const SectionFallback = ({ label }) => (
  <div className="section-loading" role="status" aria-live="polite">
    Loading {label}…
  </div>
)

export default function App() {
  const [isDark, setIsDark] = useState(true)
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved) {
      setIsDark(saved === 'dark')
    }
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark-mode', isDark)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  // Set active section based on scroll using IntersectionObserver
  useEffect(() => {
    const sections = ['hero', 'experience', 'skills', 'projects', 'resources', 'success-stories', 'collaboration', 'contact']
    
    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0
    }
    
    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    }
    
    const observer = new IntersectionObserver(observerCallback, observerOptions)
    
    // Observe all sections
    sections.forEach(section => {
      const element = document.getElementById(section)
      if (element) {
        observer.observe(element)
      }
    })
    
    return () => {
      observer.disconnect()
    }
  }, [])

  // Set active section based on hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || 'hero'
      setActiveSection(hash)
      
      // Scroll to section
      setTimeout(() => {
        const element = document.getElementById(hash)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    }
    
    window.addEventListener('hashchange', handleHashChange)
    
    // Initial check
    const hash = window.location.hash.slice(1) || 'hero'
    setActiveSection(hash)
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  return (
    <div className={`app ${isDark ? 'dark' : 'light'}`}>
      <Navigation isDark={isDark} setIsDark={setIsDark} activeSection={activeSection} />
      <main className="full-scroll-view">
        <section id="hero"><Hero /></section>
        <section id="experience">
          <Suspense fallback={<SectionFallback label="experience" />}>
            <Experience />
          </Suspense>
        </section>
        <section id="skills">
          <Suspense fallback={<SectionFallback label="skills" />}>
            <Skills />
          </Suspense>
        </section>
        <section id="projects">
          <Suspense fallback={<SectionFallback label="projects" />}>
            <Projects />
          </Suspense>
        </section>
        <section id="resources">
          <Suspense fallback={<SectionFallback label="resources" />}>
            <StudentResources />
          </Suspense>
        </section>
        <section id="success-stories">
          <Suspense fallback={<SectionFallback label="success stories" />}>
            <SuccessStories />
          </Suspense>
        </section>
        <section id="collaboration">
          <Suspense fallback={<SectionFallback label="collaboration" />}>
            <Collaboration />
          </Suspense>
        </section>
        <section id="contact">
          <Suspense fallback={<SectionFallback label="contact" />}>
            <Contact />
          </Suspense>
        </section>
      </main>
      <Suspense fallback={<SectionFallback label="footer" />}>
        <Footer />
      </Suspense>
    </div>

  )
}
