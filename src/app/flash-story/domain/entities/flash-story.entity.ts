// domain/entities/flash-story.entity.ts

export interface FlashStoryItemEntity {
  id: string;
  flashStoryId: string;
  imageUrl: string;
  fileId: string;
  caption?: string | null;
  productId?: string | null;
  orderIndex: number;
  createdAt: string;
}

export interface FlashStoryEntity {
  id: string;
  vendorId: string;
  title?: string | null;
  expiresAt: string;
  createdAt: string;
  items: FlashStoryItemEntity[];
  vendor?: {
    id: string;
    name: string;
    logoUrl?: string | null;
  };
}
