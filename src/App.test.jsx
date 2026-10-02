import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { owner } from './config/site'

describe('Portfolio Website - Complete Test Suite', () => {
  
  // Test 1: App Renders Successfully
  it('should render the App component without crashing', () => {
    const { container } = render(<App />)
    expect(container).toBeTruthy()
  })

  // Test 2: Navigation Component
  describe('Navigation', () => {
    it('should render navigation with all links', () => {
      render(<App />)
      expect(screen.getAllByText(/About/i).length).toBeGreaterThan(0)
      expect(screen.getAllByText(/Experience/i).length).toBeGreaterThan(0)
      expect(screen.getAllByText(/Projects/i).length).toBeGreaterThan(0)
      expect(screen.getAllByText(/Skills/i).length).toBeGreaterThan(0)
    })

    it('should have working navigation links', async () => {
      render(<App />)
      const links = screen.getAllByRole('link')
      expect(links.length).toBeGreaterThan(0)
    })
  })

  // Test 3: Hero Section
  describe('Hero Section', () => {
    it('should display hero content', () => {
      render(<App />)
      const nameElements = screen.getAllByText(owner.name)
      expect(nameElements.length).toBeGreaterThan(0)
    })

    it('should have CTA buttons', () => {
      render(<App />)
      const buttons = screen.getAllByRole('button')
      expect(buttons.length).toBeGreaterThan(0)
    })
  })

  // Test 4: Contact Section
  describe('Contact Section', () => {
    it('should display email address', async () => {
      render(<App />)
      expect(await screen.findByText(owner.email)).toBeInTheDocument()
    })

    it('should display location', async () => {
      render(<App />)
      const locations = await screen.findAllByText(owner.location)
      expect(locations.length).toBeGreaterThan(0)
    })

    it('should have mailto link for email', async () => {
      render(<App />)
      const emailLink = await screen.findByRole('link', { name: new RegExp(owner.email, 'i') })
      expect(emailLink).toHaveAttribute('href', `mailto:${owner.email}`)
    })

    it('should render contact form', async () => {
      render(<App />)
      expect(await screen.findByPlaceholderText(/Your Name/i)).toBeInTheDocument()
      expect(await screen.findByPlaceholderText(/Your Email/i)).toBeInTheDocument()
      expect(await screen.findByPlaceholderText(/Your Message/i)).toBeInTheDocument()
    })

    it('should allow typing in contact form fields', async () => {
      const user = userEvent.setup()
      render(<App />)
      
      const nameInput = await screen.findByPlaceholderText(/Your Name/i)
      const emailInput = await screen.findByPlaceholderText(/Your Email/i)
      const messageInput = await screen.findByPlaceholderText(/Your Message/i)

      await user.type(nameInput, 'John Doe')
      await user.type(emailInput, 'john@example.com')
      await user.type(messageInput, 'Hello World')

      expect(nameInput).toHaveValue('John Doe')
      expect(emailInput).toHaveValue('john@example.com')
      expect(messageInput).toHaveValue('Hello World')
    })
  })

  // Test 5: Experience Section
  describe('Experience Section', () => {
    it('should render experience section', () => {
      render(<App />)
      // Check for common experience-related text
      const experienceElements = screen.queryAllByText(/experience/i)
      expect(experienceElements.length).toBeGreaterThan(0)
    })
  })

  // Test 6: Projects Section
  describe('Projects Section', () => {
    it('should render projects section', () => {
      render(<App />)
      const projectElements = screen.queryAllByText(/project/i)
      expect(projectElements.length).toBeGreaterThan(0)
    })
  })

  // Test 7: Skills Section
  describe('Skills Section', () => {
    it('should render skills section', () => {
      render(<App />)
      const skillElements = screen.queryAllByText(/skill/i)
      expect(skillElements.length).toBeGreaterThan(0)
    })
  })

  // Test 8: Footer Section
  describe('Footer', () => {
    it('should render footer', async () => {
      render(<App />)
      const footer = await screen.findByRole('contentinfo')
      expect(footer).toBeTruthy()
    })
  })

  // Test 9: Collaboration Section
  describe('Collaboration Section', () => {
    it('should render collaboration content', () => {
      render(<App />)
      const collaborationElements = screen.queryAllByText(/collaborat/i)
      expect(collaborationElements.length).toBeGreaterThan(0)
    })
  })

  // Test 10: Student Resources Section
  describe('Student Resources', () => {
    it('should render student resources section', () => {
      render(<App />)
      const resourceElements = screen.queryAllByText(/resource/i)
      expect(resourceElements.length).toBeGreaterThan(0)
    })
  })

  // Test 11: Success Stories Section
  describe('Success Stories', () => {
    it('should render success stories section', () => {
      render(<App />)
      const storyElements = screen.queryAllByText(/stor/i)
      expect(storyElements.length).toBeGreaterThan(0)
    })
  })

  // Test 12: Tech Info Section
  describe('Tech Info Section', () => {
    it('should render tech info', async () => {
      render(<App />)
      const skillsHeading = await screen.findByRole('heading', { name: /Skills & Expertise/i })
      const skillsSection = skillsHeading.closest('section')
      const skillButtons = within(skillsSection).getAllByRole('button', { name: 'AWS' })
      await userEvent.click(skillButtons[0])
      expect(await screen.findByText(/What is AWS\?/i)).toBeInTheDocument()
    })
  })

  // Test 13: Responsive Design
  describe('Responsive Design', () => {
    it('should render responsive components', () => {
      const { container } = render(<App />)
      expect(container.querySelector('.app')).toBeTruthy()
    })
  })

  // Test 14: Accessibility
  describe('Accessibility', () => {
    it('should have all images with alt attributes or appropriate roles', () => {
      const { container } = render(<App />)
      const images = container.querySelectorAll('img')
      images.forEach(img => {
        expect(img.hasAttribute('alt') || img.hasAttribute('role')).toBeTruthy()
      })
    })

    it('should have semantic HTML structure', () => {
      const { container } = render(<App />)
      const nav = container.querySelector('nav')
      const main = container.querySelector('main') || container.querySelector('[role="main"]')
      
      expect(nav || container.querySelector('[role="navigation"]')).toBeTruthy()
      expect(main || container.querySelector('section')).toBeTruthy()
    })
  })

  // Test 15: Form Validation
  describe('Form Validation', () => {
    it('should have submit button in contact form', async () => {
      render(<App />)
      const submitButton = await screen.findByRole('button', { name: /send message/i })
      expect(submitButton).toBeTruthy()
    })
  })

  // Test 16: External Links
  describe('External Links', () => {
    it('should have social media or external links', () => {
      render(<App />)
      const links = screen.getAllByRole('link')
      expect(links.length).toBeGreaterThan(0)
    })
  })

  // Test 17: Icons Rendering
  describe('Icons', () => {
    it('should render icons from react-icons', () => {
      const { container } = render(<App />)
      const svgs = container.querySelectorAll('svg')
      expect(svgs.length).toBeGreaterThan(0)
    })
  })

  // Test 18: CSS Classes
  describe('CSS Classes', () => {
    it('should have proper CSS classes applied', () => {
      const { container } = render(<App />)
      const elementsWithClasses = container.querySelectorAll('[class]')
      expect(elementsWithClasses.length).toBeGreaterThan(0)
    })
  })

  // Test 19: No Console Errors
  describe('Error Handling', () => {
    it('should render without console errors', () => {
      const consoleError = vi.spyOn(console, 'error')
      render(<App />)
      expect(consoleError).not.toHaveBeenCalled()
      consoleError.mockRestore()
    })
  })

  // Test 20: Component Integration
  describe('Component Integration', () => {
    it('should render all major components together', () => {
      const { container } = render(<App />)
      const sections = container.querySelectorAll('section, div[class*="section"]')
      expect(sections.length).toBeGreaterThan(3) // Multiple sections should exist
    })
  })
})
