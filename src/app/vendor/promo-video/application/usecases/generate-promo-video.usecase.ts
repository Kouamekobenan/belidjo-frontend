// src/app/vendor/promo-video/application/usecases/generate-promo-video.usecase.ts

import { IPromoVideoRepository } from "../../domain/interfaces/promo-video-repository";
import { PromoVideo, CreatePromoVideoDto } from "../../domain/entities/promo-video.entity";

export class GeneratePromoVideoUseCase {
  constructor(private readonly repository: IPromoVideoRepository) {}

  async execute(dto: CreatePromoVideoDto): Promise<PromoVideo> {
    if (!dto.images || dto.images.length === 0) {
      throw new Error("Veuillez sélectionner au moins 1 image produit (1 à 10 images max).");
    }
    if (dto.images.length > 10) {
      throw new Error("Vous ne pouvez pas dépasser 10 images produits.");
    }
    if (!dto.shopName || !dto.shopName.trim()) {
      throw new Error("Le nom de la boutique est obligatoire.");
    }

    return this.repository.generateVideo(dto);
  }
}
