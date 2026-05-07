export interface ShortUrl {
  id: number;
  shortCode: string;
  originalUrl: string;
  accessCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUrlRequest {
  shortCode: string;
  originalUrl: string;
}

export interface UpdateUrlRequest {
  originalUrl: string;
}
