import React from 'react';
import { Navigate } from 'react-router-dom';
import { Role } from '@/types/role';
import { useAuth } from '@/hooks/useAuth';
interface ProtectedRouteProps { requiredRoles: Role[]; children: React.ReactNode; }
export default function ProtectedRoute({ requiredRoles, children }: ProtectedRouteProps): JSX.Element { const { user, accessToken } = useAuth(); if (accessToken === null) { return <Navigate to="/login" replace />; } const allowed = requiredRoles.every((role) => user?.roles.includes(role) ?? false); if (!allowed) { return <main><h1>403</h1></main>; } return <>{children}</>; }
