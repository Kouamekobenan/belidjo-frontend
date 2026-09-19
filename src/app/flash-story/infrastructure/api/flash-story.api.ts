// infrastructure/api/flash-story.api.ts

import { api } from "@/app/lib/api";
import { IPaginatedResponse } from "@/app/lib/globals.type";
import { FlashStoryEntity } from "../../domain/entities/flash-story.entity";
import { IFlashStoryRepository } from "../../domain/interfaces/flash-story-repository";

export class FlashStoryRepository implements IFlashStoryRepository {
  async create(
    vendorId: string,
    images: File[],
    title?: string,
    captions?: string[],
    productIds?: string[],
  ): Promise<FlashStoryEntity> {
    const formData = new FormData();
    formData.append("vendorId", vendorId);

    if (title) {
      formData.append("title", title);
    }

    // Ajouter les images
    images.forEach((image) => {
      formData.append("images", image);
    });

    // Ajouter les captions en JSON stringified
    if (captions && captions.length > 0) {
      formData.append("captions", JSON.stringify(captions));
    }

    // Ajouter les productIds en JSON stringified
    if (productIds && productIds.length > 0) {
      formData.append("productIds", JSON.stringify(productIds));
    }

    const response = await api.post("/flash-story", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data.data;
  }

  async getAll(
    limit: number,
    page: number,
  ): Promise<IPaginatedResponse<FlashStoryEntity>> {
    const response = await api.get("/flash-story", {
      params: { limit, page },
    });

    return {
      data: response.data.data,
      total: response.data.total,
      totalPages: response.data.totalPages,
      page: response.data.page,
      limit: response.data.limit,
    };
  }

  async getByVendor(vendorId: string): Promise<FlashStoryEntity | null> {
    try {
      const response = await api.get(`/flash-story/vendor/${vendorId}`);
      return response.data.data || null;
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/flash-story/${id}`);
  }
}
