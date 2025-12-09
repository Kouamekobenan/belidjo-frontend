import { ICategoryRepository } from "../../domain/interfaces/category-repository.interface";
import { IPaginatedResponse } from "@/app/lib/globals.type";
import { Category } from "../../domain/entities/category.entity";

export class FindAllCategoryUseCase {
  constructor(private readonly catRepository: ICategoryRepository) {}

  async execute(
    vendorId: string,
    limit: number,
    page: number
  ): Promise<IPaginatedResponse<Category>> {
    return await this.catRepository.findAll(vendorId, limit, page);
  }
}
