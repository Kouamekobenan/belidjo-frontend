// domain/interfaces/flash-story-repository.ts

import { IPaginatedResponse } from "@/app/lib/globals.type";
import { FlashStoryEntity } from "../entities/flash-story.entity";

export interface IFlashStoryRepository {
  create(
    vendorId: string,
    images: File[],
    title?: string,
    captions?: string[],
    productIds?: string[],
  ): Promise<FlashStoryEntity>;

  getAll(limit: number, page: number): Promise<IPaginatedResponse<FlashStoryEntity>>;

  getByVendor(vendorId: string): Promise<FlashStoryEntity | null>;

  delete(id: string): Promise<void>;
}
