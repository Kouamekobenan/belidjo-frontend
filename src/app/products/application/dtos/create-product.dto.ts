export interface CreateProductDto {
  name: string;
  description: string;
  categoryId: string;
  price: number;
  quantity: number;
  imageUrl: string;
  // fileId: string;
  vendorId?: string;
}
