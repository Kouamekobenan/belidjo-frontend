import { IPaginatedResponse } from "@/app/lib/globals.type";
import { Category } from "../entities/category.entity";

export interface ICategoryRepository {
  findAll(
    vendorId: string,
    limit: number,
    page: number
  ): Promise<IPaginatedResponse<Category>>;
}
