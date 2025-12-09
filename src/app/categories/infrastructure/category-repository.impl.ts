import { IPaginatedResponse } from "@/app/lib/globals.type";
import { Category } from "../domain/entities/category.entity";
import { ICategoryRepository } from "../domain/interfaces/category-repository.interface";
import { CategoryMapper } from "../domain/mappers/category.mapper";
import { api } from "@/app/lib/api";

export class CategoryRepository implements ICategoryRepository {
  constructor(private readonly mapper: CategoryMapper) {}

  async findAll(
    vendorId: string,
    limit: number,
    page: number
  ): Promise<IPaginatedResponse<Category>> {
    try {
      const res = await api.get(`/cat/vendor/${vendorId}`, {
        params: { page, limit },
      });

      // 🔍 Vérifie que res.data.data est bien un tableau
      const dataArray = Array.isArray(res.data.data) ? res.data.data : [];

      // 🧩 Mapping des catégories en entités de domaine
      const categories = dataArray.map((item: any) =>
        this.mapper.toEntity(item)
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
        error
      );
      throw error;
    }
  }
}
