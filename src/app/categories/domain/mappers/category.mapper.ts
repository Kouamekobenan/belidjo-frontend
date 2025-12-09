import { Category } from "../entities/category.entity";

export class CategoryMapper {
  toEntity(model: Category): Category {
    return new Category(
      model.id,
      model.name,
      model.description,
      model.imageUrl,
      model.fileId,
      model.vendorId,
      model.createdAt,
      model.updatedAt
    );
  }
}
