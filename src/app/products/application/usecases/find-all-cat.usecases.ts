import { IPaginatedResponse } from "@/app/lib/globals.type";
import { IProductRepository } from "../../domain/interfaces/product-repository.interface";
import { IProduct } from "../../domain/entities/product.entity";

export class FindProductByCatIdUseCase {
  constructor(private readonly productRepo: IProductRepository) {}
  async execute(
    catId: string,
    limit: number,
    page: number
  ): Promise<IPaginatedResponse<IProduct>> {
    const products = await this.productRepo.findByCatId(catId, limit, page);
    return products;
  }
}
