import { Product } from "../../domain/entities/product.entity";
import { IProductRepository } from "../../domain/interfaces/product-repository.interface";
import { CreateProductDto } from "../dtos/create-product.dto";
export class CreateProductUseCase {
  constructor(private readonly productRepo: IProductRepository) {}

  async execute(dto: CreateProductDto, file?: File | null): Promise<Product> {
    return await this.productRepo.create(dto, file);
  }
}
