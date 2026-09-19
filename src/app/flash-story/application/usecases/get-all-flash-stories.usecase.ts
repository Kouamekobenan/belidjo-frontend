// application/usecases/get-all-flash-stories.usecase.ts

import { IPaginatedResponse } from "@/app/lib/globals.type";
import { FlashStoryEntity } from "../../domain/entities/flash-story.entity";
import { IFlashStoryRepository } from "../../domain/interfaces/flash-story-repository";

export class GetAllFlashStoriesUseCase {
  constructor(private readonly repository: IFlashStoryRepository) {}

  async execute(
    limit: number = 20,
    page: number = 1,
  ): Promise<IPaginatedResponse<FlashStoryEntity>> {
    return this.repository.getAll(limit, page);
  }
}
