import { request } from './client';
import { ApiResponse } from '../types/api';
import { PublicUser } from '../types/user';
export function getUser(id: string): Promise<ApiResponse<PublicUser>> { return request<PublicUser>(`/api/users/${id}`); }
