import { request } from './client';
import { ApiResponse } from '../types/api';
import { Role } from '../types/role';
export function getRoles(id: string): Promise<ApiResponse<Role[]>> { return request<Role[]>(`/api/users/${id}/roles`); }
