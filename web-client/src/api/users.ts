import { request } from './client';
import { PublicUser } from '@/types/user';
export function getUser(id: string): Promise<import('@/types/api').ApiResponse<PublicUser>> { return request<PublicUser>(`/api/users/${id}`); }
