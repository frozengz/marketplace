export interface ApiError { code: string; message: string; fields?: Record<string, string>; }
export interface ApiResponse<T> { data: T | null; error: ApiError | null; }
