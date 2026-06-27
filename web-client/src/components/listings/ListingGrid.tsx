import { Listing } from '../../types/listing';
import ListingCard from './ListingCard';
export default function ListingGrid({ listings }: { listings: Listing[] }): JSX.Element { return <section>{listings.map((listing) => <ListingCard key={listing.id} listing={listing} />)}</section>; }
