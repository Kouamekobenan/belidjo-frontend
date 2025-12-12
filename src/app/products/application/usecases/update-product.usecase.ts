import { Product } from "../../domain/entities/product.entity";
import { IProductRepository } from "../../domain/interfaces/product-repository.interface";
import { CreateProductDto } from "../dtos/create-product.dto";

export class UpdateProductUseCase {
  constructor(private readonly productRepo: IProductRepository) {}
  async execute(
    productId: string,
    dto: CreateProductDto,
    file?: File | null
  ): Promise<Product> {
    return await this.productRepo.update(productId, dto, file);
  }
}
