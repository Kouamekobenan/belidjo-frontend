import { Product } from "../../domain/entities/product.entity";
import { IProductRepository } from "../../domain/interfaces/product-repository.interface";
import { CreateProductDto } from "../dtos/create-product.dto";

export class CreateProductUseCase {
  constructor(private readonly productRepo: IProductRepository) {}

  async execute(dto: CreateProductDto, file?: File | null): Promise<Product> {
    try {
      // Si un fichier est fourni, envoie FormData

      // Sinon, envoie du JSON classique
      return await this.productRepo.create(dto, file);
    } catch (error: any) {
      console.error("Erreur lors de la création du produit :", error);
      throw new Error(
        error?.response?.data?.message || "Échec de la création du produit."
      );
    }
  }
}
