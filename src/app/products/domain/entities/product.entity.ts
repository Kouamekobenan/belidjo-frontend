import { User } from "@/app/users/domain/entities/user.entity";
import { CreateProductDto } from "../../application/dtos/create-product.dto";

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

// export interface  {
//   name: string;
//   description: string;
//   categoryId: string;
//   price: number;
//   quantity: number;
//   imageUrl?: string; // Utilisé pour l'affichage/la modification
//   vendorId?: string; // Peut être nécessaire si non géré par le contexte utilisateur
// }

// Interface pour le produit lors de l'édition (peut inclure l'ID)
export interface IProductToEdit extends CreateProductDto {
  id: string;
}

// État du formulaire initial pour la création
export const initialFormData: CreateProductDto = {
  name: "",
  description: "",
  categoryId: "", // IMPORTANT: Assurez-vous d'avoir une liste de catégories pour le sélecteur
  price: 0,
  quantity: 0,
  imageUrl:"",
  vendorId: "",
};

export class Product {
  constructor(
    public readonly id: string,
    public name: string,
    public description: string,
    public readonly categoryId: string,
    public price: number,
    public quantity: number,
    public imageUrl: string,
    public readonly fileId: string,
    public vendorId: string,
    public readonly createdAt: string,
    public readonly updatedAt: string,
    public comment: IComment[],
    public vendor: IVendor
  ) {}
}
