import { Role } from './role';
export interface User { id: string; email: string; username: string; avatarUrl: string | null; roles: Role[]; emailVerified: boolean; isBlocked: boolean; chatBlockedForever: boolean; chatRestrictedUntil: string | null; createdAt: string; }
export interface PublicUser { id: string; username: string; avatarUrl: string | null; }
