import { IPaginatedResponse } from "@/app/lib/globals.type";
import { IProduct } from "../../domain/entities/product.entity";
import { IProductRepository } from "../../domain/interfaces/product-repository.interface";

export class GetProductsByCategoryUseCase {
  constructor(private readonly productRepo: IProductRepository) {}
  async execute(
    categoryId: string,
    page: number = 1,
    limit: number = 20,
    vendorId?: string,
  ): Promise<IPaginatedResponse<IProduct>> {
    return this.productRepo.findByCatId(categoryId, limit, page, vendorId);
  }
}
