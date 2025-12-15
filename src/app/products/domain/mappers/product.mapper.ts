import { VendorList } from "@/app/vendor/ui/components/Vendor-list";
import { CreateProductDto } from "../../application/dtos/create-product.dto";
import { IProduct, Product } from "../entities/product.entity";

export class ProductMapper {
  toEntity(model: Product): Product {
    return new Product(
      model.id,
      model.name,
      model.description,
      model.categoryId,
      model.price,
      model.quantity,
      model.imageUrl,
      model.fileId,
      model.vendorId,
      model.createdAt,
      model.updatedAt,
      model.comment,
      model.vendor
    );
  }
  toApp(create: CreateProductDto): any {
    return {
      name: create.name,
      description: create.description,
      categoryId: create.categoryId,
      price: create.price,
      quantity: create.quantity,
      imageUrl: create.imageUrl,
      // fileId: create.fileId,
      VendorId: create.vendorId,
    };
  }
}
