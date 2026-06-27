import { Link } from 'react-router-dom';
import { Listing } from '@/types/listing';
export default function ListingCard({ listing }: { listing: Listing }): JSX.Element { const image = listing.images[0]?.url; return <article>{image !== undefined && <img src={image} alt={listing.title} width="180" />}<h3><Link to={`/listings/${listing.id}`}>{listing.title}</Link></h3><p>{listing.price.toFixed(2)}</p></article>; }
