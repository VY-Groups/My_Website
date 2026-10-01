import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

/**
 * Theme Context with:
 * - Dark/Light mode (with system preference detection)
 * - User-selectable accent colors
 * - localStorage persistence
 */

export const ACCENT_COLORS = [
  { id: 'blue', name: 'Ocean Blue', light: '#0071e3', dark: '#0071e3', glow: '#00d4ff' },
  { id: 'purple', name: 'Royal Purple', light: '#7c3aed', dark: '#8b5cf6', glow: '#a78bfa' },
  { id: 'emerald', name: 'Emerald', light: '#059669', dark: '#10b981', glow: '#34d399' },
  { id: 'rose', name: 'Rose', light: '#e11d48', dark: '#f43f5e', glow: '#fb7185' },
  { id: 'amber', name: 'Amber', light: '#d97706', dark: '#f59e0b', glow: '#fbbf24' },
  { id: 'cyan', name: 'Cyan', light: '#0891b2', dark: '#06b6d4', glow: '#22d3ee' },
  { id: 'pink', name: 'Pink', light: '#db2777', dark: '#ec4899', glow: '#f472b6' },
  { id: 'teal', name: 'Teal', light: '#0d9488', dark: '#14b8a6', glow: '#2dd4bf' },
];

const ThemeContext = createContext({
  isDark: true,
  accent: 'blue',
  setIsDark: () => {},
  setAccent: () => {},
});

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true);
  const [accent, setAccentState] = useState('blue');

  // Initialize from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const savedAccent = localStorage.getItem('accent');

    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    } else {
      // No saved preference → detect system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(prefersDark);
    }

    if (savedAccent && ACCENT_COLORS.some(c => c.id === savedAccent)) {
      setAccentState(savedAccent);
    }
  }, []);

  // Apply theme class and persist
  useEffect(() => {
    document.documentElement.classList.toggle('dark-mode', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // Apply accent CSS variables
  const applyAccent = useCallback((accentId) => {
    const color = ACCENT_COLORS.find(c => c.id === accentId) || ACCENT_COLORS[0];
    const root = document.documentElement;
    root.style.setProperty('--accent', color.light);
    root.style.setProperty('--accent-hover', color.light);
    root.style.setProperty('--accent-2', color.glow);
    // Keep accent-3 (pink) unchanged for gradient variety
    localStorage.setItem('accent', accentId);
  }, []);

  useEffect(() => {
    applyAccent(accent);
  }, [accent, applyAccent]);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      // Only auto-switch if user hasn't manually chosen
      if (!localStorage.getItem('theme')) {
        setIsDark(e.matches);
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const setAccent = useCallback((accentId) => {
    setAccentState(accentId);
  }, []);

  return (
    <ThemeContext.Provider value={{ isDark, accent, setIsDark, setAccent }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}