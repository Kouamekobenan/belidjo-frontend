import { UserRole } from "../users/domain/enums/role.enum";
import { api } from "./api";

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
  createdAt: string;
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

// ✅ Créer l'instance Axios

export interface VideoGenerationRequest {
  images: string[];
  prices: number[];
  shopName: string;
  audioUrl?: string;
  bpm?: number;
}

export interface VideoGenerationResponse {
  success: boolean;
  url: string;
  fileName: string;
  message: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
export class VideoApiService {
  static async generateVideo(
    data: VideoGenerationRequest,
  ): Promise<VideoGenerationResponse> {
    try {
      // ✅ Axios envoie automatiquement data correctement
      const response = await api.post("/video/generate", data);
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Erreur lors de la génération";
      throw new Error(message);
    }
  }

  static async checkVideoStatus(fileName: string) {
    try {
      const response = await api.get(`/video/status/${fileName}`);
      return response.data;
    } catch (error: any) {
      throw new Error("Erreur lors de la vérification du statut");
    }
  }
  static getDownloadUrl(fileName: string): string {
    return `${API_BASE_URL}/video/download/${fileName}`;
  }
}

export const cityName = "NoBoutik";
export const logoNoBoutik = "/images/bj.png";
export const photoCouv = "/images/photo.jpg";
