import { IPaginatedResponse } from "@/app/lib/globals.type";
import { IProduct } from "../entities/product.entity";

export interface IProductRepository {
  getAll(
    vendorId: string,
    limit: number,
    page: number
  ): Promise<IPaginatedResponse<IProduct>>;
  findById(productId: string): Promise<IProduct>;
  findByCatId(
    catId: string,
    limit: number,
    page: number
  ): Promise<IPaginatedResponse<IProduct>>;
}
