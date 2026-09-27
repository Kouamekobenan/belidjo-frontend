// src/app/vendor/promo-video/infrastructure/api/promo-video.api.ts

import { api } from "@/app/lib/api";
import { IPromoVideoRepository } from "../../domain/interfaces/promo-video-repository";
import { PromoVideo, CreatePromoVideoDto } from "../../domain/entities/promo-video.entity";

export class PromoVideoRepository implements IPromoVideoRepository {
  async getMyVideo(): Promise<PromoVideo | null> {
    try {
      const response = await api.get("/video/my-video");
      if (response.data && response.data.data) {
        return response.data.data as PromoVideo;
      }
      if (response.data && response.data.id) {
        return response.data as PromoVideo;
      }
      return null;
    } catch (error: any) {
      if (error?.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async generateVideo(dto: CreatePromoVideoDto): Promise<PromoVideo> {
    const response = await api.post("/video/generate", dto);
    if (response.data && response.data.data) {
      return response.data.data as PromoVideo;
    }
    return response.data as PromoVideo;
  }
}

export const promoVideoRepository = new PromoVideoRepository();
