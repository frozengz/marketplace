export interface ListingImage { id: string; url: string; position: number; }
export interface Listing { id: string; sellerId: string; sellerUsername: string; title: string; description: string; price: number; images: ListingImage[]; isActive: boolean; createdAt: string; updatedAt: string; }
export interface PaginatedListings { items: Listing[]; total: number; page: number; limit: number; }
