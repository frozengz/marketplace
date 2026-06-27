import { Outlet } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import './styles.css';
export default function App(): JSX.Element { return <><Header /><Outlet /><Footer /></>; }
