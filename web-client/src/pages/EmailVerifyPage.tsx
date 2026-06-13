import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { verifyEmail } from '@/api/auth';
export default function EmailVerifyPage(): JSX.Element { const [params] = useSearchParams(); const [message, setMessage] = useState('Verifying'); useEffect(() => { const token = params.get('token'); if (token === null) { setMessage('Missing token'); return; } void verifyEmail(token).then((response) => setMessage(response.data?.message ?? response.error?.message ?? 'Verification failed')); }, [params]); return <main><h1>{message}</h1><Link to="/login">Login</Link></main>; }
