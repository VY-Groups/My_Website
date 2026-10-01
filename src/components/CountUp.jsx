import React, { useEffect, useRef, useState } from 'react'

/**
 * Animates a numeric stat from 0 to its target the first time it scrolls
 * into view. Understands the stat formats used across the site:
 *   "3.0" -> 3.0   "99.99%" -> 99.99%   "10+" -> 10+   "0.8s" -> 0.8s
 * Anything non-numeric (e.g. "v2.0.17") renders unchanged.
 * Respects prefers-reduced-motion (jumps straight to the final value).
 */
function parseStat(str) {
  const m = /^(\d+(?:\.\d+)?)(.*)$/.exec(String(str).trim())
  if (!m) return null
  const decimals = (m[1].split('.')[1] || '').length
  return { value: parseFloat(m[1]), decimals, suffix: m[2] }
}

const reducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const format = ({ value, decimals, suffix }) => `${value.toFixed(decimals)}${suffix}`

export default function CountUp({ value, duration = 1100, className }) {
  const parsed = parseStat(value)
  const ref = useRef(null)
  const [display, setDisplay] = useState('0')

  useEffect(() => {
    const parsedInside = parseStat(value)
    const el = ref.current
    if (!parsedInside || !el) return undefined

    if (reducedMotion()) {
      setDisplay(format(parsedInside))
      return undefined
    }

    let rafId = null
    let startTime = null

    const step = (t) => {
      if (startTime === null) startTime = t
      const progress = Math.min(1, (t - startTime) / duration)
      const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic
      setDisplay(format({ ...parsedInside, value: parsedInside.value * eased }))
      if (progress < 1) rafId = requestAnimationFrame(step)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            observer.disconnect()
            rafId = requestAnimationFrame(step)
          }
        })
      },
      { threshold: 0.4 }
    )
    observer.observe(el)

    return () => {
      observer.disconnect()
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [value, duration])

  if (!parsed) return <span className={className}>{value}</span>
  return (
    <span className={className} ref={ref}>
      {display}
    </span>
  )
}
