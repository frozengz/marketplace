import { useTranslation } from 'react-i18next';
export function useLang(): { lang: string; setLang: (lang: string) => void } { const { i18n } = useTranslation(); return { lang: i18n.language, setLang: (lang) => { localStorage.setItem('lang', lang); void i18n.changeLanguage(lang); } }; }
