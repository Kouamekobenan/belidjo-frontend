import { api } from "@/app/lib/api";
import { CreateNotificationDto } from "../application/dtos/create-notification.dto";
import { Notification } from "../domain/entities/notification.entity";
import { INotificationRepository } from "../domain/interfaces/notification-repository";

export class NotificationRepository implements INotificationRepository {
  async create(dto: CreateNotificationDto): Promise<Notification> {
    const response = await api.post("/notification", dto);
    return response.data?.data || response.data;
  }

  async getByUserId(userId: string): Promise<Notification[]> {
    const response = await api.get(`/notification/${userId}`);
    const rawData = response.data?.data || response.data || [];
    return Array.isArray(rawData)
      ? rawData.map(
          (item: any) =>
            new Notification(
              item.id,
              item.senderId ?? null,
              item.receiverId,
              item.title,
              item.message,
              item.type,
              item.isRead ?? false,
              item.createdAt,
              item.imageUrl ?? null,
              item.actionUrl ?? null,
              item.priority ?? "NORMAL",
              item.channel ?? "IN_APP",
              item.metadata ?? null
            )
        )
      : [];
  }

  async getFeaturedPopup(userId: string): Promise<Notification | null> {
    try {
      const response = await api.get(`/notification/${userId}/featured-popup`);
      const item = response.data?.data ?? response.data;
      if (!item || typeof item !== "object" || !item.id) return null;
      return new Notification(
        item.id,
        item.senderId ?? null,
        item.receiverId,
        item.title,
        item.message,
        item.type,
        item.isRead ?? false,
        item.createdAt,
        item.imageUrl ?? null,
        item.actionUrl ?? null,
        item.priority ?? "HIGH",
        item.channel ?? "IN_APP",
        item.metadata ?? null
      );
    } catch {
      return null;
    }
  }

  async markAsRead(id: string): Promise<void> {
    try {
      await api.patch(`/notification/${id}/read`);
    } catch {
      await api.patch(`/notification/read/${id}`);
    }
  }

  async markAllAsRead(userId: string): Promise<void> {
    try {
      await api.patch(`/notification/user/${userId}/read-all`);
    } catch {
      await api.patch(`/notification/read-all/${userId}`);
    }
  }

  async deleteNotification(id: string): Promise<void> {
    await api.delete(`/notification/${id}`);
  }
}

