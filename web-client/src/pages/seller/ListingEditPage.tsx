import { useParams } from 'react-router-dom';
import ListingForm from '../../components/listings/ListingForm';
export default function ListingEditPage(): JSX.Element { const { id } = useParams(); return <main><h1>Edit listing {id}</h1><ListingForm onSubmit={async () => Promise.resolve()} /></main>; }
