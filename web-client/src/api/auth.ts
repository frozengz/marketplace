import { request } from './client';
import { User } from '@/types/user';
export interface LoginBody { email: string; password: string; }
export interface RegisterBody { email: string; password: string; username: string; terms_accepted: boolean; }
export interface TokenResponse { access_token: string; refresh_token: string; user?: User; }
export function login(body: LoginBody): Promise<import('@/types/api').ApiResponse<TokenResponse>> { return request<TokenResponse>('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }); }
export function register(body: RegisterBody): Promise<import('@/types/api').ApiResponse<{ message: string }>> { return request<{ message: string }>('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }); }
export function verifyEmail(token: string): Promise<import('@/types/api').ApiResponse<{ message: string }>> { return request<{ message: string }>(`/api/auth/verify-email?token=${encodeURIComponent(token)}`); }
