import { afterEach, beforeAll, vi } from 'vitest'
import { cleanup, configure } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

// Give async queries more time (lazy sections + fetch settle)
configure({ asyncUtilTimeout: 3000 })

// Mock IntersectionObserver for tests
beforeAll(() => {
  global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    disconnect() {}
    observe() {}
    takeRecords() {
      return []
    }
    unobserve() {}
  }

  // Mock matchMedia (used by ThemeContext + ParticleBackground for system preference)
  if (!window.matchMedia) {
    window.matchMedia = (query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })
  }

  // Mock scrollTo for jsdom
  if (!window.scrollTo) {
    window.scrollTo = () => {}
  }

  // jsdom has no canvas implementation — return null quietly
  if (typeof HTMLCanvasElement !== 'undefined') {
    HTMLCanvasElement.prototype.getContext = () => null
  }

  // Mock fetch: resolve with static resources (deterministic, no network in tests)
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          source: 'static',
          materials: [
            {
              id: 1,
              title: 'Linux Essentials',
              category: 'Linux',
              description: 'Complete guide to Linux fundamentals.',
              fileSize: 'PDF',
              fileType: 'PDF',
              downloadLink: '/downloads/resources/linux-essentials.pdf',
            },
          ],
        }),
    })
  )
})

// Cleanup after each test
afterEach(() => {
  cleanup()
})