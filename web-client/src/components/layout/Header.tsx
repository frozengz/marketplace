import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { useLang } from '@/hooks/useLang';
import { useTheme } from '@/hooks/useTheme';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
export default function Header(): JSX.Element { const { t } = useTranslation(); const auth = useAuth(); const { lang, setLang } = useLang(); const { theme, toggleTheme } = useTheme(); const roles = auth.user?.roles ?? []; return <header><Link to="/">{t('title')}</Link><nav>{roles.includes('seller') && <Link to="/seller/dashboard">Seller</Link>}{roles.includes('administrator') && <Link to="/admin/dashboard">Admin</Link>}{roles.includes('support_agent') && <Link to="/support/dashboard">Support</Link>}</nav><Select value={lang} onChange={(event) => setLang(event.target.value)} options={[{ value: 'en', label: 'EN' }, { value: 'ru', label: 'RU' }, { value: 'fr', label: 'FR' }]} /><Button type="button" onClick={toggleTheme}>{theme === 'light' ? '☀' : '☾'}</Button>{auth.accessToken !== null ? <><span>{auth.user?.username ?? ''}</span><Button type="button" onClick={auth.logout}>{t('logout')}</Button></> : <><Link to="/login">{t('login')}</Link><Link to="/register">{t('register')}</Link></>}</header>; }
