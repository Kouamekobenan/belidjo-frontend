// application/usecases/get-vendor-flash-story.usecase.ts

import { FlashStoryEntity } from "../../domain/entities/flash-story.entity";
import { IFlashStoryRepository } from "../../domain/interfaces/flash-story-repository";

export class GetVendorFlashStoryUseCase {
  constructor(private readonly repository: IFlashStoryRepository) {}

  async execute(vendorId: string): Promise<FlashStoryEntity | null> {
    return this.repository.getByVendor(vendorId);
  }
}
