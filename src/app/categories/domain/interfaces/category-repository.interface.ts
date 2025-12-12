import { IPaginatedResponse } from "@/app/lib/globals.type";
import { Category } from "../entities/category.entity";
import { CreateCategoryDto } from "../../application/dtos/create-cat.dto";
import { UpdateCategoryDto } from "../../application/dtos/update-dto.uscase";

export interface ICategoryRepository {
  findAll(
    vendorId: string,
    limit: number,
    page: number
  ): Promise<IPaginatedResponse<Category>>;
  create(dto: CreateCategoryDto, file: File | null): Promise<Category>;
  delete(id: string): Promise<void>;
  update(
    id: string,
    dto: CreateCategoryDto,
    file: File | null
  ): Promise<Category>;
}
