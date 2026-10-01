import React, { useState, useEffect } from 'react';
import './ScrollProgress.css';

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let rafId = null;

    const getScrollData = () => {
      // Support both window scrolling and internal main-container scrolling
      const main = document.querySelector('.full-scroll-view');
      const isMainScrollable = main && main.scrollHeight > main.clientHeight;

      const scrollTop = isMainScrollable ? main.scrollTop : (window.scrollY || document.documentElement.scrollTop);
      const scrollHeight = isMainScrollable ? main.scrollHeight : document.documentElement.scrollHeight;
      const viewportHeight = isMainScrollable ? main.clientHeight : window.innerHeight;
      const docHeight = scrollHeight - viewportHeight;

      return { scrollTop, docHeight };
    };

    const update = () => {
      if (rafId) return; // throttle to one update per frame
      rafId = requestAnimationFrame(() => {
        const { scrollTop, docHeight } = getScrollData();
        const percent = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
        setProgress(percent);
        rafId = null;
      });
    };

    const main = document.querySelector('.full-scroll-view');
    window.addEventListener('scroll', update, { passive: true });
    main?.addEventListener('scroll', update, { passive: true });
    update(); // initial

    return () => {
      window.removeEventListener('scroll', update);
      main?.removeEventListener('scroll', update);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      className="scroll-progress"
      role="progressbar"
      aria-label="Reading progress"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-hidden={progress === 0}
    >
      <div
        className="scroll-progress-bar"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}