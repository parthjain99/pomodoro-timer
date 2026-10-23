import { useEffect, useState } from 'react';

// Built-in themes, used until the website's theme list loads (and if it never does).
export const FALLBACK_THEMES = [
  { id: 'default', name: 'Default', logo: '', colors: { bg: '#f5f5f5', card: '#ffffff', text: '#111111', muted: '#6b6b70', line: '#e5e5e5', accent: '#ff6b81', accentInk: '#111111', violet: '#4f3bd6' } },
  { id: 'halloween', name: 'Halloween', logo: '/logos/halloween.png', colors: { bg: '#120b1a', card: '#22142f', text: '#f3e8ff', muted: '#b9a7cc', line: '#3a2a4f', accent: '#ff7518', accentInk: '#120b1a', violet: '#ff7518' } },
];

// Loads the themes list from /api/themes (website only). Keeps the fallback list on any error.
export function useThemes(enabled) {
  const [themes, setThemes] = useState(FALLBACK_THEMES);
  useEffect(() => {
    if (!enabled) return undefined;
    let cancelled = false;
    fetch('/api/themes')
      .then((r) => (r.ok ? r.json() : null))
      .then((list) => {
        if (!cancelled && Array.isArray(list) && list.length > 0) setThemes(list);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [enabled]);
  return themes;
}

// Turns a theme's colors into the CSS variables the stylesheet already uses.
export function themeStyle(theme) {
  const c = theme.colors;
  return {
    '--bg': c.bg,
    '--card': c.card,
    '--text': c.text,
    '--muted': c.muted,
    '--line': c.line,
    '--accent': c.accent,
    '--accent-ink': c.accentInk,
    '--violet': c.violet,
  };
}
