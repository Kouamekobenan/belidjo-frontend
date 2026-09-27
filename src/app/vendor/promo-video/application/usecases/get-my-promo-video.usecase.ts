// src/app/vendor/promo-video/application/usecases/get-my-promo-video.usecase.ts

import { IPromoVideoRepository } from "../../domain/interfaces/promo-video-repository";
import { PromoVideo } from "../../domain/entities/promo-video.entity";

export class GetMyPromoVideoUseCase {
  constructor(private readonly repository: IPromoVideoRepository) {}

  async execute(): Promise<PromoVideo | null> {
    return this.repository.getMyVideo();
  }
}
