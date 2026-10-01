/**
 * Total professional experience — auto-updating calculator.
 *
 * Anchor: October 2023. The value is computed from the visitor's clock at
 * render time, so it advances every month with zero code changes or deploys.
 *
 * Display follows the X.Y convention where X = full years and Y = months
 * (3.1 = 3 years 1 month), matching how IT experience is usually written.
 * Note: Y runs 0–11, so "3.11" means 3 years 11 months (then 4.0).
 */
export const EXPERIENCE_START = { year: 2023, month: 10 }; // October 2023

export function getExperience(now = new Date()) {
  let years = now.getFullYear() - EXPERIENCE_START.year;
  let months = now.getMonth() - (EXPERIENCE_START.month - 1);

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  if (years < 0) return { years: 0, months: 0, label: '0.0' };

  return {
    years,
    months,
    label: `${years}.${months}`, // "3.0", "3.1", ... "3.11"
  };
}
