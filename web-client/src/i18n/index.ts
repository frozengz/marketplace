import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import ru from './locales/ru.json';
import fr from './locales/fr.json';
void i18next.use(initReactI18next).init({ resources: { en: { translation: en }, ru: { translation: ru }, fr: { translation: fr } }, lng: localStorage.getItem('lang') ?? 'en', fallbackLng: 'en', interpolation: { escapeValue: false } });
export { i18next };
