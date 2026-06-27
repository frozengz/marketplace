import { Role } from '../../types/role';
export default function RoleBadge({ role }: { role: Role }): JSX.Element { return <span>{role}</span>; }
