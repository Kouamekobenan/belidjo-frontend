// src/app/vendor/promo-video/domain/entities/promo-video.entity.ts

export interface PromoVideo {
  id: string;
  vendorId: string;
  videoUrl: string;
  shopName: string;
  images: string[];
  prices?: number[];
  audioUrl?: string;
  bpm?: number;
  createdAt: string;
  expiresAt: string;
}

export interface CreatePromoVideoDto {
  images: string[];
  shopName: string;
  prices?: number[];
  audioUrl?: string;
  bpm?: number;
}
