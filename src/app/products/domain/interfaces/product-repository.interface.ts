import { IPaginatedResponse } from "@/app/lib/globals.type";
import { IProduct, Product } from "../entities/product.entity";
import { CreateProductDto } from "../../application/dtos/create-product.dto";

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
  create(create: CreateProductDto, file?: File | null): Promise<Product>;
  delete(productId: string): Promise<void>;
  update(
    productId: string,
    dto: CreateProductDto,
    file?: File | null
  ): Promise<Product>;
}
