import { useContext } from 'react';
import { AuthContext } from '../store/authStore';
export function useAuth() { const context = useContext(AuthContext); if (context === null) { throw new Error('AuthProvider is missing'); } return context; }
