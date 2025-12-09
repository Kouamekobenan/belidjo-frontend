import { User } from "@/app/users/domain/entities/user.entity";

// domain/interfaces/product.interface.ts
export interface IComment {
  id: string;
  content: string;
  userId: string;
  createdAt?: string;
  updatedAt?: Date;
}
export interface IVendor {
  user: User;
}

export interface IProduct {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  price: number;
  quantity: number;
  imageUrl: string;
  fileId: string;
  vendorId: string;
  createdAt: string;
  updatedAt: string;
  comment: IComment[];
  vendor: IVendor;
}
