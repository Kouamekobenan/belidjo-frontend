import { Category } from "../../domain/entities/category.entity";
import { ICategoryRepository } from "../../domain/interfaces/category-repository.interface";
import { CreateCategoryDto } from "../dtos/create-cat.dto";
import { UpdateCategoryDto } from "../dtos/update-dto.uscase";

export class UpdateCategoryUseCase {
  constructor(private readonly catRepository: ICategoryRepository) {}
  async execute(
    id: string,
    dto: CreateCategoryDto,
    file: File | null
  ): Promise<Category> {
    try {
      return await this.catRepository.update(id, dto, file);
    } catch (error) {
      throw new Error("Erreur provenant du backend");
    }
  }
}
