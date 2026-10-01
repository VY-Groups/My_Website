import React, { useState, useEffect, Suspense, lazy } from 'react'
import { ThemeProvider, useTheme } from './context/ThemeContext'
import { useSEO } from './components/SEO'
import './App.css'
import './components/ScrollReveal.css'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import ThemeCustomizer from './components/ThemeCustomizer'
import ScrollProgress from './components/ScrollProgress'
import InstallPrompt from './components/InstallPrompt'
import BackToTop from './components/BackToTop'
const Experience = lazy(() => import('./components/Experience'))
const Skills = lazy(() => import('./components/Skills'))
const Projects = lazy(() => import('./components/Projects'))
const StudentResources = lazy(() => import('./components/StudentResources'))
const SuccessStories = lazy(() => import('./components/SuccessStories'))
const Collaboration = lazy(() => import('./components/Collaboration'))
const Contact = lazy(() => import('./components/Contact'))
const Blog = lazy(() => import('./components/Blog'))
const Footer = lazy(() => import('./components/Footer'))

const SectionFallback = ({ label }) => (
  <div className="section-loading" role="status" aria-live="polite">
    Loading {label}…
  </div>
)

function AppInner() {
  const { isDark, setIsDark } = useTheme()
  const [activeSection, setActiveSection] = useState('hero')

  // SEO: Update meta tags based on active section
  useSEO(activeSection)

  // Set active section based on scroll using IntersectionObserver
  useEffect(() => {
    const sections = ['hero', 'experience', 'skills', 'projects', 'blog', 'resources', 'success-stories', 'collaboration', 'contact']
    
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
      // Ignore skip-link target (not a nav section)
      if (hash !== 'main-content') {
        setActiveSection(hash)
      }

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
    if (hash !== 'main-content') {
      setActiveSection(hash)
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  return (
    <div className={`app ${isDark ? 'dark' : 'light'}`}>
      <ScrollProgress />
      <a href="#main-content" className="skip-to-content">Skip to main content</a>
      <Navigation isDark={isDark} setIsDark={setIsDark} activeSection={activeSection} />
      <main id="main-content" className="full-scroll-view" tabIndex={-1} aria-label="Main content">
        <section id="hero" aria-label="About"><Hero /></section>
        <section id="experience" aria-label="Experience">
          <Suspense fallback={<SectionFallback label="experience" />}>
            <Experience />
          </Suspense>
        </section>
        <section id="skills" aria-label="Skills">
          <Suspense fallback={<SectionFallback label="skills" />}>
            <Skills />
          </Suspense>
        </section>
        <section id="projects" aria-label="Projects">
          <Suspense fallback={<SectionFallback label="projects" />}>
            <Projects />
          </Suspense>
        </section>
        <section id="blog" aria-label="Blog">
          <Suspense fallback={<SectionFallback label="blog" />}>
            <Blog />
          </Suspense>
        </section>
        <section id="resources" aria-label="Student Resources">
          <Suspense fallback={<SectionFallback label="resources" />}>
            <StudentResources />
          </Suspense>
        </section>
        <section id="success-stories" aria-label="Success Stories">
          <Suspense fallback={<SectionFallback label="success stories" />}>
            <SuccessStories />
          </Suspense>
        </section>
        <section id="collaboration" aria-label="Collaboration">
          <Suspense fallback={<SectionFallback label="collaboration" />}>
            <Collaboration />
          </Suspense>
        </section>
        <section id="contact" aria-label="Contact">
          <Suspense fallback={<SectionFallback label="contact" />}>
            <Contact />
          </Suspense>
        </section>
      </main>
      <Suspense fallback={<SectionFallback label="footer" />}>
        <Footer />
      </Suspense>
      <ThemeCustomizer />
      <BackToTop />
      <InstallPrompt />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  )
}
