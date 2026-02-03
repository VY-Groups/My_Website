import React, { useState, useEffect } from 'react'
import './App.css'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import Experience from './components/Experience'
import Skills from './components/Skills'
import Projects from './components/Projects'
import StudentResources from './components/StudentResources'
import SuccessStories from './components/SuccessStories'
import Collaboration from './components/Collaboration'
import Contact from './components/Contact'
import Footer from './components/Footer'

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
        <section id="experience"><Experience /></section>
        <section id="skills"><Skills /></section>
        <section id="projects"><Projects /></section>
        <section id="resources"><StudentResources /></section>
        <section id="success-stories"><SuccessStories /></section>
        <section id="collaboration"><Collaboration /></section>
        <section id="contact"><Contact /></section>
      </main>
      <Footer />
    </div>

  )
}
