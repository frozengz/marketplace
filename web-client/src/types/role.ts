export const ROLES = ['user', 'seller', 'support_agent', 'administrator', 'manager'] as const;
export type Role = typeof ROLES[number];
