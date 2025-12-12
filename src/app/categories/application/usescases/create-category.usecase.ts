import { Category } from "../../domain/entities/category.entity";
import { ICategoryRepository } from "../../domain/interfaces/category-repository.interface";
import { CreateCategoryDto } from "../dtos/create-cat.dto";

export class CreateCategoryUseCase {
  constructor(private readonly catRepository: ICategoryRepository) {}
  async execute(dto: CreateCategoryDto, file: File | null): Promise<Category> {
    try {
      const response = await this.catRepository.create(dto, file);
      return response;
    } catch (error) {
      throw new Error("Erreur au niveau du backend");
    }
  }
}
