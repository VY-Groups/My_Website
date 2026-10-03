import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import {
  FiHome,
  FiTrendingUp,
  FiStar,
  FiAward,
  FiBox,
  FiRss,
  FiBookOpen,
  FiUsers,
  FiHeart,
  FiMail,
  FiMoon,
  FiSun,
  FiCopy,
  FiFileText,
  FiGithub,
  FiLinkedin,
} from 'react-icons/fi'
import { owner, socials } from '../config/site'
import { useTheme } from '../context/ThemeContext'
import './CommandPalette.css'

// Open-event so any component (e.g. the nav trigger) can request the palette
// without prop drilling: window.dispatchEvent(new CustomEvent('cmd-palette:open'))
export const OPEN_COMMAND = 'cmd-palette:open'

const SECTION_ITEMS = [
  { id: 'hero', label: 'About', kw: 'home intro profile', icon: FiHome },
  { id: 'experience', label: 'Experience', kw: 'work jobs timeline vy-groups', icon: FiTrendingUp },
  { id: 'skills', label: 'Skills', kw: 'tech stack aws kubernetes docker terraform', icon: FiStar },
  { id: 'certifications', label: 'Certifications', kw: 'certificates aws redhat udemy', icon: FiAward },
  { id: 'projects', label: 'Projects', kw: 'portfolio work patchmaster hrms', icon: FiBox },
  { id: 'blog', label: 'Blog', kw: 'articles posts writing', icon: FiRss },
  { id: 'resources', label: 'Student Resources', kw: 'materials downloads learning', icon: FiBookOpen },
  { id: 'success-stories', label: 'Success Stories', kw: 'patchops coming soon', icon: FiUsers },
  { id: 'collaboration', label: 'Collaborate', kw: 'hire freelance consulting partnership', icon: FiHeart },
  { id: 'contact', label: 'Contact', kw: 'email message reach get in touch', icon: FiMail },
]

export default function CommandPalette() {
  const { isDark, setIsDark } = useTheme()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const [flashMsg, setFlashMsg] = useState(null)
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const restoreRef = useRef(null)

  const close = useCallback(() => {
    setOpen(false)
    const el = restoreRef.current
    if (el && typeof el.focus === 'function') el.focus()
    restoreRef.current = null
  }, [])

  const flash = useCallback(
    (msg) => {
      setFlashMsg(msg)
      window.setTimeout(() => {
        setFlashMsg(null)
        close()
      }, 1100)
    },
    [close]
  )

  const openPalette = useCallback(() => {
    restoreRef.current = document.activeElement
    setQuery('')
    setActive(0)
    setFlashMsg(null)
    setOpen(true)
  }, [])

  const jumpTo = useCallback(
    (id) => {
      close()
      window.location.hash = id
      window.setTimeout(() => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    },
    [close]
  )

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(owner.email)
      flash(`✓ ${owner.email} copied to clipboard`)
    } catch {
      flash(owner.email)
    }
  }, [flash])

  const downloadResume = useCallback(() => {
    close()
    const link = document.createElement('a')
    link.href = owner.resume
    link.download = ''
    link.click()
  }, [close])

  const openExternal = useCallback(
    (url) => {
      close()
      window.open(url, '_blank', 'noopener,noreferrer')
    },
    [close]
  )

  const commands = useMemo(
    () => [
      ...SECTION_ITEMS.map((s) => ({
        id: 'nav-' + s.id,
        group: 'Navigate',
        hint: 'Section',
        icon: s.icon,
        label: s.label,
        kw: s.kw,
        run: () => jumpTo(s.id),
      })),
      {
        id: 'theme',
        group: 'Actions',
        hint: 'Theme',
        icon: isDark ? FiMoon : FiSun,
        label: isDark ? 'Switch to light mode' : 'Switch to dark mode',
        kw: 'dark light appearance color',
        run: () => {
          setIsDark(!isDark)
          close()
        },
      },
      {
        id: 'copy-email',
        group: 'Actions',
        hint: 'Copy',
        icon: FiCopy,
        label: `Copy email address (${owner.email})`,
        kw: 'mail clipboard copy address',
        run: copyEmail,
      },
      {
        id: 'resume',
        group: 'Actions',
        hint: 'PDF',
        icon: FiFileText,
        label: 'Download résumé',
        kw: 'cv resume pdf download',
        run: downloadResume,
      },
      {
        id: 'github',
        group: 'Links',
        hint: 'External',
        icon: FiGithub,
        label: 'Open GitHub profile',
        kw: 'github git code repository',
        run: () => openExternal(socials.github),
      },
      {
        id: 'linkedin',
        group: 'Links',
        hint: 'External',
        icon: FiLinkedin,
        label: 'Open LinkedIn profile',
        kw: 'linkedin network jobs',
        run: () => openExternal(socials.linkedin),
      },
      {
        id: 'email',
        group: 'Links',
        hint: 'External',
        icon: FiMail,
        label: 'Send an email',
        kw: 'mail message contact compose',
        run: () => {
          close()
          window.location.href = `mailto:${owner.email}`
        },
      },
    ],
    [isDark, setIsDark, close, jumpTo, copyEmail, downloadResume, openExternal]
  )

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    return commands.filter((c) =>
      `${c.label} ${c.kw || ''} ${c.group} ${c.hint || ''}`.toLowerCase().includes(q)
    )
  }, [query, commands])

  // Reset selection whenever the result set changes
  useEffect(() => {
    setActive(0)
  }, [query])

  // Global hotkey + open event
  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        if (open) {
          close()
        } else {
          openPalette()
        }
      }
    }
    const onOpen = () => openPalette()
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener(OPEN_COMMAND, onOpen)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener(OPEN_COMMAND, onOpen)
    }
  }, [open, close, openPalette])

  // Escape anywhere while open
  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, close])

  // Focus the input on open
  useEffect(() => {
    if (open) {
      const raf = requestAnimationFrame(() => inputRef.current?.focus())
      return () => cancelAnimationFrame(raf)
    }
    return undefined
  }, [open])

  // Lock page scroll while open (scroll container is <main>)
  useEffect(() => {
    if (!open) return undefined
    const main = document.getElementById('main-content')
    const prevBody = document.body.style.overflow
    const prevMain = main ? main.style.overflow : ''
    document.body.style.overflow = 'hidden'
    if (main) main.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevBody
      if (main) main.style.overflow = prevMain
    }
  }, [open])

  // Keep the active option in view
  useEffect(() => {
    if (!open) return
    const el = listRef.current?.querySelector('[data-active="true"]')
    if (el && typeof el.scrollIntoView === 'function') el.scrollIntoView({ block: 'nearest' })
  }, [active, results.length, open])

  const onInputKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      results[active]?.run()
    }
    // Escape is handled globally so it works from anywhere in the dialog
  }

  if (!open) return null

  const activeResult = results[active]

  return (
    <div
      className="cmd-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close()
      }}
    >
      <div
        className="cmd-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="cmd-input-row">
          <span className="cmd-prompt" aria-hidden="true">
            $
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder="Type a command or search…"
            aria-label="Type a command or search"
            role="combobox"
            aria-expanded="true"
            aria-controls="cmd-list"
            aria-autocomplete="list"
            aria-activedescendant={activeResult ? 'cmd-' + activeResult.id : undefined}
            spellCheck="false"
            autoComplete="off"
          />
          <kbd className="cmd-chip">esc</kbd>
        </div>

        <ul className="cmd-list" id="cmd-list" role="listbox" aria-label="Commands" ref={listRef}>
          {flashMsg ? (
            <li className="cmd-flash" role="option" aria-selected="true">
              {flashMsg}
            </li>
          ) : results.length === 0 ? (
            <li className="cmd-empty" role="presentation">
              No matching commands — try “theme”, “blog”, or “copy”
            </li>
          ) : (
            results.map((c, i) => (
              <li
                key={c.id}
                id={'cmd-' + c.id}
                data-active={i === active}
                className={`cmd-item${i === active ? ' active' : ''}`}
                role="option"
                aria-selected={i === active}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => {
                  e.preventDefault()
                  c.run()
                }}
              >
                <span className="cmd-item-icon" aria-hidden="true">
                  <c.icon size={16} />
                </span>
                <span className="cmd-item-label">{c.label}</span>
                <span className="cmd-item-hint">{c.hint}</span>
              </li>
            ))
          )}
        </ul>

        <div className="cmd-footer" aria-hidden="true">
          <span>
            <kbd className="cmd-chip">↑↓</kbd> navigate
          </span>
          <span>
            <kbd className="cmd-chip">↵</kbd> run
          </span>
          <span>
            <kbd className="cmd-chip">esc</kbd> close
          </span>
        </div>
      </div>
    </div>
  )
}
