import { useEffect, useState } from 'react';

/**
 * Tracks a CSS media query so components can swap in touch-sized affordances.
 * Seeded synchronously from `matchMedia` to avoid a first-paint mismatch.
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const sync = () => setMatches(mql.matches);
    sync();
    mql.addEventListener('change', sync);
    return () => mql.removeEventListener('change', sync);
  }, [query]);

  return matches;
}

/** True on touch-first devices, where hover states never fire. */
export function useCoarsePointer() {
  return useMediaQuery('(hover: none) and (pointer: coarse)');
}