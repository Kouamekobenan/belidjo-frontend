import { IPaginatedResponse } from "@/app/lib/globals.type";
import { IProduct } from "../../domain/entities/product.entity";
import { IProductRepository } from "../../domain/interfaces/product-repository.interface";

export class SearchProductsUseCase {
  constructor(private readonly productRepo: IProductRepository) {}
  async execute(
    term: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<IPaginatedResponse<IProduct>> {
    return this.productRepo.searchProducts(term, limit, page);
  }
}
