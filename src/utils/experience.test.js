import { describe, it, expect } from 'vitest'
import { getExperience, EXPERIENCE_START } from './experience'

const date = (y, m) => new Date(y, m - 1, 15) // day irrelevant: month granularity

describe('getExperience', () => {
  it('uses October 2023 as the anchor', () => {
    expect(EXPERIENCE_START).toEqual({ year: 2023, month: 10 })
  })

  it('shows exactly 3.0 in October 2026', () => {
    expect(getExperience(date(2026, 10))).toEqual({ years: 3, months: 0, label: '3.0' })
  })

  it('ticks to 3.1 in November 2026 and 3.2 in December 2026', () => {
    expect(getExperience(date(2026, 11)).label).toBe('3.1')
    expect(getExperience(date(2026, 12)).label).toBe('3.2')
  })

  it('handles mid-year values', () => {
    expect(getExperience(date(2026, 4)).label).toBe('2.6') // 2y 6m
  })

  it('rolls 11 months correctly (3.11 = 3 years 11 months)', () => {
    const exp = getExperience(date(2027, 9))
    expect(exp).toEqual({ years: 3, months: 11, label: '3.11' })
  })

  it('rolls over to 4.0 in October 2027', () => {
    expect(getExperience(date(2027, 10)).label).toBe('4.0')
  })

  it('never returns a negative value before the anchor', () => {
    const exp = getExperience(date(2023, 6))
    expect(exp.years).toBeGreaterThanOrEqual(0)
    expect(exp.months).toBeLessThan(12)
  })
})
