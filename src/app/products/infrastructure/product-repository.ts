import { api } from "@/app/lib/api";
import { IProduct, Product } from "../domain/entities/product.entity";
import { IProductRepository } from "../domain/interfaces/product-repository.interface";
import { IPaginatedResponse } from "@/app/lib/globals.type";
import { CreateProductDto } from "../application/dtos/create-product.dto";
import { ProductMapper } from "../domain/mappers/product.mapper";
export class ProductRepository implements IProductRepository {
  constructor(private readonly mapper: ProductMapper) {}
  async create(dto: CreateProductDto, file?: File | null): Promise<Product> {
    let response;
    const url = `/products`;
    try {
      if (file) {
        // --- CAS 1 : Avec Fichier (Multipart/form-data) ---
        const formData = new FormData();
        // 1. Ajouter le fichier en premier
        formData.append("imageUrl", file);
        // 2. Ajouter les autres champs du DTO
        formData.append("name", dto.name);
        formData.append("description", dto.description);
        formData.append("categoryId", dto.categoryId);
        formData.append("price", dto.price.toString());
        formData.append("quantity", dto.quantity.toString());
        // Si le backend nécessite vendorId même si optional
        if (dto.vendorId) {
          formData.append("vendorId", dto.vendorId);
        }
        // 3. Envoyer FormData (l'en-tête 'Content-Type: multipart/form-data' est souvent auto-géré)
        response = await api.post(url, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        const productPayload = this.mapper.toApp(dto);

        response = await api.post(url, productPayload);
      }

      return this.mapper.toEntity(response.data);
    } catch (error: any) {
      console.error(
        "Erreur Infrastructure (Repository) lors de la création du produit:",
        error
      );
      // Rejeter une erreur compréhensible par la couche Application/Domaine
      const message =
        error?.response?.data?.message ||
        "Erreur de connexion à l'API lors de la création.";
      throw new Error(message);
    }
  }
  async update(
    productId: string,
    dto: CreateProductDto,
    file?: File | null
  ): Promise<Product> {
    let response;
    const url = `/products/${productId}`;
    try {
      if (file) {
        // --- CAS 1 : Avec Fichier (Multipart/form-data) ---
        const formData = new FormData();
        // 1. Ajouter le fichier en premier
        formData.append("imageUrl", file);
        // 2. Ajouter les autres champs du DTO
        formData.append("name", dto.name);
        formData.append("description", dto.description);
        formData.append("categoryId", dto.categoryId);
        formData.append("price", dto.price.toString());
        formData.append("quantity", dto.quantity.toString());
        // Si le backend nécessite vendorId même si optional
        if (dto.vendorId) {
          formData.append("vendorId", dto.vendorId);
        }
        // 3. Envoyer FormData (l'en-tête 'Content-Type: multipart/form-data' est souvent auto-géré)
        response = await api.patch(url, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        const productPayload = this.mapper.toApp(dto);

        response = await api.patch(url, productPayload);
      }

      return this.mapper.toEntity(response.data);
    } catch (error: any) {
      console.error(
        "Erreur Infrastructure (Repository) lors de la création du produit:",
        error
      );
      // Rejeter une erreur compréhensible par la couche Application/Domaine
      const message =
        error?.response?.data?.message ||
        "Erreur de connexion à l'API lors de la modification.";
      throw new Error(message);
    }
  }
  async getAll(
    vendorId: string,
    limit: number,
    page: number
  ): Promise<IPaginatedResponse<IProduct>> {
    const res = await api.get(
      `/products/${vendorId}?page=${page}&limit=${limit}`
    );
    return {
      data: res.data.data,
      total: res.data.total,
      totalPages: res.data.totalPages,
      limit: res.data.limit,
      page: res.data.page,
    };
  }
  async findById(productId: string): Promise<IProduct> {
    const product = await api.get(`products/product/${productId}`);
    return product.data.data;
  }
  async findByCatId(
    catId: string,
    limit: number,
    page: number
  ): Promise<IPaginatedResponse<IProduct>> {
    const res = await api.get(
      `/products/cat/${catId}?page=${page}&limit=${limit}`
    );
    return {
      data: res.data.data,
      total: res.data.total,
      totalPages: res.data.totalPages,
      limit: res.data.limit,
      page: res.data.page,
    };
  }
  async delete(productId: string): Promise<void> {
    await api.delete(`/products/${productId}`);
  }
}
