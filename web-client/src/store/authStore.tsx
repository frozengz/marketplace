import React, { createContext, useMemo, useReducer } from 'react';
import { User } from '../types/user';
import { setAccessToken } from '../api/client';
interface AuthState { user: User | null; accessToken: string | null; isLoading: boolean; }
type AuthAction = { type: 'login'; user: User | null; accessToken: string } | { type: 'logout' } | { type: 'setUser'; user: User | null } | { type: 'loading'; isLoading: boolean };
interface AuthContextValue extends AuthState { login: (user: User | null, accessToken: string) => void; logout: () => void; setUser: (user: User | null) => void; refreshToken: () => Promise<void>; }
const initialState: AuthState = { user: null, accessToken: localStorage.getItem('accessToken'), isLoading: false };
function reducer(state: AuthState, action: AuthAction): AuthState { if (action.type === 'login') { setAccessToken(action.accessToken); return { user: action.user, accessToken: action.accessToken, isLoading: false }; } if (action.type === 'logout') { setAccessToken(null); return { user: null, accessToken: null, isLoading: false }; } if (action.type === 'setUser') { return { ...state, user: action.user }; } return { ...state, isLoading: action.isLoading }; }
export const AuthContext = createContext<AuthContextValue | null>(null);
export function AuthProvider({ children }: { children: React.ReactNode }): JSX.Element { const [state, dispatch] = useReducer(reducer, initialState); const value = useMemo<AuthContextValue>(() => ({ ...state, login: (user, accessToken) => dispatch({ type: 'login', user, accessToken }), logout: () => dispatch({ type: 'logout' }), setUser: (user) => dispatch({ type: 'setUser', user }), refreshToken: async () => { dispatch({ type: 'loading', isLoading: true }); dispatch({ type: 'loading', isLoading: false }); } }), [state]); return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>; }
