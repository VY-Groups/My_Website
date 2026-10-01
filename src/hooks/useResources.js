import { useState, useEffect } from 'react';
import { studentMaterials } from '../../api/data/materials';

/**
 * useResources - fetches resources from CMS-backed API, falls back to static data.
 *
 * @returns {{ materials: Array, source: string, loading: boolean, error: string|null }}
 */
export function useResources() {
  const [materials, setMaterials] = useState(studentMaterials);
  const [source, setSource] = useState('static');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch('/api/resources', {
          headers: { Accept: 'application/json' },
          signal: AbortSignal.timeout(6000),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled && Array.isArray(data.materials) && data.materials.length > 0) {
          setMaterials(data.materials);
          setSource(data.source || 'static');
        }
      } catch (err) {
        // Silent fallback to bundled static data (works offline too)
        if (!cancelled) {
          setError(err.message);
          setSource('static');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { materials, source, loading, error };
}