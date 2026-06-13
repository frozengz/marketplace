import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { login as loginRequest } from '@/api/auth';
import { useAuth } from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
export default function LoginPage(): JSX.Element { const auth = useAuth(); const navigate = useNavigate(); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [message, setMessage] = useState(''); if (auth.accessToken !== null) { return <Navigate to="/" replace />; } async function submit(event: React.FormEvent): Promise<void> { event.preventDefault(); const response = await loginRequest({ email, password }); if (response.data !== null) { auth.login(response.data.user ?? null, response.data.access_token); navigate('/'); } else { setMessage(response.error?.code === 'EMAIL_NOT_VERIFIED' ? 'Please verify your email before logging in.' : response.error?.message ?? 'Login failed'); } } return <main><form onSubmit={submit}><Input label="Email" value={email} onChange={(event) => setEmail(event.target.value)} /><Input label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} /><Button type="submit">Login</Button></form><p>{message}</p></main>; }
