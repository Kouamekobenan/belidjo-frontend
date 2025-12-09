import { IProduct } from "../../domain/entities/product.entity";
import { IProductRepository } from "../../domain/interfaces/product-repository.interface";
export class FindByIdProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}
  async execute(productId: string): Promise<IProduct> {
    return await this.productRepository.findById(productId);
  }
}
