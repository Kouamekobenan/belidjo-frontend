import { api } from "@/app/lib/api";
import { IProduct } from "../domain/entities/product.entity";
import { IProductRepository } from "../domain/interfaces/product-repository.interface";
import { IPaginatedResponse } from "@/app/lib/globals.type";
export class ProductRepository implements IProductRepository {
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
}
