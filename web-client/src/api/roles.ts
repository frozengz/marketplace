import { request } from './client';
import { Role } from '@/types/role';
export function getRoles(id: string): Promise<import('@/types/api').ApiResponse<Role[]>> { return request<Role[]>(`/api/users/${id}/roles`); }
