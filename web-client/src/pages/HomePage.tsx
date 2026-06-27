import { useEffect, useState } from 'react';
import { getListings } from '../api/listings';
import ListingGrid from '../components/listings/ListingGrid';
import { Listing } from '../types/listing';
export default function HomePage(): JSX.Element { const [items, setItems] = useState<Listing[]>([]); const [page, setPage] = useState(1); useEffect(() => { void getListings(page, 20).then((response) => setItems(response.data?.items ?? [])); }, [page]); return <main><h1>Marketplace</h1><ListingGrid listings={items} /><button type="button" onClick={() => setPage(Math.max(1, page - 1))}>Previous</button><button type="button" onClick={() => setPage(page + 1)}>Next</button></main>; }
