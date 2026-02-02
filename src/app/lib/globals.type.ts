// export enum Role {
//   USER = "USER",
//   ADMIN = "ADMIN",
//   CUSTOMER = "CUSTOMER",
//   VENDEUR = "VENDEUR",

import { UserRole } from "../users/domain/enums/role.enum";

// }
export interface IvendorProfile {
  id: string;
  userId: string;
  name: string;
  description: string;
  logoUrl: string;
  cityId: string;
  isApproved: boolean;
}
interface Token {
  accessToken: string;
  refreshToken: string;
}
export interface User {
  id: string;
  name: string;
  password: string;
  phone: string;
  role: UserRole;
  refreshToken: string;
  cityId: string;
  createdAt: Date;
  updatedAt: Date;
  vendorProfile: IvendorProfile;
  cityName: string;
  token: Token;
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

export interface ICustomer {
  id: string;
  userId: string;
  vendorId: string;
  cityId: string;
  user: User[];
}
export const cityName = "NoBoutik";
export const logoNoBoutik = "/images/bj.png";
export const photoCouv = "/images/photo.jpg";
