import { CreateCategoryDto } from "../../application/dtos/create-cat.dto";
import { UpdateCategoryDto } from "../../application/dtos/update-dto.uscase";
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
  toApplication(dto: CreateCategoryDto): any {
    return {
      name: dto.name,
      description: dto.description,
      imageUrl: dto.imageUrl,
      vendorId: dto.vendorId,
    };
  }
  toUpdate(dto: UpdateCategoryDto): any {
    const dataForm: any = {};
    if (dto.name !== undefined) {
      dataForm.name = dto.name;
    }
    if (dto.imageUrl !== undefined) {
      dataForm.imageUrl = dto.imageUrl;
    }
    if (dto.fileId !== undefined) {
      dataForm.fileId = dto.fileId;
    }
    return dataForm;
  }
}
