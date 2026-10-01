import React, { useRef, useEffect } from 'react';
import './ParticleBackground.css';

/**
 * Canvas particle network background.
 * - Respects prefers-reduced-motion (renders static dots only / disables animation)
 * - Auto-pauses when tab is hidden
 * - Low particle count on mobile
 */
export default function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let width = 0;
    let height = 0;
    let particles = [];
    let rafId = null;
    let running = true;

    const PARTICLE_COUNT = isMobile ? 24 : 55;
    const LINK_DISTANCE = isMobile ? 90 : 130;
    const SPEED = 0.25;

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function createParticles() {
      particles = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * SPEED,
        vy: (Math.random() - 0.5) * SPEED,
        r: Math.random() * 1.8 + 0.6,
      }));
    }

    function getAccent() {
      const style = getComputedStyle(document.documentElement);
      return style.getPropertyValue('--accent').trim() || '#0071e3';
    }

    let accent = getAccent();

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // Links between close particles
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK_DISTANCE) {
            const alpha = (1 - dist / LINK_DISTANCE) * 0.22;
            ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Particles
      for (const p of particles) {
        ctx.fillStyle = accent;
        ctx.globalAlpha = 0.55;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    function update() {
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      }
    }

    function loop() {
      if (!running) return;
      update();
      draw();
      rafId = requestAnimationFrame(loop);
    }

    function handleVisibility() {
      if (document.hidden) {
        running = false;
        if (rafId) cancelAnimationFrame(rafId);
      } else if (!reducedMotion) {
        running = true;
        loop();
      }
    }

    function handleAccentChange() {
      accent = getAccent();
    }

    resize();
    createParticles();

    if (reducedMotion) {
      draw(); // single static frame
    } else {
      loop();
    }

    const resizeObserver = new ResizeObserver(() => {
      resize();
      createParticles();
      if (reducedMotion) draw();
    });
    resizeObserver.observe(canvas.parentElement);

    document.addEventListener('visibilitychange', handleVisibility);
    const accentObserver = new MutationObserver(handleAccentChange);
    accentObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });

    return () => {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      accentObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-background" aria-hidden="true" />;
}