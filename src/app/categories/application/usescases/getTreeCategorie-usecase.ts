import { ICategoryRepository } from "../../domain/interfaces/category-repository.interface";

export class GetTreeCategorieUseCase {
  constructor(private readonly catRepo: ICategoryRepository) {}
  async execute() {
    return await this.catRepo.getTree();
  }
}
