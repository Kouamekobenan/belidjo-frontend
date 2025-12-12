import { ICategoryRepository } from "../../domain/interfaces/category-repository.interface";

export class DeleteCategoryUseCase {
  constructor(private readonly catRepository: ICategoryRepository) {}
  async execute(id: string): Promise<void> {
    try {
      if (!id) {
        return;
      }
      return await this.catRepository.delete(id);
    } catch (error) {
      throw new Error("Erreur venant du backend");
    }
  }
}
