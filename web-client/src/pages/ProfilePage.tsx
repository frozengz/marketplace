import { useParams } from 'react-router-dom';
export default function ProfilePage(): JSX.Element { const { id } = useParams(); return <main><h1>Profile</h1><p>{id}</p></main>; }
