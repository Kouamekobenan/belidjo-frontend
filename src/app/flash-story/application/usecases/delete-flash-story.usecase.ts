// application/usecases/delete-flash-story.usecase.ts

import { IFlashStoryRepository } from "../../domain/interfaces/flash-story-repository";

export class DeleteFlashStoryUseCase {
  constructor(private readonly repository: IFlashStoryRepository) {}

  async execute(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}
