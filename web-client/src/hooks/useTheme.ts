import { useEffect, useState } from 'react';
import { getTheme, setTheme, Theme } from '../store/themeStore';
export function useTheme(): { theme: Theme; toggleTheme: () => void } { const [theme, updateTheme] = useState<Theme>(getTheme()); useEffect(() => { setTheme(theme); }, [theme]); return { theme, toggleTheme: () => updateTheme(theme === 'light' ? 'dark' : 'light') }; }
