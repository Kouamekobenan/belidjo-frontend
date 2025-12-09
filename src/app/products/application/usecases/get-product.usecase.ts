// application/usecases/get-products-by-vendor.usecase.ts

import { IPaginatedResponse } from "@/app/lib/globals.type";
import { IProduct } from "../../domain/entities/product.entity";
import { IProductRepository } from "../../domain/interfaces/product-repository.interface";

export class GetProductsByVendorUseCase {
  constructor(private readonly productRepo: IProductRepository) {}
  async execute(
    vendorId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<IPaginatedResponse<IProduct>> {
    return this.productRepo.getAll(vendorId, page, limit);
  }
}
