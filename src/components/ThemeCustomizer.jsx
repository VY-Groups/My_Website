import React, { useState, useRef, useEffect } from 'react';
import { FiDroplet, FiX } from 'react-icons/fi';
import { useTheme, ACCENT_COLORS } from '../context/ThemeContext';
import './ThemeCustomizer.css';

export default function ThemeCustomizer() {
  const { accent, setAccent, isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen]);

  return (
    <div className="theme-customizer" ref={panelRef}>
      <button
        className="customizer-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Customize theme colors"
        aria-expanded={isOpen}
        title="Customize colors"
      >
        {isOpen ? <FiX size={18} /> : <FiDroplet size={18} />}
      </button>

      {isOpen && (
        <div className="customizer-panel" role="dialog" aria-label="Theme color picker">
          <h4 className="customizer-title">Accent Color</h4>
          <div className="color-grid">
            {ACCENT_COLORS.map((color) => (
              <button
                key={color.id}
                className={`color-swatch ${accent === color.id ? 'active' : ''}`}
                style={{
                  background: `linear-gradient(135deg, ${color.light}, ${color.glow})`,
                }}
                onClick={() => setAccent(color.id)}
                aria-label={`Set accent color to ${color.name}`}
                aria-pressed={accent === color.id}
                title={color.name}
              >
                {accent === color.id && <span className="swatch-check">✓</span>}
              </button>
            ))}
          </div>
          <p className="customizer-hint">
            Colors are saved to your browser and applied site-wide.
          </p>
        </div>
      )}
    </div>
  );
}