import React, { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ImageUpload from '@/components/ui/ImageUpload';
import { ListingPayload } from '@/api/listings';
interface ListingFormProps { initial?: ListingPayload; onSubmit: (payload: ListingPayload, files: File[]) => Promise<void>; }
export default function ListingForm({ initial, onSubmit }: ListingFormProps): JSX.Element { const [title, setTitle] = useState(initial?.title ?? ''); const [description, setDescription] = useState(initial?.description ?? ''); const [price, setPrice] = useState(String(initial?.price ?? 0)); const [files, setFiles] = useState<File[]>([]); async function submit(event: React.FormEvent): Promise<void> { event.preventDefault(); await onSubmit({ title, description, price: Number(price) }, files); } return <form onSubmit={submit}><Input label="Title" value={title} onChange={(event) => setTitle(event.target.value)} /><Input label="Description" value={description} onChange={(event) => setDescription(event.target.value)} /><Input label="Price" type="number" value={price} onChange={(event) => setPrice(event.target.value)} /><ImageUpload onFiles={setFiles} /><Button type="submit">Save</Button></form>; }
