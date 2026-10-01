import { describe, it, expect, beforeAll } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { axe } from 'vitest-axe'
import { toHaveNoViolations } from 'vitest-axe/matchers'
import App from './App'

// vitest-axe's extend-expect is empty in v0.1.0 — register matcher manually
expect.extend({ toHaveNoViolations })

beforeAll(() => {
  // vitest-axe needs matchMedia (already mocked in setup, defensive here)
  window.matchMedia = window.matchMedia || (() => ({
    matches: false,
    media: '',
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
  }))
})

describe('Accessibility Audit (axe-core)', () => {
  it('initial page render should have no axe violations', async () => {
    const { container } = render(<App />)

    // Wait for lazy sections + navigation to settle
    await waitFor(() => {
      expect(screen.getAllByText(/Experience/i).length).toBeGreaterThan(0)
    }, { timeout: 5000 })

    const results = await axe(container, {
      rules: {
        // Color-contrast is unreliable under jsdom (no real rendering engine)
        'color-contrast': { enabled: false },
        // Landmark uniqueness: single-page app uses sections by design
        'region': { enabled: false },
      },
    })

    expect(results).toHaveNoViolations()
  }, 20000)

  it('navigation should expose correct ARIA structure', () => {
    render(<App />)

    // nav landmark with label
    const nav = screen.getByRole('navigation')
    expect(nav).toHaveAttribute('aria-label', 'Main navigation')

    // menu toggle has aria-expanded
    const menuToggle = screen.getByLabelText(/open menu/i)
    expect(menuToggle).toHaveAttribute('aria-expanded', 'false')

    // theme toggle has aria-pressed
    const themeToggle = screen.getByRole('button', { name: /switch to (light|dark) mode/i })
    expect(themeToggle).toHaveAttribute('aria-pressed')

    // skip link exists
    expect(screen.getByText(/skip to main content/i)).toBeInTheDocument()
  })

  it('all images should have alt text', () => {
    const { container } = render(<App />)
    const images = container.querySelectorAll('img')
    expect(images.length).toBeGreaterThan(0)
    images.forEach((img) => {
      expect(img.getAttribute('alt')).toBeTruthy()
    })
  })
})