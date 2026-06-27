import { request } from './client';
import { Listing, PaginatedListings } from '@/types/listing';
export interface ListingPayload { title: string; description: string; price: number; }
export function getListings(page: number, limit: number): Promise<import('@/types/api').ApiResponse<PaginatedListings>> { return request<PaginatedListings>(`/api/listings?page=${page}&limit=${limit}`); }
export function getListing(id: string): Promise<import('@/types/api').ApiResponse<Listing>> { return request<Listing>(`/api/listings/${id}`); }
export function createListing(body: ListingPayload): Promise<import('@/types/api').ApiResponse<Listing>> { return request<Listing>('/api/listings', { method: 'POST', body: JSON.stringify(body) }); }
export function getMyListings(): Promise<import('@/types/api').ApiResponse<Listing[]>> { return request<Listing[]>('/api/listings/my'); }
