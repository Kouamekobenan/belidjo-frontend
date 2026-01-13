import { api } from "@/app/lib/api";
import { CreateNotificationDto } from "../application/dtos/create-notification.dto";
import { Notification } from "../domain/entities/notification.entity";
import { INotificationRepository } from "../domain/interfaces/notification-repository";

export class NotificationRepository implements INotificationRepository {
  async create(dto: CreateNotificationDto): Promise<Notification> {
    const url = `/notification`;
    const newNotification = await api.post(url, dto);
    return newNotification.data.data;
  }
}
