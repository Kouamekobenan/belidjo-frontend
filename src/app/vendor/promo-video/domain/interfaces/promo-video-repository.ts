// src/app/vendor/promo-video/domain/interfaces/promo-video-repository.ts

import { PromoVideo, CreatePromoVideoDto } from "../entities/promo-video.entity";

export interface IPromoVideoRepository {
  getMyVideo(): Promise<PromoVideo | null>;
  generateVideo(dto: CreatePromoVideoDto): Promise<PromoVideo>;
}
