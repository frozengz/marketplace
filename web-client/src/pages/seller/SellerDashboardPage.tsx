import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyListings, createListing } from '@/api/listings';
import ListingForm from '@/components/listings/ListingForm';
import { Listing } from '@/types/listing';
export default function SellerDashboardPage(): JSX.Element { const [listings, setListings] = useState<Listing[]>([]); const [showForm, setShowForm] = useState(false); useEffect(() => { void getMyListings().then((response) => setListings(response.data ?? [])); }, []); return <main><h1>Seller dashboard</h1><button type="button" onClick={() => setShowForm(true)}>Create listing</button>{showForm && <ListingForm onSubmit={async (payload) => { await createListing(payload); setShowForm(false); }} />}{listings.map((listing) => <article key={listing.id}><Link to={`/seller/listings/${listing.id}/edit`}>{listing.title}</Link><span>{listing.price}</span><span>{listing.isActive ? 'active' : 'inactive'}</span></article>)}</main>; }
