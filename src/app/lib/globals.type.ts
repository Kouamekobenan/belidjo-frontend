export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
  CUSTOMER = "CUSTOMER",
  VENDEUR = "VENDEUR",
}
export interface User {
  id: string;
  name: string;
  password: string;
  phone: string;
  role: Role;
  refreshToken: string;
  cityId: string;
  createdAt: Date;
  updatedAt: Date;
}

// domain/interfaces/pagination.interface.ts
export interface IPaginatedResponse<T> {
  data: T[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}
export interface IComment {
  id: string;
  content: string;
  productId: string;
  userId: string;
  createdAt: string;
  updatedAt?: Date;
}
