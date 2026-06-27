export type Theme = 'light' | 'dark';
const THEME_KEY = 'theme';
export function getTheme(): Theme { return localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light'; }
export function setTheme(theme: Theme): void { localStorage.setItem(THEME_KEY, theme); document.documentElement.dataset.theme = theme; }
