import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getListing } from '../api/listings';
import { Listing } from '../types/listing';
export default function ListingDetailPage(): JSX.Element { const { id } = useParams(); const [listing, setListing] = useState<Listing | null>(null); useEffect(() => { if (id !== undefined) { void getListing(id).then((response) => setListing(response.data)); } }, [id]); if (listing === null) { return <main>Loading</main>; } return <main><div>{listing.images.map((image) => <img key={image.id} src={image.url} alt={listing.title} width="180" />)}</div><h1>{listing.title}</h1><p>{listing.description}</p><strong>{listing.price.toFixed(2)}</strong><Link to={`/profile/${listing.sellerId}`}>{listing.sellerUsername}</Link></main>; }
