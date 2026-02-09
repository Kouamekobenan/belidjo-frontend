import { IPaginatedResponse } from "@/app/lib/globals.type";
import { Category } from "../domain/entities/category.entity";
import { ICategoryRepository } from "../domain/interfaces/category-repository.interface";
import { CategoryMapper } from "../domain/mappers/category.mapper";
import { api } from "@/app/lib/api";
import { CreateCategoryDto } from "../application/dtos/create-cat.dto";
import { UpdateCategoryDto } from "../application/dtos/update-dto.uscase";

export class CategoryRepository implements ICategoryRepository {
  constructor(private readonly mapper: CategoryMapper) {}
  async create(dto: CreateCategoryDto, file: File | null): Promise<Category> {
    const url = "/cat";
    let response;
    if (file) {
      const formData = new FormData();
      formData.append("imageUrl", file);
      formData.append("name", dto.name);
      formData.append("description", dto.description);
      if (dto.vendorId) {
        formData.append("vendorId", dto.vendorId);
      }
      response = await api.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } else {
      const catgory = this.mapper.toApplication(dto);
      response = await api.post(url, catgory);
    }
    return this.mapper.toEntity(response.data.data);
  }
  async findAll(
    vendorId: string,
    limit: number,
    page: number,
  ): Promise<IPaginatedResponse<Category>> {
    try {
      const res = await api.get(`/cat/vendor/${vendorId}`, {
        params: { page, limit },
      });

      // 🔍 Vérifie que res.data.data est bien un tableau
      const dataArray = Array.isArray(res.data.data) ? res.data.data : [];

      // 🧩 Mapping des catégories en entités de domaine
      const categories = dataArray.map((item: any) =>
        this.mapper.toEntity(item),
      );

      return {
        data: categories,
        total: res.data.total,
        totalPages: res.data.totalPages,
        limit: res.data.limit,
        page: res.data.page,
      };
    } catch (error) {
      console.error(
        "❌ Erreur lors de la récupération des catégories :",
        error,
      );
      throw error;
    }
  }
  async delete(id: string): Promise<void> {
    await api.delete(`/cat/${id}`);
  }

  async update(
    id: string,
    dto: CreateCategoryDto,
    file: File | null,
  ): Promise<Category> {
    const url = `/cat/${id}`;
    let response;
    if (file) {
      const formData = new FormData();
      formData.append("imageUrl", file);
      formData.append("name", dto.name);
      formData.append("description", dto.description);

      response = await api.patch(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } else {
      const category = await this.mapper.toApplication(dto);
      response = await api.patch(url, category);
    }
    return this.mapper.toEntity(response.data.data);
  }
  async getTree(): Promise<Category[]> {
    const url = "/cat/cat/tree";
    const catTree = await api.get(url);
    return catTree.data.data;
  }
}
