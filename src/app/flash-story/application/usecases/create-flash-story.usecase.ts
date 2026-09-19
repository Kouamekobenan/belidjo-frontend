// application/usecases/create-flash-story.usecase.ts

import { FlashStoryEntity } from "../../domain/entities/flash-story.entity";
import { IFlashStoryRepository } from "../../domain/interfaces/flash-story-repository";

export class CreateFlashStoryUseCase {
  constructor(private readonly repository: IFlashStoryRepository) {}

  async execute(
    vendorId: string,
    images: File[],
    title?: string,
    captions?: string[],
    productIds?: string[],
  ): Promise<FlashStoryEntity> {
    return this.repository.create(vendorId, images, title, captions, productIds);
  }
}
