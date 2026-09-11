import { CreateNotificationDto } from "../../application/dtos/create-notification.dto";
import { Notification } from "../entities/notification.entity";

export interface INotificationRepository {
  create(dto: CreateNotificationDto): Promise<Notification>;
  getByUserId(userId: string): Promise<Notification[]>;
  getFeaturedPopup(userId: string): Promise<Notification | null>;
  markAsRead(id: string): Promise<void>;
  markAllAsRead(userId: string): Promise<void>;
  deleteNotification(id: string): Promise<void>;
}

